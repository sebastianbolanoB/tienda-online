import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verificarEvento, estadoDesdeWompi } from "@/lib/wompi";

export async function POST(req: Request) {
  const secreto = process.env.WOMPI_EVENTS_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "no configurado" }, { status: 500 });
  }

  const evento = await req.json();
  if (!verificarEvento(evento, secreto)) {
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  if (evento.event !== "transaction.updated") {
    return NextResponse.json({ ok: true });
  }

  const tx = evento.data.transaction;
  const pedido = await prisma.pedido.findUnique({
    where: { referencia: tx.reference },
    include: { items: true },
  });
  if (!pedido) {
    return NextResponse.json({ ok: true });
  }
  if (tx.amount_in_cents !== pedido.total * 100) {
    return NextResponse.json({ error: "el valor no coincide" }, { status: 400 });
  }

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
  }

  return NextResponse.json({ ok: true });
}
