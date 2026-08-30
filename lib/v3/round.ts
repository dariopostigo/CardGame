// =========================================================================
// La ronda: la aproximación jugándose sola — V3
//
// docs/v3/board/battle.md §4 y §5. Hasta aquí el tablero MEDÍA —cuántos
// hexágonos, en qué ronda, hasta dónde llega—; esto lo hace ANDAR: cada ficha
// coge su turno y se mueve, y se ve dónde y cuándo se produce el choque.
//
// LO QUE ESTO NO ES: no resuelve ataques. No hay ❤️ Vida, ni tirada, ni bajas
// —eso es game-design.md §4 y necesita las 8 Habilidades—. Aquí un ataque solo
// se APUNTA: "esta ficha llegó a tener a esta otra a tiro en esta ronda". Con
// eso basta para contestar lo que el §10 manda vigilar el primero, que no es
// cuánto pega nadie sino si la batalla llega a empezar.
//
// DE DÓNDE SALE CADA CONDUCTA, porque no se ha inventado ninguna: la tabla del
// §1.1 le da su trabajo a cada tipo de daño con estas palabras exactas —
//
//   🗡️ Cuerpo a cuerpo  "Cruza el campo entero. Es el que paga la aproximación"
//   ✨ Mágico           "Avanza a media rienda y entra detrás del 🗡️"
//   🏹 A distancia      "No avanza: espera. Su trabajo es castigar a quien cruce"
//
// — así que son dos conductas y no tres: CRUZAR y ESPERAR. Lo que separa al 🗡️
// del ✨ no es la intención, es su 👢 Movimiento, y eso ya está en el dial. Y el
// que espera, cuando le llega alguien, dispara y retrocede: es el bucle que el
// §1.2 describe, jugado en 2D sobre el tablero de verdad en vez de en la línea
// recta del papel.
//
// EL ORDEN DE LA RONDA ES UN SUSTITUTO, y hay que decirlo: el §4 lo saca de
// ⚡ Iniciativa, y ⚡ no tiene valores todavía. Aquí se alterna entre bandos, que
// es lo más parecido a una lista entrelazada sin inventarse un número, y quién
// abre la ronda es un mando —el §1.2 usa justo ese peor caso: mueve antes el que
// huye—. El día que ⚡ tenga escala, esto se tira y se ordena de verdad.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";
import { type Arena, type Side } from "./arena";
import { DAMAGE_TYPES, type DamageTypeId } from "./damage";
import { reachable } from "./movement";

/** Las dos conductas de la tabla del §1.1. */
export type Intent = "cruza" | "espera";

export function intentOf(damage: DamageTypeId): Intent {
  return damage === "a-distancia" ? "espera" : "cruza";
}

/** Una ficha en el campo, con lo único que hace falta para moverla. */
export type Actor = {
  readonly id: string;
  readonly side: Side;
  readonly damage: DamageTypeId;
  readonly hex: HexCoord;
};

export type TurnLog = {
  readonly id: string;
  readonly side: Side;
  readonly from: HexCoord;
  readonly to: HexCoord;
  /** Hexágonos andados. 0 es que no se movió, por gusto o por no poder. */
  readonly steps: number;
  /** A quién tuvo a tiro al terminar, si a alguien. */
  readonly attacked: string | null;
  /** Por qué no se movió, cuando no se movió. */
  readonly held: "sin salida" | "espera" | "ya está a tiro" | "sin enemigos" | null;
};

/** El orden de la ronda: ids en el orden en el que juegan. */
export type Order = readonly string[];

/**
 * Alterna los dos bandos ficha a ficha, empezando por `first`. Es el SUSTITUTO
 * de la lista de ⚡ Iniciativa del §4 mientras ⚡ no tenga valores: no ordena por
 * nada —respeta el orden en el que están las fichas— pero sí entrelaza, que es
 * la propiedad del §4 que cambia cómo se juega (nadie encadena la ronda entera
 * antes de que el rival mueva).
 */
