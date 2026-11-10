import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function secreto() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("Falta JWT_SECRET en el .env");
  return s;
}

export function crearToken(user: { id: number; email: string; rol: string }) {
  return jwt.sign({ id: user.id, email: user.email, rol: user.rol }, secreto(), { expiresIn: "8h" });
}

export async function leerSesion() {
  const c = await cookies();
  const token = c.get("sesion")?.value;
  if (!token) return null;
  try {
    const data: any = jwt.verify(token, secreto());
    if (data.rol !== "admin") return null;
    return data;
  } catch (e) {
    return null;
  }
}
