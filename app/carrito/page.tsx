"use client";

import Link from "next/link";
import { useCarrito } from "@/components/CarritoContext";
import { formatoPrecio, precioConDescuento, calcularEnvio } from "@/lib/utils";

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar } = useCarrito();

  let subtotal = 0;
  for (const item of items) {
    subtotal += precioConDescuento(item.precio, item.descuento) * item.cantidad;
  }
  const envio = calcularEnvio(subtotal);

  if (items.length === 0) {
    return (
      <div>
        <h1>Carrito</h1>
        <p>Todavía no has agregado productos.</p>
        <Link href="/">Ver productos</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{formatoPrecio(precioConDescuento(item.precio, item.descuento))}</td>
              <td>
                <input
                  className="cant"
                  type="number"
                  min={1}
                  value={item.cantidad}
                  onChange={(e) => cambiarCantidad(item.id, Number(e.target.value))}
                />
              </td>
              <td>{formatoPrecio(precioConDescuento(item.precio, item.descuento) * item.cantidad)}</td>
              <td>
                <button className="btn btn-rojo" onClick={() => quitar(item.id)}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="resumen">
        <p>
          <span>Subtotal</span> <span>{formatoPrecio(subtotal)}</span>
        </p>
        <p>
          <span>Envío</span> <span>{envio === 0 ? "Gratis" : formatoPrecio(envio)}</span>
        </p>
        <p>
          <b>Total</b> <b>{formatoPrecio(subtotal + envio)}</b>
        </p>
        <Link href="/checkout" className="btn">
          Continuar con la compra
        </Link>{" "}
        <button className="btn btn-gris" onClick={vaciar}>
          Vaciar
        </button>
      </div>
    </div>
  );
}
