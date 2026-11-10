import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { leerSesion } from "@/lib/auth";
import { formatoPrecio } from "@/lib/utils";
import { BotonBorrar, BotonSalir } from "@/components/BotonesAdmin";

export default async function Admin() {
  const user = await leerSesion();
  if (!user) redirect("/admin/login");

  const productos = await prisma.producto.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1>Panel de administrador</h1>
      <p>
        <Link href="/admin/productos/nuevo" className="btn">
          Nuevo producto
        </Link>{" "}
        <Link href="/admin/pedidos" className="btn">
          Ver pedidos
        </Link>{" "}
        <BotonSalir />
      </p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Visible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{formatoPrecio(p.precio)}</td>
              <td>{p.stock}</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td>
                <Link href={"/admin/productos/" + p.id}>Editar</Link> <BotonBorrar id={p.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
