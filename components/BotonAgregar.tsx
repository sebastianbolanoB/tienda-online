"use client";

import { useState } from "react";
import { useCarrito } from "./CarritoContext";

export default function BotonAgregar({ producto }: { producto: any }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  if (producto.stock <= 0) {
    return <button disabled className="btn btn-gris">Agotado</button>;
  }

  return (
    <button
      className="btn"
      onClick={() => {
        agregar(producto);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1500);
      }}
    >
      {agregado ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
