import type { Metadata } from "next";
import TileLab from "@/components/dev/TileLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// TileLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Losetas",
  description:
    "Laboratorio de losetas: forma, terreno y anclas de cada pieza del tablero, en cinco tamaños, con catálogo y editor de bocetos.",
};

export default function LosetasLabPage() {
  return <TileLab />;
}
