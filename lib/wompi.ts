import crypto from "crypto";

const WOMPI_API = "https://sandbox.wompi.co/v1";

function sha256(texto: string) {
  return crypto.createHash("sha256").update(texto).digest("hex");
}

export function firmaIntegridad(referencia: string, centavos: number, moneda: string, secreto: string) {
  return sha256(referencia + centavos + moneda + secreto);
}

export function urlCheckout(referencia: string, total: number) {
  const llave = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  const secreto = process.env.WOMPI_INTEGRITY_SECRET;
  if (!llave || !secreto) return null;

  const centavos = total * 100;
  const firma = firmaIntegridad(referencia, centavos, "COP", secreto);
  const redirect = process.env.NEXT_PUBLIC_URL + "/pedido/" + referencia;

  return (
    "https://checkout.wompi.co/p/?public-key=" + llave +
    "&currency=COP" +
    "&amount-in-cents=" + centavos +
    "&reference=" + referencia +
    "&signature:integrity=" + firma +
    "&redirect-url=" + encodeURIComponent(redirect)
  );
}

export async function consultarTransaccion(id: string) {
  const res = await fetch(WOMPI_API + "/transactions/" + encodeURIComponent(id), { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

// wompi manda en signature.properties los campos que hay que concatenar
export function verificarEvento(evento: any, secreto: string) {
  if (!evento || !evento.signature || !evento.data) return false;
  let cadena = "";
  for (const prop of evento.signature.properties) {
    let valor = evento.data;
    for (const parte of prop.split(".")) {
      valor = valor ? valor[parte] : undefined;
    }
    cadena += valor;
  }
  cadena += evento.timestamp + secreto;
  const esperado = sha256(cadena);
  const recibido = String(evento.signature.checksum || "").toLowerCase();
  if (esperado.length !== recibido.length) return false;
  return crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(recibido));
}

export function estadoDesdeWompi(status: string) {
  if (status === "APPROVED") return "PAGADO";
  if (status === "DECLINED" || status === "ERROR" || status === "VOIDED") return "RECHAZADO";
  return "PENDIENTE";
}
