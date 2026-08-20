// =========================================================================
// Recortes del sprite de referencia (preview aislado, /lab/sprite)
//
// La lámina fuente (public/assets/v2/sprites/dwarf-warrior-reference.png, copia
// de knowledge/v2/art-direction/exampleSprite.png) es una lámina de REFERENCIA, no un
// spritesheet exportado con rejilla exacta: cada personaje se generó por
// separado y se compuso en tres bloques (Reposo/Andar/Ataque), así que el
// espaciado entre fotogramas no es perfectamente uniforme. Los rects de abajo
// son el primer cálculo (bandas verificadas a ojo contra la lámina real,
// columnas repartidas a partes iguales dentro de cada banda) — se espera
// retocarlos a mano contra el overlay de calibración de SpriteLab.tsx, no son
// un resultado cerrado. En concreto, la fila de Reposo es la que más deriva
// (los personajes 3-5 no caen centrados con columnas iguales); Andar y Ataque
// ya se verificaron razonablemente bien alineados.
//
// Todo por-fotograma: ningún estado comparte estas cifras con otro, así que
// cambiar Reposo no puede desalinear Andar por accidente.
// =========================================================================

/** Tamaño real de la lámina fuente, en píxeles. */
export const SHEET_WIDTH = 1693;
export const SHEET_HEIGHT = 929;

export const SPRITE_SHEET_SRC = "/assets/v2/sprites/dwarf-warrior-reference.png";

/** Un recorte rectangular de la lámina, en píxeles de la imagen original. */
export type FrameRect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Solo lo llevan los fotogramas con nombre propio (ver ATTACK_FRAMES). */
  readonly label?: string;
};

// --- 1. Reposo (Idle) — 5 fotogramas, banda y:[42, 285] --------------------
// A diferencia de Andar/Ataque, aquí las columnas NO salen bien de un reparto
// a partes iguales: medido por detección de contenido contra el fondo (los 5
// personajes reales caen en x:58-275/347-564/627-821/892-1081/1147-1342,
// dejando además ~350px de margen vacío tras el quinto), una rejilla de 5
// columnas iguales deja el fotograma 5 cayendo entero en ese margen —se
// veía en blanco en /lab/sprite—. Los rects de abajo están partidos por el
// punto medio de cada hueco entre personajes, no a partes iguales.
export const IDLE_FRAMES: readonly FrameRect[] = [
  { x: 0, y: 42, w: 311, h: 243 },
  { x: 311, y: 42, w: 284, h: 243 },
  { x: 595, y: 42, w: 262, h: 243 },
  { x: 857, y: 42, w: 257, h: 243 },
  { x: 1114, y: 42, w: 311, h: 243 },
];

// --- 2. Andar (Walk) — 8 fotogramas, banda y:[333, 580] --------------------
// Igual que en Reposo, partido por el punto medio de cada hueco real entre
// personajes (detección de contenido contra fondo), no a partes iguales —
// aquí el reparto real estaba ya bastante cerca del equitativo, pero se
// afina con las mismas cifras medidas.
export const WALK_FRAMES: readonly FrameRect[] = [
  { x: 0, y: 333, w: 231, h: 247 },
  { x: 231, y: 333, w: 225, h: 247 },
  { x: 456, y: 333, w: 211, h: 247 },
  { x: 667, y: 333, w: 211, h: 247 },
  { x: 878, y: 333, w: 207, h: 247 },
  { x: 1085, y: 333, w: 212, h: 247 },
  { x: 1297, y: 333, w: 202, h: 247 },
  { x: 1499, y: 333, w: 194, h: 247 },
];

// --- 3. Ataque (Ataque normal) — 7 fotogramas, banda y:[628, 855] ----------
// Rótulos tal cual los pone la propia lámina bajo cada fotograma: el ataque
// es un ciclo DE UNA VEZ (mode="once" en AnimatedSprite), no un bucle — el
// propio fotograma 7 ya es "vuelve a reposo".
export const ATTACK_FRAMES: readonly FrameRect[] = [
  { x: 0, y: 628, w: 242, h: 227, label: "Prepara" },
  { x: 242, y: 628, w: 242, h: 227, label: "Levanta" },
  { x: 484, y: 628, w: 242, h: 227, label: "Impulso" },
  { x: 726, y: 628, w: 242, h: 227, label: "Golpea" },
  { x: 968, y: 628, w: 241, h: 227, label: "Impacto" },
  { x: 1209, y: 628, w: 242, h: 227, label: "Recupera" },
  { x: 1451, y: 628, w: 242, h: 227, label: "Vuelve a reposo" },
];

export type SpriteState = "idle" | "walk" | "attack";

export const SPRITE_FRAMES: Readonly<Record<SpriteState, readonly FrameRect[]>> = {
  idle: IDLE_FRAMES,
  walk: WALK_FRAMES,
  attack: ATTACK_FRAMES,
};
