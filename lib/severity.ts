// Paleta de severidad de Maldiciones (cards/curses.md §1-2) — deliberadamente
// distinta de la de Rareza (lib/rarity.ts): escala de peligro creciente
// (ámbar → rojo → púrpura), no de calidad, para no confundirlas de un vistazo.
export type SeverityLevel = "leve" | "molesta" | "grave" | "severa" | "malefica";

export const SEVERITY_LABEL_TO_LEVEL: Record<string, SeverityLevel> = {
  "Leve": "leve",
  "Molesta": "molesta",
  "Grave": "grave",
  "Severa": "severa",
  "Maléfica": "malefica",
};

export const SEVERITY_COLORS: Record<SeverityLevel, { color: string; soft: string }> = {
  leve: { color: "#d97706", soft: "rgba(217,119,6,.35)" },
  molesta: { color: "#ea580c", soft: "rgba(234,88,12,.35)" },
  grave: { color: "#b91c1c", soft: "rgba(185,28,28,.4)" },
  severa: { color: "#7f1d1d", soft: "rgba(127,29,29,.42)" },
  malefica: { color: "#3b0764", soft: "rgba(59,7,100,.45)" },
};

// Orden de progresión = nº de estrellas, leído al revés (game-design.md §3.3,
// cards/curses.md §1: 1★ Leve … 5★ Maléfica, cuanto más alto peor). Espejo de
// $severity en styles/settings/_colors.scss.
export const SEVERITY_LEVELS: readonly SeverityLevel[] = [
  "leve",
  "molesta",
  "grave",
  "severa",
  "malefica",
];
