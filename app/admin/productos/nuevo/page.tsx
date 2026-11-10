import { redirect } from "next/navigation";
import { leerSesion } from "@/lib/auth";
import FormProducto from "@/components/FormProducto";

export default async function NuevoProducto() {
  const user = await leerSesion();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <h1>Nuevo producto</h1>
      <FormProducto />
    </div>
  );
}
