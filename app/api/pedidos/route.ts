import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validarEmail, generarReferencia, calcularEnvio } from "@/lib/utils";
import { urlCheckout } from "@/lib/wompi";

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, email, telefono, direccion, ciudad, items } = body;

  if (!nombre || !direccion || !ciudad) {
    return NextResponse.json({ error: "Faltan datos del envío" }, { status: 400 });
  }
  if (!email || !validarEmail(email)) {
    return NextResponse.json({ error: "El correo no es válido" }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  // los precios se sacan de la base de datos, no de lo que mande el navegador
  const ids = items.map((i: any) => Number(i.id));
  const productos = await prisma.producto.findMany({ where: { id: { in: ids }, activo: true } });

  let subtotal = 0;
  const lineas = [];
  for (const item of items) {
    const prod = productos.find((p) => p.id === Number(item.id));
    if (!prod) {
      return NextResponse.json({ error: "Uno de los productos ya no está disponible" }, { status: 400 });
    }
    const cantidad = parseInt(item.cantidad);
    if (!cantidad || cantidad < 1) {
      return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
    }
    const totalLinea = Math.floor((prod.precio * cantidad * (100 - prod.descuento)) / 100);
    subtotal += totalLinea;
    lineas.push({ productoId: prod.id, cantidad, precio: Math.floor(totalLinea / cantidad) });
  }

  const total = subtotal + calcularEnvio(subtotal);
  const referencia = generarReferencia();

  const pedido = await prisma.pedido.create({
    data: {
      referencia,
      nombre,
      email,
      telefono: telefono || "",
      direccion,
      ciudad,
      total,
      items: { create: lineas },
    },
  });
  console.log("pedido creado", pedido.id, referencia);

  const urlPago = urlCheckout(referencia, total);

  return NextResponse.json({ referencia, urlPago });
}
