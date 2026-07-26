"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type CardCategory, type CardRecord } from "@/lib/card-table";
import type { CatalogCard } from "@/lib/card-catalog";
import { cardFontVars } from "./card-fonts";
import { CardFrameDefs, type CardTheme } from "./card-frames";
import GameCard from "./GameCard";

// Los estilos viven en el árbol ITCSS, no aquí: el esqueleto en
// styles/components/_card.scss y cada pestaña en styles/components/card-themes/.

/* Laboratorio de diseño de carta integrado en la wiki.
   Las cartas son el catálogo real, leído de las tablas de docs/cards/*.md por
   lib/card-catalog.ts y pasado como prop desde la página: las mismas que pinta
   la vista cartas de cada apartado de la wiki (CardTableView.tsx), así que lo
   que se decide aquí es lo que se ve allí.
   Sin flip ni otras interacciones (solo tilt al hover). */

// La lista de temas vive en card-frames.tsx, que es quien debe cubrirlos todos.
type Theme = CardTheme;

// Pestañas de diseño. Se van añadiendo aquí a medida que se crean nuevos
// templates de carta (cada uno un parcial de styles/components/card-themes/).
// Cada uno trae su marco SVG propio en card-frames.tsx.
const THEMES: { key: Theme; label: string }[] = [{ key: "armored", label: "Armored" }];

const RARITIES: { rarity: string; tag: string }[] = [
  { rarity: "comun", tag: "Común" },
  { rarity: "poco-comun", tag: "Poco común" },
  { rarity: "raro", tag: "Raro" },
  { rarity: "epico", tag: "Épico" },
  { rarity: "legendario", tag: "Legendario" },
];

// Cartas de la vista Rareza: la misma carta en los cinco raíles de color, para
// revisar el raíl sin el ruido del contenido real.
const RARITY_CARDS: CardRecord[] = RARITIES.map((r) => ({
  id: `rareza-${r.rarity}`,
  category: "arma",
  rarity: r.rarity,
  name: "Espada",
  text: "Ejemplo de rareza.",
  emoji: "🗡️",
  stats: [{ k: "Daño", v: "1d8" }],
  legendary: r.rarity === "legendario",
}));

// Vistas del escenario. "Muestra" es la de trabajo mientras se itera un diseño:
// una carta por categoría, que es lo que hace falta para ver todas las variantes
// de fichas (manos, daño, peso, severidad, coste) sin pintar el catálogo entero.
// El catálogo completo sigue a un clic, para revisar el diseño ya elegido contra
// todas las cartas reales.
type View = "muestra" | "cards" | "rarities";

export default function CardDesignLab({ cards }: { cards: CatalogCard[] }) {
  const [theme, setTheme] = useState<Theme>("armored");
  const [tilt, setTilt] = useState(false);
  const [view, setView] = useState<View>("muestra");
  const [category, setCategory] = useState<CardCategory | "todas">("todas");

  // Una carta por categoría, la primera de cada una: no se eligen a mano para
  // que la muestra siga al catálogo si cambian los .md.
  const sample = useMemo(
    () =>
      CATEGORIES.map((c) => cards.find((card) => card.category === c.key)).filter(
        (c): c is CatalogCard => c !== undefined
      ),
    [cards]
  );

  const shown = useMemo(() => {
    if (view === "muestra") return sample;
    if (view === "rarities") return RARITY_CARDS;
    return category === "todas" ? cards : cards.filter((c) => c.category === category);
  }, [view, category, cards, sample]);

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className={`card-lab ${cardFontVars}`} data-theme={theme}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de cartas</h1>
      <p className="mb-5 text-sm text-[var(--wiki-muted)]">
        Galería de estilos del esqueleto de carta. Cambia de diseño con las pestañas; la vista{" "}
        <b>Muestra</b> enseña una carta por categoría, que es con lo que se itera el diseño. Las
        cartas salen de las tablas de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">docs/cards/*</code>{" "}
        marcadas como catálogo, las mismas que puedes ver en modo cartas en cada apartado de la wiki.
      </p>

      {/* Controles */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Diseño</span>
          {THEMES.map((t) => (
            <button key={t.key} className={btn(theme === t.key)} onClick={() => setTheme(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Vista</span>
          <button className={btn(view === "muestra")} onClick={() => setView("muestra")}>
            Muestra ({sample.length})
          </button>
          <button className={btn(view === "cards")} onClick={() => setView("cards")}>
            Catálogo ({cards.length})
          </button>
          <button className={btn(view === "rarities")} onClick={() => setView("rarities")}>Rareza</button>
        </div>
        {view === "cards" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Categoría</span>
            <button className={btn(category === "todas")} onClick={() => setCategory("todas")}>
              Todas ({cards.length})
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.key} className={btn(category === c.key)} onClick={() => setCategory(c.key)}>
                {c.label} ({cards.filter((card) => card.category === c.key).length})
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Efectos</span>
          <button className={btn(tilt)} onClick={() => setTilt((v) => !v)}>Tilt 3D</button>
        </div>
      </div>

      {/* Escenario */}
      <div className="card-lab__stage">
        <CardFrameDefs />
        <div className="card-lab__grid">
          {shown.map((c) => (
            <GameCard key={c.id} card={c} tilt={tilt} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
