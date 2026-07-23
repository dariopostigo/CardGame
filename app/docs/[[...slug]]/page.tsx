import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Markdown from "@/components/Markdown";
import DocsIndex from "@/components/wiki/DocsIndex";
import { getAllParams, getDocBySlug } from "@/lib/docs";

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
      <Markdown content={doc.content} docDir={doc.dir} />
    </article>
  );
}
