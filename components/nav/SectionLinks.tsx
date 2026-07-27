"use client";

// Enlaces a los otros apartados, en la cabecera de los cuatro marcos (wiki,
// dev y los dos repositorios). Sale de lib/sections.ts: así el quinto apartado
// —si algún día lo hay— aparece en las cuatro cabeceras con una sola entrada.
//
// En pantalla estrecha se quedan los iconos sin rótulo: son cuatro secciones y
// la cabecera ya lleva el interruptor de tema y, en la wiki, el buscador.

import Link from "next/link";
import { otherSections, type SectionId } from "@/lib/sections";

export default function SectionLinks({ current }: { current: SectionId }) {
  return (
    <nav aria-label="Apartados" className="flex items-center gap-1">
      {otherSections(current).map((section) => (
        <Link
          key={section.id}
          href={section.href}
          title={section.label}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[var(--wiki-text)] transition-colors hover:bg-[var(--wiki-surface-2)] sm:px-3"
        >
          <i className={`${section.icon} text-[0.85em] opacity-80`} />
          <span className="hidden lg:inline">{section.short}</span>
        </Link>
      ))}
    </nav>
  );
}
