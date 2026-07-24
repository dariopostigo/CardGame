// Paleta de rareza compartida entre el lab de cartas y la mini-carta de rareza
// de la wiki (components/wiki/RarityChip.tsx). Espejo de $rarity en
// styles/settings/_colors.scss: si cambia una, cambia la otra.
export type RarityLevel = "comun" | "poco-comun" | "raro" | "epico" | "legendario";

// Etiqueta de tabla (game-design.md §3.3) -> nivel. Incluye ambos géneros
// ("Épico"/"Épica", "Legendario"/"Legendaria") porque los docs no son
// consistentes entre sí (cartas concretas vs. tablas ilustrativas de progresión).
export const RARITY_LABEL_TO_LEVEL: Record<string, RarityLevel> = {
  "Común": "comun",
  "Poco común": "poco-comun",
  "Raro": "raro",
  "Rara": "raro",
  "Épico": "epico",
  "Épica": "epico",
  "Legendario": "legendario",
  "Legendaria": "legendario",
};

export const RARITY_COLORS: Record<RarityLevel, { color: string; soft: string }> = {
  comun: { color: "#9aa0a6", soft: "rgba(154,160,166,.35)" },
  "poco-comun": { color: "#3fae5a", soft: "rgba(63,174,90,.35)" },
  raro: { color: "#3b82f6", soft: "rgba(59,130,246,.35)" },
  epico: { color: "#a855f7", soft: "rgba(168,85,247,.38)" },
  legendario: { color: "#e2b53c", soft: "rgba(226,181,60,.45)" },
};
