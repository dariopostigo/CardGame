// Capa de datos de la wiki (solo servidor: usa node:fs).
// Lee los .md de docs/, construye el árbol de navegación, resuelve slugs y
// genera el índice de búsqueda.
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { docPathToRoute } from "@/lib/markdown-link";
import { hasCardDirective } from "@/lib/card-table";
import { DOCS_VERSIONS, type DocsVersion } from "@/lib/docs-version";
import { defaultStatusOf, isDocStatus, type DocStatus } from "@/lib/doc-status";

// Reexportado por comodidad: el servidor puede pedírselo todo a este módulo.
// El cliente NO — tiene que importar de "@/lib/docs-version" o de
// "@/lib/doc-status" directamente, o se lleva node:fs al bundle.
export * from "@/lib/docs-version";
export * from "@/lib/doc-status";

const DOCS_ROOT = path.join(process.cwd(), "docs");

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  /**
   * Lo que declara el documento en su `<!-- estado: … -->` (lib/doc-status.ts).
   * Sin directiva no hay estado: son los índices y los documentos vivos, que
   * no se etiquetan nunca.
   */
  status?: DocStatus;
};
export type NavGroup = {
  key: string;
  label: string;
  icon: string;
  items: NavItem[];
  /**
   * El estado que comparte la mayoría del grupo. Se pinta una vez en la
   * cabecera, y las entradas que lo tienen se callan: solo se etiqueta lo que
   * se sale de la norma. Null = no hay norma, cada una carga con la suya.
   */
  defaultStatus: DocStatus | null;
};
export type SearchHeading = { text: string; id: string };
export type SearchDoc = {
  href: string;
  title: string;
  group: string;
  headings: SearchHeading[];
  text: string;
};
export type Doc = {
  slug: string[];
  content: string;
  dir: string;
  title: string;
  /** Trae tablas de catálogo con vista cartas (lib/card-table.ts). */
  hasCards: boolean;
};

type FileRec = { abs: string; rel: string; dir: string; slug: string[] };

// El árbol vive partido en dos versiones, cada una con su propia wiki: v3 es
// el diseño vigente, v2 la base de conocimiento congelada. Comparten forma
// —las mismas cuatro carpetas— así que los grupos se generan en vez de
// escribirse dos veces.
//
// Los helpers de versión están en lib/docs-version.ts, que sí puede importarse
// desde el cliente: este módulo usa node:fs y no cruza esa frontera.

// Las cuatro carpetas de cada versión. Los grupos sin documentos se descartan
// solos en getNavTree(), así que una carpeta vacía no ensucia el menú.
const GROUP_SHAPE = [
  { key: "general", label: "General", icon: "pi pi-book", sub: "" },
  { key: "board", label: "Tablero", icon: "pi pi-map", sub: "board" },
  { key: "characters", label: "Personajes", icon: "pi pi-users", sub: "characters" },
  { key: "cards", label: "Cartas", icon: "pi pi-th-large", sub: "cards" },
];

const GROUPS = DOCS_VERSIONS.flatMap((version) =>
  GROUP_SHAPE.map((g) => ({
    key: `${version}-${g.key}`,
    label: g.label,
    icon: g.icon,
    dir: g.sub ? `${version}/${g.sub}` : version,
    version,
  })),
);

// Versión cuyas cartas alimentan el laboratorio de diseño. Sigue al CARDS_ROOT
// de lib/card-catalog.ts, y sigue en v2 para que el lab no se quede vacío
// mientras docs/v3/cards/ no tenga su primera tabla.
//
// El día que se mueva a "v3" hay que mover tres cosas a la vez: esta constante,
// CARDS_ROOT y la carpeta de la ruta — que desde el 3 de septiembre de 2026
// vuelve a ser app/docs/v3/cards/design/, la única que hay. Estuvo apuntando a
// .../deck/ desde el 25 de agosto, cuando se eligió el marco y la baraja se
// separó de los bocetos; borrada esa página al fundirse las dos, el destino es
// otra vez el de siempre.
const DESIGN_LAB_VERSION: DocsVersion = "v2";
const DESIGN_LAB_GROUP = `${DESIGN_LAB_VERSION}-cards`;

