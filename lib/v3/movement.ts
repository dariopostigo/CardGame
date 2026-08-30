// =========================================================================
// El movimiento de una ficha — V3
//
// docs/v3/board/battle.md §5: "mueve hasta 👢 Movimiento hexágonos y hace su
// ataque, en cualquier orden", y sobre todo la regla que le da forma:
//
//   NO SE ATRAVIESA A NINGUNA FICHA, ni aliada ni enemiga, y dos fichas nunca
//   comparten hexágono.
//
// Eso es lo que convierte una línea de unidades en una PANTALLA, y es lo único
// que hace que este archivo no sea una resta: si se pudiera atravesar, "a qué
// hexágonos llego" sería `distancia ≤ 👢 Movimiento` y no haría falta código.
// Con cuerpos en medio hay que andar el camino, así que es un recorrido en
// anchura y el resultado puede ser mucho menor que el círculo.
//
// COSTE 1 POR CASILLA, y no es una simplificación: el prototipo se juega a campo
// abierto por decisión del §7 —ni terreno, ni obstáculos, ni cobertura—, así que
// hoy no existe ninguna casilla que cueste más. El día que entre el terreno,
// esto pasa a ser un recorrido con pesos y el resto de la firma no cambia.
//
// Lo que el §5 promete y aquí se puede medir: "con 12 filas de alto la pantalla
// no es un muro; rodear siempre es legal y lo que cuesta es tiempo — es un
// peaje, no una pared". `reachable` contra `openFieldReach` da exactamente el
// peaje, en hexágonos perdidos.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";
import { contains, within, type Arena } from "./arena";

/**
 * Los hexágonos que hay ocupados. No se pisan y no se atraviesan, así que valen
 * para las dos cosas a la vez: son destino prohibido y son pared.
 *
 * La casilla de la que sale la ficha NO tiene que estar aquí —se está yendo de
 * ella—, y quien construya el conjunto es quien lo sabe.
 */
export type Occupied = ReadonlySet<HexKey>;

/**
 * A qué hexágonos llega una ficha, y en cuántos pasos.
 *
 * @param {number} movement - 👢 Movimiento, en hexágonos por turno.
 * @returns {Map<HexKey, number>} Destino → pasos. **Sin la casilla de salida**:
 *   quedarse quieto siempre se puede y no es un destino, que es el mismo criterio
 *   que usa `within` en arena.ts.
 */
export function reachable(
  arena: Arena,
  from: HexCoord,
  movement: number,
  occupied: Occupied = new Set(),
): Map<HexKey, number> {
  const out = new Map<HexKey, number>();
  if (movement < 1) return out;

  const seen = new Set<HexKey>([Hex.key(from)]);
  let frontier: HexCoord[] = [from];

  for (let step = 1; step <= movement; step++) {
    const next: HexCoord[] = [];
    for (const hex of frontier) {
      for (const neighbour of Hex.neighbors(hex)) {
        const k = Hex.key(neighbour);
        if (seen.has(k)) continue;
        seen.add(k);
        if (!contains(arena, neighbour)) continue;
        // Una ficha no se pisa ni se atraviesa: no entra en el resultado y
        // tampoco sigue expandiendo desde ella.
        if (occupied.has(k)) continue;
        out.set(k, step);
        next.push(neighbour);
      }
    }
    if (next.length === 0) break; // encerrada: no hay por dónde seguir
    frontier = next;
  }

  return out;
}

/**
 * El camino más corto de `from` a `to`, esquivando lo ocupado, o null si no lo
 * hay dentro de `movement` pasos.
 *
 * @returns {HexCoord[] | null} El camino con la casilla de salida incluida, para
 *   poder dibujarlo de un tirón.
 */
export function pathTo(
  arena: Arena,
  from: HexCoord,
  to: HexCoord,
  movement: number,
  occupied: Occupied = new Set(),
): HexCoord[] | null {
  const target = Hex.key(to);
  if (target === Hex.key(from)) return [from];

  const parent = new Map<HexKey, HexCoord>();
  const seen = new Set<HexKey>([Hex.key(from)]);
  let frontier: HexCoord[] = [from];

  for (let step = 1; step <= movement; step++) {
    const next: HexCoord[] = [];
    for (const hex of frontier) {
      for (const neighbour of Hex.neighbors(hex)) {
        const k = Hex.key(neighbour);
        if (seen.has(k)) continue;
        seen.add(k);
        if (!contains(arena, neighbour) || occupied.has(k)) continue;
        parent.set(k, hex);
        if (k === target) {
          const path = [neighbour];
          let cursor: HexCoord | undefined = hex;
          while (cursor) {
            path.unshift(cursor);
            cursor = parent.get(Hex.key(cursor));
          }
          return path;
        }
        next.push(neighbour);
      }
    }
    if (next.length === 0) break;
    frontier = next;
  }

  return null;
}

/**
 * Cuántos hexágonos alcanzaría esa ficha si el campo estuviera vacío. Es el
 * círculo de `within`, y solo sirve para compararlo con lo que alcanza de
 * verdad: la diferencia es el peaje que cobra la pantalla (§5).
 */
export function openFieldReach(arena: Arena, from: HexCoord, movement: number): number {
  return within(arena, from, movement).length;
}

/**
 * Por qué esa ficha no puede ir a ese hexágono, o null si puede.
 *
 * Se devuelve el motivo y no un boolean por lo mismo de siempre
 * (ARCHITECTURE.md §5), y aquí gana un trabajo extra: las dos negativas del §5
 * —"está lejos" y "hay alguien en medio"— se parecen en el tablero y no se
 * parecen en nada como regla. Distinguirlas es lo que enseña que la pantalla es
 * un peaje y no una pared.
 *
 * @param {(hex: HexCoord) => string | null} nameAt - Cómo se llama quien ocupa
 *   un hexágono. Vive fuera porque este archivo no sabe qué es un bando.
 */
export function moveProblem(
  arena: Arena,
  from: HexCoord,
  to: HexCoord,
  movement: number,
  occupied: Occupied,
  nameAt: (hex: HexCoord) => string | null = () => null,
): string | null {
  if (!contains(arena, to)) return "Ese hexágono no está en el tablero.";
  if (Hex.equals(from, to)) return null;

  if (occupied.has(Hex.key(to))) {
    const name = nameAt(to) ?? "otra ficha";
    return `Ahí está ${name}, y dos fichas nunca comparten hexágono (§5).`;
  }

  const straight = Hex.distance(from, to);
  if (straight > movement) {
    return `Está a ${straight} hexágonos y 👢 Movimiento son ${movement}.`;
  }

  const steps = reachable(arena, from, movement, occupied).get(Hex.key(to));
  if (steps === undefined) {
    // Cabía en línea recta pero no se llega: hay cuerpos en medio y no se
    // atraviesa a nadie. Es el caso que hace falta explicar bien.
    const detour = reachable(arena, from, arena.hexes.length, occupied).get(Hex.key(to));
    return detour === undefined
      ? "No hay camino: la ficha está encerrada y no se atraviesa a nadie (§5)."
      : `En línea recta está a ${straight}, pero hay fichas en medio y no se atraviesa a nadie: rodeando son ${detour} pasos y 👢 Movimiento son ${movement} (§5).`;
  }

  return null;
}
