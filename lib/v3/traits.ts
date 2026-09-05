// =========================================================================
// El catálogo de Características — V3
//
// Las 41 Características de razas.md §"Características de los personajes", en
// seis grupos. Son la mitad no numérica de una ficha: las 8 Habilidades dicen
// cuánto, el tipo de daño dice de qué clase, y estas dicen QUÉ TIENE DE RARO
// esta ficha y no las otras 131.
//
// SE LEEN DEL MARKDOWN, NO SE COPIAN. Es la regla del pipeline
// (ARCHITECTURE.md §7 y su anti-patrón "transcribir a mano cifras que están en
// los documentos"), y aquí no es preventiva: la copia ya existe y ya divergió.
// `components/design/v3/sample.ts` y `races.ts` llevan escritos a mano los
// nombres, los emojis y los rasgos de cuatro razas —sesenta fichas— porque el
// marco de carta necesitaba sujetos antes de que existiera nada de esto. Su
// propia cabecera avisa de que los números son inventados. Lo que este archivo
// impide es que también lo sea el catálogo.
//
// LA FUENTE ES knowledge/, NO docs/. Las razas se están redefiniendo en
// `knowledge/v3/races-concept/razas.md`, que es el archivo que se edita;
// `docs/v3/razas.md` está congelado porque lo lee la wiki (AGENTS.md). Hoy los
// dos apartados de Características son idénticos byte a byte, así que la
// elección no cambia nada de lo que sale — cambia de quién se entera este
// laboratorio cuando el catálogo se mueva, y tiene que ser del que se edita.
//
// PARTIDO EN DOS COMO card-table/card-catalog: aquí el parseo, que es puro y se
// puede probar con una cadena; en `traits-catalog.ts` el `node:fs`, que es
// solo-servidor. Sin ese corte, importar el catálogo desde un componente de
// cliente mete `fs` en el bundle y el build de Turbopack se cae.
//
// FALLA RUIDOSAMENTE, también por la regla del §7: si el apartado no está donde
// se espera, si aparece un grupo que no conocemos o si una línea no tiene la
// forma de siempre, esto lanza con el número de línea. Un catálogo que se queda
// corto en silencio es peor que uno que no carga: la ficha seguiría validando
// y el rasgo que falta no existiría para nadie.
// =========================================================================

/** Los seis grupos del apartado, en el orden en que están escritos. */
export type TraitGroupId =
  | "ofensivas"
  | "elementales"
  | "resistencias"
  | "supervivencia"
  | "movimiento"
  | "percepcion";

export type TraitGroup = {
  readonly id: TraitGroupId;
  /** Rótulo del `###`, sin su emoji. Es con lo que se casa el parseo. */
  readonly heading: string;
  /** Como se enseña en la interfaz, que no siempre es el rótulo entero. */
  readonly label: string;
  readonly icon: string;
};

export const TRAIT_GROUPS: readonly TraitGroup[] = [
  { id: "ofensivas", heading: "Ofensivas", label: "Ofensivas", icon: "⚔️" },
  {
    id: "elementales",
    heading: "Elementales y estados alterados",
    label: "Elementales y estados",
    icon: "🌪️",
  },
  {
    id: "resistencias",
    heading: "Resistencias e inmunidades",
    label: "Resistencias e inmunidades",
    icon: "🛡️",
  },
  { id: "supervivencia", heading: "Supervivencia", label: "Supervivencia", icon: "💚" },
  { id: "movimiento", heading: "Movimiento y terreno", label: "Movimiento y terreno", icon: "🦅" },
  {
    id: "percepcion",
    heading: "Percepción y comportamiento",
    label: "Percepción y comportamiento",
    icon: "🧠",
  },
];

export const TRAIT_GROUPS_BY_ID: Readonly<Record<TraitGroupId, TraitGroup>> = Object.fromEntries(
  TRAIT_GROUPS.map((g) => [g.id, g]),
) as Record<TraitGroupId, TraitGroup>;

/** Una Característica del catálogo. */
export type Trait = {
  /**
   * Slug del nombre. Es la clave con la que una ficha la lleva, y sale del
   * NOMBRE y no del emoji a propósito: hay glifos repetidos (ver
   * `glyphClashes`) y no habría id única.
   */
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly description: string;
  readonly group: TraitGroupId;
};

