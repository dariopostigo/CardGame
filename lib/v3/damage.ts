// =========================================================================
// Tipos de daño — V3
//
// Catálogo cerrado de tres, y lo único que aportan aquí es su ALCANCE en
// hexágonos: docs/v3/game-design.md §4.3. Toda ficha lleva uno y solo uno,
// obligatorio y sin defecto.
//
// Vive en su propio archivo y no dentro de la arena a propósito: el alcance es
// propiedad del TIPO DE DAÑO, no del tablero. La arena solo mide distancias
// (lib/v3/hex.ts `distance`); quien decide si un ataque llega es esto. Cuando
// exista la ficha de personaje, será ella la que importe este módulo.
//
// Los tres números dejaron de ser provisionales el 24 de agosto de 2026, y por
// una razón que toca directamente a este código: estaban calculados sobre la
// geometría 7×5 con frentes a 4, y ese tablero se confirmó
// (docs/v3/board/battle.md §1.1). Si algún día se mueve el ancho de la arena
// —sigue siendo el dial abierto del §10—, estos tres valores son lo primero
// que hay que volver a mirar.
//
// El alcance es un MÁXIMO, no un mínimo: se puede disparar o lanzar magia
// contra un enemigo pegado, sin penalización. En v2 sí penalizaba, con
// "Desventaja", y ese mecanismo no se recupera.
// =========================================================================

export type DamageTypeId = "cuerpo-a-cuerpo" | "a-distancia" | "magico";

export type DamageType = {
  readonly id: DamageTypeId;
  /** Como se escribe en la wiki y en la carta. */
  readonly label: string;
  readonly icon: string;
  /** Alcance máximo en hexágonos. */
  readonly range: number;
  /** Qué Habilidad lo reduce (game-design.md §4.3). */
  readonly mitigatedBy: "defensa" | "resistencia-magica";
  /** Qué hace en la ronda 1 sobre la arena confirmada (battle.md §1.1). */
  readonly openingRound: string;
};

export const DAMAGE_TYPES: Record<DamageTypeId, DamageType> = {
  "cuerpo-a-cuerpo": {
    id: "cuerpo-a-cuerpo",
    label: "Cuerpo a cuerpo",
    icon: "🗡️",
    range: 1,
    mitigatedBy: "defensa",
    openingRound: "Avanza; contacta y golpea en la ronda 2",
  },
  "a-distancia": {
    id: "a-distancia",
    label: "A distancia",
    icon: "🏹",
    range: 4,
    mitigatedBy: "defensa",
    openingRound: "Dispara sin moverse: el frente está justo a tiro",
  },
  magico: {
    id: "magico",
    label: "Mágico",
    icon: "✨",
    range: 2,
    mitigatedBy: "resistencia-magica",
    openingRound: "Tiene que avanzar; tira en la ronda 2",
  },
};

/** En el orden en el que se enseñan: por alcance, del corto al largo. */
export const DAMAGE_TYPE_IDS: readonly DamageTypeId[] = [
  "cuerpo-a-cuerpo",
  "magico",
  "a-distancia",
];
