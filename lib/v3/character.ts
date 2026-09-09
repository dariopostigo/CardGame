// =========================================================================
// Las estadísticas de personaje — la anatomía de V3
//
// "Personaje" incluye por igual a héroes, unidades y enemigos
// (docs/v3/game-design.md §1), y los enemigos no son un bestiario aparte: son
// las mismas razas (characters/enemies.md). Así que esto es la anatomía de los
// 132 personajes del juego, y de ella cuelga todo lo demás — el roster, el
// catálogo de cartas, la ficha del tablero y el motor de combate.
//
// NO ES LA FICHA, y el nombre importa porque hasta el 1 de septiembre de 2026
// valía para las dos cosas: la FICHA es el disco que se pone en el hexágono y
// anda por él (docs/v2/board/board-map.md §4c, y el módulo 5 de /dev), y esto es
// la HOJA DE DATOS que dice qué lleva escrito ese disco encima. Aquí no hay ni
// un píxel: no se sabe de qué color es el bando ni cuánto mide el diámetro.
//
// LA ANATOMÍA ESTÁ CERRADA Y LOS VALORES NO, y ese corte es el que da forma a
// este archivo. characters/heroes.md lo dice con esas palabras: «cerrada;
// faltan los valores». Lo que aquí se escribe es la FORMA —qué campos lleva un
// personaje, en qué escala va cada número y qué combinaciones son ilegales—, no las
// cifras: siguen siendo insumo pendiente (status.md §2, punto 3). De las ocho
// solo 👢 Movimiento tiene número, y no se decidió a dedo sino midiendo el duelo
// del arquero en el laboratorio del tablero (`duel.ts`, 31 de agosto de 2026).
//
// Y CUÁNTAS FALTAN TAMBIÉN ESTÁ CERRADO: «faltan siete Habilidades» se leía como
// 1.056 celdas en blanco, y son TRES cifras más los escalones de la raza piloto.
// El reparto, más abajo.
//
// POR QUÉ EXISTE ESTE ARCHIVO Y NO SE USA EL DE LOS BOCETOS. La anatomía ya
// estaba escrita a medias en `components/design/v3/sample.ts`: sus propias 8
// Habilidades, su propio tipo de daño, su propio `Trait` y sesenta fichas a
// mano con los números inventados. No es un descuido de nadie —el marco de
// carta necesitaba sujetos meses antes de que hubiera un motor, y su cabecera
// avisa de lo que es—, pero deja al repositorio con dos vocabularios para lo
// mismo, que es el error que este proyecto ya ha pagado dos veces (las 97
// cartas copiadas de v2, y las tres entradas para «resistencia mágica» que
// razas.md tuvo que deshacer). Este es el vocabulario, y el marco tiene su
// deuda declarada en `lib/dev-registry.ts` (módulo «marco», su `standIn`).
//
// NO DUPLICA NINGÚN NÚMERO QUE YA EXISTA. Los topes de la tirada vienen de
// `combat.ts` (§4.1), el alcance y la mitigación de `damage.ts` (§4.3) y la
// banda de 👢 de `tempo.ts`, donde se midió. Si un dial se mueve, se mueve en
// un sitio.
//
// Puro: sin React, sin azar, sin estado, sin `node:fs`. El catálogo de
// Características se INYECTA (ARCHITECTURE.md §7): validar una ficha no puede
// depender de leer un archivo.
// =========================================================================

import { HIT_BAND, LUCK_CAP, cappedLuck } from "./combat";
import { DAMAGE_TYPES, type DamageTypeId } from "./damage";
import { MOVEMENT_BAND } from "./tempo";
import type { Trait } from "./traits";

// --- Las 8 Habilidades ----------------------------------------------------

export type AbilityId =
  | "vida"
  | "ataque"
  | "defensa"
  | "resistencia-magica"
  | "precision"
  | "suerte"
  | "iniciativa"
  | "movimiento";

/**
 * Qué clase de número es. **Las ocho no viven en la misma escala** y eso no es
 * un descuido (habilidades.md §"La escala"): cuatro son umbrales o porcentajes que el
 * motor ya acota, dos son cantidades libres, una solo se compara y otra la fija
 * el tipo de daño. De aquí sale cómo se valida y cómo se lee cada una.
 */
export type AbilityScaleKind = "cantidad" | "porcentaje" | "umbral" | "orden" | "banda";

export type AbilityScale = {
  readonly kind: AbilityScaleKind;
  /** Mínimo y máximo admisibles. Los dos son inclusive. */
  readonly min: number;
  readonly max: number;
  /** De dónde sale ese tope, en una frase. Es lo que se enseña al chocar. */
  readonly why: string;
};

