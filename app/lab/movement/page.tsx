import type { Metadata } from "next";
import MovementLab from "@/components/lab/MovementLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// MovementLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Movimiento y visión",
  description:
    "Laboratorio de alcance de movimiento y los dos radios de visión: coste de terreno, bonus de Camino y niebla acumulativa.",
};

export default function MovementLabPage() {
  return <MovementLab />;
}
