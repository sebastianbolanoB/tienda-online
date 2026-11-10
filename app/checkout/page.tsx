"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrito } from "@/components/CarritoContext";
import { formatoPrecio, precioConDescuento, calcularEnvio } from "@/lib/utils";

export default function Checkout() {
  const { items } = useCarrito();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  let subtotal = 0;
  for (const item of items) {
    subtotal += precioConDescuento(item.precio, item.descuento) * item.cantidad;
  }
  const envio = calcularEnvio(subtotal);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !direccion || !ciudad) {
      setError("Completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          direccion,
          ciudad,
          items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setCargando(false);
        return;
      }
      if (data.urlPago) {
        window.location.href = data.urlPago;
      } else {
        window.location.href = "/pedido/" + data.referencia;
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (items.length === 0) {
    return (
      <div>
        <h1>Finalizar compra</h1>
        <p>No hay productos en el carrito.</p>
        <Link href="/">Ver productos</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Finalizar compra</h1>
      <form className="formulario" onSubmit={enviar}>
        <label>
          Nombre completo
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Correo
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Teléfono
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </label>
        <label>
          Dirección
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </label>
        <label>
          Ciudad
          <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
        </label>

        <p>Subtotal: {formatoPrecio(subtotal)}</p>
        <p>Envío: {envio === 0 ? "Gratis" : formatoPrecio(envio)}</p>
        <p>
          <b>Total a pagar: {formatoPrecio(subtotal + envio)}</b>
        </p>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit">
          {cargando ? "Procesando..." : "Pagar con Wompi"}
        </button>
      </form>
    </div>
  );
}
