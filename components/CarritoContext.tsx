"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
  imagen: string | null;
  cantidad: number;
};

type Ctx = {
  items: ItemCarrito[];
  agregar: (p: any, cantidad?: number) => void;
  quitar: (id: number) => void;
  cambiarCantidad: (id: number, cantidad: number) => void;
  vaciar: () => void;
};

const CarritoCtx = createContext<Ctx | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("carrito");
    if (guardado) {
      setItems(JSON.parse(guardado));
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items, cargado]);

  function agregar(p: any, cantidad = 1) {
    setItems((actual) => {
      const existe = actual.find((i) => i.id === p.id);
      if (existe) {
        return actual.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + cantidad } : i));
      }
      return [
        ...actual,
        { id: p.id, nombre: p.nombre, precio: p.precio, descuento: p.descuento, imagen: p.imagen, cantidad },
      ];
    });
  }

  function quitar(id: number) {
    setItems((actual) => actual.filter((i) => i.id !== id));
  }

  function cambiarCantidad(id: number, cantidad: number) {
    if (cantidad < 1) return;
    setItems((actual) => actual.map((i) => (i.id === id ? { ...i, cantidad } : i)));
  }

  function vaciar() {
    setItems([]);
  }

  return (
    <CarritoCtx.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar }}>
      {children}
    </CarritoCtx.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoCtx);
  if (!ctx) throw new Error("falta el CarritoProvider");
  return ctx;
}
