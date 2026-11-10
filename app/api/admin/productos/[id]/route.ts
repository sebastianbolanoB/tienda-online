import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leerSesion } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await leerSesion();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;

  const body = await req.json();
  if (!body.nombre || !body.precio || !body.categoria) {
    return NextResponse.json({ error: "Nombre, precio y categoría son obligatorios" }, { status: 400 });
  }

  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion || "",
      precio: Number(body.precio),
      descuento: Number(body.descuento) || 0,
      stock: Number(body.stock) || 0,
      imagen: body.imagen || null,
      categoria: body.categoria,
      activo: body.activo,
    },
  });

  return NextResponse.json(producto);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await leerSesion();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;

  // si el producto ya tiene pedidos no se puede borrar, se desactiva
  const usado = await prisma.pedidoItem.count({ where: { productoId: Number(id) } });
  if (usado > 0) {
    await prisma.producto.update({ where: { id: Number(id) }, data: { activo: false } });
    return NextResponse.json({ ok: true, desactivado: true });
  }

  await prisma.producto.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
