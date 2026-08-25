// Capa de datos de la wiki (solo servidor: usa node:fs).
// Lee los .md de docs/, construye el árbol de navegación, resuelve slugs y
// genera el índice de búsqueda.
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { docPathToRoute } from "@/lib/markdown-link";
import { hasCardDirective } from "@/lib/card-table";
import { DOCS_VERSIONS, type DocsVersion } from "@/lib/docs-version";

// Reexportado por comodidad: el servidor puede pedírselo todo a este módulo.
// El cliente NO — tiene que importar de "@/lib/docs-version" directamente, o
// se lleva node:fs al bundle.
export * from "@/lib/docs-version";

const DOCS_ROOT = path.join(process.cwd(), "docs");

export type NavItem = { label: string; href: string; icon: string };
export type NavGroup = { key: string; label: string; icon: string; items: NavItem[] };
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
// El día que se mueva a "v3" hay que mover tres cosas a la vez: esta
// constante, CARDS_ROOT, y la carpeta de la ruta (app/docs/v2/cards/design/ →
// app/docs/v3/cards/design/).
const DESIGN_LAB_VERSION: DocsVersion = "v2";
const DESIGN_LAB_GROUP = `${DESIGN_LAB_VERSION}-cards`;

// Bocetos de marco de V3 (app/docs/v3/cards/design/). Página propia y no la
// misma de arriba: aquella pinta el catálogo real de v2 con un marco YA
// decidido, y esta pinta sujetos de muestra escritos a mano
// (components/design/v3/sample.ts) con tres bocetos POR decidir.
//
// Cuando uno de los tres gane, las dos se funden en una: esta se queda con el
// marco elegido y hereda el catálogo, y entonces la constante de arriba pasa a
// "v3" con sus tres mudanzas. Hasta ese día conviven, así que el push de abajo
// se guarda de que no se dupliquen si las dos versiones coincidieran.
const SKETCH_LAB_GROUP = "v3-cards";

// Metadatos por documento (etiqueta corta + icono + orden dentro del grupo).
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
        return {
          label: m.label,
          icon: m.icon,
          href: docPathToRoute(f.slug.join("/")),
          _order: m.order,
        };
      })
      .sort((a, b) => a._order - b._order || a.label.localeCompare(b.label))
      .map(({ _order, ...item }) => item as NavItem);
    // Páginas especiales (no-markdown): los dos laboratorios de diseño.
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
    return { key: g.key, label: g.label, icon: g.icon, items };
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
