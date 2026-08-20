"use client";

// Marco de los dos repositorios de componentes. Mismo esqueleto que LabShell y
// que el de la wiki —cabecera fija, lateral pegajoso, cajón en móvil— y un solo
// componente para los dos lados: lo único que cambia es el rótulo, el icono y
// de qué lista come el menú.
//
// Ojo con la tentación de vestir este marco con el tema del lado que muestra:
// el marco es herramienta, siempre skin --wiki-*. Lo medieval va DENTRO del
// especimen, encerrado en su lienzo, que es la única forma de ver si un botón
// de hierro funciona sin que el resto de la página se lo maquille.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import ThemeControls from "@/components/wiki/ThemeControls";
import SectionLinks from "@/components/nav/SectionLinks";
import { SECTIONS_BY_ID } from "@/lib/sections";
import type { RepoSide } from "@/lib/repository";
import RepoSidebar from "./RepoSidebar";

export default function RepoShell({ side, children }: { side: RepoSide; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const section = SECTIONS_BY_ID[side === "dev" ? "repository-dev" : "repository-pro"];
  const root = `/repository-${side}`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--wiki-border)] bg-[var(--wiki-surface)]/95 px-4 backdrop-blur">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--wiki-surface-2)] lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <i className="pi pi-bars" />
        </button>
        <Link href={root} className="flex items-center gap-2 font-semibold">
          <i className={`${section.icon} text-[var(--wiki-accent)]`} />
          <span>
            CardGame <span className="text-[var(--wiki-muted)]">{section.short}</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <SectionLinks current={section.id} />
          <ThemeControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[110rem]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[var(--wiki-border)] lg:block">
          <RepoSidebar side={side} />
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--wiki-surface)] shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-[var(--wiki-border)] px-4">
              <span className="font-semibold">Familias</span>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--wiki-surface-2)]"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                <i className="pi pi-times" />
              </button>
            </div>
            <RepoSidebar side={side} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
