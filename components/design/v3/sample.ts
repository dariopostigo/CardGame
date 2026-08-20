// =========================================================================
// Sujetos de muestra de los bocetos de marco V3
//
// El lab de v2 (components/design/CardDesignLab.tsx) pinta el catálogo REAL,
// leído de las tablas de docs/v2/cards/*.md. Este no puede: docs/v3/cards/ no
// tiene todavía ni una tabla, así que los sujetos se escriben aquí a mano.
//
// Están elegidos para reventar el marco, no para lucirlo. La lista sale de
// docs/v3/razas.md §"Características de todas las unidades" y cubre el rango
// entero de los dos ejes que deforman la carta:
//
//   · Características: de 0 (🗡️ Miliciano) a 5 (🐉 Dragón esquelético).
//   · Vida: de dos cifras a tres.
//
// OJO con el 5: knowledge/v3/card-concept/README.md dice "de 0 a 4 chips",
// pero en razas.md hay SEIS unidades de tier 8 con cinco Características
// (Dragón esquelético, Balor, Dragón ancestral, Kraken ancestral, Coloso
// mecánico y Abominación de plaga). El marco tiene que aguantar cinco, y por
// eso el Dragón esquelético está en esta lista aunque no sea de Humanos.
//
// LOS NÚMEROS SON INVENTADOS. docs/v3/razas.md avisa de que los valores de las
// 8 Habilidades siguen pendientes; aquí solo importa su FORMA (una, dos o tres
// cifras), que es lo que decide si el hueco del número se rompe.
// =========================================================================

