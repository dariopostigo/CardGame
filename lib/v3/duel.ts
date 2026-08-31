// =========================================================================
// La persecución en 2D — V3
//
// docs/v3/board/battle.md §1.2 y §8. Es LA medida que el documento dejó
// pendiente el 28 de agosto de 2026, y hace falta antes de fijar la escala de
// 👢 Movimiento porque decide con qué argumento se reparte en las 132 fichas:
//
//   · lib/v3/tempo.ts `chase` mide el bucle EN LÍNEA RECTA. Con el borde puesto
//     dice que el arquero se estropea solo —le queda un hexágono de retroceso y
//     come el contacto en la ronda 6—, y ese resultado es el que corrigió al
//     §1.2, que estaba escrito sin borde.
//   · Pero en 1D solo se puede huir HACIA ATRÁS. En el tablero de verdad el que
//     huye tiene 12 filas para correr de lado, y correr en paralelo al borde
//     conserva la distancia sin gastar sitio a la espalda. Si eso funciona, el
//     borde deja de ser la respuesta y el reparto de 👢 vuelve a ser un
//     requisito de necesidad y no de carácter.
//
// Así que esto no es un segundo modelo: es el MISMO caso jugado sobre la arena,
// con `round.ts` `takeTurn`. Y por eso no se inventa ninguna conducta —la presa
// "espera" y el cazador "cruza" son las dos del §1.1— ni ninguna regla: no se
// atraviesa a nadie (§5) y el borde del tablero es el de arena.ts.
//
// EL DUELO ES 1 CONTRA 1 A PROPÓSITO. Es el caso límite que el §10 manda
// vigilar —"el 1 contra 1 de 🗡️ contra 🏹, donde no hay pantalla que ayude"—, y
// con quince fichas por bando el resultado se contamina: la presa se choca con
// las suyas y el cazador tiene ayuda. Lo que se busca aquí es el peor caso.
//
// LO QUE ESTO NO ES: no resuelve ataques, igual que `round.ts`. Un disparo solo
// se APUNTA —"la presa tuvo al cazador a tiro al terminar su turno"— porque
// ❤️ Vida y la tirada son game-design.md §4 y necesitan las 8 Habilidades. La
// pregunta de aquí no es cuánto duele, es CUÁNTOS pasan antes del contacto.
//
// EL TURNO DE LA PRESA VA PRIMERO, como en `chase` y por lo mismo: es el peor
// caso para quien caza —dispara y ya se ha ido cuando el otro mueve— y el peor
// caso es lo que hay que poder ver. La ⚡ Iniciativa real decidirá el orden.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord } from "./hex";
import { frontColumn, type Arena } from "./arena";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "./damage";
import { reachable } from "./movement";
import { takeTurn, type Actor } from "./round";
import type { MovementByType } from "./tempo";

/** Los dos papeles del duelo, nombrados por lo que hacen y no por su tipo. */
export const CHASER = "cazador";
export const RUNNER = "presa";

export type DuelRole = typeof CHASER | typeof RUNNER;

export type DuelTurn = {
  readonly round: number;
  readonly role: DuelRole;
  readonly from: HexCoord;
  readonly to: HexCoord;
  /** Hexágonos andados. 0 es que no se movió, por gusto o por no poder. */
  readonly steps: number;
  /** Distancia entre los dos al terminar el turno. */
  readonly distance: number;
  /** Si al terminar tenía al otro a tiro de su alcance. */
  readonly threatens: boolean;
};

export type DuelResult = {
  /** Si el cazador llega a tener a la presa a tiro de su alcance. */
  readonly contact: boolean;
  /** En qué ronda, si llega. */
  readonly round: number | null;
  /** Disparos que mete la presa antes de eso. Es el precio de la caza. */
  readonly shots: number;
  /** Distancia entre los dos al terminar la simulación. */
  readonly finalDistance: number;
  /** Filas distintas que pisó la presa: si son varias, huyó DE LADO. */
  readonly rowsUsed: number;
  /** Columnas que retrocedió la presa, del principio al final. */
  readonly columnsBack: number;
  /** Si en algún turno la presa quiso moverse y no tenía a dónde. */
  readonly cornered: boolean;
  readonly turns: readonly DuelTurn[];
};

