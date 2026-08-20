"use client";

// Conmutador entre las dos wikis, en la cabecera.
//
// Aunque Wiki V3 y Wiki v2 son dos apartados independientes (lib/sections.ts)
// y se llega a cada una desde la portada, saltar de una a otra es un gesto
// frecuente mientras dure la migración: se consulta cómo se resolvía algo en
// v2 y se vuelve a V3. Sin esto habría que pasar por la portada cada vez.
//
// Salta siempre a la raíz de la otra versión, no al documento equivalente: los
// árboles comparten forma pero no contenido, y la mitad de los documentos de
// V3 todavía no existen.

import Link from "next/link";
import { DOCS_VERSIONS, VERSION_LABEL, type DocsVersion } from "@/lib/docs-version";

export default function VersionSwitch({ current }: { current: DocsVersion }) {
  return (
    <nav
      aria-label="Versión de la wiki"
      className="ml-1 hidden items-center rounded-md border border-[var(--wiki-border)] p-0.5 text-xs sm:flex"
    >
      {DOCS_VERSIONS.map((v) => {
        const active = v === current;
        return (
          <Link
            key={v}
            href={`/docs/${v}`}
            aria-current={active ? "page" : undefined}
            title={v === "v3" ? "Diseño vigente" : "Diseño anterior, congelado"}
            className={
              active
                ? "rounded bg-[var(--wiki-accent)] px-2 py-1 font-semibold text-[var(--wiki-surface)]"
                : "rounded px-2 py-1 text-[var(--wiki-muted)] hover:bg-[var(--wiki-surface-2)]"
            }
          >
            {VERSION_LABEL[v]}
          </Link>
        );
      })}
    </nav>
  );
}
