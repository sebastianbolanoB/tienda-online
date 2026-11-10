import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { crearToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Escribe el correo y la contraseña" }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }

  const token = crearToken(usuario);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sesion", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
