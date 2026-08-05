// =========================================================================
// Las dos capas de niebla (docs/game-design.md §2.3, decidido)
//
// Dos radios distintos porque "ver por dónde voy" y "ver qué hay ahí" no son
// la misma cosa: visión de TERRENO (silueta del mapa) y visión de DETALLE
// (fichas y localizaciones). Ambos salen del modificador de Sabiduría del
// héroe y se recortan por el terreno donde está de pie —Bosque y Mazmorra
// ciegan, Montaña corta la línea de visión— nunca por el terreno del
// hexágono mirado.
//
// Acumulativa y permanente (ARCHITECTURE.md §4): revelar solo ENCIENDE
// flags, nunca los apaga. Un hexágono visto una vez se queda visto aunque el
// héroe se aleje.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";
import type { Board, Hex as HexCell } from "./state";
import { TERRAINS, type TerrainId } from "./terrain";

/** Visión de detalle: `2 + mod SAB`, nunca por debajo de 1. */
export function detailRadius(sabMod: number): number {
  return Math.max(1, 2 + sabMod);
}

/** Visión de terreno: la de detalle + 2, nunca por debajo de 2. */
export function terrainRadiusFromDetail(detail: number): number {
  return Math.max(2, detail + 2);
}

export type VisionRadii = {
  readonly detail: number;
  readonly terrain: number;
};

/**
 * Los dos radios ya con el modificador del terreno donde el héroe está de
 * pie aplicado a ambos (Bosque −1, Mazmorra −2 — `terrain.ts`
 * `heroVisionMod`), respetando los mismos suelos que la fórmula base.
 */
export function visionRadii(sabMod: number, standingTerrain: TerrainId): VisionRadii {
  const mod = TERRAINS[standingTerrain].heroVisionMod;
  const baseDetail = detailRadius(sabMod);
  const baseTerrain = terrainRadiusFromDetail(baseDetail);
  return {
    detail: Math.max(1, baseDetail + mod),
    terrain: Math.max(2, baseTerrain + mod),
  };
}

/**
 * Revela la niebla vista desde `from` con la Sabiduría `sabMod`. Devuelve un
 * `Board` nuevo: las celdas sin cambios conservan la misma referencia, así
 * que un render que compare por identidad no repinta lo que no cambió.
 */
export function revealFromPosition(board: Board, from: HexCoord, sabMod: number): Board {
  const origin = board.hexes.get(Hex.key(from));
  if (!origin) return board;

  const radii = visionRadii(sabMod, origin.terrain);
  const isOpaque = (coord: HexCoord): boolean => {
    const cell = board.hexes.get(Hex.key(coord));
    return cell ? TERRAINS[cell.terrain].blocksLineOfSight : false;
  };

  let hexes: Map<HexKey, HexCell> | null = null;
  for (const coord of Hex.withinRadius(from, radii.terrain)) {
    const key = Hex.key(coord);
    const cell = board.hexes.get(key);
    if (!cell) continue; // hueco cerrado o fuera del tablero

    const wantsDetail = Hex.distance(from, coord) <= radii.detail;
    const alreadyFull = cell.terrainRevealed && (cell.contentRevealed || !wantsDetail);
    if (alreadyFull) continue;
    if (!Hex.hasLineOfSight(from, coord, isOpaque)) continue;

    hexes ??= new Map(board.hexes);
    hexes.set(key, {
      ...cell,
      terrainRevealed: true,
      contentRevealed: cell.contentRevealed || wantsDetail,
    });
  }

  return hexes ? { ...board, hexes } : board;
}
