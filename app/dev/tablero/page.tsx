import type { Metadata } from "next";
import ArenaModule from "@/components/dev/ArenaModule";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// ArenaModule, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Tablero de batalla",
  description:
    "La arena de batalla de V3: rejilla hexagonal con bandas de despliegue de 2 columnas, y los tres alcances por tipo de daño medidos sobre ella.",
};

export default function ArenaPage() {
  return <ArenaModule />;
}
