// =========================================================================
// Sujetos de muestra de los bocetos de marco V3
//
// El lab de v2 (components/design/CardDesignLab.tsx) pinta el catálogo REAL,
// leído de las tablas de docs/v2/cards/*.md. Este no puede: docs/v3/cards/ no
// tiene todavía ni una tabla, así que los sujetos se escriben aquí a mano.
//
// PERO NO SE ESCOGEN A DEDO. Son la plantilla entera de la raza piloto tal y
// como está en knowledge/v3/races-concept/razas.md: las OCHO unidades de
// 👤 Humanos en su orden de progresión (tier 1 → 8) y TRES de sus cuatro
// héroes. Un marco se juzga con el reparto real de una raza —cuántos nombres
// largos hay, cuántas Características caen por carta, cuántas cifras de Vida—
// y no con media docena de casos elegidos para que salga bien.
//
// Los héroes están por dos motivos. Uno: NO son unidades, no tienen tier, y
// eso descoloca a cualquier marco que reserve un sitio fijo para el Tier — el
// hueco reservado para un número se queda esperándolo. Dos: son lo ÚNICO que tiene arte
// de V3 (public/assets/v3/races/humanos/), así que son las tres cartas que de
// verdad enseñan cómo queda un marco sobre una ilustración de este juego y no
// sobre un emoji o sobre un recorte prestado de v2. Ojo: ese arte está pendiente
// de regenerarse —encuadre, reparto y fondo se cerraron después de tirarlo—, así
// que sirve para juzgar el marco, no el arte.
//
// El 🐉 Dragón esquelético no es de Humanos y se queda de todas formas: es el
// peor caso del catálogo entero (cinco Características y dieciocho caracteres
// de nombre) y sin él ningún boceto pasa de cuatro chips. Va en su propia
// lista, etiquetado como caso límite, para no ensuciar la plantilla de la raza.
//
// LOS NÚMEROS DE LAS HABILIDADES SON INVENTADOS. docs/v3/razas.md avisa de que
// los valores siguen pendientes; aquí solo importa su FORMA (una, dos o tres
// cifras), que es lo que decide si el hueco del número se rompe. Lo que NO es
// inventado es todo lo demás: nombres, emojis, orden, raza y Características
// salen de razas.md tal cual.
//
// PERO YA NO SON LIBRES: el 23-ago-2026 se cerró la ESCALA de las ocho
// (docs/v3/razas.md §"La escala"), así que los inventados tienen que caber en
// ella o el marco se estaría juzgando con números imposibles. Al cotejarlos
// salió un desajuste real y está corregido: 🎯 Precisión iba de 7 a 18 cuando
// es un UMBRAL sobre 1..100 y su banda es 65-95. Ahora va de 66 a 90 — mismas
// dos cifras, así que el marco no se mueve, pero ya se lee como lo que es.
// El resto ya encajaba: ⚔️ Ataque 5-48 (1-2 cifras), ❤️ Vida 15-240 (2-3),
// 🛡️/🔮 por debajo de 75, 🍀 Suerte por debajo de 25, y del Miliciano al
// Dragón dorado hay ×8 de Ataque y ×13 de Vida, que es la curva ×10 por tier.
// =========================================================================

