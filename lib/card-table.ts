// =========================================================================
// Tabla de catálogo (markdown) → cartas
//
// La FUENTE ÚNICA de verdad de cada carta es su fila en la tabla de
// docs/cards/*.md. Este módulo la proyecta a un CardRecord para poder pintar
// la misma fila como carta, así que la vista tabla y la vista cartas de un
// apartado no pueden divergir: si editas el .md cambian las dos.
//
// Se consume desde dos sitios, siempre sobre el markdown EN CRUDO:
//   - lib/remark-card-table.ts  → la vista cartas de cada apartado de la wiki.
//   - lib/card-catalog.ts       → el catálogo completo del lab de diseño.
//
// Trabajar con el texto en crudo (y no con el mdast) es lo que permite tener
// un solo camino de extracción para los dos: el plugin remark corta el trozo
// de fuente de la tabla y lo manda aquí igual que lo hace el catálogo.
//
// OPT-IN: una tabla solo se convierte en cartas si lleva encima su directiva
//   <!-- cards: <categoría> [clave=valor]... -->
// (ver parseCardDirective). Es deliberado: en docs/cards/ hay tablas que NO
// son catálogo (la fórmula de CA de armor.md §1, las progresiones de rareza
// de weapons.md §5, el reparto de fichas de encounter.md §5) y no deben salir
// como cartas.
// =========================================================================

import { RARITY_LABEL_TO_LEVEL } from "./rarity";
import { SEVERITY_LABEL_TO_LEVEL, type SeverityLevel } from "./severity";
import { artFor } from "./card-art";

export type CardCategory =
  | "clase"
  | "arma"
  | "armadura"
  | "item"
  | "maldicion"
  | "mercenario"
  | "encuentro";

export type DamageType =
  | "cortante"
  | "perforante"
  | "contundente"
  | "arcano"
  | "radiante"
  | "fuego"
  | "necrotico";

export type CardWeight = "ligera" | "media" | "pesada";
export type Hands = "1h" | "2h";

export type CardStat = { k?: string; v?: string; label?: string };

export type CardRecord = {
  id: string;
  category: CardCategory;
  /** Raíl de color: nivel de rareza o rareza de categoría ($rarity en _colors.scss). */
  rarity: string;
  name: string;
  /** Markdown en línea (negritas incluidas), ya limpio de referencias a docs. */
  text: string;
  emoji: string;
  stats: CardStat[];
  /** Icono del badge; sin él manda el de la categoría (CATEGORY_BADGE). */
  badge?: string;
  cost?: string;
  hands?: Hands;
  damageType?: DamageType;
  weight?: CardWeight;
  severity?: SeverityLevel;
  legendary?: boolean;
};

export const CATEGORIES: { key: CardCategory; label: string }[] = [
  { key: "clase", label: "Clase" },
  { key: "arma", label: "Arma" },
  { key: "armadura", label: "Armadura" },
  { key: "item", label: "Item" },
  { key: "maldicion", label: "Maldición" },
  { key: "mercenario", label: "Mercenario" },
  { key: "encuentro", label: "Encuentro" },
];

const CATEGORY_KEYS = new Set<string>(CATEGORIES.map((c) => c.key));

// Raíl de color por defecto de las categorías que no llevan columna Rareza
// (las cartas de clase no tienen rareza por diseño, class.md §3.3).
const CATEGORY_RARITY: Partial<Record<CardCategory, string>> = {
  clase: "clase",
  maldicion: "maldicion",
  encuentro: "enemigo",
};

// --- Directiva ------------------------------------------------------------

export type CardDirective = {
  category: CardCategory;
  /** Pisa el raíl de color de toda la tabla (`rareza=…`). */
  rarity?: string;
  /** Peso de la armadura cuando vive en el encabezado y no en una columna. */
  weight?: CardWeight;
  /** Fichas fijas que se añaden al pie de todas las cartas de la tabla. */
  chips?: string[];
  /** Icono del badge para toda la tabla (`icono=…`). */
  badge?: string;
};

const DIRECTIVE_RE = /^<!--\s*cards:\s*([\s\S]*?)\s*-->\s*$/;
// clave=valor, con valor entrecomillado si lleva espacios.
const OPTION_RE = /(\w+)=(?:"([^"]*)"|(\S+))/g;