export type Ability = {
  readonly id: AbilityId;
  readonly label: string;
  readonly icon: string;
  /** Qué es el número (habilidades.md §"La escala", columna "Qué es el número"). */
  readonly what: string;
  readonly scale: AbilityScale;
  /**
   * Si crece con el tier. **Solo ❤️ Vida y ⚔️ Ataque**, ×10 del tier 1 al 8: las
   * otras seis están topadas o no escalan, y por eso un tier 8 pega y aguanta
   * diez veces más pero NO acierta diez veces mejor. Es lo que deja que un tier
   * 1 siga arañando a un tier 8 sin ningún caso especial.
   */
  readonly scalesWithTier: boolean;
};

/**
 * Las ocho, en el orden de razas.md — que es también el de la fila de la carta
 * (knowledge/v3/card-concept/README.md §"Contra qué se juzgan": ocho números en
 * su caja de datos).
 *
 * Los topes que son de reglas están citados; los que son de HUECO —cuántas
 * cifras caben en la carta— van dichos como tal, porque son de otra clase y el
 * día que el marco cambie se mueven.
 */
export const ABILITIES: Readonly<Record<AbilityId, Ability>> = {
  vida: {
    id: "vida",
    label: "Vida",
    icon: "❤️",
    what: "Los PV máximos, sin derivar de nada",
    scale: {
      kind: "cantidad",
      min: 10,
      max: 999,
      why: "2–3 cifras. El daño se le resta directamente: lo que pone en la carta es lo que tiene (§4.2)",
    },
    scalesWithTier: true,
  },
  ataque: {
    id: "ataque",
    label: "Ataque",
    icon: "⚔️",
    what: "Daño por golpe, sin rango y sin decir de qué clase es",
    scale: {
      kind: "cantidad",
      min: 1,
      max: 99,
      why: "1–2 cifras. Un solo número, porque el azar ya está en el acierto y en el crítico (§4.2)",
    },
    scalesWithTier: true,
  },
  defensa: {
    id: "defensa",
    label: "Defensa",
    icon: "🛡️",
    what: "El % que reduce del daño 🗡️ y 🏹",
    scale: {
      kind: "porcentaje",
      min: 0,
      max: 75,
      why: "Tope 75 (§4.2): el muro más duro del juego recibe una cuarta parte. A 100 habría inmunidad, y la inmunidad tiene que ser un rasgo",
    },
    scalesWithTier: false,
  },
  "resistencia-magica": {
    id: "resistencia-magica",
    label: "Resistencia mágica",
    icon: "🔮",
    what: "El % que reduce del daño ✨",
    scale: {
      kind: "porcentaje",
      min: 0,
      max: 75,
      why: "El mismo tope 75 que 🛡️ Defensa (§4.2). Lo único que cambia entre las dos es qué tipo de daño frenan",
    },
    scalesWithTier: false,
  },
  precision: {
    id: "precision",
    label: "Precisión",
    icon: "🎯",
    what: "Umbral de acierto sobre la tirada oculta 1..100",
    scale: {
      kind: "umbral",
      min: HIT_BAND.min,
      max: HIT_BAND.max,
      why: `Banda ${HIT_BAND.min}–${HIT_BAND.max} (§4.1): nunca acierto garantizado y nunca un 40% que se sienta roto. Treinta puntos que reparten los 8 tiers, la cobertura y 💨 Evasivo`,
    },
    scalesWithTier: false,
  },
  suerte: {
    id: "suerte",
    label: "Suerte",
    icon: "🍀",
    what: "Umbral de crítico, entrada de los estados de control, salida temprana de un estado y desempate de ⚡ Iniciativa",
    scale: {
      kind: "umbral",
      min: 0,
      max: LUCK_CAP,
      why: `Tope ${LUCK_CAP} y nunca por encima de 🎯 Precisión (§4.1). El techo existe porque el crítico además aplica el control: sin él, crítico y control se desbocan juntos`,
    },
    scalesWithTier: false,
  },
  iniciativa: {
    id: "iniciativa",
    label: "Iniciativa",
    icon: "⚡",
    what: "Orden de actuación, y nada más",
    scale: {
      kind: "orden",
      min: 1,
      max: 99,
      // El §4.6 dice "sin escala propia: solo se compara", así que las reglas no
      // ponen tope. El que hay es del hueco de la carta, y va dicho así.
      //
      // Y no hay banda ni fórmula que la genere: desde el 8 de septiembre de 2026
      // se elige POR FICHA, en tres escalones (lento · normal · rápido). El banco
      // ya midió que da igual —100.000 combates, el orden de turno no mueve quién
      // gana—, así que no hay nada que compensar con un número fino.
      why: "Sin escala de reglas: solo se compara, y los empates los rompe 🍀 Suerte (§4.6). Se elige por ficha en tres escalones. El límite de dos cifras es del hueco de la carta, no del motor",
    },
    scalesWithTier: false,
  },
  movimiento: {
    id: "movimiento",
    label: "Movimiento",
    icon: "👢",
    what: "Hexágonos por turno",
    scale: {
      kind: "banda",
      min: 0,
      max: 9,
      why: "La única de las ocho con número: banda por tipo de daño, 🗡️ 3 · ✨ 2 · 🏹 1 (battle.md §1.2). Los límites de verdad son por tipo — ver MOVEMENT_LIMITS",
    },
    scalesWithTier: false,
  },
};

