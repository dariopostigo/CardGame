// Glifos de las fichas y localizaciones del tablero.
//
// Capa de presentación pura: el motor solo conoce los identificadores
// ("tesoro", "guarida"), nunca cómo se pintan. Son glifos provisionales
// —la fase de arte está diferida (docs/status.md §4)—, pero los conceptos
// que representan sí están cerrados (board-map.md §4).

import type { BoardToken, LocationId } from "@/lib/rules/state";

export const TOKEN_GLYPH: Record<BoardToken, { glyph: string; label: string }> = {
  exploracion: { glyph: "👁", label: "Exploración: comodín, puede salir cualquier cosa" },
  amenaza: { glyph: "❗", label: "Amenaza: peligro ambiguo, normalmente un enemigo" },
  tesoro: { glyph: "💰", label: "Tesoro: cartas y/o oro garantizados" },
  terreno: { glyph: "⛰", label: "Terreno: atajo arriesgado, prueba FUE/DES vs CD 12" },
  personaje: { glyph: "🧑", label: "Personaje: NPC con el que interactuar" },
  enemigo: { glyph: "⚔", label: "Enemigo: combate al quedar adyacente" },
};

export const LOCATION_GLYPH: Record<LocationId, { glyph: string; label: string }> = {
  pueblo: { glyph: "🏘", label: "Pueblo: tienda, descanso largo, limpiar Maldiciones" },
  mazmorra: { glyph: "🏚", label: "Mazmorra: 1 Élite y el mejor botín tras el boss" },
  guarida: { glyph: "🐉", label: "Guarida: el boss del capítulo" },
};

/** Nombre legible de los 3 Élite, para el resumen de la partida. */
export const ELITE_LABEL: Record<string, string> = {
  "capitan-bandido": "Capitán bandido",
  "trol-de-las-minas": "Trol de las minas",
  "arana-matriarca": "Araña matriarca",
};
