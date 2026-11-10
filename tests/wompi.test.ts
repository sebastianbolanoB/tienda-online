import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { firmaIntegridad, verificarEvento, estadoDesdeWompi } from "../lib/wompi";

describe("wompi", () => {
  it("genera la firma de integridad", () => {
    const firma = firmaIntegridad("REF1", 5000000, "COP", "secreto_prueba");
    const esperado = crypto.createHash("sha256").update("REF15000000COPsecreto_prueba").digest("hex");
    expect(firma).toBe(esperado);
  });

  it("acepta un evento con la firma correcta", () => {
    const secreto = "secreto_eventos";
    const evento: any = {
      event: "transaction.updated",
      data: { transaction: { id: "123-abc", status: "APPROVED", amount_in_cents: 5000000 } },
      timestamp: 1700000000,
      signature: {
        properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
        checksum: "",
      },
    };
    evento.signature.checksum = crypto
      .createHash("sha256")
      .update("123-abcAPPROVED5000000" + 1700000000 + secreto)
      .digest("hex");

    expect(verificarEvento(evento, secreto)).toBe(true);
  });

  it("rechaza un evento con la firma mala", () => {
    const evento = {
      data: { transaction: { id: "1", status: "APPROVED", amount_in_cents: 100 } },
      timestamp: 1,
      signature: { properties: ["transaction.id"], checksum: "abc" },
    };
    expect(verificarEvento(evento, "x")).toBe(false);
  });

  it("convierte el estado", () => {
    expect(estadoDesdeWompi("APPROVED")).toBe("PAGADO");
    expect(estadoDesdeWompi("DECLINED")).toBe("RECHAZADO");
    expect(estadoDesdeWompi("PENDING")).toBe("PENDIENTE");
  });
});