// --- Parseo ---------------------------------------------------------------

/** Sin tildes, en minúsculas. Para comparar rótulos sin depender del acento. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Quita los selectores de variación para comparar emojis (🗡️ vs 🗡). Son marcas
 * Unicode como los acentos, así que las tumba el mismo `\p{M}` de arriba.
 */
function normIcon(s: string): string {
  return s.replace(/\p{M}/gu, "").trim();
}

function slug(s: string): string {
  return norm(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Un encabezado de markdown: nivel y texto, ya sin la almohadilla. */
function heading(line: string): { level: number; text: string } | null {
  const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
  return m ? { level: m[1].length, text: m[2] } : null;
}

/** El emoji de un rótulo `### ⚔️ Ofensivas` sobra para casar el grupo. */
function withoutIcon(text: string): string {
  return text.replace(/^[^\p{L}]+/u, "").trim();
}

const SECTION = "caracteristicas de los personajes";

/**
 * `- 💥 **Golpe crítico** — Tiene una probabilidad de…`
 *
 * El nombre va en negrita y la descripción detrás de una raya larga. El nombre
 * es perezoso porque lo cierra el `**`; la descripción es voraz porque puede
 * llevar rayas dentro (🧪 *Inmune a estados alterados* las lleva).
 */
const TRAIT_LINE = /^-\s+(\S+)\s+\*\*(.+?)\*\*\s+—\s+(.+?)\s*$/u;

/**
 * Las Características de un razas.md.
 *
 * Puro: entra el markdown, salen los rasgos. Lanza si el documento no tiene la
 * forma esperada, con la línea señalada.
 *
 * @param md - Contenido de razas.md.
 * @param source - Cómo se llama el archivo en el mensaje de error.
 */
export function parseTraits(md: string, source = "razas.md"): readonly Trait[] {
  const lines = md.split(/\r?\n/);
  const out: Trait[] = [];
  const byId = new Map<string, Trait>();

  let inSection = false;
  let group: TraitGroup | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const at = `${source}:${i + 1}`;
    const head = heading(line);

    if (head) {
      const text = norm(withoutIcon(head.text));
      // El apartado se abre con su `##` y se cierra con el siguiente del mismo
      // nivel — que es "🦸 Tabla de características de héroes", o sea el
      // roster, que no es de aquí (eso es el módulo de razas).
      if (head.level === 2) {
        inSection = text === SECTION;
        group = null;
        continue;
      }
      if (!inSection) continue;

      group =
        TRAIT_GROUPS.find((g) => norm(g.heading) === text) ??
        (() => {
          throw new Error(
            `${at}: grupo de Características desconocido, «${head.text}». Los que este catálogo conoce son: ${TRAIT_GROUPS.map((g) => g.heading).join(", ")}. Si el apartado ha ganado un grupo, hay que añadirlo a TRAIT_GROUPS.`,
          );
        })();
      continue;
    }

    if (!inSection || !group) continue;
    // Las notas en cita explican el catálogo pero no son catálogo. Van con `>`,
    // así que sus viñetas no llegan aquí; el descarte es explícito de todas
    // formas, porque de eso depende que la cuenta salga.
    if (/^\s*>/.test(line)) continue;
    if (!/^-\s/.test(line)) continue;

    const m = TRAIT_LINE.exec(line);
    if (!m) {
      throw new Error(
        `${at}: esta viñeta está en «${group.heading}» pero no tiene la forma de una Característica (\`- <emoji> **<nombre>** — <descripción>\`): ${line.trim()}`,
      );
    }

    const [, icon, label, description] = m;
    const trait: Trait = {
      id: slug(label),
      icon: icon.trim(),
      label: label.trim(),
      description: description.trim(),
      group: group.id,
    };

    const clash = byId.get(trait.id);
    if (clash) {
      throw new Error(
        `${at}: «${trait.label}» y «${clash.label}» dan la misma id (${trait.id}). Dos Características no pueden llamarse igual: una ficha no podría decir cuál lleva.`,
      );
    }
    byId.set(trait.id, trait);
    out.push(trait);
  }

  if (out.length === 0) {
    throw new Error(
      `${source}: no se ha encontrado ninguna Característica. Se esperaba un apartado «## … ${SECTION}» con sus grupos en \`###\`.`,
    );
  }

  return out;
}

// --- El tope de Características --------------------------------------------
// CUÁNTAS PUEDE LLEVAR UNA FICHA *(Dario, 5 de septiembre de 2026)*. Estaba en
// la lista de decisiones abiertas como «¿se congela en cinco o alguna raza puede
// pasarlo?», y contar las 132 dijo que esa no era la pregunta, por tres motivos.
//
// PRIMERO: EL RECUENTO YA ES UNA CURVA DE POTENCIA, y nadie la había declarado.
//
//   tier            1     2     3     4     5     6     7     8
//   media rasgos  1,18  1,27  2,00  1,91  2,00  2,55  3,27  4,36
//   máximo           2     2     3     3     3     4     4     5
//
// Sube monótona del tier 1 al 8, o sea que «cuántas Características llevas»
// funciona como un SEGUNDO EJE DE PROGRESIÓN en paralelo a la curva ×10 de las
// estadísticas (`TIER_CURVE` en character.ts). Un solo número no lo describe:
// dejaría que una unidad de tier 1 llevase cinco rasgos cuando su escalón tiene
// una media de 1,18.
//
// SEGUNDO: LOS HÉROES PARAN EN 3, y no de milagro — de los 44, seis llevan uno,
// dieciocho llevan dos y veinte llevan tres. Ninguno llega a cuatro. Un tope
// global no dice nada de la mitad del roster, así que los héroes llevan el suyo.
//
// TERCERO: EL MARCO NO ES LA RESTRICCIÓN. Medido en un navegador sobre la carta
// real (L · Lámina, 300×420): el raíl aguanta SIETE medallones antes de tocar el
// panel —con cinco le sobran 77,8 px, con siete 7,8, con ocho se mete dentro—.
// Así que el tope es una decisión de balance y no un límite de sitio.
//
// LA REGLA ES EL MÁXIMO OBSERVADO EN CADA TIER, escrito. Eso ratifica las 132
// tal y como están —cero fichas cambian— y es el mismo trato que ya recibió el
// encuadre de la ficha: la regla derivada reproduce lo que la mano había hecho,
// y por eso encodea la intención en vez de sustituirla. El precio está dicho:
// HOLGURA CERO. Una unidad nueva de tier 5 con cuatro rasgos rompe el tope, y
// eso es a propósito — que salte la comprobación es la conversación, no el bug.
//
// Y LA ETIQUETA DE TIPO OCUPA PLAZA COMO CUALQUIER OTRA *(la misma fecha)*. 💀
// No-muerto, 😈 Demonio, 🤖 Constructo y 🐺 Bestia dicen QUÉ ERES y no qué haces,
// y cuatro razas las llevan en sus doce fichas, así que se planteó sacarlas del
// recuento. No se sacan: son Características del catálogo y su texto tiene
// mecánica —💀 No-muerto dice literalmente «es inmune al miedo»—, y sacarlas
// daría a tres razas un rasgo más que a las otras ocho, gratis. Las razas con
// etiqueta gastan una plaza permanente en identidad: ese es su coste. Importa
// para lo que viene, porque las sub-facciones van a traer más etiquetas.

/**
 * Cuántas Características puede llevar una unidad, por tier. El índice 0 es el
 * tier 1.
 *
 * Es una tabla y no una fórmula porque la curva no es limpia —hay meseta en 3,
 * 4 y 5, y otra en 6 y 7—, igual que `TIER_CURVE` es una lista a mano. Salió de
 * contar el máximo de cada escalón en las 88 unidades de razas.md el 5 de
 * septiembre de 2026.
 */
export const TRAIT_CAP_BY_TIER: readonly number[] = [2, 2, 3, 3, 3, 4, 4, 5];

/**
 * El tope de un héroe, que no tiene tier.
 *
 * Los 44 se reparten 6 · 18 · 20 entre uno, dos y tres rasgos, y ninguno pasa de
 * ahí. No es que un héroe valga menos que una unidad de tier 8: es que lo que
 * distingue a un héroe es su clase, y la unidad solo tiene sus rasgos.
 */
export const HERO_TRAIT_CAP = 3;

/**
 * El tope de una ficha. `null` en el tier significa héroe.
 *
 * Lanza si el tier se sale de la escala, que es la única forma de que esto
 * devuelva un número que no significa nada.
 */
export function traitCap(tier: number | null): number {
  if (tier === null) return HERO_TRAIT_CAP;
  const cap = TRAIT_CAP_BY_TIER[tier - 1];
  if (cap === undefined) {
    throw new Error(
      `Tier ${tier} fuera de la escala: TRAIT_CAP_BY_TIER solo cubre del 1 al ${TRAIT_CAP_BY_TIER.length}.`,
    );
  }
  return cap;
}

// --- El roster, para poder comprobar el tope --------------------------------
// El apartado de arriba parsea el CATÁLOGO —qué rasgos existen—; esto parsea la
// ASIGNACIÓN —quién lleva cuáles—, que es lo único con lo que el tope se puede
// medir en vez de prometerse. Las dos tablas son regulares y el tier de una
// unidad es su orden en la de su raza, que es como está escrita la progresión.

export type RosterEntry = {
  /** Tal y como se escribe en la tabla: `👤 Humanos`. */
  readonly race: string;
  readonly name: string;
  readonly kind: "heroe" | "unidad";
  /** De 1 a 8 en una unidad; `null` en un héroe, que no tiene tier. */
  readonly tier: number | null;
  /** Las Características que lleva, con su emoji, como están escritas. */
  readonly traits: readonly string[];
};

const HERO_SECTION = "tabla de caracteristicas de heroes";
const UNIT_SECTION = "caracteristicas de todas las unidades";

/** `| a | b | c |` → `["a", "b", "c"]`, o `null` si no es una fila de tabla. */
function cells(line: string): string[] | null {
  if (!/^\s*\|/.test(line)) return null;
  const raw = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  if (/^[\s|:-]+$/.test(raw)) return null; // la fila de guiones
  return raw.split("|").map((c) => c.trim());
}

/** La celda de Características: `—` es ninguna, y el resto van con `·`. */
function traitCell(cell: string): readonly string[] {
  if (cell === "—" || cell === "") return [];
  return cell.split("·").map((t) => t.trim());
}

/**
 * Las 132 fichas de razas.md: los héroes de su tabla y las unidades de las suyas.
 *
 * Puro, como `parseTraits`, y falla igual de ruidosamente: una raza a la que le
 * falte una unidad desplazaría los tiers de todas las de debajo, y el tope se
 * mediría contra el escalón equivocado sin avisar.
 */
export function parseRoster(md: string, source = "razas.md"): readonly RosterEntry[] {
  const lines = md.split(/\r?\n/);
  const out: RosterEntry[] = [];
  const unitsPerRace = new Map<string, number>();

  let section: "heroes" | "unidades" | null = null;
  let race: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const at = `${source}:${i + 1}`;
    const head = heading(line);

    if (head) {
      if (head.level === 2) {
        const text = norm(withoutIcon(head.text));
        section = text === HERO_SECTION ? "heroes" : text === UNIT_SECTION ? "unidades" : null;
        race = null;
      } else if (head.level === 3 && section === "unidades") {
        race = head.text.trim();
      }
      continue;
    }

    const c = cells(line);
    if (!c || section === null) continue;

    if (section === "heroes") {
      // `| Raza | Héroe | Tipo de daño | Características |`, y su encabezado.
      if (c.length !== 4) continue;
      if (norm(c[0]) === "raza") continue;
      out.push({ race: c[0], name: c[1], kind: "heroe", tier: null, traits: traitCell(c[3]) });
      continue;
    }

    // `| Unidad | Tipo de daño | Características |`, bajo el `###` de su raza.
    if (c.length !== 3) continue;
    if (norm(c[0]) === "unidad") continue;
    if (race === null) {
      throw new Error(
        `${at}: una unidad fuera de la tabla de ninguna raza. Cada tabla de unidades cuelga de un \`###\` con el nombre de su raza, y de ese orden sale el tier.`,
      );
    }
    const tier = (unitsPerRace.get(race) ?? 0) + 1;
    unitsPerRace.set(race, tier);
    if (tier > TRAIT_CAP_BY_TIER.length) {
      throw new Error(
        `${at}: ${race} tiene más de ${TRAIT_CAP_BY_TIER.length} unidades. La progresión es de ${TRAIT_CAP_BY_TIER.length} tiers, así que la de más no tendría escalón.`,
      );
    }
    out.push({ race, name: c[0], kind: "unidad", tier, traits: traitCell(c[2]) });
  }

  const short = [...unitsPerRace.entries()].filter(([, n]) => n !== TRAIT_CAP_BY_TIER.length);
  if (short.length > 0) {
    throw new Error(
      `${source}: estas razas no tienen ${TRAIT_CAP_BY_TIER.length} unidades — ${short
        .map(([r, n]) => `${r} (${n})`)
        .join(", ")}. Con una de menos, todas las de debajo cambiarían de tier.`,
    );
  }
  if (out.length === 0) {
    throw new Error(
      `${source}: no se ha encontrado ninguna ficha. Se esperaban los apartados «${HERO_SECTION}» y «${UNIT_SECTION}».`,
    );
  }

  return out;
}

