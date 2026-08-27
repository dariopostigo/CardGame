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
// LOS TRES NÚMEROS NO SE MUEVEN, y esto ya está probado en la práctica: el 24 de
// agosto de 2026 dejaron de ser provisionales sobre la geometría 7×5, el 27 el
// tablero creció a 14×12 —frentes a 11 en vez de a 4— y **siguieron igual**
// (docs/v3/board/battle.md §1.1). El motivo es de catálogo y no de tablero:
// 🗡️ es 1 por definición —el hexágono contiguo— y las fichas 🗡️ son 70 de las
// 132, así que escalar el alcance con el ancho del campo solo escala a quien ya
// llegaba y deja a más de la mitad del catálogo exactamente igual de lejos.
//
// Lo que se adapta al tablero es 👢 MOVIMIENTO, y por eso aquí aparece
// `movementBand`: el reparto está decidido (🗡️ el más alto, 🏹 el más bajo), los
// valores no —son insumo de Dario, como el resto de la escala—. De ahí sale el
// cambio de carácter del 🏹, que en un tablero grande ya no abre la batalla sino
// que la espera: avanzar para disparar es ponerse a tiro del que corre.
//
// El alcance es un MÁXIMO, no un mínimo: se puede disparar o lanzar magia
// contra un enemigo pegado, sin penalización. En v2 sí penalizaba, con
// "Desventaja", y ese mecanismo no se recupera.
// =========================================================================

export type DamageTypeId = "cuerpo-a-cuerpo" | "a-distancia" | "magico";

/**
 * En qué banda de 👢 Movimiento va ese tipo de daño (battle.md §1.1 y §1.2).
 * El reparto está decidido; los números, no. Es lo que rompe el bucle del
 * arquero que dispara y retrocede: el alcance se paga con los pies.
 */
export type MovementBand = "alto" | "medio" | "bajo";

export type DamageType = {
  readonly id: DamageTypeId;
  /** Como se escribe en la wiki y en la carta. */
  readonly label: string;
  readonly icon: string;
  /** Alcance máximo en hexágonos. */
  readonly range: number;
  /** Qué Habilidad lo reduce (game-design.md §4.3). */
  readonly mitigatedBy: "defensa" | "resistencia-magica";
  readonly movementBand: MovementBand;
  /** Su trabajo mientras los dos bandos se acercan (battle.md §1.1). */
  readonly approachRole: string;
};

export const DAMAGE_TYPES: Record<DamageTypeId, DamageType> = {
  "cuerpo-a-cuerpo": {
    id: "cuerpo-a-cuerpo",
    label: "Cuerpo a cuerpo",
    icon: "🗡️",
    range: 1,
    mitigatedBy: "defensa",
    movementBand: "alto",
    approachRole: "Cruza el campo entero: paga la aproximación, y por eso corre",
  },
  "a-distancia": {
    id: "a-distancia",
    label: "A distancia",
    icon: "🏹",
    range: 4,
    mitigatedBy: "defensa",
    movementBand: "bajo",
    approachRole: "No avanza: espera y castiga a quien cruce",
  },
  magico: {
    id: "magico",
    label: "Mágico",
    icon: "✨",
    range: 2,
    mitigatedBy: "resistencia-magica",
    movementBand: "medio",
    approachRole: "Avanza a media rienda y entra detrás del 🗡️",
  },
};

/** En el orden en el que se enseñan: por alcance, del corto al largo. */
export const DAMAGE_TYPE_IDS: readonly DamageTypeId[] = [
  "cuerpo-a-cuerpo",
  "magico",
  "a-distancia",
];