export const ABILITY_IDS: readonly AbilityId[] = [
  "vida",
  "ataque",
  "defensa",
  "resistencia-magica",
  "precision",
  "suerte",
  "iniciativa",
  "movimiento",
];

/**
 * Las que no traen número puesto de ningún sitio. **Cinco de ocho**: 👢 se midió
 * en duelo *(31-ago)* y ❤️/⚔️ salen de la base de su raza más la curva
 * *(8-sep, `RACE_BASES`)*.
 *
 * Y "sin número" no es "sin decidir": estas cinco **se eligen a ojo, ficha a
 * ficha**, en los escalones de `ABILITY_STEPS`. Lo que falta es catálogo —el
 * valor de cada una de las 132—, no una decisión de sistema.
 */
export const ABILITIES_WITHOUT_VALUES: readonly AbilityId[] = ABILITY_IDS.filter(
  (id) => id !== "movimiento" && id !== "vida" && id !== "ataque",
);

// --- El tier --------------------------------------------------------------

export const TIERS = 8;

/**
 * La curva de potencia de una raza: ×10 del tier 1 al tier 8, unos ×1,4 por
 * escalón (habilidades.md §"La escala"). Es 10^((t−1)/7) redondeado a un decimal, y
 * se guarda la tabla tal cual está escrita en vez de la fórmula porque lo que
 * manda es el documento.
 *
 * **Y es toda la curva que tiene el juego**: el tier es el único eje de las
 * unidades —una unidad no sube, es más fuerte porque es *otra* unidad— y V3 no
 * tiene progresión de personaje (§3, status.md §5).
 */
export const TIER_CURVE: readonly number[] = [1, 1.4, 1.9, 2.7, 3.7, 5.2, 7.2, 10];

/** El multiplicador de ese tier, o 1 si el tier no es de los ocho. */
export function tierMultiplier(tier: number): number {
  return TIER_CURVE[Math.round(tier) - 1] ?? 1;
}

/**
 * El valor de una Habilidad que escala, llevado de su base de tier 1 a otro
 * tier. Solo tiene sentido para ❤️ Vida y ⚔️ Ataque (`scalesWithTier`).
 */
export function scaleByTier(base: number, tier: number): number {
  return Math.round(base * tierMultiplier(tier));
}

// --- La base de raza ------------------------------------------------------
//
// DE DÓNDE SALE CADA NÚMERO (habilidades.md §3). Solo dos de las ocho se calculan:
//
//   · ❤️ Vida y ⚔️ Ataque      → una base de tier 1 POR RAZA; la curva de arriba
//                                da los otros siete escalones. 2 cifras por raza.
//   · Un héroe                 → equivale a un TIER FIJO, el mismo para los 44,
//                                para poder darle ❤️/⚔️ con la curva de su raza.
//                                1 cifra, y no se imprime en la carta.
//   · Las otras seis           → NO SE CALCULAN. 👢 ya está (banda por tipo de
//                                daño, medida en duelo); 🛡️ 🔮 🎯 🍀 ⚡ se eligen
//                                A OJO, ficha a ficha, en cinco escalones con
//                                nombre. Ver `ABILITY_STEPS`.
//
// NO HAY FÓRMULA, Y ES UNA DECISIÓN (8 de septiembre de 2026). Hubo una: base por
// tipo de daño + paso por tier + firma de raza (±X, suma cero) + desvío de rol,
// cuatro capas de aritmética apiladas para producir un número. Se cayó entera
// —35 de las 39 cifras que pedía eran de la máquina de generar el juego, no del
// juego— porque los valores que salían eran todos primos hermanos: ninguna ficha
// podía ser rara sin salirse de la cuenta. El rol y la raza siguen existiendo
// como DESCRIPCIÓN: te dicen qué escalón elegir, no suman nada. Con ellos decae
// la regla de "dos clases de la misma raza no comparten tipo de daño Y rol", que
// solo existía porque la fórmula las sacaba idénticas.
//
// Aquí solo está lo que se puede comprobar sin ninguna cifra decidida: los topes
// de la base, que no los eligió nadie, y los escalones. Los valores viven con el
// roster (módulo «razas»), que es quien los tendrá.

