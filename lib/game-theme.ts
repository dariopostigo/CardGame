// Paleta del tema de producción, para las muestras de
// app/repository-pro/foundations. Espejo de $game en
// styles/settings/_game.scss: si cambia una, cambia la otra.
export type GameToken =
  | "bg"
  | "surface"
  | "surface-2"
  | "stone-hi"
  | "stone-lo"
  | "border"
  | "text"
  | "muted"
  | "accent"
  | "accent-hi"
  | "accent-lo"
  | "accent-glow"
  | "gold"
  | "gold-hi"
  | "gold-lo";

export const GAME_COLORS: Record<GameToken, string> = {
  bg: "#100c0a",
  surface: "#1a1411",
  "surface-2": "#241d18",
  "stone-hi": "#8d7b70",
  "stone-lo": "#26201c",
  border: "#0a0706",
  text: "#ede3d4",
  muted: "#a6937a",
  accent: "#4b120d",
  "accent-hi": "#d9422c",
  "accent-lo": "#230705",
  "accent-glow": "rgba(217,66,44,.45)",
  gold: "#d9a53c",
  "gold-hi": "#fff0bd",
  "gold-lo": "#ffab27",
};

/** Grupos de la paleta para la página de Fundamentos, en el orden del mapa Sass. */
export const GAME_COLOR_GROUPS: ReadonlyArray<{
  title: string;
  tokens: readonly GameToken[];
}> = [
  { title: "Superficies", tokens: ["bg", "surface", "surface-2", "stone-hi", "stone-lo", "border"] },
  { title: "Texto", tokens: ["text", "muted"] },
  { title: "Acento — sangre", tokens: ["accent", "accent-hi", "accent-lo", "accent-glow"] },
  { title: "Oro — grabado y filetes", tokens: ["gold", "gold-hi", "gold-lo"] },
];
