import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const productos = [
  { nombre: "Camiseta blanca cuello redondo", descripcion: "Algodón peinado. Horma normal, no encoge.", precio: 35000, descuento: 0, stock: 40, categoria: "ropa" },
  { nombre: "Camiseta negra estampada", descripcion: "Estampado en screen al frente", precio: 45900, descuento: 15, stock: 25, categoria: "ropa" },
  { nombre: "Jean azul bota recta", descripcion: "Para hombre, tallas de la 28 a la 36.", precio: 119900, descuento: 0, stock: 18, categoria: "ropa" },
  { nombre: "Buzo gris con capota", descripcion: "Perchado por dentro, con bolsillo canguro. Bueno para el frío de Bogotá.", precio: 89900, descuento: 10, stock: 12, categoria: "ropa" },
  { nombre: "Chaqueta rompevientos", descripcion: "Liviana, aguanta un aguacero corto", precio: 159900, descuento: 0, stock: 7, categoria: "ropa" },
  { nombre: "Tenis blancos", descripcion: "Suela plana. Vienen con cordones de repuesto.", precio: 189900, descuento: 20, stock: 15, categoria: "calzado" },
  { nombre: "Botas de cuero café", descripcion: "Cuero de verdad, hechas en Bucaramanga.", precio: 249900, descuento: 0, stock: 6, categoria: "calzado" },
  { nombre: "Chanclas", descripcion: "", precio: 39900, descuento: 0, stock: 30, categoria: "calzado" },
  { nombre: "Gorra negra", descripcion: "Visera curva, se ajusta atrás.", precio: 29900, descuento: 0, stock: 50, categoria: "accesorios" },
  { nombre: "Morral para portátil", descripcion: "Le cabe un portátil de 15 pulgadas y tiene bolsillo para el cargador.", precio: 134900, descuento: 12, stock: 9, categoria: "accesorios" },
  { nombre: "Billetera de cuero", descripcion: "Pequeña, con monedero", precio: 59900, descuento: 0, stock: 22, categoria: "accesorios" },
  { nombre: "Gafas de sol", descripcion: "Con filtro UV.", precio: 74900, descuento: 0, stock: 14, categoria: "accesorios" },
  { nombre: "Reloj digital", descripcion: "Resiste agua (lluvia y lavarse las manos, no piscina).", precio: 99900, descuento: 5, stock: 11, categoria: "accesorios" },
  { nombre: "Medias x3", descripcion: "Paquete de tres pares de medias tobilleras.", precio: 18990, descuento: 15, stock: 60, categoria: "ropa" },
  { nombre: "Termo metálico 500 ml", descripcion: "Mantiene frío unas 8 horas.", precio: 49900, descuento: 0, stock: 0, categoria: "hogar" },
  { nombre: "Mug blanco", descripcion: "Cerámica, 350 ml", precio: 15990, descuento: 0, stock: 35, categoria: "hogar" },
  { nombre: "Cojín 45x45", descripcion: "La funda se quita y se puede lavar.", precio: 32900, descuento: 33, stock: 20, categoria: "hogar" },
  { nombre: "Lámpara de escritorio", descripcion: "LED, brazo flexible, se conecta por USB.", precio: 69900, descuento: 0, stock: 8, categoria: "hogar" },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@tienda.com";
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) {
    console.log("Falta ADMIN_PASSWORD en el .env, no se crea el admin");
  } else {
    const hash = await bcrypt.hash(pass, 10);
    await prisma.usuario.upsert({
      where: { email },
      update: { password: hash },
      create: { email, password: hash, nombre: "Administrador" },
    });
    console.log("admin listo:", email);
  }

  const cuantos = await prisma.producto.count();
  if (cuantos > 0) {
    console.log("ya hay productos, no se cargan de nuevo");
    return;
  }

  let i = 1;
  for (const p of productos) {
    await prisma.producto.create({
      data: { ...p, imagen: "https://picsum.photos/seed/tienda" + i + "/400/300" },
    });
    i++;
  }
  console.log("productos cargados: " + productos.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
