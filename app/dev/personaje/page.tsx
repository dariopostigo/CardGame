import type { Metadata } from "next";
import CharacterModule from "@/components/dev/CharacterModule";
import { getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, el catálogo y el montaje. Toda la interacción vive
// en CharacterModule, que es el único "use client" de esta ruta
// (ARCHITECTURE.md §6).
//
// EL CATÁLOGO CRUZA POR AQUÍ, y este es el motivo de que la página no sea una
// línea: `traits-catalog.ts` usa `node:fs` y el inspector es un componente de
// cliente, así que la lectura se hace en el servidor y las 41 Características
// bajan como props tipadas — que es la opción que ARCHITECTURE.md §7 deja
// apuntada para el catálogo de cartas. Son 41 filas: no hace falta generar
// ningún JSON en build.

// Sin esto la lectura de razas.md se congela en el primer render y editar el
// documento no cambiaría nada en pantalla, que es exactamente lo que le pasó a
// la wiki cuando empezó a leer los .md en vivo.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estadísticas de personaje",
  description:
    "La hoja de datos de los personajes de V3 —no la ficha del tablero, que es otro módulo—: las 8 Habilidades con su escala y sus topes, el tipo de daño con su alcance, y el catálogo de Características leído de razas.md.",
};

export default function CharacterPage() {
  return <CharacterModule catalog={getTraitCatalog()} />;
}