/**
 * Cómo huye la presa, y es la parte de esta medida que NO es geometría:
 *
 *   · `voraz` — el hexágono alcanzable que más la aleja, que es exactamente lo
 *     que hace `round.ts` con la conducta "espera" del §1.1. Es lo que juega el
 *     tablero hoy.
 *   · `con-sitio` — el que más la aleja y, a igualdad, el que la deja más lejos
 *     del borde. Un paso más listo, y hace falta probarlo: la presa voraz se
 *     mete en la esquina ella sola, así que sin esta comparación no se sabe si
 *     el borde caza al arquero o solo caza a un arquero tonto.
 *
 * La diferencia entre las dos es la que dice si el reparto de 👢 Movimiento es
 * necesidad o carácter (§1.2), así que se mide, no se supone.
 */
export type RunnerPolicy = "voraz" | "con-sitio";

export type DuelOptions = {
  /** Quién mueve primero en cada ronda. La presa, salvo que se diga. */
  readonly first?: DuelRole;
  readonly maxRounds?: number;
  readonly policy?: RunnerPolicy;
};

/** Hexágonos hasta el borde más cercano de la arena. 0 es estar pegada a él. */
function edgeRoom(arena: Arena, hex: HexCoord): number {
  const { col, row } = Hex.axialToOffset(hex);
  return Math.min(col, arena.spec.cols - 1 - col, row, arena.spec.rows - 1 - row);
}

/**
 * El turno de la presa, que es el único que este archivo juega por su cuenta: el
 * del cazador se lo deja a `round.ts` `takeTurn` porque "cruzar" no admite
 * matices, y huir sí.
 *
 * Respeta las dos reglas que ya están escritas: **su sitio es quieto mientras no
 * la alcancen** (§1.1, así que no se mueve si el cazador está fuera de su
 * alcance) y **no se atraviesa a nadie** (§5, que es lo que `reachable` cuenta).
 */
function runnerMove(
  arena: Arena,
  runner: Actor,
  chaser: Actor,
  boots: number,
  policy: RunnerPolicy,
): { hex: HexCoord; steps: number; stuck: boolean } {
  const range = DAMAGE_TYPES[runner.damage].range;
  const distance = Hex.distance(runner.hex, chaser.hex);
  if (distance > range) return { hex: runner.hex, steps: 0, stuck: false };

  const occupied = new Set([Hex.key(chaser.hex)]);
  const options = reachable(arena, runner.hex, boots, occupied);
  if (options.size === 0) return { hex: runner.hex, steps: 0, stuck: true };

  let best = { hex: runner.hex, steps: 0 };
  let bestDistance = distance;
  let bestRoom = edgeRoom(arena, runner.hex);

  for (const [k, steps] of options) {
    const hex = Hex.fromKey(k);
    const d = Hex.distance(hex, chaser.hex);
    const room = edgeRoom(arena, hex);
    const better =
      d > bestDistance ||
      (d === bestDistance &&
        (policy === "con-sitio" ? room > bestRoom : steps < best.steps));
    if (better) {
      best = { hex, steps };
      bestDistance = d;
      bestRoom = room;
    }
  }

  return { ...best, stuck: best.steps === 0 };
}

/**
 * Dos fichas en la misma fila, separadas por `distance` hexágonos y centradas en
 * el campo. Es el montaje del ejemplo del §1.2 —donde el bucle empieza, con la
 * presa ya a tiro— puesto sobre la arena.
 *
 * @param {number} distance - Separación inicial, en hexágonos.
 * @param {number} row - Fila en la que se colocan. La de en medio por defecto.
 */
export function facingAtDistance(
  arena: Arena,
  distance: number,
  row = Math.floor(arena.spec.rows / 2),
): { chaser: HexCoord; runner: HexCoord } {
  const gap = Math.max(1, Math.min(distance, arena.spec.cols - 1));
  const left = Math.floor((arena.spec.cols - 1 - gap) / 2);
  return {
    chaser: Hex.offsetToAxial({ col: left, row }),
    runner: Hex.offsetToAxial({ col: left + gap, row }),
  };
}

/**
 * Las dos fichas en la columna del frente de su banda, cara a cara. Es el
 * arranque real de una batalla: la separación es `arena.frontDistance`, once
 * hexágonos en el tablero mínimo.
 */
export function frontToFront(
  arena: Arena,
  row = Math.floor(arena.spec.rows / 2),
): { chaser: HexCoord; runner: HexCoord } {
  return {
    chaser: Hex.offsetToAxial({ col: frontColumn(arena.spec, "propio"), row }),
    runner: Hex.offsetToAxial({ col: frontColumn(arena.spec, "enemigo"), row }),
  };
}

