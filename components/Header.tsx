"use client";

import Link from "next/link";
import { useCarrito } from "./CarritoContext";

export default function Header() {
  const { items } = useCarrito();
  const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <header className="header">
      <Link href="/" className="logo">
        La Percha
      </Link>
      <nav>
        <Link href="/">Productos</Link>
        <Link href="/carrito">Carrito ({cantidad})</Link>
      </nav>
    </header>
  );
}
