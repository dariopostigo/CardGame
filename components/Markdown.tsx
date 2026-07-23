import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { resolveLink } from "@/lib/markdown-link";

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

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
