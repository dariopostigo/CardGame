// =========================================================================
// El ritmo de la aproximación — V3
//
// Dos preguntas, y las dos son las que el diseño dejó apoyadas en la geometría
// de la arena:
//
//   1. EN QUÉ RONDA PEGA POR PRIMERA VEZ una ficha, dado lo que hay delante, su
//      alcance y su 👢 Movimiento.
//   2. SI EL QUE CORRE ALCANZA AL QUE DISPARA, y cuántos disparos come mientras
//      lo hace. Es el §1.2 de battle.md, y es la que decide si un tablero
//      grande se puede jugar.
//
// Vive aparte de arena.ts porque no es el escenario —necesita 👢 Movimiento, que
// es de la ficha— y aparte de damage.ts porque no es el tipo de daño: es lo que
// sale de cruzar los dos sobre un tablero concreto.
//
// LO QUE CAMBIÓ EL 27 DE AGOSTO DE 2026, y por qué este archivo se rehizo:
//
//   · La tabla del §1.1 ya no es el objetivo. Decía que el 🏹 abría en la ronda
//     1 y los otros dos entraban en la 2, y eso solo pasaba sobre 7×5 con
//     frentes a 4. Con el tablero grande **la aproximación larga es la
//     intención** —tres a cinco rondas de maniobra— así que aquí ya no se
//     comprueba si sale una tabla vieja: se mide qué sale.
//   · 👢 Movimiento dejó de ser un número para todos y pasó a depender del TIPO
//     DE DAÑO (damage.ts `movementBand`): 🗡️ el más alto, 🏹 el más bajo. Por eso
//     todo lo de aquí toma un valor por tipo y no uno solo.
//
// EL BORDE CUENTA, y es la corrección del 28 de agosto de 2026. `chase` le daba
// al que huye campo infinito, así que contestaba "no lo alcanza nunca" en cuanto
// los dos 👢 Movimiento empataban. Pero el §1 clava las bandas al borde, y eso
// deja a quien espera con el borde a la espalda: lo que tiene para retroceder es
// la profundidad de su banda menos uno —UN hexágono con bandas de 2, y da igual
// el tamaño del tablero (arena.ts `retreatRoom`)—. Medido con el borde puesto,
// sobre 14×12 y con los dos 👢 a 2, el 🗡️ contacta en la ronda 6 comiendo 2
// disparos, donde el modelo sin borde decía que no llegaba jamás.
//
// Y ESE RESULTADO ERA OPTIMISTA, lo que se vio el 31 de agosto de 2026 midiendo
// el mismo duelo en 2D (lib/v3/duel.ts): en línea recta la presa solo puede huir
// hacia atrás, y en el tablero de verdad da la vuelta al campo conservando la
// distancia. Con los dos 👢 a 2 el 🗡️ tarda **16 rondas y come 11 disparos** en
// el tablero mínimo. Así que el borde caza al arquero tonto y no al arquero, y
// la banda de 👢 Movimiento vuelve a ser **necesidad** y no carácter. De ahí
// salió `MOVEMENT_BAND`.
//
// SIGUE SIENDO 1D: mide el retroceso hacia atrás y nada más. En 2D el que huye
// tiene las filas del tablero para escapar de lado, y además un 🏹 que avanza en
// la ronda 1 se compra sitio para retroceder al precio de acortar la distancia.
// Las dos cosas piden una persecución sobre la arena de verdad, que es trabajo
// aparte. Pasando `Infinity` como `retreatRoom` se recupera el modelo del papel.
//
// El modelo del §5 sigue siendo literal: en su turno una ficha "mueve hasta
// 👢 Movimiento hexágonos y hace su ataque, en cualquier orden". Así que para
// pegar solo tiene que terminar el movimiento a distancia ≤ alcance:
//
//     avance = max(0, distancia − alcance)
//     ronda  = avance === 0 ? 1 : ceil(avance / 👢 Movimiento)
//
// Avanza SOLO ella: el rival aguanta. Es el caso lento, y es el que hace falta
// para leer el tablero — si los dos caminaran, el acercamiento iría al doble y
// ninguna cuenta sería la del peor caso. Para el 🏹 esa lectura se da la vuelta y
// sigue valiendo la misma función: el arquero no avanza, así que su primer
// disparo llega cuando el rival cruza, y basta con darle el 👢 Movimiento del que
// se acerca.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "./damage";

