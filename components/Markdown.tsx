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
import remarkCardTable from "@/lib/remark-card-table";
import CardTableView from "@/components/wiki/CardTableView";

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
      // Archivo del repositorio fuera de docs/ (knowledge/, public/…): la wiki
      // no lo sirve, así que se queda como texto en vez de enlazar a un 404.
      if (r.kind === "outside") {
        return <span title={r.href}>{children}</span>;
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
    "card-table"({ spec, children }: { spec: string; children?: React.ReactNode }) {
      return <CardTableView spec={spec}>{children}</CardTableView>;
    },
  };

  return (
    <ReactMarkdown
      // remarkCardTable va justo detrás de GFM: necesita las celdas de la
      // tabla intactas, antes de que los plugins de chip las reescriban.
      remarkPlugins={[remarkGfm, remarkCardTable, remarkIconTooltip, remarkRarityChip, remarkSeverityChip]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      components={{ ...components, ...customComponents } as Components}
    >
      {content}
    </ReactMarkdown>
  );
}