export type CapViolation = {
  readonly entry: RosterEntry;
  readonly cap: number;
  readonly count: number;
};

/**
 * Las fichas que se pasan del tope.
 *
 * Hoy devuelve vacío, y eso es el resultado y no un descuido: la regla se
 * escribió calcando el máximo de cada tier, así que ratifica las 132 tal y como
 * estaban. Queda de guardia para lo que venga —los 25 renombres, las
 * sub-facciones, las razas de DLC—, que es cuando una regla sin comprobación se
 * habría convertido en una nota que nadie mira.
 */
export function capViolations(roster: readonly RosterEntry[]): readonly CapViolation[] {
  return roster
    .map((entry) => ({ entry, cap: traitCap(entry.tier), count: entry.traits.length }))
    .filter((v) => v.count > v.cap);
}

// --- Glifos compartidos ---------------------------------------------------

/**
 * Las tres familias elementales comparten emoji A PROPÓSITO: 🔥 Fuego,
 * 🔥 Resistente al fuego y 🔥 Inmune al fuego son el mismo tema, y el glifo
 * compartido es lo que lo dice. Lo que falta por marcar es el PAPEL —hacer,
 * resistir o ser inmune—, y eso es tratamiento visual del icono, no otro
 * dibujo (knowledge/v3/card-concept/README.md §"Dos Características distintas
 * con el mismo emoji").
 */
