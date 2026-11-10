import type { Metadata } from "next";
import "./globals.css";
import { CarritoProvider } from "@/components/CarritoContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "La Percha",
  description: "Tienda de ropa y accesorios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CarritoProvider>
          <Header />
          <main className="contenido">{children}</main>
          <footer className="footer">La Percha - proyecto de práctica</footer>
        </CarritoProvider>
      </body>
    </html>
  );
}