/** Las 8 Habilidades, en el orden de docs/v3/razas.md §"Habilidades". */
export const SKILLS = [
  { key: "vida", label: "Vida", icon: "❤️" },
  { key: "ataque", label: "Ataque", icon: "⚔️" },
  { key: "defensa", label: "Defensa", icon: "🛡️" },
  { key: "resistencia", label: "Resistencia mágica", icon: "🔮" },
  { key: "precision", label: "Precisión", icon: "🎯" },
  { key: "suerte", label: "Suerte", icon: "🍀" },
  { key: "iniciativa", label: "Iniciativa", icon: "⚡" },
  { key: "movimiento", label: "Movimiento", icon: "👢" },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

/**
 * El tipo de daño (docs/v3/razas.md §"Tipo de daño"). Campo obligatorio de toda
 * ficha, uno y solo uno — no es una Característica: lo llevan las 132, y un
 * rasgo que lleva todo el mundo no dice nada en la fila de glifos.
 *
 * Por eso se dibuja EN EL SITIO DEL ICONO DE ⚔️ Ataque: el glifo que acompaña
 * al número es el del tipo, así que la carta dice cuánto pega y de qué manera
 * en el mismo hueco y sin gastar ni un pixel más de marco.
 */
export const DAMAGE = {
  cuerpo: { icon: "🗡️", label: "Cuerpo a cuerpo" },
  distancia: { icon: "🏹", label: "A distancia" },
  magico: { icon: "✨", label: "Mágico" },
} as const;

export type DamageKey = keyof typeof DAMAGE;

export type Trait = { icon: string; label: string };

/**
 * Unidad o héroe. No es un matiz de sabor: la unidad tiene tier (1–8, su
 * puesto en la progresión de la raza) y el héroe NO TIENE NADA en su lugar —V3
 * no tiene progresión de personaje (docs/v3/status.md §5), así que no hay ningún
 * dato en camino para ese hueco—. Cualquier boceto que meta el Tier en una pieza
 * fija del marco tiene que resolverlo poniendo otra cosa, no esperando el dato.
 */
export type SubjectKind = "unidad" | "heroe";

export type Subject = {
  readonly id: string;
  readonly name: string;
  readonly kind: SubjectKind;
  readonly race: string;
  /** Emoji de la raza, el que usa razas.md. */
  readonly raceIcon: string;
  /** Solo unidades: su puesto en la progresión. Los héroes no tienen. */
  readonly tier?: number;
  /** Clave de $rarity (styles/settings/_colors.scss) — ver rarityForTier(). */
  readonly rarity: string;
  /** Emoji de la unidad o del héroe: hace de ilustración cuando no hay imagen. */
  readonly icon: string;
  /**
   * Ilustración. Hay de dos clases y no se mezclan:
   *
   * - **Los tres héroes llevan arte de V3**
   *   (`public/assets/v3/races/humanos/`). Es lo primero dibujado para V3 y
   *   manda para juzgar el marco: si uno no funciona con esas tres, no funciona.
   *   Pero **no es definitivo**: está pendiente de regenerarse con las reglas de
   *   encuadre, reparto y fondo, que se cerraron después.
   * - **Dos unidades llevan relleno de v2** (`public/assets/v2/cards/class/`),
   *   prestado de las cartas de clase cuyo papel coincide. Es provisional.
   *
   * Las demás caen al emoji, que hoy es lo normal —no hay arte de unidad— y
   * también hay que verlo. Todas son APAISADAS, así que en un marco vertical
   * se recortan por los lados: con eso basta para juzgar el marco, y de paso
   * enseña por qué el lienzo heredado de v2 no sirve.
   */
  readonly art?: string;
  readonly skills: Record<SkillKey, number>;
  /** Tipo de daño. Obligatorio: no hay defecto, igual que en razas.md. */
  readonly damage: DamageKey;
  readonly traits: readonly Trait[];
};

/** Relleno prestado de v2: las cuatro cartas de clase del juego anterior. */
const ART_V2 = (slug: string) => `/assets/v2/cards/class/${slug}/cards_class_${slug}.png`;

/**
 * Arte de V3. Hoy solo hay tres archivos y son los tres héroes de Humanos
 * dibujados (`public/assets/v3/races/humanos/`).
 *
 * La ruta y el nombre ya son los que manda `public/assets/v3/README.md`, que es
 * la fuente única: `races/<raza>/` y slug del nombre español. Queda una
 * divergencia, la extensión: son `.png` de ~2,4 MB y ese documento pide `.webp`.
 * No se convierten porque **los tres se van a regenerar** —salieron apaisados,
 * en plano medio y con el fondo compitiendo, antes de que se cerraran las reglas
 * de encuadre, reparto y fondo—, así que el `.webp` entra con los archivos
 * nuevos y no con una conversión que se va a tirar.
 */
const ART_V3 = (slug: string) => `/assets/v3/races/humanos/${slug}.png`;

/**
 * Rareza por tier. No está decidida en ningún documento —status.md la tiene
 * abierta en §"Escala de unidades"—, así que aquí va la lectura más obvia
 * (a más tier, más rara) solo para que los bocetos enseñen los cinco raíles
 * de color sin inventarse un control aparte.
 */
export function rarityForTier(tier: number): string {
  if (tier <= 2) return "comun";
  if (tier <= 4) return "poco-comun";
  if (tier <= 6) return "raro";
  if (tier <= 7) return "epico";
  return "legendario";
}

/**
 * Lo que va bajo el nombre: el rango de la carta. Es lo único que un boceto
 * tiene que preguntar para saber si está pintando una unidad o un héroe.
 */
export const rankOf = (s: Subject) => (s.kind === "heroe" ? "Héroe" : `Tier ${s.tier}`);

/**
 * Raíl de color de un héroe: el suyo, no un escalón prestado de la escala de
 * rareza. Clave de $rarity (styles/settings/_colors.scss), donde vive junto a
 * las otras categorías que no son escalones de rareza ("clase", "enemigo"…), y allí está
 * el porqué del color — es la sangre del tema de producción.
 *
 * Un héroe no tiene tier, así que no puede tener rareza por tier; y darle una
 * a mano decía que un Sacerdote es "más legendario" que un Guerrero, que es
 * falso. Los tres comparten raíl y así se leen como lo que son: una familia
 * distinta de las unidades.
 */
export const HERO_RAIL = "heroe";

// --- Las ocho unidades de 👤 Humanos --------------------------------------
// razas.md §"Unidades › 👤 Humanos — Progresión de unidades" para el orden y
// los nombres, y §"Características de todas las unidades › 👤 Humanos" para
// los chips. El tier es la posición en esa progresión.
export const UNITS: readonly Subject[] = [
  {
    id: "miliciano",
    name: "Miliciano",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "🗡️",
    // El caso vacío: cero Características y todo a una cifra menos la Vida.
    // Es el que descubre los huecos que se ven vacíos.
    skills: {
      vida: 18,
      ataque: 6,
      defensa: 4,
      resistencia: 1,
      precision: 66,
      suerte: 0,
      iniciativa: 5,
      movimiento: 4,
    },
    damage: "cuerpo",
    traits: [],
  },
  {
    id: "arquero",
    name: "Arquero",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🏹",
    art: ART_V2("picaro"),
    skills: {
      vida: 15,
      ataque: 7,
      defensa: 3,
      resistencia: 1,
      precision: 78,
      suerte: 2,
      iniciativa: 6,
      movimiento: 4,
    },
    damage: "distancia",
    // Sin Características: la única que tenía era 🏹 Ataque a distancia, que
    // ahora es el campo `damage`. Los casos vacíos de la raza pasan de uno a
    // TRES —Miliciano, Arquero y Mago—, así que el raíl sin medallones deja de
    // ser una rareza y hay que mirarlo.
    traits: [],
  },
  {
    id: "caballero",
    name: "Caballero",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 3,
    rarity: rarityForTier(3),
    icon: "🛡️",
    skills: {
      vida: 34,
      ataque: 10,
      defensa: 12,
      resistencia: 3,
      precision: 72,
      suerte: 2,
      iniciativa: 4,
      movimiento: 3,
    },
    damage: "cuerpo",
    traits: [{ icon: "🛡️", label: "Resistente al daño físico" }],
  },
  {
    id: "mago",
    name: "Mago",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "🔮",
    art: ART_V2("mago"),
    skills: {
      vida: 24,
      ataque: 5,
      defensa: 3,
      resistencia: 12,
      precision: 74,
      suerte: 3,
      iniciativa: 5,
      movimiento: 4,
    },
    damage: "magico",
    traits: [],
  },
  {
    id: "caballeria",
    name: "Caballería",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 5,
    rarity: rarityForTier(5),
    icon: "🐎",
    skills: {
      vida: 48,
      ataque: 16,
      defensa: 9,
      resistencia: 4,
      precision: 76,
      suerte: 4,
      iniciativa: 10,
      movimiento: 7,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🐾", label: "Ágil" },
      { icon: "💥", label: "Golpe crítico" },
    ],
  },
  {
    id: "grifo",
    name: "Grifo",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 6,
    rarity: rarityForTier(6),
    icon: "🦅",
    skills: {
      vida: 62,
      ataque: 19,
      defensa: 11,
      resistencia: 6,
      precision: 80,
      suerte: 5,
      iniciativa: 14,
      movimiento: 9,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🦅", label: "Volador" },
      { icon: "💥", label: "Golpe crítico" },
      { icon: "🐾", label: "Ágil" },
    ],
  },
  {
    id: "paladin",
    name: "Paladín",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "✝️",
    skills: {
      vida: 96,
      ataque: 24,
      defensa: 22,
      resistencia: 14,
      precision: 85,
      suerte: 6,
      iniciativa: 9,
      movimiento: 5,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😱", label: "Inmune al miedo" },
    ],
  },
  {
    id: "dragon-dorado",
    name: "Dragón dorado",
    kind: "unidad",
    race: "Humanos",
    raceIcon: "👤",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "🐉",
    // El techo de Humanos: cuatro Características, tres cifras de Vida y trece
    // caracteres de nombre, justo el límite del escalón de rótulo (LONG_NAME).
    skills: {
      vida: 240,
      ataque: 48,
      defensa: 30,
      resistencia: 28,
      precision: 90,
      suerte: 8,
      iniciativa: 12,
      movimiento: 9,
    },
    damage: "cuerpo",
    traits: [
      { icon: "🦅", label: "Volador" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "🔥", label: "Fuego" },
      { icon: "💣", label: "Explosivo" },
    ],
  },
];

// --- Tres de los cuatro héroes de 👤 Humanos ------------------------------
// razas.md §"Razas y clases › 👤 Humanos" y §"Tabla de características de
// héroes", en su orden. De los cuatro (⚔️ Guerrero, 🔮 Mago, ✝️ Sacerdote,
// 🏹 Arquero) están los TRES QUE YA ESTÁN DIBUJADOS: son el primer arte
// definitivo de V3 y por eso mandan sobre cualquier relleno de v2. Falta el
// 🏹 Arquero, que todavía no tiene ilustración.
//
// El 🔮 Mago choca de nombre con la unidad 🔮 Mago, y el 🏹 Arquero chocaría
// con la unidad 🏹 Arquero. Antes lo esquivaba dejando fuera al Mago; ahora
// que tiene arte entra, y la colisión se ve en la página — que es donde tiene
// que verse. Es un problema del catálogo de razas.md, no del marco.
//
// Los tres comparten HERO_RAIL: los héroes tienen color propio y no un escalón
// de la escala de rareza, que no les corresponde. Ver ahí el porqué.
export const HEROES: readonly Subject[] = [
  {
    id: "heroe-guerrero",
    name: "Guerrero",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "⚔️",
    art: ART_V3("guerrero"),
    skills: {
      vida: 120,
      ataque: 22,
      defensa: 20,
      resistencia: 8,
      precision: 82,
      suerte: 5,
      iniciativa: 8,
      movimiento: 5,
    },
    damage: "cuerpo",
    // Esta ficha fue la que destapó el problema del glifo repetido: Último
    // aliento llevaba 🛡️, igual que Resistente al daño físico, y en un marco que
    // dibuja las Características como glifos y sin texto la carta enseñaba el
    // mismo icono dos veces. Resuelto en razas.md (22-ago-2026) dándole 😤, que
    // además deja de mentir: Último aliento es un buff de daño, no de defensa.
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😱", label: "Inmune al miedo" },
      { icon: "😤", label: "Último aliento" },
    ],
  },
  {
    id: "heroe-mago",
    name: "Mago",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "🔮",
    art: ART_V3("mago"),
    skills: {
      vida: 78,
      ataque: 14,
      defensa: 9,
      resistencia: 26,
      precision: 80,
      suerte: 6,
      iniciativa: 7,
      movimiento: 5,
    },
    damage: "magico",
    // El héroe con menos Características del set: es el que enseña el raíl
    // corto. Tenía dos y se queda en una — ✨ Ataque mágico dejó de ser rasgo
    // el 23-ago-2026 y ahora es el campo `damage`, que se dibuja en el icono
    // del Ataque. Ese hueco liberado es justo lo que compra el campo nuevo.
    traits: [{ icon: "🧊", label: "Resistente al frío" }],
  },
  {
    id: "heroe-sacerdote",
    name: "Sacerdote",
    kind: "heroe",
    race: "Humanos",
    raceIcon: "👤",
    rarity: HERO_RAIL,
    icon: "✝️",
    art: ART_V3("sacerdote"),
    skills: {
      vida: 84,
      ataque: 11,
      defensa: 12,
      resistencia: 20,
      precision: 77,
      suerte: 7,
      iniciativa: 7,
      movimiento: 5,
    },
    damage: "magico",
    traits: [{ icon: "😱", label: "Inmune al miedo" }],
  },
];

// --- Fuera de la raza piloto ----------------------------------------------
// Humanos llega a cuatro Características y a trece caracteres de nombre. El
// catálogo llega a cinco y a dieciocho, y esa diferencia es justo la que
// revienta un raíl o una cenefa que iba justa. Va aparte para que se vea que
// no forma parte de la plantilla de la raza.
export const STRESS: readonly Subject[] = [
  {
    id: "dragon-esqueletico",
    name: "Dragón esquelético",
    kind: "unidad",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "🐉",
    skills: {
      vida: 210,
      ataque: 44,
      defensa: 26,
      resistencia: 32,
      precision: 86,
      suerte: 4,
      iniciativa: 11,
      movimiento: 9,
    },
    damage: "cuerpo",
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🦅", label: "Volador" },
      { icon: "🧊", label: "Hielo" },
      { icon: "😱", label: "Inmune al miedo" },
      { icon: "🧪", label: "Inmune a estados alterados" },
    ],
  },
];

export const SUBJECTS: readonly Subject[] = [...UNITS, ...HEROES, ...STRESS];

/** Nombre a partir del cual el rótulo baja de escalón (sketch-font "name-long"). */
export const LONG_NAME = 13;
