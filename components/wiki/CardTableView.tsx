"use client";

// =========================================================================
// Conmutador Tabla / Cartas de un apartado de la wiki
//
// Lo inserta lib/remark-card-table.ts en cada tabla marcada con
// `<!-- cards: … -->`. Las dos vistas salen de la MISMA fila de markdown:
//   - Tabla  → `children`, la tabla renderizada de siempre (enlaces, chips,
//              tooltips). Es la fuente de verdad y no se toca.
//   - Cartas → `spec`, la proyección que hace lib/card-table.ts.
//
// Uno por tabla y no uno por página: así se puede tener Armas melee en cartas
// y Armas a distancia en tabla a la vez, y las tablas que no son catálogo se
// quedan como están.
// =========================================================================

import { useMemo, useState, type ReactNode } from "react";
import { cardFontVars } from "@/components/design/card-fonts";
import { DEFAULT_CARD_THEME } from "@/components/design/card-frames";
import GameCard from "@/components/design/GameCard";
import type { CardRecord } from "@/lib/card-table";

type View = "tabla" | "cartas";

export default function CardTableView({ spec, children }: { spec: string; children?: ReactNode }) {
  const cards = useMemo(() => (JSON.parse(spec) as { cards: CardRecord[] }).cards, [spec]);
  const [view, setView] = useState<View>("tabla");

  const btn = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-muted)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className="my-5">
      <div className="not-prose mb-2 flex items-center gap-2">
        <button className={btn(view === "tabla")} onClick={() => setView("tabla")} aria-pressed={view === "tabla"}>
          <i className="pi pi-table" style={{ fontSize: "0.75em", marginRight: "0.4em" }} />
          Tabla
        </button>
        <button className={btn(view === "cartas")} onClick={() => setView("cartas")} aria-pressed={view === "cartas"}>
          <i className="pi pi-th-large" style={{ fontSize: "0.75em", marginRight: "0.4em" }} />
          Cartas ({cards.length})
        </button>
      </div>

      {view === "tabla" ? (
        // Sin envoltorio: la tabla se queda en el contexto de prosa del
        // documento (styles/components/_prose.scss) tal cual la renderiza
        // react-markdown.
        children
      ) : (
        // Scope de los estilos de carta (styles/components/_card.scss) — el
        // mismo que usa el lab, de ahí el nombre de la clase. `not-prose`
        // aparta las cartas de la tipografía de la prosa: la carta tiene su
        // propia escala (styles/settings/_typography.scss).
        <div className={`not-prose card-lab ${cardFontVars}`} data-theme={DEFAULT_CARD_THEME}>
          <div className="card-lab__stage">
            <div className="card-lab__grid">
              {cards.map((card) => (
                <GameCard key={card.id} card={card} theme={DEFAULT_CARD_THEME} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