/**
 * Hasta dónde puede llegar la base de tier 1 de una Habilidad que escala.
 *
 * **No es una decisión, es aritmética**: la curva multiplica por 10 del tier 1
 * al 8, así que la base no puede pasar de la décima parte del tope de su escala
 * o el tier 8 de esa raza se saldría de la carta. De ahí que el ⚔️ Ataque de
 * cualquier tier 1 del juego sea forzosamente de una sola cifra.
 */
export const BASE_LIMITS: Readonly<Record<"vida" | "ataque", { min: number; max: number }>> = {
  vida: {
    min: ABILITIES.vida.scale.min,
    max: Math.floor(ABILITIES.vida.scale.max / TIER_CURVE[TIERS - 1]),
  },
  ataque: {
    min: ABILITIES.ataque.scale.min,
    max: Math.floor(ABILITIES.ataque.scale.max / TIER_CURVE[TIERS - 1]),
  },
};

/** Los cinco escalones, de menos a más. `null` = ese escalón no existe. */
export type StepName = "nada" | "poco" | "normal" | "mucho" | "bestial";

export const STEP_NAMES: readonly StepName[] = ["nada", "poco", "normal", "mucho", "bestial"];

/**
 * Los valores que puede tomar una Habilidad que se elige a ojo.
 *
 * **Cinco escalones con nombre en vez de una fórmula** (habilidades.md §3,
 * 8-sep-2026). No es una tabla de balance: es la lista de la compra. Se asigna
 * el escalón que le pega a la ficha, y una ficha corriente se queda en `normal`
 * sin que nadie decida nada.
 *
 * ⚡ Iniciativa solo tiene los tres de en medio porque no tiene tope de reglas
 * —solo se compara—, así que "nada" y "bestial" no querrían decir nada.
 *
 * 🎯 Precisión empieza en 65 y acaba en 95 porque esos son los bordes de su
 * banda (game-design.md §4), la misma que comparten la cobertura y 💨 Evasivo.
 */
export const ABILITY_STEPS: Readonly<
  Record<"defensa" | "resistencia-magica" | "precision" | "suerte" | "iniciativa", readonly (number | null)[]>
> = {
  defensa: [0, 20, 40, 60, 75],
  "resistencia-magica": [0, 20, 40, 60, 75],
  precision: [65, 72, 80, 88, 95],
  suerte: [0, 6, 12, 18, 25],
  iniciativa: [null, 3, 5, 8, null],
};

/** El escalón por defecto de cualquier ficha: el de en medio. */
export const DEFAULT_STEP: StepName = "normal";

/**
 * A qué tier equivale un héroe por dentro, **el mismo para los 44**
 * (habilidades.md §4, 8-sep-2026). Solo sirve para darle ❤️/⚔️ con la curva de
 * su raza: **no se imprime en la carta** y no es un tier de verdad — el héroe es
 * el que no tiene tier (ficha.md).
 *
 * El 5 y no otro porque el héroe es el líder y no el campeón —sus tres unidades
 * más altas le superan en ❤️ y ⚔️—, y porque es el que cuadra con su tope de 3
 * Características, que es el de los tiers 3, 4 y 5.
 */
export const HERO_TIER = 5;

/**
 * La base de tier 1 de las dos Habilidades que escalan, por raza.
 *
 * **Las dos razas piloto** (habilidades.md §4 y status.md §4, 8-sep-2026):
 * Humanos va bajo y en redondo porque es el estándar de las once, con el
 * ⚔️ 5 en el centro de 1–9 para que quepan arriba los brutos y abajo los
 * frágiles. Enanos es tanque puro —más ❤️ que el estándar, menos ⚔️—, que es
 * lo que ya decía su progresión: 🛡️ Resistente al daño físico en seis de sus
 * ocho unidades y ninguna de daño ✨ mágico. Las otras nueve quedan en
 * StandBy hasta la v1 (status.md §4) y no ponen su par hasta que les toque.
 *
 * El día que exista el módulo «razas» esto se muda con el roster: aquí está
 * porque es lo que la mesa de /dev/personaje necesita para pintar una ficha de
 * verdad, y porque `BASE_LIMITS` lo comprueba.
 */