export function alternatingOrder(actors: readonly Actor[], first: Side = "propio"): Order {
  const second: Side = first === "propio" ? "enemigo" : "propio";
  const a = actors.filter((x) => x.side === first).map((x) => x.id);
  const b = actors.filter((x) => x.side === second).map((x) => x.id);
  const out: string[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

/** El enemigo más cercano y a qué distancia, o null si no queda ninguno. */
function nearestFoe(
  actors: readonly Actor[],
  self: Actor,
): { foe: Actor; distance: number } | null {
  let best: { foe: Actor; distance: number } | null = null;
  for (const other of actors) {
    if (other.side === self.side) continue;
    const distance = Hex.distance(self.hex, other.hex);
    if (!best || distance < best.distance) best = { foe: other, distance };
  }
  return best;
}

/**
 * El turno de una ficha: mueve hasta su 👢 Movimiento y, si al terminar tiene a
 * alguien a tiro, se apunta el ataque (§5: las dos cosas, en cualquier orden).
 *
 * @param {Record<DamageTypeId, number>} movement - 👢 por tipo de daño (§1.1).
 */
export function takeTurn(
  arena: Arena,
  actors: readonly Actor[],
  id: string,
  movement: Readonly<Record<DamageTypeId, number>>,
): { actor: Actor; log: TurnLog } {
  const self = actors.find((a) => a.id === id);
  if (!self) throw new Error(`No hay ninguna ficha con id ${id}`);

  const type = DAMAGE_TYPES[self.damage];
  const boots = movement[self.damage];
  const target = nearestFoe(actors, self);

  const stay = (held: TurnLog["held"]): { actor: Actor; log: TurnLog } => ({
    actor: self,
    log: {
      id,
      side: self.side,
      from: self.hex,
      to: self.hex,
      steps: 0,
      attacked: target && target.distance <= type.range ? target.foe.id : null,
      held,
    },
  });

  // Sin nadie enfrente no hay conducta que aplicar, y decirlo "espera" sería
  // confundirlo con el 🏹 que espera a propósito (§1.1).
  if (!target) return stay("sin enemigos");

  // Lo ocupado: todos menos ella misma. No se pisa y no se atraviesa (§5).
  const occupied = new Set<HexKey>(
    actors.filter((a) => a.id !== id).map((a) => Hex.key(a.hex)),
  );
  const options = reachable(arena, self.hex, boots, occupied);
  if (options.size === 0) {
    return stay(target.distance <= type.range ? "ya está a tiro" : "sin salida");
  }

  // Las dos conductas del §1.1, y son la misma función con el signo cambiado:
  // el que cruza quiere el hexágono que más lo acerca, el que espera el que más
  // lo aleja. Se elige entre lo alcanzable, así que los cuerpos ya están
  // contados.
  const crossing = intentOf(self.damage) === "cruza";

  // El que espera solo se mueve si tiene a alguien encima: si nadie ha llegado,
  // su sitio es quieto (§1.1) y retroceder sería regalar campo.
  if (!crossing && target.distance > type.range) return stay("espera");

  let bestHex = self.hex;
  let bestDistance = target.distance;
  let bestSteps = 0;
  for (const [key, steps] of options) {
    const hex = Hex.fromKey(key);
    const distance = Hex.distance(hex, target.foe.hex);
    const better = crossing
      ? distance < bestDistance || (distance === bestDistance && steps < bestSteps)
      : distance > bestDistance || (distance === bestDistance && steps < bestSteps);
    if (better) {
      bestHex = hex;
      bestDistance = distance;
      bestSteps = steps;
    }
  }

  // El que cruza y ya está a tiro no da un paso de más: pegar es lo que quería.
  if (crossing && target.distance <= type.range) return stay("ya está a tiro");

  const moved: Actor = { ...self, hex: bestHex };
  const after = nearestFoe(
    actors.map((a) => (a.id === id ? moved : a)),
    moved,
  );
  return {
    actor: moved,
    log: {
      id,
      side: self.side,
      from: self.hex,
      to: bestHex,
      steps: bestSteps,
      attacked: after && after.distance <= type.range ? after.foe.id : null,
      held: bestSteps === 0 ? "sin salida" : null,
    },
  };
}

/** Una ronda entera: cada ficha en el orden dado. */
export function playRound(
  arena: Arena,
  actors: readonly Actor[],
  order: Order,
  movement: Readonly<Record<DamageTypeId, number>>,
): { actors: Actor[]; logs: TurnLog[] } {
  let current = [...actors];
  const logs: TurnLog[] = [];
  for (const id of order) {
    if (!current.some((a) => a.id === id)) continue;
    const { actor, log } = takeTurn(arena, current, id, movement);
    current = current.map((a) => (a.id === id ? actor : a));
    logs.push(log);
  }
  return { actors: current, logs };
}
