export function formatoPrecio(valor: number) {
  return "$" + valor.toLocaleString("es-CO");
}

export function precioConDescuento(precio: number, descuento: number) {
  if (!descuento) return precio;
  return Math.round((precio * (100 - descuento)) / 100);
}

export function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generarReferencia() {
  const fecha = new Date();
  const parte = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "TO-" + fecha.getFullYear() + (fecha.getMonth() + 1) + fecha.getDate() + "-" + parte;
}

export function recortar(texto: string, max = 60) {
  if (texto.length <= max) return texto;
  return texto.substring(0, max) + "...";
}

export function formatoFecha(fecha: Date | string) {
  const f = new Date(fecha);
  return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear() + " " + f.getHours() + ":" + f.getMinutes();
}

// envio gratis desde 150 mil
export function calcularEnvio(subtotal: number) {
  if (subtotal >= 150000) return 0;
  return 8000;
}
