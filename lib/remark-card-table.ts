// Convierte cada tabla de catálogo marcada con `<!-- cards: … -->` en un
// elemento custom <card-table> que Markdown.tsx renderiza como el conmutador
// Tabla/Cartas (CardTableView.tsx). Mismo mecanismo que los chips de rareza y
// severidad (lib/remark-rarity-chip.ts), pero a nivel de bloque.
//
// La tabla original se conserva COMO HIJA del elemento: la vista tabla sigue
// siendo el markdown renderizado de siempre (con sus enlaces, chips y
// tooltips), no una reconstrucción. Solo la vista cartas es una proyección
// (lib/card-table.ts).
//
// Va antes de los plugins de chip en el orden de Markdown.tsx para leer las
// celdas antes de que nadie las reescriba; el corte se hace sobre el markdown
// EN CRUDO (`file.value`) usando las posiciones del nodo, así que el parser es
// exactamente el mismo que usa el catálogo del lab.

import { cardsFromTable, parseCardDirective } from "./card-table";

type Position = { start: { offset?: number }; end: { offset?: number } };
type AnyNode = {
  type: string;
  value?: string;
  children?: AnyNode[];
  data?: unknown;
  position?: Position;
};

export default function remarkCardTable() {
  return (tree: AnyNode, file: { value?: unknown }) => {
    const source = typeof file.value === "string" ? file.value : String(file.value ?? "");
    const children = tree.children;
    if (!Array.isArray(children)) return;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== "html" || typeof node.value !== "string") continue;

      const directive = parseCardDirective(node.value);
      if (!directive) continue;

      const table = children[i + 1];
      const start = table?.position?.start.offset;
      const end = table?.position?.end.offset;
      if (!table || table.type !== "table" || start === undefined || end === undefined) continue;

      const cards = cardsFromTable(source.slice(start, end), directive);
      if (!cards.length) continue;

      // Sustituye [comentario, tabla] por <card-table>{tabla}</card-table>.
      children.splice(i, 2, {
        type: "cardTable",
        data: {
          hName: "card-table",
          hProperties: { spec: JSON.stringify({ category: directive.category, cards }) },
        },
        children: [table],
      });
    }
  };
}
