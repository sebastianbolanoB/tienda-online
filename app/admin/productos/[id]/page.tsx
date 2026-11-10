import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { leerSesion } from "@/lib/auth";
import FormProducto from "@/components/FormProducto";

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const user = await leerSesion();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const producto = await prisma.producto.findUnique({ where: { id: Number(id) } });
  if (!producto) notFound();

  return (
    <div>
      <h1>Editar producto</h1>
      <FormProducto producto={producto} />
    </div>
  );
}