export const RACE_BASES: Readonly<Record<string, { vida: number; ataque: number }>> = {
  humanos: { vida: 20, ataque: 5 },
  enanos: { vida: 26, ataque: 4 },
};

/**
 * El valor de una Habilidad de escalones, o `null` si ese escalón no existe
 * para ella (⚡ en los extremos).
 */
export function stepValue(
  ability: keyof typeof ABILITY_STEPS,
  step: StepName,
): number | null {
  return ABILITY_STEPS[ability][STEP_NAMES.indexOf(step)] ?? null;
}

/**
 * En qué tier la ❤️ Vida de una raza pasa a tener tres cifras, o `null` si no
 * llega en los ocho.
 *
 * **Es la cuenta que ata este documento con la ficha del tablero.** El disco
 * lleva la ❤️ Vida en una gema donde tres cifras no caben (módulo 5), y cuántas
 * fichas rompen esa gema no lo decide el dibujo: lo decide dónde se ponga esta
 * base. Con 10, solo la ve el tier 8; con 99, ya el tier 2.
 */
export function firstThreeDigitTier(healthBase: number): number | null {
  for (let tier = 1; tier <= TIERS; tier++) {
    if (scaleByTier(healthBase, tier) >= 100) return tier;
  }
  return null;
}

// --- La ficha -------------------------------------------------------------

/**
 * Héroe o unidad. **No es un matiz de sabor**: la unidad tiene tier y el héroe
 * NO TIENE NADA en su lugar —V3 no tiene progresión de personaje (status.md
 * §5)—, así que no hay ningún dato en camino para ese hueco. Cualquier marco
 * que reserve un sitio fijo para el Tier tiene que resolverlo poniendo otra
 * cosa, no esperando el dato.
 *
 * Un ENEMIGO no es un tercer papel: los enemigos son las razas, y una unidad
 * hostil es la misma unidad del otro lado del campo (characters/enemies.md).
 * Lo que distingue a un bando del otro es el bando, no la ficha.
 *
 * `deployment.ts` tiene su propio `FigureRole` con estos dos valores, porque la
 * arena solo necesita saber quién es el héroe y se construyó antes que esto. Se
 * junta con este el día que una figura del tablero lleve una ficha entera, que
 * es cuando exista el roster (módulo «razas»).
 */
export type CharacterRole = "heroe" | "unidad";

export type Abilities = Readonly<Record<AbilityId, number>>;

export type Character = {
  readonly id: string;
  readonly name: string;
  readonly role: CharacterRole;
  /**
   * Su puesto en la progresión de ocho de su raza, 1..8. **Solo las unidades**;
   * un héroe no lo lleva y no lo sustituye nada.
   */
  readonly tier?: number;
  /** Raza, tal y como se escribe en razas.md. La rellena el roster. */
  readonly race?: string;
  /** Emoji de la ficha. Hace de ilustración mientras no haya arte. */
  readonly icon?: string;
  /**
   * Uno y solo uno, obligatorio y sin defecto (dano.md). Trae
   * puesto el alcance, así que la ficha NO lleva campo de alcance.
   */
  readonly damage: DamageTypeId;
  readonly abilities: Abilities;
  /** Ids del catálogo de Características. De 0 a 5. */
  readonly traits: readonly string[];
};

/**
 * El tope de Características que una ficha puede llevar.
 *
 * **Son cinco, y no es una elección de marco**: en la tabla de unidades de
 * razas.md hay seis unidades de tier 8 que llevan cinco —🐉 Dragón esquelético,
 * 👹 Balor, 🐉 Dragón ancestral, 🐙 Kraken ancestral, ⚙️ Coloso mecánico y
 * 🧪 Abominación de plaga—, así que el catálogo ya gastó los cinco huecos y el
 * marco tiene que aguantarlos (knowledge/v3/card-concept/README.md).
 *
 * Que el tope se congele en cinco o alguna raza pueda pasarlo sigue siendo una
 * decisión abierta (status.md §3), y es la razón de que esto sea una constante
 * de un archivo y no un número escrito en seis sitios.
 */
export const MAX_TRAITS = 5;

