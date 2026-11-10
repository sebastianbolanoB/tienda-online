import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatoPrecio } from "@/lib/utils";
import { consultarTransaccion, estadoDesdeWompi } from "@/lib/wompi";

export default async function PaginaPedido({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<any>;
}) {
  const { ref } = await params;
  const { id } = await searchParams;

  let pedido = await prisma.pedido.findUnique({
    where: { referencia: ref },
    include: { items: { include: { producto: true } } },
  });
  if (!pedido) notFound();

  // wompi redirige con ?id= de la transaccion, se consulta para saber si pagó
  if (id && pedido.estado === "PENDIENTE") {
    const tx = await consultarTransaccion(id);
    if (tx && tx.reference === pedido.referencia && tx.amount_in_cents === pedido.total * 100) {
      const estado = estadoDesdeWompi(tx.status);
      if (estado !== "PENDIENTE") {
        const cambio = await prisma.pedido.updateMany({
          where: { id: pedido.id, estado: "PENDIENTE" },
          data: { estado, wompiId: tx.id },
        });
        if (cambio.count > 0 && estado === "PAGADO") {
          for (const item of pedido.items) {
            await prisma.producto.update({
              where: { id: item.productoId },
              data: { stock: { decrement: item.cantidad } },
            });
          }
        }
        pedido.estado = estado;
      }
    }
  }

  return (
    <div>
      <h1>Pedido {pedido.referencia}</h1>

      {pedido.estado === "PAGADO" && <p className="ok">Pago aprobado. Gracias por tu compra.</p>}
      {pedido.estado === "RECHAZADO" && <p className="error">El pago fue rechazado.</p>}
      {pedido.estado === "PENDIENTE" && <p>Estamos esperando la confirmación del pago.</p>}

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.id}>
              <td>{item.producto.nombre}</td>
              <td>{item.cantidad}</td>
              <td>{formatoPrecio(item.precio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <b>Total: {formatoPrecio(pedido.total)}</b>
      </p>
      <Link href="/">Volver a la tienda</Link>
    </div>
  );
}