/** 👢 Movimiento repartido por tipo de daño (battle.md §1.1). */
export type MovementByType = Readonly<Record<DamageTypeId, number>>;

/**
 * **La banda de 👢 Movimiento, decidida por Dario el 31 de agosto de 2026**
 * (battle.md §1.1 y razas.md, la escala). Dejó de ser un dial de laboratorio: es
 * el primer valor numérico de las 8 Habilidades que entra en la escala, y entró
 * porque el duelo 2D (duel.ts) midió qué pasa sin él.
 *
 * Se eligió el reparto **más lento que sigue siendo seguro**: respeta la
 * intención del §1.1 —de tres a cinco rondas de maniobra antes del choque— y el
 * 🏹 cobra **un disparo** mientras el 🗡️ cruza, en los cuatro tamaños de arena.
 * Subirlo a 4·3·1 quitaba ese disparo y bajaba la aproximación a tres rondas;
 * igualarlo devuelve el bucle del §1.2 (con los dos a 2 son 11 disparos).
 *
 * Las fichas todavía no tienen valores propios, así que hoy esto es su 👢: lo que
 * la escala fija es la banda por tipo de daño, no un número por ficha.
 */
export const MOVEMENT_BAND: MovementByType = {
  "cuerpo-a-cuerpo": 3,
  magico: 2,
  "a-distancia": 1,
};

/** Cuántos hexágonos hay que recorrer para tener el objetivo a tiro. */
export function advanceNeeded(distance: number, range: number): number {
  return Math.max(0, distance - range);
}

/**
 * La ronda en la que esa ficha ataca por primera vez, o null si no llega nunca
 * (👢 Movimiento 0: sin alcance suficiente, se queda mirando).
 *
 * @param {number} distance - Hexágonos hasta el objetivo al empezar.
 * @param {number} range - Alcance fijo de su tipo de daño.
 * @param {number} movement - Hexágonos por turno de quien cierra la distancia.
 */
export function firstAttackRound(
  distance: number,
  range: number,
  movement: number,
): number | null {
  const advance = advanceNeeded(distance, range);
  if (advance === 0) return 1;
  if (movement < 1) return null;
  return Math.ceil(advance / movement);
}

export type TempoRow = {
  readonly id: DamageTypeId;
  readonly range: number;
  readonly movement: number;
  readonly distance: number;
  readonly advance: number;
  readonly round: number | null;
};

/**
 * El ritmo de los tres tipos de daño desde una misma distancia, cada uno con su
 * 👢 Movimiento. Es la tabla del §1.1, medida en vez de recordada.
 */
export function openingTempo(distance: number, movement: MovementByType): TempoRow[] {
  return DAMAGE_TYPE_IDS.map((id) => {
    const range = DAMAGE_TYPES[id].range;
    return {
      id,
      range,
      movement: movement[id],
      distance,
      advance: advanceNeeded(distance, range),
      round: firstAttackRound(distance, range, movement[id]),
    };
  });
}

/**
 * Qué forma tiene el ritmo que sale:
 *
 *   · escalonado  — el 🏹 pega antes que los otros dos, así que el alcance
 *     compra rondas. Es lo que el §4.3 le pide, y lo que la tabla del §1.1
 *     describía cuando el tablero era pequeño.
 *   · simultaneo  — los tres entran a la vez, o el 🏹 no es el primero. Aquí el
 *     alcance deja de comprar ritmo. Con 👢 Movimiento repartido por tipo de
 *     daño esto es lo NORMAL en un tablero grande, y no es un fallo: el 🏹 bajó
 *     de pies a cambio de que nadie pueda quedarse fuera de su alcance, y su
 *     trabajo pasó a ser esperar (§1.1).
 *   · nunca       — alguno no llega (👢 Movimiento 0).
 *
 * Es un veredicto CALCULADO y por eso vive aquí: la pantalla no tiene que saber
 * qué forma se buscaba.
 */
export type TempoVerdict = "escalonado" | "simultaneo" | "nunca";

export function tempoVerdict(rows: readonly TempoRow[]): TempoVerdict {
  if (rows.some((r) => r.round === null)) return "nunca";
  const ranged = rows.find((r) => r.id === "a-distancia")!.round!;
  const others = rows.filter((r) => r.id !== "a-distancia").map((r) => r.round!);
  return others.every((r) => r > ranged) ? "escalonado" : "simultaneo";
}