/**
 * Los límites de 👢 Movimiento por tipo de daño, MEDIDOS y no supuestos
 * (habilidades.md §"La escala", del duelo de `duel.ts`): con el mismo 👢 para todos,
 * el 🏹 dispara y retrocede dando la vuelta al campo y el 🗡️ tarda 16 rondas
 * comiendo 11 disparos en alcanzarlo.
 *
 * ✨ Mágico se midió el 7 de septiembre de 2026 con el mismo duelo, contra el
 * 🏹 y con 🗡️ y 🏹 fijos en su banda: a 👢 2 —su banda— el peaje es un disparo,
 * y a 👢 1 se duplica a dos y empieza a acorralarse, el mismo quiebre que ya
 * partía a 🗡️ un escalón más arriba. **No tiene máximo escrito, y no es que
 * falte medir**: el de 🏹 sale de SU PROPIO 👢 al huir, algo que ✨ no hace
 * nunca en este duelo —solo persigue—, así que esa pregunta no tiene caso que
 * la conteste con el modelo que existe hoy.
 */
export const MOVEMENT_LIMITS: Readonly<
  Record<DamageTypeId, { readonly min?: number; readonly max?: number }>
> = {
  "cuerpo-a-cuerpo": { min: 3 },
  magico: { min: 2 },
  "a-distancia": { max: 2 },
};

/**
 * Una ficha en blanco: cada Habilidad en el suelo de su escala y 👢 Movimiento
 * en la banda de su tipo de daño.
 *
 * **El suelo es una ficha legal**, y eso no es casualidad sino una propiedad de
 * la escala: 🎯 Precisión arranca en 65 porque su banda empieza ahí, y 🍀 Suerte
 * en 0 nunca puede pasar de ella. Sirve de punto de partida honesto mientras
 * los valores sean insumo pendiente — no finge cifras que nadie ha decidido.
 */
export function blankCharacter(role: CharacterRole, damage: DamageTypeId): Character {
  return {
    id: "sin-nombre",
    name: role === "heroe" ? "Héroe sin nombre" : "Unidad sin nombre",
    role,
    tier: role === "unidad" ? 1 : undefined,
    damage,
    abilities: {
      vida: ABILITIES.vida.scale.min,
      ataque: ABILITIES.ataque.scale.min,
      defensa: 0,
      "resistencia-magica": 0,
      precision: HIT_BAND.min,
      suerte: 0,
      iniciativa: 1,
      movimiento: MOVEMENT_BAND[damage],
    },
    traits: [],
  };
}

// --- Lo que la ficha deriva ----------------------------------------------

export type Derived = {
  /** Alcance máximo en hexágonos. Lo trae el tipo de daño, no la ficha. */
  readonly range: number;
  /** Qué Habilidad del defensor frena SU daño. */
  readonly mitigatedBy: "defensa" | "resistencia-magica";
  /** El 👢 que le tocaría por su tipo de daño, tenga el que tenga. */
  readonly movementBand: number;
  /** 🍀 Suerte ya saneada: con su tope y sin pasar de 🎯 Precisión. */
  readonly luck: number;
  /** Cuántas Características le quedan libres de las cinco. */
  readonly traitSlotsLeft: number;
};

/**
 * Lo que sale de la ficha sin decidir nada: el alcance, contra qué se resta su
 * daño, qué 👢 le toca y cuánta 🍀 Suerte le queda después de los topes.
 *
 * No resuelve ataques ni calcula daño: eso es el motor (§4.2) y todavía no
 * existe, porque necesita las siete cifras que faltan.
 */
export function derivedOf(c: Character): Derived {
  const type = DAMAGE_TYPES[c.damage];
  return {
    range: type.range,
    mitigatedBy: type.mitigatedBy,
    movementBand: MOVEMENT_BAND[c.damage],
    luck: cappedLuck(c.abilities.suerte, c.abilities.precision),
    traitSlotsLeft: Math.max(0, MAX_TRAITS - c.traits.length),
  };
}

// --- Validación -----------------------------------------------------------

/**
 * De qué clase es el problema. No es adorno: separa lo que rompe una REGLA de
 * lo que no cabe en la CARTA, y las dos cosas se arreglan en sitios distintos.
 */
export type ProblemKind =
  /** Choca con un tope o una banda del motor (§4.1, §4.2). */
  | "tope"
  /** El campo está mal formado: falta, sobra o no es un entero. */
  | "forma"
  /** No cabe en el marco de carta, aunque las reglas lo permitan. */
  | "hueco";

/**
 * Una comprobación de la anatomía, con su lectura en esta ficha.
 *
 * **Se devuelven también las que pasan**, y no es adorno de interfaz: la lista
 * de comprobaciones ES la anatomía escrita en un sitio donde se puede leer. Un
 * panel que solo enseña los fallos deja invisible la regla mientras la
 * cumples, y aquí la regla es justo lo que se está construyendo — que 🍀 Suerte
 * no pueda pasar de 🎯 Precisión se aprende viéndolo sostenerse, no viéndolo
 * romperse.
 */