// La carta de V3 (app/docs/v3/cards/design/). UNA página propia, y ninguna la de
// arriba: aquella pinta el catálogo real de v2, y esta pinta un roster escrito a
// mano (components/design/v3/races.ts) porque docs/v3/cards/ no tiene tabla.
//
// FUERON DOS HASTA EL 3 DE SEPTIEMBRE DE 2026: "Diseño de cartas" comparaba los
// bocetos de marco sobre sujetos de muestra y "Diseño baraja" pintaba el elegido
// sobre el roster real. Era la separación entre una comparación y su resultado,
// y ese día se cerró la comparación —L · Lámina, tras doce bocetos; antes lo
// estuvo la J · Orla desde el 25 de agosto—, así que quedaban dos páginas
// pintando la misma carta con distintos sujetos delante. Se funden en la
// primera, que es la que da nombre a lo que hay: el diseño de la carta, con la
// baraja entera dentro.
//
// Lo que sigue abierto no es la carta, es el CATÁLOGO: los números de las 132
// fichas. Son dos ejes distintos —uno es qué pinta la carta, el otro qué lleva
// escrito—, y el día que docs/v3/cards/ tenga su primera tabla esta página
// hereda el catálogo real y la constante de arriba pasa a "v3" con sus tres
// mudanzas.
const SKETCH_LAB_GROUP = "v3-cards";

// Metadatos por documento (etiqueta corta + icono + orden dentro del grupo).
//
// El ESTADO no está aquí: lo declara cada .md con `<!-- estado: … -->`, que es
// donde no puede desincronizarse de lo que describe (lib/doc-status.ts).
const META: Record<string, { label: string; icon: string; order: number }> = {
  // --- V3 (diseño vigente) ---
  v3: { label: "V3 (índice)", icon: "pi pi-sparkles", order: 0 },
  "v3/game-design": { label: "Diseño del juego", icon: "pi pi-book", order: 1 },
  "v3/razas": { label: "Razas", icon: "pi pi-sitemap", order: 2 },
  "v3/glossary": { label: "Glosario", icon: "pi pi-list", order: 3 },
  "v3/status": { label: "Estado", icon: "pi pi-check-circle", order: 4 },
  "v3/ideas": { label: "Ideas", icon: "pi pi-lightbulb", order: 5 },
  "v3/effects": { label: "Efectos / Estados", icon: "pi pi-sparkles", order: 6 },
  "v3/board/board-map": { label: "Tablero y mapa", icon: "pi pi-map", order: 1 },
  "v3/board/battle": { label: "Tablero de batalla", icon: "pi pi-bolt", order: 2 },
  "v3/board/board-map-dev": { label: "Tablero (técnico)", icon: "pi pi-cog", order: 3 },
  "v3/characters/heroes": { label: "Héroes", icon: "pi pi-user", order: 1 },
  "v3/characters/enemies": { label: "Enemigos", icon: "pi pi-bolt", order: 2 },
  "v3/characters/npcs": { label: "NPCs", icon: "pi pi-users", order: 3 },
  "v3/cards": { label: "Cartas (índice)", icon: "pi pi-th-large", order: 0 },
  "v3/cards/class": { label: "Cartas de clase", icon: "pi pi-id-card", order: 1 },
  "v3/cards/units": { label: "Unidades", icon: "pi pi-users", order: 2 },
  "v3/cards/items": { label: "Items", icon: "pi pi-box", order: 3 },
  "v3/cards/curses": { label: "Maldiciones", icon: "pi pi-exclamation-triangle", order: 4 },
  "v3/cards/encounter": { label: "Mazo de encuentro", icon: "pi pi-clone", order: 5 },

  // --- v2 (congelado, solo consulta) ---
  v2: { label: "v2 (congelado)", icon: "pi pi-lock", order: 0 },
  "v2/game-design": { label: "Diseño del juego", icon: "pi pi-book", order: 1 },
  "v2/glossary": { label: "Glosario", icon: "pi pi-list", order: 2 },
  "v2/status": { label: "Estado", icon: "pi pi-check-circle", order: 3 },
  "v2/ideas": { label: "Ideas", icon: "pi pi-lightbulb", order: 4 },
  "v2/effects": { label: "Efectos / Estados", icon: "pi pi-sparkles", order: 5 },
  "v2/board/board-map": { label: "Tablero y mapa", icon: "pi pi-map", order: 1 },
  "v2/board/battle": { label: "Tablero de batalla", icon: "pi pi-bolt", order: 2 },
  "v2/board/board-map-dev": { label: "Tablero (técnico)", icon: "pi pi-cog", order: 3 },
  "v2/characters/heroes": { label: "Héroes", icon: "pi pi-user", order: 1 },
  "v2/characters/enemies": { label: "Enemigos", icon: "pi pi-bolt", order: 2 },
  "v2/characters/npcs": { label: "NPCs", icon: "pi pi-users", order: 3 },
  "v2/cards": { label: "Cartas (índice)", icon: "pi pi-th-large", order: 0 },
  "v2/cards/class": { label: "Cartas de clase", icon: "pi pi-id-card", order: 1 },
  "v2/cards/weapons": { label: "Armas", icon: "pi pi-star", order: 2 },
  "v2/cards/armor": { label: "Armaduras", icon: "pi pi-shield", order: 3 },
  "v2/cards/items": { label: "Items", icon: "pi pi-box", order: 4 },
  "v2/cards/mercenaries": { label: "Mercenarios", icon: "pi pi-users", order: 5 },
  "v2/cards/curses": { label: "Maldiciones", icon: "pi pi-exclamation-triangle", order: 6 },
  "v2/cards/encounter": { label: "Mazo de encuentro", icon: "pi pi-clone", order: 7 },
};

