// =========================================================================
// Catálogo de mercenarios (docs/cards/mercenaries.md)
//
// Mismo patrón que enemy-roster.ts y hero-roster.ts: datos por id, ya
// derivados, sin lógica. Pero con una diferencia de fondo respecto a los
// otros dos rosters, y es la que explica casi todo lo raro de este archivo:
//
//   **el bloque de combate sale de la RAREZA, no de la carta** (§1b). La
//   tabla de §1b es la autoridad; el catálogo de §3 solo aporta nombre,
//   familia y alcance. Por eso aquí hay DOS estructuras y no una: un
//   `MERCENARY_BLOCK` por Rareza y un `MERCENARY_CATALOG` que apunta a él.
//
// Consecuencias que hay que tener presentes al usarlo:
//
// - **No tiene características.** Un mercenario no lleva FUE/DES/CON: su
//   ataque es un bono plano por Rareza y su iniciativa es `1d20 + Nivel de su
//   carta` justamente porque "no tiene DES propia" (board/battle.md §6). De
//   ahí `Weapon.flat` en combat.ts: sin eso, resolveAttack derivaría el mod
//   de unas características que este bloque no tiene.
// - **El bono de ataque y el mod de daño NO coinciden** a partir de Poco
//   común (+3 al ataque pero 1d8+2 de daño), así que son dos campos, no uno.
// - **Falta la familia Soporte** (Aprendiz de sanador, Curandera errante,
//   Chamán, Guardia de honor, Círculo de sanadores). No es un olvido: su
//   Acción no es atacar, es curar a un aliado a elección del tablero (§1b),
//   y no hay motor de curación todavía. Meterlas con un ataque inventado
//   sería peor que no tenerlas. Melee y Distancia, en cambio, son el mismo
//   ataque con distinto alcance y entran tal cual.
// - **La discrepancia de §3 se resuelve a favor de §1b**, como manda el
//   propio documento ("no un bloque escrito carta por carta"): el catálogo de
//   §3 da menos dado a las filas de distancia que la tabla de §1b, y ese
//   desajuste está marcado allí como pendiente del pase de balance. Aquí se
//   usa §1b para todo el bloque y de §3 solo el alcance y el tipo de daño.
// =========================================================================

import type { DamageType } from "@/lib/card-table";
import type { RarityLevel } from "@/lib/rarity";
import type { AttackDice } from "./combat";
import type { AbilityScores } from "./state";

/**
 * Características neutras (todas a 10 → modificador 0) para las tiradas que el
 * motor pide por característica y el bloque de §1b no cubre: la salvación de
 * fin de turno de un estado (`effects.md` §1) y la tirada enfrentada de
 * Desengancharse (`board/battle.md` §6).
 *
 * No es una decisión de diseño escondida: es la ausencia de una. El documento
 * da al mercenario PV, CA, Movimiento, Iniciativa, Ataque y Figuras, y nada
 * más — ni siquiera le da DES, que es justo por lo que su iniciativa no se
 * tira con el mod de Destreza. Modificador 0 es lo que menos inventa hasta que
 * §1b diga otra cosa.
 */
export const MERCENARY_SAVES: AbilityScores = {
  fuerza: 10,
  destreza: 10,
  constitucion: 10,
  inteligencia: 10,
  sabiduria: 10,
  carisma: 10,
};

/**
 * Fila de la tabla de §1b. `figures` es cuántos ataques hace por turno (no
 * cuántas vidas tiene): las cartas Épicas y Legendarias de §3 ya decían "2
 * ataques a +4" / "3 ataques a +5", y §1b lo formaliza como columna.
 */
export type MercenaryBlock = {
  readonly pvMax: number;
  readonly ca: number;
  readonly speed: number;
  /** Bono de iniciativa = Nivel de la carta (board/battle.md §6). */
  readonly initiativeBonus: number;
  readonly attackBonus: number;
  readonly damageDice: AttackDice;
  readonly damageBonus: number;
  readonly figures: number;
};

