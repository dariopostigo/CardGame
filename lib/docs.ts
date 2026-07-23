// Capa de datos de la wiki (solo servidor: usa node:fs).
// Lee los .md de docs/, construye el árbol de navegación, resuelve slugs y
// genera el índice de búsqueda.
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { docPathToRoute } from "@/lib/markdown-link";

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
export type Doc = { slug: string[]; content: string; dir: string; title: string };

type FileRec = { abs: string; rel: string; dir: string; slug: string[] };

// Grupos (carpetas) en orden de aparición.
const GROUPS = [
  { key: "general", label: "General", icon: "pi pi-book", dir: "" },
  { key: "board", label: "Tablero", icon: "pi pi-map", dir: "board" },
  { key: "characters", label: "Personajes", icon: "pi pi-users", dir: "characters" },
  { key: "cards", label: "Cartas", icon: "pi pi-th-large", dir: "cards" },
];

// Metadatos por documento (etiqueta corta + icono + orden dentro del grupo).
const META: Record<string, { label: string; icon: string; order: number }> = {
  "game-design": { label: "Diseño del juego", icon: "pi pi-book", order: 1 },
  glossary: { label: "Glosario", icon: "pi pi-list", order: 2 },
  status: { label: "Estado", icon: "pi pi-check-circle", order: 3 },
  "board/board-map": { label: "Tablero y mapa", icon: "pi pi-map", order: 1 },
  "board/board-map-dev": { label: "Tablero (técnico)", icon: "pi pi-cog", order: 2 },
  "characters/heroes": { label: "Héroes", icon: "pi pi-user", order: 1 },
  "characters/enemies": { label: "Enemigos", icon: "pi pi-bolt", order: 2 },
  "characters/npcs": { label: "NPCs", icon: "pi pi-users", order: 3 },
  cards: { label: "Cartas (índice)", icon: "pi pi-th-large", order: 0 },
  "cards/class": { label: "Cartas de clase", icon: "pi pi-id-card", order: 1 },
  "cards/weapons": { label: "Armas", icon: "pi pi-star", order: 2 },
  "cards/armor": { label: "Armaduras", icon: "pi pi-shield", order: 3 },
  "cards/items": { label: "Items", icon: "pi pi-box", order: 4 },
  "cards/effects": { label: "Efectos / Estados", icon: "pi pi-sparkles", order: 5 },
  "cards/curses": { label: "Maldiciones", icon: "pi pi-exclamation-triangle", order: 6 },
  "cards/encounter": { label: "Mazo de encuentro", icon: "pi pi-clone", order: 7 },
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

/** Árbol de navegación agrupado por carpeta. */
export const getNavTree = cache((): NavGroup[] => {
  const files = listFiles();
  return GROUPS.map((g) => {
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
    // Página especial (no-markdown): laboratorio de diseño de carta.
    if (g.key === "cards") {
      items.push({ label: "Diseño", icon: "pi pi-palette", href: "/docs/cards/diseno" });
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