const WEIGHTS = new Set<string>(["ligera", "media", "pesada"]);

/**
 * Lee `<!-- cards: arma -->` / `<!-- cards: armadura peso=media fichas="Ligera" -->`.
 * Devuelve null si el comentario no es una directiva de cartas (o si pide una
 * categoría o un peso que no existen: mejor no pintar cartas que pintar una
 * carta con un raíl de color inventado).
 */
export function parseCardDirective(html: string): CardDirective | null {
  const m = html.trim().match(DIRECTIVE_RE);
  if (!m) return null;

  const body = m[1].trim();
  const category = body.split(/\s+/)[0];
  if (!CATEGORY_KEYS.has(category)) return null;

  const dir: CardDirective = { category: category as CardCategory };
  for (const opt of body.slice(category.length).matchAll(OPTION_RE)) {
    const key = opt[1].toLowerCase();
    const value = opt[2] ?? opt[3];
    if (key === "rareza") dir.rarity = value;
    else if (key === "peso" && WEIGHTS.has(value)) dir.weight = value as CardWeight;
    else if (key === "fichas") dir.chips = value.split(",").map((s) => s.trim()).filter(Boolean);
    else if (key === "icono") dir.badge = value;
  }
  return dir;
}

/** ¿El documento trae alguna tabla marcada como catálogo de cartas? */
export function hasCardDirective(md: string): boolean {
  return /^\s*<!--\s*cards:/m.test(md);
}

// --- Troceado de la tabla -------------------------------------------------

const EMPTY_CELL = new Set(["", "—", "–", "-", "n/a"]);

/** Parte una fila GFM en celdas, respetando los `\|` escapados. */
function splitRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\\" && line[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (ch === "|") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  // Los pipes de apertura y cierre dejan una celda vacía en cada punta.
  if (cells.length && cells[0].trim() === "") cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === "") cells.pop();
  return cells.map((c) => c.trim());
}

const DELIMITER_ROW = /^[\s|:-]+$/;

/** Trocea el bloque de una tabla GFM en encabezados + filas de markdown en crudo. */
export function splitTable(source: string): { headers: string[]; rows: string[][] } | null {
  const lines = source
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 3) return null; // encabezado + delimitador + ≥1 fila

  const headers = splitRow(lines[0]);
  if (!DELIMITER_ROW.test(lines[1])) return null;
  const rows = lines.slice(2).map(splitRow).filter((r) => r.some((c) => c.length > 0));
  return rows.length ? { headers, rows } : null;
}

// --- Texto ----------------------------------------------------------------

/** Quita acentos y normaliza para comparar encabezados y valores. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Quita los selectores de variación para comparar emojis (🗡️ vs 🗡). */
function normIcon(s: string): string {
  return s.replace(/[\ufe0e\ufe0f]/g, "").trim();
}

