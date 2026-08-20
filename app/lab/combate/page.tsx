import type { Metadata } from "next";
import CombatLab from "@/components/lab/CombatLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// CombatLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Combate",
  description:
    "Laboratorio de combate: iniciativa, adyacencia, ataque y estados, con el árbol de prioridades de la IA enemiga contra 1-2 enemigos Normales.",
};

export default function CombatLabPage() {
  return <CombatLab />;
}
