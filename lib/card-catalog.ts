// =========================================================================
// Catálogo completo de cartas (solo servidor: usa node:fs)
//
// Lee docs/cards/*.md y devuelve todas las cartas marcadas con la directiva
// `<!-- cards: … -->`. Es lo que come el lab de diseño
// (app/docs/cards/diseno/page.tsx), para que el lab y la wiki pinten
// exactamente el mismo catálogo: si una carta cambia en su tabla, cambia en
// los dos sitios a la vez.
//
// Antes esto era una transcripción a mano (components/design/cards-data.tsx):
// 97 cartas copiadas de las tablas, que ya habían empezado a divergir del
// markdown. Ahora no hay nada que mantener sincronizado.
// =========================================================================

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { cardTablesInDoc, type CardRecord } from "./card-table";

const CARDS_ROOT = path.join(process.cwd(), "docs", "cards");

// Orden de los documentos en el catálogo. El resto de .md de docs/cards/ se
// añade detrás por orden alfabético, así que un documento nuevo con cartas
// entra solo (aunque para fijar su sitio se añade aquí).
const DOC_ORDER = ["class", "weapons", "armor", "items", "curses", "mercenaries", "encounter"];

/** Una carta del catálogo con su procedencia, para poder citarla. */
export type CatalogCard = CardRecord & {
  /** Documento del que sale, sin extensión ("weapons"). */
  doc: string;
  /** Encabezado de la sección que la contiene ("1. Armas melee"). */
  section: string;
};

function docFiles(): string[] {
  const files = fs
    .readdirSync(CARDS_ROOT)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .map((f) => f.replace(/\.md$/i, ""));
  return [
    ...DOC_ORDER.filter((d) => files.includes(d)),
    ...files.filter((f) => !DOC_ORDER.includes(f)).sort(),
  ];
}

/** Todas las cartas de docs/cards/, en orden de documento y de tabla. */
export const getCardCatalog = cache((): CatalogCard[] => {
  const out: CatalogCard[] = [];
  for (const doc of docFiles()) {
    const md = fs.readFileSync(path.join(CARDS_ROOT, `${doc}.md`), "utf8");
    for (const table of cardTablesInDoc(md, `${doc}-`)) {
      for (const card of table.cards) {
        out.push({ ...card, doc, section: table.heading });
      }
    }
  }
  return out;
});
