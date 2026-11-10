"use client";

import { useState } from "react";

export default function FormProducto({ producto }: { producto?: any }) {
  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion || "");
  const [precio, setPrecio] = useState(producto?.precio || "");
  const [descuento, setDescuento] = useState(producto?.descuento || 0);
  const [stock, setStock] = useState(producto?.stock || 0);
  const [imagen, setImagen] = useState(producto?.imagen || "");
  const [categoria, setCategoria] = useState(producto?.categoria || "ropa");
  const [activo, setActivo] = useState(producto ? producto.activo : true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // TODO: subir la imagen en vez de pegar la url
  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nombre || !precio) {
      setError("El nombre y el precio son obligatorios");
      return;
    }
    setGuardando(true);

    const data = { nombre, descripcion, precio, descuento, stock, imagen, categoria, activo };
    let res;
    if (producto) {
      res = await fetch("/api/admin/productos/" + producto.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/admin/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const json = await res.json();
      setError(json.error || "No se pudo guardar");
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={guardar}>
      <label>
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>
        Descripción
        <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </label>
      <label>
        Precio
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      </label>
      <label>
        Descuento (%)
        <input type="number" value={descuento} onChange={(e) => setDescuento(e.target.value)} />
      </label>
      <label>
        Unidades disponibles
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      </label>
      <label>
        Imagen (url)
        <input value={imagen} onChange={(e) => setImagen(e.target.value)} />
      </label>
      <label>
        Categoría
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="ropa">ropa</option>
          <option value="calzado">calzado</option>
          <option value="accesorios">accesorios</option>
          <option value="hogar">hogar</option>
        </select>
      </label>
      {producto && (
        <label>
          <input
            type="checkbox"
            style={{ display: "inline", width: "auto" }}
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />{" "}
          Visible en la tienda
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={guardando}>
        {guardando ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
