import Link from "next/link";
import type { Metadata } from "next";
import ThemeControls from "@/components/wiki/ThemeControls";
import { LABS, isAvailable } from "@/lib/lab-registry";
import { DEV_MODULES, isAvailable as isModuleAvailable } from "@/lib/dev-registry";
import { getNavTree } from "@/lib/docs";
import { REPO_DEV_GROUPS, REPO_PRO_GROUPS, isBuilt } from "@/lib/repository";
import { SECTIONS, type SectionId } from "@/lib/sections";

// Portada: las puertas del proyecto. Salen de lib/sections.ts; lo único que se
// escribe aquí es el contador de cada una, porque cada apartado cuenta una
// cosa distinta (documentos, labs, módulos, familias de componentes) y no cabe
// en el registro.
// Server Component; lo único de cliente es el interruptor de tema.

export const metadata: Metadata = {
  title: { absolute: "CardGame" },
  description:
    "Juego de cartas y tablero hexagonal. Las dos wikis de diseño, la construcción de V3, los laboratorios del motor y los repositorios de componentes.",
};

function docCount(version: "v2" | "v3"): number {
  return getNavTree(version).reduce((n, g) => n + g.items.length, 0);
}

const DOOR =
  "group flex flex-col gap-3 rounded-xl border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-6 transition-colors hover:border-[var(--wiki-accent)] hover:bg-[var(--wiki-surface-2)]";

function progressOf(id: SectionId): string | null {
  switch (id) {
    case "wiki":
      return `${docCount("v3")} documentos en V3 y ${docCount("v2")} en la v2 congelada.`;
    case "lab":
      return `${LABS.filter(isAvailable).length} de ${LABS.length} laboratorios en marcha.`;
    case "dev":
      return `${DEV_MODULES.filter(isModuleAvailable).length} de ${DEV_MODULES.length} módulos en marcha.`;
    case "repository-dev":
      return `${REPO_DEV_GROUPS.filter(isBuilt).length} de ${REPO_DEV_GROUPS.length} familias documentadas.`;
    case "repository-pro":
      return `${REPO_PRO_GROUPS.length} familias por construir.`;
    default:
      return null;
  }
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center px-4">
        <span className="flex items-center gap-2 font-semibold">
          <i className="pi pi-th-large text-[var(--wiki-accent)]" />
          CardGame
        </span>
        <div className="ml-auto">
          <ThemeControls />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 lg:py-20">
        <h1 className="text-3xl font-bold text-[var(--wiki-text)] lg:text-4xl">CardGame</h1>
        <p className="mt-3 max-w-2xl text-[var(--wiki-muted)]">
          Juego de cartas y tablero hexagonal para un jugador: mezcla las estadísticas y la
          identidad de personajes de D&amp;D con una estructura de mazo y tablero modular. El diseño
          sobre papel de la <b>Partida rápida</b> está completo; el prototipo está en construcción.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const progress = progressOf(section.id);
            return (
              <Link key={section.id} href={section.href} className={DOOR}>
                <span className="flex items-center gap-3">
                  <i className={`${section.icon} text-2xl text-[var(--wiki-accent)]`} />
                  <span className="text-lg font-semibold text-[var(--wiki-text)]">
                    {section.label}
                  </span>
                  <i className="pi pi-arrow-right ml-auto text-[var(--wiki-muted)] transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-sm text-[var(--wiki-muted)]">
                  {section.summary}
                  {progress && <> {progress}</>}
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-xs text-[var(--wiki-muted)]">
          Los dos primeros apartados documentan <b>qué</b> es el juego —sobre papel y en el motor—;
          los dos repositorios documentan <b>cómo se ve</b>: uno la piel sobria de estas
          herramientas, el otro la piel medieval que verá el jugador.
        </p>
      </main>
    </div>
  );
}
