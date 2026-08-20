import type { Metadata } from "next";
import SpriteLab from "@/components/lab/SpriteLab";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// SpriteLab, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Animación de personaje",
  description:
    "Preview de sprite animado (reposo, andar, ataque) a partir de una lámina de referencia, con velocidad ajustable y vista de calibración de recortes.",
};

export default function SpriteLabPage() {
  return <SpriteLab />;
}
