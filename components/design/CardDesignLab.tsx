"use client";

import { isValidElement, useMemo, useState, type PointerEvent, type ReactNode } from "react";
import { EB_Garamond, Metamorphous } from "next/font/google";
import "./card-design.css";
import { CARDS, CATEGORIES, type Category, type CardData } from "./cards-data";

/* Laboratorio de diseño de carta integrado en la wiki.
   Mismo esqueleto y datos (docs/cards/*, game-design.md §3) con estilos
   conmutables por pestaña. Sin flip ni otras interacciones (solo tilt al hover). */

// Tipografía del tema Grimorio, escapada a .card-lab (no afecta al resto de la wiki).
const metamorphous = Metamorphous({ weight: "400", subsets: ["latin"], variable: "--font-metamorphous" });
const ebGaramond = EB_Garamond({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-eb-garamond" });

type Theme = "grimorio";

// Pestañas de diseño. Se van añadiendo aquí a medida que se crean nuevos
// templates de carta (cada uno como [data-theme] en card-design.css).
const THEMES: { key: Theme; label: string }[] = [
  { key: "grimorio", label: "Grimorio" },
];

// Iconos de tipo de daño (game-design.md §4b.10). Sin entrada = la carta no hace daño.
const DAMAGE_TYPE: Record<NonNullable<CardData["damageType"]>, { icon: string; label: string }> = {
  cortante: { icon: "🗡️", label: "Cortante" },
  perforante: { icon: "🏹", label: "Perforante" },
  contundente: { icon: "🔨", label: "Contundente" },
  arcano: { icon: "🔮", label: "Arcano" },
  radiante: { icon: "☀️", label: "Radiante" },
  fuego: { icon: "🔥", label: "Fuego" },
  necrotico: { icon: "💀", label: "Necrótico" },
};

// Iconos de peso de armadura (cards/armor.md §1). Sin entrada = no es armadura.
const WEIGHT: Record<NonNullable<CardData["weight"]>, { icon: string; label: string }> = {
  ligera: { icon: "🥼", label: "Ligera" },
  media: { icon: "👕", label: "Media" },
  pesada: { icon: "🧥", label: "Pesada" },
};

// Iconos de severidad de Maldición (cards/curses.md §2). Sin entrada = no es maldición.
const SEVERITY: Record<NonNullable<CardData["severity"]>, { icon: string; label: string }> = {
  leve: { icon: "🟡", label: "Leve" },
  grave: { icon: "🔴", label: "Grave" },
};

const RARITIES: { rarity: string; tag: string; legendary?: boolean }[] = [
  { rarity: "comun", tag: "Común" },
  { rarity: "poco-comun", tag: "Poco común" },
  { rarity: "raro", tag: "Raro" },
  { rarity: "epico", tag: "Épico" },
  { rarity: "legendario", tag: "Legendario", legendary: true },
];

const MAX_TILT = 10;

// Nivel de ajuste (1/2/3) según longitud real del texto — deriva del dato
// ya autorado en cards-data.tsx, así que se recalcula solo si la copia cambia.
function textLength(node: ReactNode): number {
  if (typeof node === "string") return node.length;
  if (typeof node === "number") return String(node).length;
  if (Array.isArray(node)) return node.reduce((n: number, c) => n + textLength(c), 0);
  if (isValidElement(node)) return textLength((node.props as { children?: ReactNode }).children);
  return 0;
}
function fitStep(node: ReactNode): 1 | 2 | 3 {
  const len = textLength(node);
  return len > 160 ? 3 : len > 100 ? 2 : 1;
}

function LabCard({ data, tilt }: { data: CardData; tilt: boolean }) {
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
      className={`card card--tilt${data.legendary ? " card--legendary" : ""}`}
      data-rarity={data.rarity}
      data-fit={fitStep(data.text)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="card__badge">{data.badge}</span>
      {data.hands && (
        <span className="card__hands" title={data.hands === "2h" ? "Arma a dos manos" : "Arma a una mano"}>
          {data.hands === "2h" ? "🤲" : "✋"}
        </span>
      )}
      {data.damageType && (
        <span className="card__damage-type" title={DAMAGE_TYPE[data.damageType].label}>
          {DAMAGE_TYPE[data.damageType].icon}
        </span>
      )}
      {data.weight && (
        <span className="card__hands" title={`Armadura ${WEIGHT[data.weight].label.toLowerCase()}`}>
          {WEIGHT[data.weight].icon}
        </span>
      )}
      {data.severity && (
        <span className="card__hands" title={`Severidad ${SEVERITY[data.severity].label}`}>
          {SEVERITY[data.severity].icon}
        </span>
      )}
      {data.cost && <span className="card__cost">{data.cost}</span>}
      <div className="card__art">
        <span className="emoji">{data.emoji}</span>
      </div>
      <h3 className="card__name">{data.name}</h3>
      <p className="card__text">{data.text}</p>
      <footer className="card__footer">
        {data.stats.map((s, i) => (
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

export default function CardDesignLab() {
  const [theme, setTheme] = useState<Theme>("grimorio");
  const [tilt, setTilt] = useState(true);
  const [view, setView] = useState<"cards" | "rarities">("cards");
  const [category, setCategory] = useState<Category | "todas">("todas");

  const shown = useMemo(
    () => (category === "todas" ? CARDS : CARDS.filter((c) => c.category === category)),
    [category]
  );

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className={`card-lab ${metamorphous.variable} ${ebGaramond.variable}`} data-theme={theme}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de cartas</h1>
      <p className="mb-5 text-sm text-[var(--wiki-muted)]">
        Galería de estilos del esqueleto de carta. Cambia de diseño con las pestañas. Datos de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">docs/cards/*</code>{" "}
        y <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">game-design.md</code> §3.
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
          <button className={btn(view === "cards")} onClick={() => setView("cards")}>Catálogo</button>
          <button className={btn(view === "rarities")} onClick={() => setView("rarities")}>Rareza</button>
        </div>
        {view === "cards" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Categoría</span>
            <button className={btn(category === "todas")} onClick={() => setCategory("todas")}>
              Todas ({CARDS.length})
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.key} className={btn(category === c.key)} onClick={() => setCategory(c.key)}>
                {c.label} ({CARDS.filter((card) => card.category === c.key).length})
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
        <div className="card-lab__grid">
          {view === "cards"
            ? shown.map((c) => <LabCard key={c.name} data={c} tilt={tilt} />)
            : RARITIES.map((r) => (
                <LabCard
                  key={r.rarity}
                  tilt={tilt}
                  data={{
                    category: "arma",
                    rarity: r.rarity,
                    badge: "⚔️",
                    emoji: "🗡️",
                    name: "Espada",
                    text: <>Ejemplo de rareza.</>,
                    stats: [{ k: "Daño", v: "1d8" }],
                    tag: r.tag,
                    legendary: r.legendary,
                  }}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
