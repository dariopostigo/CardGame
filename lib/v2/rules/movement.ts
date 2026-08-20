// =========================================================================
// Alcance de movimiento (docs/game-design.md §2.2)
//
// 1 movimiento = 1 hexágono cruzado, modificado por el coste de terreno de
// cada hexágono (`terrain.ts` `moveCost`). El Camino da +1 al pool la
// primera vez que se entra en él ese turno (`ROAD_MOVEMENT_BONUS` en
// terrain.ts) — no se acumula por cruzar varios, así que el alcance se busca
// con un estado doblado por hexágono: "bonus todavía disponible" / "ya
// gastado". Ese estado es POR TURNO, no por llamada: si el héroe ya se movió
// una vez este turno y gastó el bono, la llamada siguiente recibe
// `roadBonusAvailable = false` para no volver a concedérselo paso a paso
// (eso es lo que lo volvía prácticamente ilimitado). El suelo de 1 (§2.2,
// "nunca baja de 1 hexágono") es aparte: es el total de puntos del turno, no
// el coste de una casilla.
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

/** Alcance de un hexágono: puntos que quedarían y si ese camino ya gastó el bono de Camino. */
export type ReachableInfo = {
  readonly pointsLeft: number;
  readonly roadBonusUsed: boolean;
};

/**
 * Hexágonos alcanzables desde `from` con `points` de movimiento, con el
 * coste de terreno de cada uno y el bonus de Camino (una vez por turno, no
 * una vez por llamada: `roadBonusAvailable` es el estado real del turno —
 * si ya se gastó en un movimiento anterior, se pasa `false` para que no
 * vuelva a concederse aquí).
 *
 * `occupied` son los hexágonos con otra ficha encima ahora mismo: en el
 * tablero de batalla dos fichas nunca comparten hexágono (board/battle.md
 * §2), así que se tratan como intransitables tanto para terminar el
 * movimiento ahí como para atravesarlos de paso hacia otro más lejano. Vacío
 * por defecto porque el mapa de exploración sí permite compartir casilla
 * (los héroes co-op pueden arrancar juntos en la entrada) y no debe verse
 * afectado por este parámetro.
 *
 * @returns Info por hexágono alcanzable (incluido `from`, con `points`
 *   intactos). No filtra por terreno "abierto": la Montaña es transitable
 *   de verdad (coste 3), solo los huecos cerrados quedan fuera por no estar
 *   en `board.hexes`.
 */
export function reachableHexes(
  board: Board,
  from: HexCoord,
  points: number,
  roadBonusAvailable: boolean = true,
  occupied: ReadonlySet<HexKey> = new Set(),
): ReadonlyMap<HexKey, ReachableInfo> {
  // Coste mínimo para llegar a cada hexágono en cada estado del bonus de
  // Camino: [0] = todavía disponible, [1] = ya gastado.
  const cost = new Map<HexKey, [number, number]>();
  cost.set(Hex.key(from), roadBonusAvailable ? [0, Infinity] : [Infinity, 0]);

  const queue: Array<{ coord: HexCoord; roadUsed: boolean }> = [
    { coord: from, roadUsed: !roadBonusAvailable },
  ];
  for (let head = 0; head < queue.length; head++) {
    const { coord, roadUsed } = queue[head];
    const here = cost.get(Hex.key(coord))![roadUsed ? 1 : 0];

    for (const neighbor of Hex.neighbors(coord)) {
      const cell = board.hexes.get(Hex.key(neighbor));
      if (!cell) continue; // hueco cerrado o fuera del tablero
      if (occupied.has(Hex.key(neighbor))) continue; // otra ficha ya está ahí

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

  const best = new Map<HexKey, ReachableInfo>();
  for (const [key, [noRoad, road]] of cost) {
    // Empate a coste → se prefiere NO haber gastado el bono, para no
    // consumirlo de más cuando había una ruta igual de barata sin Camino.
    const roadBonusUsed = road < noRoad;
    const spent = roadBonusUsed ? road : noRoad;
    if (spent <= points) best.set(key, { pointsLeft: points - spent, roadBonusUsed });
  }
  return best;
}

/**
 * De `targets`, cuáles quedan a `range` hexágonos o menos de algún
 * hexágono de `reachable` — es decir, atacables ESTE turno una vez elegido
 * dónde moverse, no en el turno siguiente. `reachable` ya incluye el propio
 * hexágono de partida (sin gastar movimiento), así que un objetivo ya en
 * rango sin moverse también cuenta.
 *
 * Sirve para pintar, antes de mover, qué fichas rivales (o qué héroe, si
 * quien pregunta es un enemigo a distancia) se podrían golpear este turno:
 * es simétrica, no asume quién ataca a quién.
 */
export function attackableTargets(
  reachable: ReadonlyMap<HexKey, ReachableInfo>,
  range: number,
  targets: readonly HexCoord[],
): ReadonlySet<HexKey> {
  const from = [...reachable.keys()].map(Hex.fromKey);
  const result = new Set<HexKey>();
  for (const target of targets) {
    if (from.some((origin) => Hex.distance(origin, target) <= range)) {
      result.add(Hex.key(target));
    }
  }
  return result;
}
