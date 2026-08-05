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
import { textLength, type CardRecord, type CardStat } from "@/lib/card-table";
import { CATEGORY_BADGE } from "@/lib/card-art";
import { starsFor } from "@/lib/rarity";
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

// Ciclo de vida de la carta (cards/class.md §1).
const CARD_TYPE: Record<NonNullable<CardRecord["type"]>, string> = {
  accion: "Acción",
  pasiva: "Pasiva",
  turnos: "Turnos",
};

// Ficha suelta (Daño, Bono CA...) como texto plano para el pie de las
// categorías sin equipo: "Daño 1d8", o solo la etiqueta si no lleva valor.
function statText(s: CardStat): string {
  if (s.k) return s.v ? `${s.k} ${s.v}` : s.k;
  return s.label ?? "";
}

// Misma ficha, pero para Arma/Armadura: se cuela dentro del Efecto de la
// carta (markdown), así que el valor va en negrita como el resto de datos
// mecánicos del texto.
function statMarkdown(s: CardStat): string {
  if (s.k) return s.v ? `${s.k} **${s.v}**` : `**${s.k}**`;
  return s.label ? `**${s.label}**` : "";
}

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
  const stars = starsFor(card.rarity);

  // Arma/Armadura no llevan Tipo (son equipo, no pasan por el Mazo/Oteo,
  // class.md §1): sus fichas sueltas (Daño, Bono CA...) se cuelan en el
  // Efecto en vez de pintarse como pastilla en el pie.
  const isEquipment = card.category === "arma" || card.category === "armadura";

  const equipmentStats = isEquipment
    ? card.stats.map(statMarkdown).filter(Boolean).join(" · ")
    : "";
  const fullText = equipmentStats
    ? card.text
      ? `${card.text} · ${equipmentStats}`
      : equipmentStats
    : card.text;

  // El resto de categorías muestran ahí el Tipo (Acción/Pasiva/Turnos) y sus
  // fichas sueltas (la clase, la familia de un item, "Combate"/"Suceso"...)
  // como una línea de texto, igual que la descripción. Turnos lleva además su
  // número de usos pegado a la etiqueta ("Turnos 3") en vez de como ficha
  // flotante aparte.
  const typeLabel =
    card.type &&
    (card.type === "turnos" && card.usage != null
      ? `${CARD_TYPE[card.type]} ${card.usage}`
      : CARD_TYPE[card.type]);
  const footerText = isEquipment
    ? ""
    : [typeLabel, ...card.stats.map(statText)].filter(Boolean).join(" · ");

  // El efecto se parsea una vez por carta: en el catálogo del lab hay más de
  // cien en pantalla y sin esto cada cambio de estado (el Tilt 3D, p. ej.)
  // volvería a parsear el markdown de todas.
  const body = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={CARD_TEXT_COMPONENTS}>
        {fullText}
      </ReactMarkdown>
    ),
    [fullText]
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
      data-fit={fitStep(fullText)}
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
      <div className="card__art">
        <span className="emoji">{card.emoji}</span>
      </div>
      <div className="card__name-block">
        <h3 className="card__name">{card.name}</h3>
        {stars > 0 && (
          <div className="card__stars" title={`Nivel ${stars} de 5`} aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < stars ? "card__star" : "card__star card__star--empty"}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="card__text">{body}</p>
      <footer className="card__footer">
        {footerText && <p className="card__footer-text">{footerText}</p>}
      </footer>
      <div className="card__gloss" />
    </article>
  );
}
