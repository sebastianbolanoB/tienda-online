import { describe, it, expect } from "vitest";
import { formatoPrecio, precioConDescuento, validarEmail, calcularEnvio, recortar } from "../lib/utils";

describe("utils", () => {
  it("calcula el precio con descuento", () => {
    expect(precioConDescuento(100000, 10)).toBe(90000);
    expect(precioConDescuento(45900, 15)).toBe(39015);
  });

  it("sin descuento devuelve el mismo precio", () => {
    expect(precioConDescuento(35000, 0)).toBe(35000);
  });

  it("formatea el precio", () => {
    expect(formatoPrecio(35000)).toContain("35");
    expect(formatoPrecio(35000).startsWith("$")).toBe(true);
  });

  it("valida correos", () => {
    expect(validarEmail("caro.m@gmail.com")).toBe(true);
    expect(validarEmail("caro")).toBe(false);
    expect(validarEmail("caro@gmail")).toBe(false);
  });

  it("cobra envio si la compra es pequeña", () => {
    expect(calcularEnvio(50000)).toBe(8000);
    expect(calcularEnvio(200000)).toBe(0);
  });

  it("recorta textos largos", () => {
    expect(recortar("hola", 10)).toBe("hola");
    expect(recortar("un texto bastante largo", 8)).toBe("un texto...");
  });
});
