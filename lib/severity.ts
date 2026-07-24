// Paleta de severidad de Maldiciones (cards/curses.md §2) — deliberadamente
// distinta de la de Rareza (lib/rarity.ts): escala de peligro creciente
// (ámbar → rojo), no de calidad, para no confundirlas de un vistazo.
export type SeverityLevel = "leve" | "grave";

export const SEVERITY_LABEL_TO_LEVEL: Record<string, SeverityLevel> = {
  "Leve": "leve",
  "Grave": "grave",
};

export const SEVERITY_COLORS: Record<SeverityLevel, { color: string; soft: string }> = {
  leve: { color: "#d97706", soft: "rgba(217,119,6,.35)" },
  grave: { color: "#b91c1c", soft: "rgba(185,28,28,.4)" },
};