export type Check = {
  readonly id: string;
  readonly kind: ProblemKind;
  /** La Habilidad a la que señalar, si la comprobación es de una. */
  readonly ability?: AbilityId;
  /** La regla, corta: «🍀 Suerte ≤ 🎯 Precisión». */
  readonly rule: string;
  /** Cómo ha quedado en esta ficha: «12 ≤ 78». */
  readonly reading: string;
  readonly ok: boolean;
  /** Si no pasa, el "no" con sus palabras y su motivo. */
  readonly message?: string;
};

export type CharacterProblem = {
  readonly kind: ProblemKind;
  readonly ability?: AbilityId;
  /** El "no" con sus palabras, para que la interfaz pueda explicarlo. */
  readonly message: string;
};

/**
 * Todo lo que la anatomía comprueba de una ficha, pase o no.
 *
 * @param c - La ficha.
 * @param catalog - El catálogo de Características, inyectado. Sin él no se
 *   comprueba que los rasgos existan, que es lo único que necesita leer un
 *   archivo.
 */
export function checks(c: Character, catalog?: readonly Trait[]): readonly Check[] {
  const out: Check[] = [];
  const type = DAMAGE_TYPES[c.damage];

  // --- El tier, que es lo que separa a un héroe de una unidad -------------
  const tierOk =
    c.role === "unidad"
      ? c.tier !== undefined && Number.isInteger(c.tier) && c.tier >= 1 && c.tier <= TIERS
      : c.tier === undefined;
  out.push({
    id: "tier",
    kind: "forma",
    rule: c.role === "unidad" ? `Una unidad tiene tier 1–${TIERS}` : "Un héroe no tiene tier",
    reading:
      c.tier === undefined ? "sin tier" : `tier ${c.tier}`,
    ok: tierOk,
    message: tierOk
      ? undefined
      : c.role === "unidad"
        ? `Una unidad tiene que decir su tier, un entero de 1 a ${TIERS}: es su puesto en la progresión de ocho de su raza.`
        : "Un héroe no tiene tier, y no hay nada que lo sustituya: V3 no tiene progresión de personaje (status.md §5).",
  });

  // --- Las ocho, cada una contra su escala --------------------------------
  for (const id of ABILITY_IDS) {
    const ability = ABILITIES[id];
    const value = c.abilities[id];
    const whole = Number.isInteger(value);
    const inRange = value >= ability.scale.min && value <= ability.scale.max;
    out.push({
      id: `escala-${id}`,
      // Solo ⚡ Iniciativa tiene un límite que no es de reglas sino del hueco de
      // la carta (§4.6: "sin escala propia, solo se compara").
      kind: ability.scale.kind === "orden" ? "hueco" : "tope",
      ability: id,
      rule: `${ability.icon} ${ability.label} ${ability.scale.min}–${ability.scale.max}`,
      reading: `${value}`,
      ok: whole && inRange,
      message: !whole
        ? `${ability.icon} ${ability.label} tiene que ser un entero: la carta imprime un número, no una fracción.`
        : inRange
          ? undefined
          : `${ability.icon} ${ability.label} ${value} se sale de ${ability.scale.min}–${ability.scale.max}. ${ability.scale.why}.`,
    });
  }

  // --- 🍀 Suerte nunca por encima de 🎯 Precisión (§4.1) ------------------
  // Es la regla que mantiene la tirada monótona: si pudiera pasarla, habría
  // críticos que no han acertado.
  const luckUnderHit = c.abilities.suerte <= c.abilities.precision;
  out.push({
    id: "suerte-bajo-precision",
    kind: "tope",
    ability: "suerte",
    rule: "🍀 Suerte ≤ 🎯 Precisión",
    reading: `${c.abilities.suerte} ${luckUnderHit ? "≤" : ">"} ${c.abilities.precision}`,
    ok: luckUnderHit,
    message: luckUnderHit
      ? undefined
      : `🍀 Suerte ${c.abilities.suerte} no puede pasar de 🎯 Precisión ${c.abilities.precision} (§4.1): habría tiradas que critican sin haber acertado.`,
  });

  // --- 👢 Movimiento contra el límite medido de su tipo de daño -----------
  const limit = MOVEMENT_LIMITS[c.damage];
  const movement = c.abilities.movimiento;
  const overMax = limit.max !== undefined && movement > limit.max;
  const underMin = limit.min !== undefined && movement < limit.min;
  out.push({
    id: "movimiento-por-tipo",
    kind: "tope",
    ability: "movimiento",
    rule:
      limit.min !== undefined
        ? `Ninguna ${type.icon} por debajo de 👢 ${limit.min}`
        : limit.max !== undefined
          ? `Ninguna ${type.icon} por encima de 👢 ${limit.max}`
          : `${type.icon} no tiene límite medido`,
    reading: `👢 ${movement} · banda ${MOVEMENT_BAND[c.damage]}`,
    ok: !overMax && !underMin,
    message: underMin
      ? `Ninguna ficha ${type.icon} ${type.label} puede bajar de 👢 ${limit.min}: por debajo, el peaje contra el 🏹 que retrocede se duplica y empieza a acorralarse (battle.md §1.2, duel.ts).`
      : overMax
        ? `Ninguna ficha ${type.icon} ${type.label} puede pasar de 👢 ${limit.max}: con más, dispara y retrocede dando la vuelta al campo (battle.md §1.2).`
        : undefined,
  });

  // --- Las Características ------------------------------------------------
  const withinCap = c.traits.length <= MAX_TRAITS;
  out.push({
    id: "traits-tope",
    kind: "hueco",
    rule: `De 0 a ${MAX_TRAITS} Características`,
    reading: `${c.traits.length}`,
    ok: withinCap,
    message: withinCap
      ? undefined
      : `${c.traits.length} Características: el marco aguanta ${MAX_TRAITS}, que es lo que ya gastan seis unidades de tier 8.`,
  });

  const duplicated = c.traits.filter((id, i) => c.traits.indexOf(id) !== i);
  out.push({
    id: "traits-sin-repetir",
    kind: "forma",
    rule: "Sin Características repetidas",
    reading: duplicated.length === 0 ? "ninguna" : duplicated.join(", "),
    ok: duplicated.length === 0,
    message:
      duplicated.length === 0
        ? undefined
        : `«${duplicated[0]}» está dos veces: una ficha no lleva la misma Característica repetida.`,
  });

  if (catalog) {
    const known = new Set(catalog.map((t) => t.id));
    const unknown = c.traits.filter((id) => !known.has(id));
    out.push({
      id: "traits-del-catalogo",
      kind: "forma",
      rule: "Todas del catálogo de razas.md",
      reading: unknown.length === 0 ? `${catalog.length} conocidas` : unknown.join(", "),
      ok: unknown.length === 0,
      message:
        unknown.length === 0
          ? undefined
          : `«${unknown[0]}» no está en el catálogo de razas.md.`,
    });
  }

  return out;
}

