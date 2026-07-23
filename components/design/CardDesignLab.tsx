"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import "./card-design.css";

/* Laboratorio de diseño de carta integrado en la wiki.
   Mismo esqueleto y datos (docs/cards/*, game-design.md §3) con estilos
   conmutables por pestaña. Sin flip ni otras interacciones (solo tilt al hover). */

type Theme = "dark" | "rpg" | "arcano" | "grimorio";
type Stat = { k?: string; v?: string; label?: string };
type CardData = {
  rarity: string;
  badge: string;
  cost?: string;
  emoji: string;
  name: string;
  text: ReactNode;
  stats: Stat[];
  tag: string;
  legendary?: boolean;
};

const THEMES: { key: Theme; label: string }[] = [
  { key: "dark", label: "Oscuro" },
  { key: "rpg", label: "RPG" },
  { key: "arcano", label: "Arcano" },
  { key: "grimorio", label: "Grimorio" },
];

// Set representativo — datos reales de docs/cards/* y characters/enemies.md
const CARDS: CardData[] = [
  {
    rarity: "clase",
    badge: "🛡️",
    cost: "Acción",
    emoji: "⚔️",
    name: "Golpe firme",
    text: (
      <>Ataque cuerpo a cuerpo a un enemigo adyacente <b>con ventaja</b> (2d20, coges el mejor).</>
    ),
    stats: [
      { label: "Guerrero" },
      { k: "Uso", v: "Básica" },
    ],
    tag: "Básica 1 · Clase",
  },
  {
    rarity: "poco-comun",
    badge: "⚔️",
    emoji: "🗡️",
    name: "Espada (2 manos)",
    text: (
      <>Hoja pesada a dos manos. Requiere <b>FUE 13</b>; por debajo, desventaja al atacar.</>
    ),
    stats: [
      { k: "Daño", v: "1d12" },
      { label: "Cortante" },
      { k: "Stat", v: "FUE" },
      { label: "2 manos" },
    ],
    tag: "Poco común · Arma",
  },
  {
    rarity: "poco-comun",
    badge: "🛡️",
    emoji: "🧥",
    name: "Cota de malla",
    text: <>Armadura pesada. <b>Desventaja</b> para evitar detección (ruidosa).</>,
    stats: [
      { k: "CA", v: "+6" },
      { label: "Pesada" },
      { k: "Req.", v: "FUE 13" },
    ],
    tag: "Poco común · Armadura",
  },
  {
    rarity: "epico",
    badge: "🎒",
    cost: "Pasiva",
    emoji: "🪄",
    name: "Bastón del poder",
    text: (
      <>Foco arcano: <b>+1</b> a tiradas y CD de hechizos y <b>+1 CA</b>. Potencia las cartas de Mago.</>
    ),
    stats: [
      { k: "Manos", v: "1h" },
      { label: "Foco arcano" },
    ],
    tag: "Épico · Item",
  },
  {
    rarity: "maldicion",
    badge: "💀",
    emoji: "⛓️",
    name: "Peso maldito",
    text: <>Ocupa un hueco del mazo y <b>no se puede vender</b>. Límpiala en el Templo.</>,
    stats: [
      { k: "Efecto", v: "−1 Mov." },
      { k: "Limpieza", v: "30 oro" },
    ],
    tag: "Severidad Leve · Maldición",
  },
  {
    rarity: "enemigo",
    badge: "👹",
    emoji: "🐸",
    name: "Trasgo de pantano",
    text: <>Bajo HP, <b>veneno al golpear</b>. Terreno típico: Pantano.</>,
    stats: [
      { k: "FUE", v: "9" },
      { k: "DES", v: "13" },
      { k: "CON", v: "12" },
      { k: "INT", v: "11" },
      { k: "SAB", v: "10" },
      { k: "CAR", v: "8" },
    ],
    tag: "Común · Enemigo",
  },
  {
    rarity: "legendario",
    badge: "⚔️",
    emoji: "🗡️",
    name: "Espada vorpal",
    text: (
      <>Con crítico (<b>nat 20</b>) decapita: muerte instantánea a no-jefes, daño masivo a jefes.</>
    ),
    stats: [
      { k: "Daño", v: "2d8" },
      { label: "Cortante" },
      { label: "2 manos" },
    ],
    tag: "Legendario · Arma",
    legendary: true,
  },
];

const RARITIES: { rarity: string; tag: string; legendary?: boolean }[] = [
  { rarity: "comun", tag: "Común" },
  { rarity: "poco-comun", tag: "Poco común" },
  { rarity: "raro", tag: "Raro" },
  { rarity: "epico", tag: "Épico" },
  { rarity: "legendario", tag: "Legendario", legendary: true },
];

const MAX_TILT = 10;

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
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="card__badge">{data.badge}</span>
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
      <span className="card__tag">{data.tag}</span>
      <div className="card__gloss" />
    </article>
  );
}

export default function CardDesignLab() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tilt, setTilt] = useState(true);
  const [view, setView] = useState<"cards" | "rarities">("cards");

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className="card-lab" data-theme={theme}>
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
          <button className={btn(view === "cards")} onClick={() => setView("cards")}>Set</button>
          <button className={btn(view === "rarities")} onClick={() => setView("rarities")}>Rareza</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">Efectos</span>
          <button className={btn(tilt)} onClick={() => setTilt((v) => !v)}>Tilt 3D</button>
        </div>
      </div>

      {/* Escenario */}
      <div className="card-lab__stage">
        <div className="card-lab__grid">
          {view === "cards"
            ? CARDS.map((c) => <LabCard key={c.name} data={c} tilt={tilt} />)
            : RARITIES.map((r) => (
                <LabCard
                  key={r.rarity}
                  tilt={tilt}
                  data={{
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
