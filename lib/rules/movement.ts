// =========================================================================
// Alcance de movimiento (docs/game-design.md §2.2)
//
// 1 movimiento = 1 hexágono cruzado, modificado por el coste de terreno de
// cada hexágono (`terrain.ts` `moveCost`). El Camino da +1 al pool la
// primera vez que se entra en él ese turno (`ROAD_MOVEMENT_BONUS` en
// terrain.ts) — no se acumula por cruzar varios, así que el alcance se busca
// con un estado doblado por hexágono: "bonus todavía disponible" / "ya
// gastado". El suelo de 1 (§2.2, "nunca baja de 1 hexágono") es aparte: es
// el total de puntos del turno, no el coste de una casilla.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";
import type { Board } from "./state";
import { TERRAINS } from "./terrain";

/** Estándar para todos los héroes, sin variación por raza (§2.2). */
export const MOVE_BASE = 2;

/** El movimiento nunca baja de esto por turno, por muchos modificadores negativos que se acumulen. */
export const MOVE_FLOOR = 1;

/** Puntos de movimiento del turno: base + modificadores, con el suelo aplicado. */
export function movePointsForTurn(base: number, modifiers: readonly number[] = []): number {
  const total = modifiers.reduce((sum, m) => sum + m, base);
  return Math.max(MOVE_FLOOR, total);
}

/**
 * Hexágonos alcanzables desde `from` con `points` de movimiento, con el
 * coste de terreno de cada uno y el bonus de Camino (una vez por turno).
 *
 * @returns Puntos restantes por hexágono alcanzable (incluido `from`, con
 *   `points` intactos). No filtra por terreno "abierto": la Montaña es
 *   transitable de verdad (coste 3), solo los huecos cerrados quedan fuera
 *   por no estar en `board.hexes`.
 */
export function reachableHexes(
  board: Board,
  from: HexCoord,
  points: number,
): ReadonlyMap<HexKey, number> {
  // Coste mínimo para llegar a cada hexágono en cada estado del bonus de
  // Camino: [0] = todavía disponible, [1] = ya gastado.
  const cost = new Map<HexKey, [number, number]>();
  cost.set(Hex.key(from), [0, Infinity]);

  const queue: Array<{ coord: HexCoord; roadUsed: boolean }> = [{ coord: from, roadUsed: false }];
  for (let head = 0; head < queue.length; head++) {
    const { coord, roadUsed } = queue[head];
    const here = cost.get(Hex.key(coord))![roadUsed ? 1 : 0];

    for (const neighbor of Hex.neighbors(coord)) {
      const cell = board.hexes.get(Hex.key(neighbor));
      if (!cell) continue; // hueco cerrado o fuera del tablero

      const grantsBonus = !roadUsed && cell.terrain === "camino";
      const nextRoadUsed = roadUsed || cell.terrain === "camino";
      const stepCost = TERRAINS[cell.terrain].moveCost - (grantsBonus ? 1 : 0);
      const next = here + stepCost;
      if (next > points) continue;

      const nk = Hex.key(neighbor);
      const slot = nextRoadUsed ? 1 : 0;
      const entry: [number, number] = cost.get(nk) ?? [Infinity, Infinity];
      if (entry[slot] <= next) continue;
      entry[slot] = next;
      cost.set(nk, entry);
      queue.push({ coord: neighbor, roadUsed: nextRoadUsed });
    }
  }

  const best = new Map<HexKey, number>();
  for (const [key, [noRoad, road]] of cost) {
    const spent = Math.min(noRoad, road);
    if (spent <= points) best.set(key, points - spent);
  }
  return best;
}
