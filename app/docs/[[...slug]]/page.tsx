import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Markdown from "@/components/Markdown";
import DocsIndex from "@/components/wiki/DocsIndex";
import { CardFrameDefs } from "@/components/design/card-frames";
import { getAllParams, getDocBySlug } from "@/lib/docs";

// Los docs viven en docs/*.md y se leen del disco con fs.readFileSync (lib/docs.ts).
// Next no rastrea esas lecturas como dependencia de caché, así que sin esto la
// wiki sirve una versión congelada del primer render en vez de reflejar ediciones al .md.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return { title: "Wiki" };
  const doc = getDocBySlug(slug);
  return { title: doc?.title ?? "Documento" };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return <DocsIndex />;

  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  return (
    <article className="wiki-prose prose">
      {/* Gradientes y trazados comunes de los marcos de carta: una sola vez por
          documento, los referencien uno o varios apartados con vista cartas
          (lib/remark-card-table.ts). */}
      {doc.hasCards && <CardFrameDefs />}
      <Markdown content={doc.content} docDir={doc.dir} />
    </article>
  );
}
