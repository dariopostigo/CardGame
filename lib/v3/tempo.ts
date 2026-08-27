// =========================================================================
// El ritmo de la ronda — V3
//
// Una sola pregunta, y es la que el diseño dejó apoyada en la geometría de la
// arena: EN QUÉ RONDA PEGA POR PRIMERA VEZ una ficha, dado lo que hay delante,
// su alcance y su 👢 Movimiento.
//
// Vive aparte de arena.ts porque no es el escenario —necesita 👢 Movimiento,
// que es de la ficha— y aparte de damage.ts porque no es el tipo de daño: es
// lo que sale de cruzar los dos sobre un tablero concreto.
//
// El modelo es el §5 literal: en su turno una ficha "mueve hasta 👢 Movimiento
// hexágonos y hace su ataque, en cualquier orden". Así que para pegar solo
// tiene que terminar el movimiento a distancia ≤ alcance:
//
//     avance = max(0, distancia − alcance)
//     ronda  = avance === 0 ? 1 : ceil(avance / 👢 Movimiento)
//
// Avanza SOLO ella: el rival aguanta. Es el caso lento, y es el que usa el
// §1.1 al escribir "tiene que avanzar; tira en la ronda 2" —si los dos
// caminaran, el acercamiento iría al doble y ninguna de esas frases sería
// cierta—.
//
// LO QUE ESTO DESTAPA, y es el motivo de que el archivo exista: la tabla del
// §1.1 no cuadra con ningún 👢 Movimiento si se mide todo desde el frente…
// hasta que se cuenta que el despliegue es libre dentro de la banda (§3). Con
// 👢 Movimiento 2 y las fichas puestas donde uno las pondría —🗡️ y 🏹 en la
// columna del frente, el ✨ detrás— la tabla sale exacta sobre 7×5:
//
//   🏹 alcance 4, a 4 → avance 0 → ronda 1    "dispara sin moverse"
//   🗡️ alcance 1, a 4 → avance 3 → ronda 2    "contacta y golpea en la ronda 2"
//   ✨ alcance 2, a 5 → avance 3 → ronda 2    "tiene que avanzar; tira en la 2"
//
// Con 👢 Movimiento 1 el 🗡️ tardaría 3 rondas; con 3, el ✨ pegaría en la 1. Los
// dos rompen la tabla, así que el 7×5 llevaba dentro un 👢 Movimiento y era 2.
// No es un valor decidido —las 8 Habilidades siguen sin números— es el valor
// que hace verdadera la única tabla de ritmo que el diseño ha escrito, y por
// eso es por donde abre el mando de /dev.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "./damage";

/**
 * El 👢 Movimiento que el §1.1 llevaba dentro sin escribirlo (ver cabecera).
 * Es una reconstrucción, no una decisión: el día que las 8 Habilidades tengan
 * valores, este número se compara con el que salga y se tira.
 */
export const IMPLIED_MOVEMENT = 2;

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
 * @param {number} movement - 👢 Movimiento, en hexágonos por turno.
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
  readonly distance: number;
  readonly advance: number;
  readonly round: number | null;
};

/**
 * El ritmo de los tres tipos de daño desde una misma distancia. Es la tabla del
 * §1.1 recalculada: mismo formato, números medidos.
 */
export function openingTempo(distance: number, movement: number): TempoRow[] {
  return DAMAGE_TYPE_IDS.map((id) => {
    const range = DAMAGE_TYPES[id].range;
    return {
      id,
      range,
      distance,
      advance: advanceNeeded(distance, range),
      round: firstAttackRound(distance, range, movement),
    };
  });
}

/**
 * Qué le pasa al ritmo del §1.1 sobre una distancia dada:
 *
 *   · identico   — sale la tabla tal cual: 🏹 en la 1, ✨ y 🗡️ en la 2.
 *   · escalonado — el 🏹 abre SOLO y los otros entran después. La tabla llega
 *     más tarde pero conserva su forma, que es lo que el §4.3 compra con el
 *     alcance: el arquero tiene rondas que los demás no tienen.
 *   · aplanado   — los tres pegan a la vez, o el 🏹 no es el primero. Aquí el
 *     alcance deja de comprar ritmo, y es lo que pasa en cuanto 👢 Movimiento
 *     sube lo bastante para tragarse la diferencia entre 1, 2 y 4.
 *   · nunca      — alguno no llega (👢 Movimiento 0).
 *
 * Es un veredicto CALCULADO y por eso vive aquí: la pantalla no tiene que saber
 * qué forma tenía la tabla original.
 */
export type TempoVerdict = "identico" | "escalonado" | "aplanado" | "nunca";

export function tempoVerdict(rows: readonly TempoRow[]): TempoVerdict {
  if (rows.some((r) => r.round === null)) return "nunca";
  const round = (id: DamageTypeId) => rows.find((r) => r.id === id)!.round!;
  const ranged = round("a-distancia");
  const others = rows.filter((r) => r.id !== "a-distancia").map((r) => r.round!);
  if (ranged === 1 && others.every((r) => r === 2)) return "identico";
  return others.every((r) => r > ranged) ? "escalonado" : "aplanado";
}

/**
 * Con qué valores de 👢 Movimiento el ritmo conserva la forma del §1.1 sobre una
 * distancia dada: los que dan "identico" o "escalonado".
 *
 * NO es un intervalo, y por eso devuelve la lista y no un mínimo y un máximo:
 * los redondeos hacia arriba de los tres alcances no van al mismo paso, así que
 * la lista sale con agujeros —sobre 11 hexágonos, por ejemplo, 3 aplana y 4
 * vuelve a escalonar—. Enseñarla como un intervalo sería mentir sobre el número
 * de en medio.
 */
export function shapeWindow(distance: number, maxMovement = 12): number[] {
  const out: number[] = [];
  for (let m = 1; m <= maxMovement; m++) {
    const verdict = tempoVerdict(openingTempo(distance, m));
    if (verdict === "identico" || verdict === "escalonado") out.push(m);
  }
  return out;
}
