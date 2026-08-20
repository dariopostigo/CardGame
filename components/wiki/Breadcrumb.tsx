"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/docs";
import { VERSION_LABEL, versionOfRoute } from "@/lib/docs-version";

export default function Breadcrumb({ nav }: { nav: NavGroup[] }) {
  const pathname = usePathname();
  if (!pathname.startsWith("/docs") || pathname === "/docs") return null;

  // La raíz de las migas es la wiki de la versión, no /docs: dentro de una
  // wiki, la otra versión no es un nivel por encima sino un sitio aparte.
  const version = versionOfRoute(pathname);
  const rootHref = version ? `/docs/${version}` : "/docs";
  const rootLabel = version ? `Wiki ${VERSION_LABEL[version]}` : "Wiki";
  if (pathname === rootHref) return null;

  const labelByHref = new Map<string, string>();
  for (const g of nav) for (const it of g.items) labelByHref.set(it.href, it.label);

  // Etiquetas para segmentos de carpeta que no tienen página propia.
  const folderLabels: Record<string, string> = {
    board: "Tablero",
    characters: "Personajes",
    cards: "Cartas",
  };

  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { href: string; label: string; link: boolean }[] = [];
  let acc = "";
  for (const p of parts) {
    acc += "/" + p;
    if (acc === "/docs" || acc === rootHref) continue;
    const link = labelByHref.has(acc);
    const label =
      labelByHref.get(acc) ?? folderLabels[p] ?? decodeURIComponent(p);
    crumbs.push({ href: acc, label, link });
  }

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[var(--wiki-muted)]">
      <Link href={rootHref} className="hover:text-[var(--wiki-accent)]">
        {rootLabel}
      </Link>
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1">
          <i className="pi pi-angle-right text-[0.65rem]" />
          {i === crumbs.length - 1 || !c.link ? (
            <span className={i === crumbs.length - 1 ? "text-[var(--wiki-text)]" : ""}>
              {c.label}
            </span>
          ) : (
            <Link href={c.href} className="hover:text-[var(--wiki-accent)]">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