// --- La persecución (battle.md §1.2) --------------------------------------
// El bucle del arquero que dispara y retrocede. Es la comprobación que decide
// si el tablero grande se sostiene, y no se puede hacer con firstAttackRound
// porque ahí el objetivo aguanta quieto — aquí huye.

export type Pursuer = {
  /** Hexágonos por turno. */
  readonly movement: number;
  /** A qué distancia puede atacar. */
  readonly range: number;
};

export type ChaseResult = {
  /** Si el perseguidor llega a tenerlo a tiro. */
  readonly contact: boolean;
  /** En qué ronda, si llega. */
  readonly round: number | null;
  /** Disparos que mete el que huye antes de eso. Es el precio de la caza. */
  readonly shots: number;
  /**
   * Hexágonos que gana el perseguidor por ronda **mientras al otro le quede
   * sitio**. Negativo o 0 ya no significa "no llega": significa que no llegaría
   * en campo abierto. En cuanto el que huye se queda sin borde detrás, el ritmo
   * de cierre pasa a ser el 👢 Movimiento entero del perseguidor.
   */
  readonly closingPerRound: number;
  /** Si el que huye se ha quedado sin sitio para retroceder. */
  readonly cornered: boolean;
};

/**
 * Persigue a un tirador que huye. El que huye juega el kiting puro: si tiene al
 * perseguidor a tiro dispara, y retrocede lo que le da 👢 Movimiento **hasta que
 * se le acaba el sitio**.
 *
 * Se le da el turno ANTES que al perseguidor a propósito: es el peor caso para
 * quien caza —dispara y ya se ha ido cuando el otro mueve— y el peor caso es lo
 * que hay que poder ver. La ⚡ Iniciativa real decidirá el orden ficha a ficha.
 *
 * @param {number} distance - Separación al empezar, en hexágonos.
 * @param {Pursuer} chaser - El que cierra la distancia (el 🗡️, normalmente).
 * @param {Pursuer} runner - El que dispara y retrocede (el 🏹).
 * @param {number} retreatRoom - Hexágonos que tiene detrás antes del borde
 *   (arena.ts `retreatRoom`). `Infinity` da el campo abierto del papel, que es
 *   el que concluye que al arquero no se le alcanza.
 * @param {number} maxRounds - Tope de simulación: más allá, no llega y punto.
 */
export function chase(
  distance: number,
  chaser: Pursuer,
  runner: Pursuer,
  retreatRoom: number,
  maxRounds = 30,
): ChaseResult {
  const closingPerRound = chaser.movement - runner.movement;
  let d = distance;
  let room = Math.max(0, retreatRoom);
  let cornered = room === 0;
  let shots = 0;

  for (let round = 1; round <= maxRounds; round++) {
    if (d <= runner.range) shots++;
    // Retrocede lo que le dan los pies y lo que le deja el tablero, en ese
    // orden: el borde manda sobre la Habilidad.
    const back = Math.min(runner.movement, room);
    room -= back;
    if (room <= 0) cornered = true;
    d += back;
    d -= chaser.movement;
    if (d <= chaser.range) {
      return { contact: true, round, shots, closingPerRound, cornered };
    }
  }

  return { contact: false, round: null, shots, closingPerRound, cornered };
}

/**
 * La persecución de los tres tipos de daño detrás de un 🏹 que huye: quién lo
 * caza y a cuántos disparos por cabeza. El 🏹 contra sí mismo se deja fuera —dos
 * tiradores no se persiguen, se disparan— así que solo salen 🗡️ y ✨.
 */
export function chaseAgainstArcher(
  distance: number,
  movement: MovementByType,
  retreatRoom: number,
  maxRounds = 30,
): { readonly id: DamageTypeId; readonly result: ChaseResult }[] {
  const runner: Pursuer = {
    movement: movement["a-distancia"],
    range: DAMAGE_TYPES["a-distancia"].range,
  };
  return DAMAGE_TYPE_IDS.filter((id) => id !== "a-distancia").map((id) => ({
    id,
    result: chase(
      distance,
      { movement: movement[id], range: DAMAGE_TYPES[id].range },
      runner,
      retreatRoom,
      maxRounds,
    ),
  }));
}
