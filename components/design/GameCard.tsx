"use client";

// =========================================================================
// La carta
//
// Un CardRecord (lib/card-table.ts, proyectado desde la tabla de su .md) →
// el esqueleto de zonas de styles/components/_card.scss. La piel la pone el
// tema activo (styles/components/card-themes/) y el marco vectorial su
// componente de card-frames.tsx.
//
// La usan los dos consumidores del catálogo: el lab de diseño
// (CardDesignLab.tsx) y la vista cartas de cada apartado de la wiki
// (components/wiki/CardTableView.tsx), así que lo que se vea en la wiki es
// exactamente lo que se está diseñando en el lab.
// =========================================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, type PointerEvent, type ReactNode } from "react";
import { textLength, type CardRecord } from "@/lib/card-table";
import { CATEGORY_BADGE } from "@/lib/card-art";
import { CARD_FRAMES, type CardTheme } from "./card-frames";

// Iconos de tipo de daño (game-design.md §4b.10).
const DAMAGE_TYPE: Record<NonNullable<CardRecord["damageType"]>, { icon: string; label: string }> = {
  cortante: { icon: "🗡️", label: "Cortante" },
  perforante: { icon: "🏹", label: "Perforante" },
  contundente: { icon: "🔨", label: "Contundente" },
  arcano: { icon: "🔮", label: "Arcano" },
  radiante: { icon: "☀️", label: "Radiante" },
  fuego: { icon: "🔥", label: "Fuego" },
  necrotico: { icon: "💀", label: "Necrótico" },
};

// Iconos de peso de armadura (cards/armor.md §1).
const WEIGHT: Record<NonNullable<CardRecord["weight"]>, { icon: string; label: string }> = {
  ligera: { icon: "🥼", label: "Ligera" },
  media: { icon: "👕", label: "Media" },
  pesada: { icon: "🧥", label: "Pesada" },
};

// Iconos de severidad de Maldición (cards/curses.md §2).
const SEVERITY: Record<NonNullable<CardRecord["severity"]>, { icon: string; label: string }> = {
  leve: { icon: "🟡", label: "Leve" },
  grave: { icon: "🔴", label: "Grave" },
};

const MAX_TILT = 10;

// Nivel de ajuste (1/2/3) según la longitud del efecto ya renderizado: reduce
// el cuerpo y permite una línea más (_card.scss, $card-fit).
function fitStep(text: string): 1 | 2 | 3 {
  const len = textLength(text);
  return len > 160 ? 3 : len > 100 ? 2 : 1;
}

// El efecto llega como markdown en línea (viene de una celda de tabla), así que
// hay que renderizar sus negritas y sus dados. Se aplana a texto en la propia
// carta: el <p> lo aporta .card__text (anidar otro sería HTML inválido) y los
// enlaces se quedan en su etiqueta — dentro de una carta no se navega.
const CARD_TEXT_COMPONENTS = {
  p: ({ children }: { children?: ReactNode }) => <>{children}</>,
  a: ({ children }: { children?: ReactNode }) => <>{children}</>,
  strong: ({ children }: { children?: ReactNode }) => <b>{children}</b>,
  code: ({ children }: { children?: ReactNode }) => <>{children}</>,
};

export default function GameCard({
  card,
  theme,
  tilt = false,
}: {
  card: CardRecord;
  theme: CardTheme;
  tilt?: boolean;
}) {
  const Frame = CARD_FRAMES[theme];

  // El efecto se parsea una vez por carta: en el catálogo del lab hay más de
  // cien en pantalla y sin esto cada cambio de estado (el Tilt 3D, p. ej.)
  // volvería a parsear el markdown de todas.
  const body = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={CARD_TEXT_COMPONENTS}>
        {card.text}
      </ReactMarkdown>
    ),
    [card.text]
  );

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!tilt) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gloss-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gloss-y", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      className={`card card--tilt${card.legendary ? " card--legendary" : ""}`}
      data-rarity={card.rarity}
      data-fit={fitStep(card.text)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Marco SVG del tema. Va primero para quedar por debajo de las fichas
          en el orden del documento. */}
      <Frame />
      <span className="card__badge" aria-hidden="true">
        {card.badge ?? CATEGORY_BADGE[card.category]}
      </span>
      {card.hands && (
        <span className="card__hands" title={card.hands === "2h" ? "Arma a dos manos" : "Arma a una mano"}>
          {card.hands === "2h" ? "🤲" : "✋"}
        </span>
      )}
      {card.damageType && (
        <span className="card__damage-type" title={DAMAGE_TYPE[card.damageType].label}>
          {DAMAGE_TYPE[card.damageType].icon}
        </span>
      )}
      {card.weight && (
        <span className="card__hands" title={`Armadura ${WEIGHT[card.weight].label.toLowerCase()}`}>
          {WEIGHT[card.weight].icon}
        </span>
      )}
      {card.severity && (
        <span className="card__hands" title={`Severidad ${SEVERITY[card.severity].label}`}>
          {SEVERITY[card.severity].icon}
        </span>
      )}
      {card.cost && <span className="card__cost">{card.cost}</span>}
      <div className="card__art">
        <span className="emoji">{card.emoji}</span>
      </div>
      <h3 className="card__name">{card.name}</h3>
      <p className="card__text">
        {card.cost && <span className="card__cost-line">{card.cost}</span>}
        {body}
      </p>
      <footer className="card__footer">
        {card.stats.map((s, i) => (
          <span className="stat" key={i}>
            {s.k && <span className="stat__k">{s.k}</span>}
            {s.v && <span className="stat__v">{s.v}</span>}
            {s.label}
          </span>
        ))}
      </footer>
      <div className="card__gloss" />
    </article>
  );
}
