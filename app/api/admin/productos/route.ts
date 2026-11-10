import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leerSesion } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await leerSesion();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.nombre || !body.precio || !body.categoria) {
    return NextResponse.json({ error: "Nombre, precio y categoría son obligatorios" }, { status: 400 });
  }

  const producto = await prisma.producto.create({
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion || "",
      precio: Number(body.precio),
      descuento: Number(body.descuento) || 0,
      stock: Number(body.stock) || 0,
      imagen: body.imagen || null,
      categoria: body.categoria,
    },
  });

  return NextResponse.json(producto);
}
