import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatoPrecio, precioConDescuento } from "@/lib/utils";
import BotonAgregar from "@/components/BotonAgregar";

export default async function PaginaProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({ where: { id: Number(id) } });

  if (!producto || !producto.activo) {
    notFound();
  }

  return (
    <div className="detalle">
      <img src={producto.imagen || "/sin-imagen.svg"} alt={producto.nombre} />
      <div>
        <Link href="/">Volver</Link>
        <h1>{producto.nombre}</h1>
        <p className="categoria">{producto.categoria}</p>
        <p>{producto.descripcion}</p>
        {producto.descuento > 0 ? (
          <p className="precio grande">
            <span className="tachado">{formatoPrecio(producto.precio)}</span>{" "}
            {formatoPrecio(precioConDescuento(producto.precio, producto.descuento))}
            <span className="etiqueta">-{producto.descuento}%</span>
          </p>
        ) : (
          <p className="precio grande">{formatoPrecio(producto.precio)}</p>
        )}
        <p className="stock">
          {producto.stock > 0 ? "Disponibles: " + producto.stock : "Sin unidades por ahora"}
        </p>
        <BotonAgregar producto={producto} />
      </div>
    </div>
  );
}
