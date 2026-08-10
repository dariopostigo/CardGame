import type { Metadata } from "next";
import BoardLab from "@/components/dev/BoardLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// BoardLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Generación de tablero",
  description:
    "Laboratorio del generador de tablero: encaje de losetas, semilla, silueta y densidad de fichas.",
};

export default function BoardLabPage() {
  return <BoardLab />;
}
