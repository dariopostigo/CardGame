"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { NavGroup } from "@/lib/docs";
import Sidebar from "./Sidebar";
import SearchBox from "./SearchBox";
import ThemeControls from "./ThemeControls";
import Breadcrumb from "./Breadcrumb";

export default function Shell({
  nav,
  children,
}: {
  nav: NavGroup[];
  children: ReactNode;
}) {
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
        <Link href="/docs" className="flex items-center gap-2 font-semibold">
          <i className="pi pi-th-large text-[var(--wiki-accent)]" />
          <span>
            CardGame <span className="text-[var(--wiki-muted)]">Wiki</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <SearchBox />
          <ThemeControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[var(--wiki-border)] lg:block">
          <Sidebar nav={nav} />
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb nav={nav} />
            {children}
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--wiki-surface)] shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-[var(--wiki-border)] px-4">
              <span className="font-semibold">Menú</span>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--wiki-surface-2)]"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                <i className="pi pi-times" />
              </button>
            </div>
            <Sidebar nav={nav} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