/**
 * Qué tiene de ilegal esta ficha. Lista vacía = legal.
 *
 * Devuelve motivos y no un booleano a propósito (ARCHITECTURE.md §5 y su
 * anti-patrón): un campo en rojo sin explicación no enseña la regla.
 */
export function validate(
  c: Character,
  catalog?: readonly Trait[],
): readonly CharacterProblem[] {
  return checks(c, catalog)
    .filter((k) => !k.ok)
    .map((k) => ({
      kind: k.kind,
      ability: k.ability,
      message: k.message ?? k.rule,
    }));
}

/**
 * Los emojis que esta ficha enseñaría repetidos en su carta.
 *
 * En la carta las Características **no son texto**: son glifos. Dos rasgos con
 * el mismo emoji en la misma ficha se ven como el mismo icono dos veces, y eso
 * ya pasó con el ⚔️ Guerrero de Humanos. No es ilegal —las familias elementales
 * comparten glifo a propósito— así que no entra en `validate`: es un aviso de
 * dibujo, y quien lo tiene que ver es quien mira la carta.
 */
export function repeatedGlyphs(
  c: Character,
  catalog: readonly Trait[],
): readonly { readonly icon: string; readonly labels: readonly string[] }[] {
  // Se compara sin selectores de variación, que es lo que hace que 🗡️ y 🗡 sean
  // el mismo dibujo para quien mira la carta.
  const byIcon = new Map<string, { icon: string; labels: string[] }>();
  for (const id of c.traits) {
    const trait = catalog.find((t) => t.id === id);
    if (!trait) continue;
    const key = trait.icon.replace(/\p{M}/gu, "");
    const entry = byIcon.get(key);
    if (entry) entry.labels.push(trait.label);
    else byIcon.set(key, { icon: trait.icon, labels: [trait.label] });
  }
  return [...byIcon.values()].filter((e) => e.labels.length > 1);
}
