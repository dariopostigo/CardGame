import { SEVERITY_LABEL_TO_LEVEL } from "./severity";

// Igual mecanismo que lib/remark-rarity-chip.ts pero para la columna
// Severidad de cards/curses.md: busca celdas de tabla GFM cuyo contenido sea
// EXACTAMENTE "Leve" o "Grave" y las sustituye por <severity-chip level="...">
// (SeverityChip.tsx), una mini-carta de color en la escala ámbar→rojo.

type AnyNode = { type: string; value?: string; children?: AnyNode[]; data?: unknown };

function visit(node: AnyNode): void {
  if (node.type === "tableCell" && Array.isArray(node.children) && node.children.length === 1) {
    const child = node.children[0];
    if (child.type === "text" && typeof child.value === "string") {
      const level = SEVERITY_LABEL_TO_LEVEL[child.value.trim()];
      if (level) {
        node.children = [
          {
            type: "severityChip",
            data: { hName: "severity-chip", hProperties: { level } },
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

export default function remarkSeverityChip() {
  return (tree: AnyNode) => {
    visit(tree);
  };
}
