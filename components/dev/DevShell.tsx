"use client";

// Marco de la sección /dev. Mismo esqueleto que el de la wiki
// (components/wiki/Shell.tsx) —cabecera fija, lateral pegajoso, cajón en
// móvil— pero con el menú de laboratorios y sin buscador: aquí no hay
// documentos que buscar. El ancho es holgado a propósito: los labs pintan
// tableros y tablas, no prosa.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import ThemeControls from "@/components/wiki/ThemeControls";
import DevSidebar from "./DevSidebar";

export default function DevShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

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
        <Link href="/dev" className="flex items-center gap-2 font-semibold">
          <i className="pi pi-code text-[var(--wiki-accent)]" />
          <span>
            CardGame <span className="text-[var(--wiki-muted)]">Dev</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/docs"
            className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)] sm:inline-flex"
          >
            <i className="pi pi-book text-[0.85em] opacity-80" />
            Wiki
          </Link>
          <ThemeControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[110rem]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[var(--wiki-border)] lg:block">
          <DevSidebar />
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--wiki-surface)] shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-[var(--wiki-border)] px-4">
              <span className="font-semibold">Laboratorios</span>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--wiki-surface-2)]"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                <i className="pi pi-times" />
              </button>
            </div>
            <DevSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
