import type { Metadata } from "next";
import DiceLab from "@/components/lab/DiceLab";

// Server Component: solo metadata y montaje. Toda la interacción (Three.js,
// cannon-es) vive en DiceLab, el único "use client" de esta ruta
// (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Tirada de dados",
  description:
    "Laboratorio de dados físicos con Three.js y cannon-es para los 7 tipos de D&D: d4, d6, d8, d10, d12, d20 y d100.",
};

export default function DiceLabPage() {
  return <DiceLab />;
}
