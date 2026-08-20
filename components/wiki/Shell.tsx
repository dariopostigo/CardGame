"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { NavGroup } from "@/lib/docs";
import { VERSION_LABEL, versionOfRoute } from "@/lib/docs-version";
import SectionLinks from "@/components/nav/SectionLinks";
import Sidebar from "./Sidebar";
import SearchBox from "./SearchBox";
import ThemeControls from "./ThemeControls";
import Breadcrumb from "./Breadcrumb";
import VersionSwitch from "./VersionSwitch";

export default function Shell({
  nav,
  children,
}: {
  nav: NavGroup[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Una sola wiki, dos versiones dentro: el menú enseña solo el árbol de la
  // versión en la que estés, y se salta entre ellas con VersionSwitch. Sin
  // versión en la ruta se cae a V3, que es a donde redirige /docs de todas
  // formas — así el marco nunca queda en un estado intermedio.
  const version = versionOfRoute(pathname) ?? "v3";
  const groups = nav.filter((g) => g.key.startsWith(`${version}-`));
  const home = `/docs/${version}`;

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
        <Link href={home} className="flex items-center gap-2 font-semibold">
          <i
            className={`${version === "v2" ? "pi pi-lock" : "pi pi-book"} text-[var(--wiki-accent)]`}
          />
          <span>
            CardGame{" "}
            <span className="text-[var(--wiki-muted)]">
              Wiki{version ? ` ${VERSION_LABEL[version]}` : ""}
            </span>
          </span>
        </Link>
        <VersionSwitch current={version} />
        <div className="ml-auto flex items-center gap-1">
          <SearchBox />
          <SectionLinks current="wiki" />
          <ThemeControls />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[var(--wiki-border)] lg:block">
          <Sidebar nav={groups} />
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb nav={groups} />
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
            <Sidebar nav={groups} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
