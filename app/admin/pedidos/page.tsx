import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { leerSesion } from "@/lib/auth";
import { formatoPrecio, formatoFecha } from "@/lib/utils";

export default async function Pedidos() {
  const usuario = await leerSesion();
  if (!usuario) redirect("/admin/login");

  // TODO paginar esto cuando haya muchos pedidos
  const pedidos = await prisma.pedido.findMany({
    orderBy: { creado: "desc" },
    include: { items: { include: { producto: true } } },
  });

  // const pagados = pedidos.filter((p) => p.estado === "PAGADO");
  let vendido = 0;
  for (const p of pedidos) {
    if (p.estado === "PAGADO") vendido += p.total;
  }

  return (
    <div>
      <h1>Pedidos</h1>
      <p>
        <Link href="/admin">Volver al panel</Link>
      </p>
      <p>
        Total de pedidos: {pedidos.length} - Vendido: {formatoPrecio(vendido)}
      </p>

      <table>
        <thead>
          <tr>
            <th>Referencia</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Envío</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.referencia}</td>
              <td>{formatoFecha(p.creado)}</td>
              <td>
                {p.nombre}
                <br />
                {p.email}
                <br />
                {p.telefono}
              </td>
              <td>
                {p.direccion}, {p.ciudad}
              </td>
              <td>
                {p.items.map((i) => (
                  <div key={i.id}>
                    {i.cantidad} x {i.producto.nombre}
                  </div>
                ))}
              </td>
              <td>{formatoPrecio(p.total)}</td>
              <td>{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
