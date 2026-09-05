import type { Metadata } from "next";
import PieceModule from "@/components/dev/PieceModule";
import { getEffectCatalog } from "@/lib/v3/effects-catalog";

// Server Component: metadata, el catálogo de estados y el montaje. Toda la
// interacción vive en PieceModule, que es el único "use client" de esta ruta
// (ARCHITECTURE.md §6).
//
// EL CATÁLOGO CRUZA POR AQUÍ, igual que las Características en /dev/personaje:
// `effects-catalog.ts` usa `node:fs` y la ficha se dibuja en el cliente, así que
// los nueve estados de effects.md §5 se leen en el servidor y bajan como props
// tipadas. Son nueve filas: no hace falta generar ningún JSON.

// Sin esto la lectura de effects.md se congela en el primer render y editar el
// documento no cambiaría nada en pantalla.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ficha de personaje",
  description:
    "La pieza que se pone en el hexágono: el tier en el marco, de quién es en la casilla iluminada —azul yo, verde el aliado, rojo el enemigo—, la ❤️ Vida y los estados, con el retrato de la carta recortado dentro.",
};

export default function PiecePage() {
  return <PieceModule catalog={getEffectCatalog()} />;
}
