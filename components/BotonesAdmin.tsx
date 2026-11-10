"use client";

export function BotonBorrar({ id }: { id: number }) {
  async function borrar() {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    const res = await fetch("/api/admin/productos/" + id, { method: "DELETE" });
    if (res.ok) {
      const data = await res.json();
      if (data.desactivado) {
        alert("El producto tiene pedidos, se ocultó de la tienda en vez de borrarse");
      }
      window.location.reload();
    } else {
      alert("No se pudo borrar");
    }
  }

  return (
    <button className="btn btn-rojo" onClick={borrar}>
      Borrar
    </button>
  );
}

export function BotonSalir() {
  async function salir() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <button className="btn btn-gris" style={{ cursor: "pointer" }} onClick={salir}>
      Cerrar sesión
    </button>
  );
}
