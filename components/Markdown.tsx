import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { resolveLink } from "@/lib/markdown-link";
import remarkIconTooltip from "@/lib/remark-icon-tooltip";
import IconTip from "@/components/wiki/IconTip";
import remarkRarityChip from "@/lib/remark-rarity-chip";
import RarityChip from "@/components/wiki/RarityChip";
import type { RarityLevel } from "@/lib/rarity";
import remarkSeverityChip from "@/lib/remark-severity-chip";
import SeverityChip from "@/components/wiki/SeverityChip";
import type { SeverityLevel } from "@/lib/severity";

export default function Markdown({
  content,
  docDir,
}: {
  content: string;
  docDir: string;
}) {
  const components: Components = {
    a({ href, children }) {
      const r = resolveLink(href ?? "", docDir);
      if (r.kind === "internal") {
        return <Link href={r.href}>{children}</Link>;
      }
      if (r.kind === "external") {
        return (
          <a href={r.href} target="_blank" rel="noopener noreferrer">
            {children}
            <i
              className="pi pi-external-link"
              style={{ fontSize: "0.7em", marginLeft: "0.25em", opacity: 0.6 }}
            />
          </a>
        );
      }
      return <a href={r.href}>{children}</a>;
    },
    table({ children }) {
      return (
        <div className="wiki-table-wrap" style={{ overflowX: "auto" }}>
          <table>{children}</table>
        </div>
      );
    },
    blockquote({ children }) {
      return <blockquote className="wiki-callout">{children}</blockquote>;
    },
    img({ src, alt }) {
      const r = resolveLink(typeof src === "string" ? src : "", docDir);
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={r.href} alt={alt ?? ""} loading="lazy" />;
    },
  };

  // Custom elements que insertan los plugins remark de lib/remark-*.ts
  // ("icon-tip", "rarity-chip") — no son keys de JSX.IntrinsicElements, así
  // que no pueden vivir en el objeto `components` (activaría el chequeo de
  // propiedades excedentes); se fusionan aquí y se castean juntos.
  const customComponents = {
    "icon-tip"({ icon }: { icon: string }) {
      return <IconTip icon={icon} />;
    },
    "rarity-chip"({ level }: { level: RarityLevel }) {
      return <RarityChip level={level} />;
    },
    "severity-chip"({ level }: { level: SeverityLevel }) {
      return <SeverityChip level={level} />;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkIconTooltip, remarkRarityChip, remarkSeverityChip]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      components={{ ...components, ...customComponents } as Components}
    >
      {content}
    </ReactMarkdown>
  );
}