/** Las 8 Habilidades, en el orden de docs/v3/razas.md §"Habilidades". */
export const SKILLS = [
  { key: "vida", label: "Vida", icon: "❤️" },
  { key: "ataque", label: "Ataque", icon: "⚔️" },
  { key: "defensa", label: "Defensa", icon: "🛡️" },
  { key: "resistencia", label: "Resistencia mágica", icon: "🔮" },
  { key: "precision", label: "Precisión", icon: "🎯" },
  { key: "suerte", label: "Suerte", icon: "🍀" },
  { key: "velocidad", label: "Velocidad", icon: "⚡" },
  { key: "movimiento", label: "Movimiento", icon: "👢" },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

/** Las cuatro que el boceto B saca a las esquinas, en orden de esquina. */
export const CORNER_SKILLS: readonly SkillKey[] = ["vida", "ataque", "defensa", "velocidad"];

/** Las otras cuatro, las que ese mismo boceto manda a la tira fina. */
export const STRIP_SKILLS: readonly SkillKey[] = SKILLS.map((s) => s.key).filter(
  (k) => !CORNER_SKILLS.includes(k)
);

export type Trait = { icon: string; label: string };

export type Subject = {
  readonly id: string;
  readonly name: string;
  readonly race: string;
  /** Emoji de la raza, el que usa docs/v3/razas.md. */
  readonly raceIcon: string;
  readonly tier: number;
  /** Clave de $rarity (styles/settings/_colors.scss) — ver rarityForTier(). */
  readonly rarity: string;
  /** Emoji de la unidad: hace de ilustración cuando no hay imagen. */
  readonly icon: string;
  /**
   * Ilustración de relleno. Son las cuatro cartas de clase de v2
   * (public/assets/v2/cards/class/), lo único dibujado que hay: V3 todavía no
   * tiene arte propio y public/assets/v3/ está vacío. Son APAISADAS, así que
   * en un marco vertical se recortan por los lados — con eso basta para juzgar
   * el marco, y de paso enseña por qué el lienzo heredado no sirve.
   */
  readonly art?: string;
  readonly skills: Record<SkillKey, number>;
  readonly traits: readonly Trait[];
};

const ART = (slug: string) => `/assets/v2/cards/class/${slug}/cards_class_${slug}.png`;

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

export const SUBJECTS: readonly Subject[] = [
  {
    id: "miliciano",
    name: "Miliciano",
    race: "Humanos",
    raceIcon: "👤",
    tier: 1,
    rarity: rarityForTier(1),
    icon: "🗡️",
    art: ART("guerrero"),
    // El caso vacío: cero Características y todo a una cifra menos la Vida.
    // Es el que descubre los huecos que se ven vacíos.
    skills: {
      vida: 18,
      ataque: 6,
      defensa: 4,
      resistencia: 1,
      precision: 7,
      suerte: 0,
      velocidad: 5,
      movimiento: 4,
    },
    traits: [],
  },
  {
    id: "arquero",
    name: "Arquero",
    race: "Humanos",
    raceIcon: "👤",
    tier: 2,
    rarity: rarityForTier(2),
    icon: "🏹",
    art: ART("picaro"),
    skills: {
      vida: 15,
      ataque: 7,
      defensa: 3,
      resistencia: 1,
      precision: 9,
      suerte: 2,
      velocidad: 6,
      movimiento: 4,
    },
    traits: [{ icon: "🏹", label: "Ataque a distancia" }],
  },
  {
    id: "mago",
    name: "Mago",
    race: "Humanos",
    raceIcon: "👤",
    tier: 4,
    rarity: rarityForTier(4),
    icon: "🔮",
    art: ART("mago"),
    skills: {
      vida: 24,
      ataque: 5,
      defensa: 3,
      resistencia: 12,
      precision: 8,
      suerte: 3,
      velocidad: 5,
      movimiento: 4,
    },
    traits: [{ icon: "🔮", label: "Resistencia mágica" }],
  },
  {
    id: "paladin",
    name: "Paladín",
    race: "Humanos",
    raceIcon: "👤",
    tier: 7,
    rarity: rarityForTier(7),
    icon: "✝️",
    art: ART("clerigo"),
    skills: {
      vida: 96,
      ataque: 24,
      defensa: 22,
      resistencia: 14,
      precision: 16,
      suerte: 6,
      velocidad: 9,
      movimiento: 5,
    },
    traits: [
      { icon: "🛡️", label: "Resistente al daño físico" },
      { icon: "😱", label: "Inmune al miedo" },
      { icon: "🔮", label: "Resistencia mágica" },
    ],
  },
  {
    id: "dragon-dorado",
    name: "Dragón dorado",
    race: "Humanos",
    raceIcon: "👤",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "🐉",
    // Sin arte: no hay dragón dibujado, así que se cae al emoji gigante. El
    // hueco de arte tiene que sostener las dos cosas.
    skills: {
      vida: 240,
      ataque: 48,
      defensa: 30,
      resistencia: 28,
      precision: 18,
      suerte: 8,
      velocidad: 12,
      movimiento: 9,
    },
    traits: [
      { icon: "🪽", label: "Volador" },
      { icon: "🔥", label: "Inmune al fuego" },
      { icon: "🔥", label: "Fuego" },
      { icon: "💣", label: "Explosivo" },
    ],
  },
  {
    id: "dragon-esqueletico",
    name: "Dragón esquelético",
    race: "No-muertos",
    raceIcon: "💀",
    tier: 8,
    rarity: rarityForTier(8),
    icon: "🐉",
    // El caso lleno, y por partida doble: CINCO Características y el nombre
    // más largo del catálogo (18 caracteres). Es el que rompe los bocetos.
    skills: {
      vida: 210,
      ataque: 44,
      defensa: 26,
      resistencia: 32,
      precision: 15,
      suerte: 4,
      velocidad: 11,
      movimiento: 9,
    },
    traits: [
      { icon: "💀", label: "No-muerto" },
      { icon: "🪽", label: "Volador" },
      { icon: "🧊", label: "Congelación" },
      { icon: "😱", label: "Inmune al miedo" },
      { icon: "🧪", label: "Inmune a estados alterados" },
    ],
  },
];

/** Nombre a partir del cual el rótulo baja de escalón (sketch-font "name-long"). */
export const LONG_NAME = 13;