/**
 * El duelo, jugado sobre la arena hasta el contacto o hasta `maxRounds`.
 *
 * @param {DamageTypeId} chaserDamage - Tipo de daño del que persigue. Su alcance
 *   es lo que define "contacto": 1 para el 🗡️, 2 para el ✨.
 * @param {MovementByType} movement - 👢 Movimiento por tipo de daño. Con los tres
 *   valores iguales se ve el caso que el §1.2 llamaba imposible.
 * @param {number} maxRounds - Tope de simulación. 40 por defecto, que es el
 *   reloj que v2 tenía y V3 todavía no ha recuperado (§8): más allá de ahí, que
 *   no llegue ya no es un detalle de la cuenta sino el resultado.
 */
export function duel(
  arena: Arena,
  start: { chaser: HexCoord; runner: HexCoord },
  chaserDamage: DamageTypeId,
  movement: MovementByType,
  { first = RUNNER, maxRounds = 40, policy = "voraz" }: DuelOptions = {},
): DuelResult {
  const chaserRange = DAMAGE_TYPES[chaserDamage].range;
  const runnerRange = DAMAGE_TYPES["a-distancia"].range;

  // El bando es lo que `round.ts` usa para saber quién es enemigo de quién, así
  // que basta con darles lados distintos: aquí no hay mesa ni máquina.
  let actors: Actor[] = [
    { id: CHASER, side: "propio", damage: chaserDamage, hex: start.chaser },
    { id: RUNNER, side: "enemigo", damage: "a-distancia", hex: start.runner },
  ];

  const order: DuelRole[] = first === RUNNER ? [RUNNER, CHASER] : [CHASER, RUNNER];
  const turns: DuelTurn[] = [];
  const rows = new Set<number>([Hex.axialToOffset(start.runner).row]);
  const startColumn = Hex.axialToOffset(start.runner).col;

  let shots = 0;
  let cornered = false;
  let contactRound: number | null = null;

  for (let round = 1; round <= maxRounds && contactRound === null; round++) {
    for (const role of order) {
      const self = actors.find((a) => a.id === role)!;
      const other = actors.find((a) => a.id !== role)!;
      const from = self.hex;

      let to = from;
      let steps = 0;
      if (role === CHASER) {
        const { actor, log } = takeTurn(arena, actors, role, movement);
        to = actor.hex;
        steps = log.steps;
      } else {
        const move = runnerMove(arena, self, other, movement[self.damage], policy);
        to = move.hex;
        steps = move.steps;
        // Acorralada es querer retroceder y no tener a dónde: el borde manda
        // sobre la Habilidad. Es lo que en 1D se llamaba `cornered`.
        if (move.stuck) cornered = true;
      }

      actors = actors.map((a) => (a.id === role ? { ...a, hex: to } : a));

      const distance = Hex.distance(to, other.hex);
      const range = role === CHASER ? chaserRange : runnerRange;

      turns.push({ round, role, from, to, steps, distance, threatens: distance <= range });

      if (role === RUNNER) {
        rows.add(Hex.axialToOffset(to).row);
        if (distance <= runnerRange) shots++;
      } else if (distance <= chaserRange) {
        contactRound = round;
        break;
      }
    }
  }

  const runner = actors.find((a) => a.id === RUNNER)!;
  const chaser = actors.find((a) => a.id === CHASER)!;

  return {
    contact: contactRound !== null,
    round: contactRound,
    shots,
    finalDistance: Hex.distance(chaser.hex, runner.hex),
    rowsUsed: rows.size,
    columnsBack: Hex.axialToOffset(runner.hex).col - startColumn,
    cornered,
    turns,
  };
}

/**
 * Los dos que persiguen —🗡️ y ✨— detrás de la misma presa 🏹, sobre la arena.
 * Es el espejo 2D de `tempo.ts` `chaseAgainstArcher`, para poder poner las dos
 * medidas una al lado de la otra: el 🏹 contra sí mismo se deja fuera, porque
 * dos tiradores no se persiguen, se disparan.
 */
export function duelsAgainstArcher(
  arena: Arena,
  start: { chaser: HexCoord; runner: HexCoord },
  movement: MovementByType,
  options?: DuelOptions,
): { readonly id: DamageTypeId; readonly result: DuelResult }[] {
  return DAMAGE_TYPE_IDS.filter((id) => id !== "a-distancia").map((id) => ({
    id,
    result: duel(arena, start, id, movement, options),
  }));
}

/**
 * 👢 Movimiento igual para los tres tipos, que es el caso contra el que se
 * compara: el reparto por tipo de daño existe para romper el bucle, así que hay
 * que poder ver qué pasa sin él.
 */
export function flatMovement(boots: number): MovementByType {
  return { "cuerpo-a-cuerpo": boots, magico: boots, "a-distancia": boots };
}