function prettify(name: string): string {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// La directiva de estado. Misma forma que `<!-- cards: … -->` de
// lib/card-table.ts, pero SOLO en la cabecera del archivo: si valiera en
// cualquier línea, un documento que explique la convención —o un bloque de
// código que la cite— se cambiaría el estado a sí mismo sin querer. Ya pasó al
// escribir docs/v3/cards/README.md.
const STATUS_DIRECTIVE_RE = /^\s*<!--\s*estado:\s*([a-z-]+)\s*-->\s*$/m;
const STATUS_HEAD_LINES = 5;

/**
 * Lee el estado declarado por un documento. Sin directiva no hay estado —es lo
 * normal en los índices y en v2 entera—, y una directiva mal escrita revienta
 * en vez de pasar en silencio: un estado que miente es peor que ninguno.
 */
const readStatus = cache((abs: string): DocStatus | undefined => {
  const head = fs
    .readFileSync(abs, "utf8")
    .split("\n", STATUS_HEAD_LINES)
    .join("\n");
  const m = head.match(STATUS_DIRECTIVE_RE);
  if (!m) return undefined;
  const value = m[1];
  if (!isDocStatus(value)) {
    throw new Error(
      `Estado desconocido "${value}" en ${path.relative(DOCS_ROOT, abs)}. ` +
        `Los válidos están en lib/doc-status.ts: por-escribir, a-medias, escrito, en-espera.`,
    );
  }
  return value;
});

/** Recorre docs/ y devuelve los .md con su slug (README = índice de carpeta). */
const listFiles = cache((): FileRec[] => {
  const files: FileRec[] = [];
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir)) {
      const abs = path.join(dir, name);
      if (fs.statSync(abs).isDirectory()) {
        walk(abs);
      } else if (name.toLowerCase().endsWith(".md")) {
        const rel = path.relative(DOCS_ROOT, abs).split(path.sep).join("/");
        const dirRel = path.dirname(rel);
        const dir2 = dirRel === "." ? "" : dirRel;
        const slugStr = rel
          .replace(/\.md$/i, "")
          .replace(/\/README$/i, "")
          .replace(/^README$/i, "");
        files.push({ abs, rel, dir: dir2, slug: slugStr ? slugStr.split("/") : [] });
      }
    }
  };
  walk(DOCS_ROOT);
  return files;
});

function slugKey(slug: string[]): string {
  return slug.join("/");
}

function metaFor(slug: string[]) {
  const key = slugKey(slug);
  return (
    META[key] ?? {
      label: prettify(slug[slug.length - 1] ?? "Inicio"),
      icon: "pi pi-file",
      order: 99,
    }
  );
}

/** Convierte "- [~] ..." (no es GFM) en un marcador 🟡 legible. */
function preprocess(raw: string): string {
  return raw.replace(/^(\s*[-*])\s+\[~\]\s+/gm, "$1 🟡 ");
}

