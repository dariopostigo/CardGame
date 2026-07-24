import { ICON_TOOLTIPS } from "./icon-tooltip";

// Busca los iconos de docs/glossary.md dentro del texto de los .md y los
// envuelve en un nodo custom <icon-tip icon="..."> para que Markdown.tsx
// pueda renderizarlos con un Tooltip real en vez de texto suelto.
// No toca `inlineCode`/`code` (no son nodos "text", así que el visitor no
// entra en ellos).

const ICONS = Object.keys(ICON_TOOLTIPS);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ICON_RE = new RegExp(`(${ICONS.map(escapeRegExp).join("|")})`, "gu");

type AnyNode = { type: string; value?: string; children?: AnyNode[]; data?: unknown };

function splitTextNode(value: string): AnyNode[] {
  const parts: AnyNode[] = [];
  let lastIndex = 0;
  ICON_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ICON_RE.exec(value))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }
    const icon = match[0];
    parts.push({
      type: "iconTooltip",
      data: { hName: "icon-tip", hProperties: { icon } },
      children: [],
    });
    lastIndex = match.index + icon.length;
  }
  if (lastIndex < value.length) {
    parts.push({ type: "text", value: value.slice(lastIndex) });
  }
  return parts;
}

function visit(node: AnyNode): void {
  if (!Array.isArray(node.children)) return;
  for (let i = node.children.length - 1; i >= 0; i--) {
    const child = node.children[i];
    if (child.type === "text" && typeof child.value === "string" && ICON_RE.test(child.value)) {
      node.children.splice(i, 1, ...splitTextNode(child.value));
    } else {
      visit(child);
    }
  }
}

export default function remarkIconTooltip() {
  return (tree: AnyNode) => {
    visit(tree);
  };
}
