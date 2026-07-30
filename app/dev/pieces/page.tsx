import type { Metadata } from "next";
import PieceLab from "@/components/dev/PieceLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// PieceLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Diseño de fichas",
  description:
    "Laboratorio de fichas del tablero: las 6 de contenido y las 3 de personaje, con su legibilidad sobre cada terreno y sus estados.",
};

export default function PiecesLabPage() {
  return <PieceLab />;
}