function firstH1(raw: string): string | null {
  const m = raw.match(/^\s*#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[`*_]/g, "").trim() : null;
}

/**
 * Árbol de navegación agrupado por carpeta. Sin `version` devuelve las dos
 * wikis; con ella, solo la que se pide — que es lo que ve cada marco.
 */
export const getNavTree = cache((version?: DocsVersion): NavGroup[] => {
  const files = listFiles();
  const groups = version ? GROUPS.filter((g) => g.version === version) : GROUPS;
  return groups.map((g) => {
    const items = files
      .filter((f) => f.dir === g.dir)
      .map((f) => {
        const m = metaFor(f.slug);
        const status = readStatus(f.abs);
        return {
          label: m.label,
          icon: m.icon,
          href: docPathToRoute(f.slug.join("/")),
          ...(status ? { status } : {}),
          _order: m.order,
        };
      })
      .sort((a, b) => a._order - b._order || a.label.localeCompare(b.label))
      .map(({ _order, ...item }) => item as NavItem);
    // Páginas especiales (no-markdown): los dos laboratorios de diseño, uno por
    // versión. Fueron TRES hasta el 3 de septiembre de 2026, cuando "Diseño
    // baraja" (/docs/v3/cards/deck) se fundió con la de V3 al cerrarse la
    // comparación de bocetos.
    if (g.key === DESIGN_LAB_GROUP) {
      items.push({
        label: "Diseño",
        icon: "pi pi-palette",
        href: `/docs/${DESIGN_LAB_VERSION}/cards/design`,
      });
    }
    if (g.key === SKETCH_LAB_GROUP && SKETCH_LAB_GROUP !== DESIGN_LAB_GROUP) {
      items.push({
        label: "Diseño de cartas",
        icon: "pi pi-palette",
        href: "/docs/v3/cards/design",
      });
    }
    // Las páginas especiales de arriba no declaran estado y tampoco cuentan
    // para la norma del grupo: no son documentos, son laboratorios.
    return {
      key: g.key,
      label: g.label,
      icon: g.icon,
      items,
      defaultStatus: defaultStatusOf(items.map((it) => it.status)),
    };
  }).filter((g) => g.items.length > 0);
});

/** Params para generateStaticParams (todos los docs + índice /docs). */
export function getAllParams(): { slug: string[] }[] {
  return [{ slug: [] }, ...listFiles().map((f) => ({ slug: f.slug }))];
}

/** Resuelve un slug a un documento (con guarda anti-traversal). */
export const getDocBySlug = cache((slug: string[]): Doc | null => {
  const rel = slug.join("/");
  const candidates = rel ? [rel + ".md", rel + "/README.md"] : ["README.md"];
  for (const c of candidates) {
    const abs = path.normalize(path.join(DOCS_ROOT, c));
    if (!abs.startsWith(DOCS_ROOT)) continue;
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      const raw = fs.readFileSync(abs, "utf8");
      const dirRel = path.dirname(path.relative(DOCS_ROOT, abs)).split(path.sep).join("/");
      return {
        slug,
        content: preprocess(raw),
        dir: dirRel === "." ? "" : dirRel,
        title: firstH1(raw) ?? metaFor(slug).label,
        hasCards: hasCardDirective(raw),
      };
    }
  }
  return null;
});

/** Título corto (para breadcrumb/nav). */
export function getShortTitle(slug: string[]): string {
  return metaFor(slug).label;
}

// --- Búsqueda -------------------------------------------------------------

function slugifyHeading(text: string, used: Map<string, number>): string {
  let base = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
  const n = used.get(base) ?? 0;
  used.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}

function stripMarkdown(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, " ") // comentarios (p. ej. las directivas de cartas)
    .replace(/```[\s\S]*?```/g, " ") // bloques de código
    .replace(/`[^`]*`/g, " ")
    .replace(/[|>#*_~\[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const getSearchIndex = cache((): SearchDoc[] => {
  const files = listFiles();
  const groupLabel = (dir: string) =>
    GROUPS.find((g) => g.dir === dir)?.label ?? "General";
  return files.map((f) => {
    const raw = fs.readFileSync(f.abs, "utf8");
    const used = new Map<string, number>();
    const headings: SearchHeading[] = [];
    for (const line of raw.split("\n")) {
      const m = line.match(/^(#{2,4})\s+(.+?)\s*$/);
      if (m) {
        const text = m[2].replace(/[`*_]/g, "").trim();
        headings.push({ text, id: slugifyHeading(text, used) });
      }
    }
    return {
      href: docPathToRoute(f.slug.join("/")),
      title: firstH1(raw) ?? metaFor(f.slug).label,
      group: groupLabel(f.dir),
      headings,
      text: stripMarkdown(raw),
    };
  });
});
