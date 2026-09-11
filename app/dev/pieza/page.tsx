import type { Metadata } from "next";
import PieceModule from "@/components/dev/PieceModule";
import { getEffectCatalog } from "@/lib/v3/effects-catalog";
import { pilotCharacters } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, los catálogos, el roster y el montaje. Toda la
// interacción vive en PieceModule, que es el único "use client" de esta ruta
// (ARCHITECTURE.md §6).
//
// DOS DOCUMENTOS CRUZAN POR AQUÍ, igual que las Características en
// /dev/personaje: los dos se leen con `node:fs` y la ficha se dibuja en el
// cliente, así que se leen en el servidor y bajan como props tipadas.
//
//   · effects.md §5 → los nueve estados que se le pueden poner encima.
//   · razas.md      → LAS FICHAS. Las mismas 24 que reparte /dev/baraja y con la
//                     misma llamada, y eso es lo que cambió el 11 de septiembre
//                     de 2026: esta pantalla dibujaba los sujetos escritos a mano
//                     de components/design/v3/, con sus propios números, así que
//                     el mismo ⛏️ Minero tenía dos juegos de cifras según la
//                     pantalla en la que se mirara. El Catálogo de Características
//                     hace falta para construirlos: las Características del roster
//                     son texto hasta que se cruzan con él.

// Sin esto la lectura de los documentos se congela en el primer render y
// editarlos no cambiaría nada en pantalla.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ficha de personaje",
  description:
    "La pieza que se pone en el hexágono: el tier en el marco, de quién es en la casilla iluminada —azul yo, verde el aliado, rojo el enemigo—, la ❤️ Vida y los estados, con el retrato de la carta recortado dentro.",
};

export default function PiecePage() {
  const traits = getTraitCatalog();
  return (
    <PieceModule
      catalog={getEffectCatalog()}
      roster={pilotCharacters(getRoster(), traits)}
    />
  );
}