/** Markdown en línea → texto plano. Para encabezados, nombres y valores de ficha. */
function plain(md: string): string {
  return md
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // enlaces e imágenes → su etiqueta
    .replace(/\*\*?|__?|`|~~/g, "") //            marcas de énfasis (el ~ suelto es texto)
    .replace(/\s+/g, " ")
    .trim();
}

function isEmpty(md: string): boolean {
  return EMPTY_CELL.has(norm(plain(md)));
}

// Referencias a otros documentos: en la tabla son navegación útil, pero en una
// carta de 260px son ruido que se come el espacio del efecto ("**Desventaja**
// (../effects.md) en tu primera tirada"). Se recortan solo para la carta; la
// tabla, que es la fuente, queda intacta.
const DOC_LINK = /!?\[[^\]]*\]\(\s*[^)\s]*\.md[^)]*\)/g; // [`../effects.md`](../effects.md)
const DOC_CODE = /`[^`]*\.md[^`]*`/g; //                    `../game-design.md`
// Grupo entre paréntesis, con las marcas de énfasis que lo envuelvan —los docs
// escriben apartes en cursiva: *(Requiere el sistema de grupos…)*.
const PARENS = /\s*\*{0,3}\([^()]*\)\*{0,3}/g;
// Marca temporal de una referencia ya quitada. Sin paréntesis a propósito: es
// lo que permite localizar el grupo que la contenía con un regex sin anidado.
const REF = "\u0000";
// Grupo que solo cita un § del propio documento: "(§4b)", "(§2c y §8)".
const ONLY_SECTION = /^[\s*(]*§[\w.]*(?:\s*(?:[,;]|y|o)\s*§[\w.]*)*[\s*)]*$/;

/**
 * Cuerpo de la carta: el markdown de la celda de efecto sin las referencias a
 * documentación. Conserva negritas y dados, que es lo que hay que poder leer
 * en la carta.
 *
 * Cuando la referencia era el motivo del paréntesis se va el paréntesis
 * entero, no solo la ruta: si no, quedan muñones ("ver checklist de .",
 * "arriesga una emboscada (roba del )"). Los paréntesis con contenido propio
 * —"(alcance 4 hex)", "(salvación DES por mitad)"— se quedan.
 */
export function cardText(md: string): string {
  if (isEmpty(md)) return "";
  return md
    .replace(DOC_LINK, REF)
    .replace(DOC_CODE, REF)
    .replace(PARENS, (group) => (group.includes(REF) || ONLY_SECTION.test(group) ? "" : group))
    .split(REF)
    .join("") // referencias que iban fuera de paréntesis
    .replace(/\s*\(\s*\)/g, "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Longitud del texto ya renderizado, para elegir el escalón de ajuste. */
export function textLength(md: string): number {
  return plain(md).length;
}

// --- Roles de columna -----------------------------------------------------

// Columnas que aportan el cuerpo de la carta. El resto de columnas que no se
// reconocen acaban como ficha en el pie con su encabezado como etiqueta, así
// que una columna nueva en un .md aparece en la carta sin tocar código.
const TEXT_HEADERS = new Set(["efecto", "propiedades", "notas", "descripcion", "que hace"]);

const DAMAGE_BY_ICON: Record<string, DamageType> = {
  "🗡": "cortante",
  "🏹": "perforante",
  "🔨": "contundente",
  "🔮": "arcano",
  "☀": "radiante",
  "🔥": "fuego",
  "💀": "necrotico",
};

const WEIGHT_BY_ICON: Record<string, CardWeight> = {
  "🥼": "ligera",
  "👕": "media",
  "🧥": "pesada",
};

const HANDS_BY_ICON: Record<string, Hands> = {
  "✋": "1h",
  "🤲": "2h",
};

// Valores de la columna "Tipo" cuando significa coste de activación
// (game-design.md §4b.3) en vez de tipo de daño.
const ACTION_VALUES = new Set([
  "accion",
  "accion rapida",
  "modificador",
  "pasiva",
  "fuera de combate",
]);

type Role =
  | { kind: "name" }
  | { kind: "text" }
  | { kind: "rarity" }
  | { kind: "severity" }
  | { kind: "hands" }
  | { kind: "weight" }
  | { kind: "damage" }
  | { kind: "cost" }
  | { kind: "stat"; k: string };

/** ¿Todos los valores no vacíos de la columna están en `set` (comparando iconos)? */
function allIcons(values: string[], set: Record<string, unknown>): boolean {
  const filled = values.filter((v) => !isEmpty(v));
  return filled.length > 0 && filled.every((v) => normIcon(plain(v)) in set);
}

function allActions(values: string[]): boolean {
  const filled = values.filter((v) => !isEmpty(v));
  return filled.length > 0 && filled.every((v) => ACTION_VALUES.has(norm(plain(v))));
}

// El rol de una columna sale de su encabezado y, cuando el encabezado es
// ambiguo, de sus valores: "Tipo" es el tipo de daño en weapons.md (🗡️/🏹/🔨)
// pero el coste de activación en class.md (Acción / Acción rápida). Mirar los
// valores evita tener que configurar el mapeo documento a documento.
function roleFor(header: string, values: string[], index: number): Role {
  const h = norm(plain(header));
  if (index === 0) return { kind: "name" };
  if (TEXT_HEADERS.has(h)) return { kind: "text" };
  if (h === "rareza") return { kind: "rarity" };
  if (h === "severidad") return { kind: "severity" };
  if (h === "manos") return { kind: "hands" };
  if (h === "peso") return { kind: "weight" };
  if (allIcons(values, DAMAGE_BY_ICON)) return { kind: "damage" };
  if (allIcons(values, WEIGHT_BY_ICON)) return { kind: "weight" };
  if (allIcons(values, HANDS_BY_ICON)) return { kind: "hands" };
  if (allActions(values)) return { kind: "cost" };
  return { kind: "stat", k: plain(header) };
}

// --- Proyección -----------------------------------------------------------

function slugify(s: string): string {
  return norm(s).replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Proyecta una tabla de catálogo a cartas.
 *
 * @param source  Bloque de la tabla, markdown en crudo (con su fila de encabezados).
 * @param dir     Directiva de la tabla (categoría y ajustes del apartado).
 * @param idPrefix Prefijo de los ids, para que sean únicos al juntar catálogos.
 */
export function cardsFromTable(
  source: string,
  dir: CardDirective,
  idPrefix = ""
): CardRecord[] {
  const table = splitTable(source);
  if (!table) return [];

  const { headers, rows } = table;
  const column = (i: number) => rows.map((r) => r[i] ?? "");
  const roles = headers.map((h, i) => roleFor(h, column(i), i));

  return rows.map((row, n) => {
    const card: CardRecord = {
      id: "",
      category: dir.category,
      rarity: dir.rarity ?? CATEGORY_RARITY[dir.category] ?? "comun",
      name: "",
      text: "",
      emoji: "",
      stats: [],
      badge: dir.badge,
      weight: dir.weight,
    };

    roles.forEach((role, i) => {
      const cell = row[i] ?? "";
      if (role.kind === "name") {
        card.name = plain(cell);
        return;
      }
      if (isEmpty(cell)) return;

      switch (role.kind) {
        case "text": {
          const body = cardText(cell);
          // Varias columnas de texto (armor.md §4 trae Requisito y Notas) se
          // encadenan en el orden de la tabla.
          card.text = card.text ? `${card.text} ${body}` : body;
          break;
        }
        case "rarity": {
          const level = RARITY_LABEL_TO_LEVEL[plain(cell)];
          if (level) card.rarity = level;
          break;
        }
        case "severity": {
          card.severity = SEVERITY_LABEL_TO_LEVEL[plain(cell)];
          break;
        }
        case "hands":
          card.hands = HANDS_BY_ICON[normIcon(plain(cell))];
          break;
        case "weight":
          card.weight = WEIGHT_BY_ICON[normIcon(plain(cell))] ?? card.weight;
          break;
        case "damage":
          card.damageType = DAMAGE_BY_ICON[normIcon(plain(cell))];
          break;
        case "cost":
          card.cost = plain(cell);
          break;
        case "stat":
          card.stats.push({ k: role.k, v: plain(cell) });
          break;
      }
    });

    for (const chip of dir.chips ?? []) card.stats.push({ label: chip });

    card.legendary = card.rarity === "legendario";
    card.emoji = artFor(card.name, dir.category);
    // El nombre puede repetirse dentro de una misma tabla (Espada ✋ y Espada
    // 🤲 en weapons.md §1), de ahí el índice de fila en el id.
    card.id = `${idPrefix}${slugify(card.name)}-${n}`;
    return card;
  });
}

/**
 * Recorre un documento markdown entero y devuelve las tablas marcadas con la
 * directiva, ya proyectadas a cartas. Lo usa el catálogo del lab; la wiki
 * pasa por el plugin remark, que trabaja tabla a tabla.
 */
export function cardTablesInDoc(
  md: string,
  idPrefix = ""
): { directive: CardDirective; heading: string; cards: CardRecord[] }[] {
  const lines = md.split("\n");
  const out: { directive: CardDirective; heading: string; cards: CardRecord[] }[] = [];
  let heading = "";

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^#{2,4}\s+(.+?)\s*$/);
    if (headingMatch) {
      heading = plain(headingMatch[1]);
      continue;
    }
    const directive = parseCardDirective(lines[i]);
    if (!directive) continue;

    // La tabla es el siguiente bloque no vacío; se corta al primer hueco.
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    const start = j;
    while (j < lines.length && lines[j].trim() !== "") j++;
    if (j === start) continue;

    const cards = cardsFromTable(
      lines.slice(start, j).join("\n"),
      directive,
      `${idPrefix}${slugify(heading)}-`
    );
    if (cards.length) out.push({ directive, heading, cards });
    i = j;
  }
  return out;
}