/** La tabla de `docs/cards/mercenaries.md` §1b, tal cual. */
export const MERCENARY_BLOCK: Readonly<Record<RarityLevel, MercenaryBlock>> = {
  comun: {
    pvMax: 10,
    ca: 12,
    speed: 2,
    initiativeBonus: 1,
    attackBonus: 2,
    damageDice: { count: 1, sides: 6 },
    damageBonus: 2,
    figures: 1,
  },
  "poco-comun": {
    pvMax: 14,
    ca: 13,
    speed: 2,
    initiativeBonus: 1,
    attackBonus: 3,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 2,
    figures: 1,
  },
  raro: {
    pvMax: 18,
    ca: 13,
    speed: 2,
    initiativeBonus: 2,
    attackBonus: 4,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 2,
    figures: 1,
  },
  epico: {
    pvMax: 24,
    ca: 14,
    speed: 2,
    initiativeBonus: 2,
    attackBonus: 4,
    damageDice: { count: 1, sides: 8 },
    damageBonus: 3,
    figures: 2,
  },
  legendario: {
    pvMax: 30,
    ca: 15,
    speed: 2,
    initiativeBonus: 3,
    attackBonus: 5,
    damageDice: { count: 1, sides: 10 },
    damageBonus: 3,
    figures: 3,
  },
};

/** Las tres familias por alcance de §3b. "soporte" existe en el tipo porque
 *  es una de las tres del documento, pero no hay ninguna carta suya aquí
 *  todavía (ver la cabecera). */
export type MercenaryFamily = "melee" | "distancia" | "soporte";

export type MercenaryCardId =
  | "llanuras"
  | "arquero-a-sueldo"
  | "bruto-de-taberna"
  | "ballestero"
  | "espadachin-veterano"
  | "francotirador"
  | "grifa-negra"
  | "arqueros-del-alba"
  | "legion-del-ocaso"
  | "horda-de-flechas";

export type MercenaryCardDef = {
  readonly label: string;
  readonly rarity: RarityLevel;
  readonly family: MercenaryFamily;
  /** Alcance en hexágonos medido DESDE SU FICHA (§1b), no desde el héroe. */
  readonly range: number;
  readonly damageType: DamageType;
};

/**
 * Melee y Distancia de §3 (§3b da la rejilla completa familia × rareza). El
 * alcance y el tipo de daño salen de la fila de §3; todo lo demás sale del
 * bloque de su Rareza.
 */
export const MERCENARY_CATALOG: Readonly<Record<MercenaryCardId, MercenaryCardDef>> = {
  llanuras: {
    label: "Mercenarios de las Llanuras",
    rarity: "comun",
    family: "melee",
    range: 1,
    damageType: "cortante",
  },
  "arquero-a-sueldo": {
    label: "Arquero a sueldo",
    rarity: "comun",
    family: "distancia",
    range: 4,
    damageType: "perforante",
  },
  "bruto-de-taberna": {
    label: "Bruto de taberna",
    rarity: "poco-comun",
    family: "melee",
    range: 1,
    damageType: "contundente",
  },
  ballestero: {
    label: "Ballestero mercenario",
    rarity: "poco-comun",
    family: "distancia",
    range: 4,
    damageType: "perforante",
  },
  "espadachin-veterano": {
    label: "Espadachín veterano",
    rarity: "raro",
    family: "melee",
    range: 1,
    damageType: "cortante",
  },
  francotirador: {
    label: "Francotirador de las brumas",
    rarity: "raro",
    family: "distancia",
    range: 5,
    damageType: "perforante",
  },
  "grifa-negra": {
    label: "Compañía de la Grifa Negra",
    rarity: "epico",
    family: "melee",
    range: 1,
    damageType: "cortante",
  },
  "arqueros-del-alba": {
    label: "Compañía de arqueros del alba",
    rarity: "epico",
    family: "distancia",
    range: 5,
    damageType: "perforante",
  },
  "legion-del-ocaso": {
    label: "La Legión del Ocaso",
    rarity: "legendario",
    family: "melee",
    range: 1,
    damageType: "cortante",
  },
  "horda-de-flechas": {
    label: "La Horda de flechas incesantes",
    rarity: "legendario",
    family: "distancia",
    range: 6,
    damageType: "perforante",
  },
};

/** Orden de presentación: por rareza y, dentro de ella, melee antes que distancia. */
export const MERCENARY_CARD_IDS: readonly MercenaryCardId[] = [
  "llanuras",
  "arquero-a-sueldo",
  "bruto-de-taberna",
  "ballestero",
  "espadachin-veterano",
  "francotirador",
  "grifa-negra",
  "arqueros-del-alba",
  "legion-del-ocaso",
  "horda-de-flechas",
];

/** El bloque de combate de una carta concreta: su Rareza decide (§1b). */
export function blockFor(cardId: MercenaryCardId): MercenaryBlock {
  return MERCENARY_BLOCK[MERCENARY_CATALOG[cardId].rarity];
}

/** Texto del ataque tal como lo escribe §1b: "+3, 1d8+2". */
export function describeAttack(block: MercenaryBlock): string {
  return `+${block.attackBonus}, ${block.damageDice.count}d${block.damageDice.sides}+${block.damageBonus}`;
}