const DELIBERATE_SHARED_ICONS: readonly string[] = ["🔥", "☠️", "🧊"];

export type GlyphClash = {
  readonly icon: string;
  readonly traits: readonly Trait[];
  /** Si es una de las familias elementales, que van así queriendo. */
  readonly deliberate: boolean;
};

/**
 * Los emojis que llevan dos o más Características.
 *
 * Hace falta porque en la carta las Características **no son texto**: son
 * glifos, uno al lado de otro. Dos rasgos con el mismo emoji en la misma ficha
 * enseñan el icono repetido y no hay nada que los distinga — le pasó al
 * ⚔️ Guerrero de Humanos, que llevaba 🛡️ Resistente al daño físico y 🛡️ Último
 * aliento, y se arregló en razas.md dándole a Último aliento su propio 😤.
 *
 * Se destapó a mano mirando una carta. Esto lo destapa solo.
 */
export function glyphClashes(traits: readonly Trait[]): readonly GlyphClash[] {
  const byIcon = new Map<string, Trait[]>();
  for (const t of traits) {
    const key = normIcon(t.icon);
    const list = byIcon.get(key);
    if (list) list.push(t);
    else byIcon.set(key, [t]);
  }

  const deliberate = new Set(DELIBERATE_SHARED_ICONS.map(normIcon));

  return [...byIcon.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([key, list]) => ({
      icon: list[0].icon,
      traits: list,
      deliberate: deliberate.has(key),
    }));
}

// --- Consulta -------------------------------------------------------------

/** Los rasgos de un grupo, en el orden del documento. */
export function traitsOfGroup(
  traits: readonly Trait[],
  group: TraitGroupId,
): readonly Trait[] {
  return traits.filter((t) => t.group === group);
}

export function traitsById(traits: readonly Trait[]): ReadonlyMap<string, Trait> {
  return new Map(traits.map((t) => [t.id, t]));
}
