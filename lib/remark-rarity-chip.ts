import { RARITY_LABEL_TO_LEVEL } from "./rarity";

// Busca celdas de tabla GFM (`tableCell`, remark-gfm) cuyo contenido sea
// EXACTAMENTE una etiqueta de rareza (nada de texto suelto en medio de una
// frase) y las sustituye por un elemento custom <rarity-chip level="..."> que
// Markdown.tsx renderiza como una mini-carta de color con tooltip
// (RarityChip.tsx) — el texto de la rareza no se muestra, la carta ya lo dice.

type AnyNode = { type: string; value?: string; children?: AnyNode[]; data?: unknown };

function visit(node: AnyNode): void {
  if (node.type === "tableCell" && Array.isArray(node.children) && node.children.length === 1) {
    const child = node.children[0];
    if (child.type === "text" && typeof child.value === "string") {
      const level = RARITY_LABEL_TO_LEVEL[child.value.trim()];
      if (level) {
        node.children = [
          {
            type: "rarityChip",
            data: { hName: "rarity-chip", hProperties: { level } },
            children: [],
          },
        ];
      }
    }
    return;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child);
  }
}

export default function remarkRarityChip() {
  return (tree: AnyNode) => {
    visit(tree);
  };
}
