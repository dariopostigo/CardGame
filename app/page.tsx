import Link from "next/link";
import type { Metadata } from "next";
import ThemeControls from "@/components/wiki/ThemeControls";
import { DEV_LABS, isAvailable } from "@/lib/dev-labs";

// Portada: las dos puertas del proyecto. Server Component; lo único de
// cliente es el interruptor de tema.

export const metadata: Metadata = {
  title: { absolute: "CardGame" },
  description:
    "Juego de cartas y tablero hexagonal. Documentación de diseño y laboratorio de desarrollo.",
};

const DOOR =
  "group flex flex-col gap-3 rounded-xl border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-6 transition-colors hover:border-[var(--wiki-accent)] hover:bg-[var(--wiki-surface-2)]";

export default function Home() {
  const readyLabs = DEV_LABS.filter(isAvailable).length;

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
          <Link href="/docs" className={DOOR}>
            <span className="flex items-center gap-3">
              <i className="pi pi-book text-2xl text-[var(--wiki-accent)]" />
              <span className="text-lg font-semibold text-[var(--wiki-text)]">Wiki</span>
              <i className="pi pi-arrow-right ml-auto text-[var(--wiki-muted)] transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-sm text-[var(--wiki-muted)]">
              La documentación oficial del juego: reglas, héroes, enemigos, catálogo de cartas y
              tablero. Es la fuente de verdad del diseño.
            </span>
          </Link>

          <Link href="/dev" className={DOOR}>
            <span className="flex items-center gap-3">
              <i className="pi pi-code text-2xl text-[var(--wiki-accent)]" />
              <span className="text-lg font-semibold text-[var(--wiki-text)]">Dev</span>
              <i className="pi pi-arrow-right ml-auto text-[var(--wiki-muted)] transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-sm text-[var(--wiki-muted)]">
              Los laboratorios donde se construye el videojuego: losetas, generación de tablero,
              semillas, fichas, baraja, combate y animaciones. {readyLabs} de {DEV_LABS.length} en
              marcha.
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
