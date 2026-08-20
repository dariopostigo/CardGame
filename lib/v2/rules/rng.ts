// =========================================================================
// Azar con semilla
//
// El motor NO usa Math.random(). El generador es un valor más del estado: se
// recibe y se devuelve, igual que el resto del estado. Eso es lo que hace
// posibles las tres cosas de las que depende el balance (ARCHITECTURE.md §9):
// repetir una partida exacta, guardarla como semilla + log de acciones, y
// simular miles de partidas sin pantalla.
//
// Convención: toda función devuelve [valor, rngSiguiente]. Nunca muta.
// =========================================================================

/** Estado del generador. Opaco a propósito: solo rng.ts lo interpreta. */
export type Rng = { readonly s: number };

/** Crea un generador a partir de una semilla legible por humanos. */
export function rngFromSeed(seed: number | string): Rng {
  return { s: typeof seed === "number" ? seed >>> 0 : hashString(seed) };
}

// Hash de cadena (FNV-1a de 32 bits) para poder usar semillas como "trol-42".
function hashString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Avanzar el generador un paso.
 * mulberry32: 32 bits de estado, distribución buena de sobra para un juego de
 * mesa y, sobre todo, reproducible entre ejecuciones y entre máquinas (no
 * depende de la implementación de Math.random del motor de JS).
 *
 * @param {Rng} rng - Generador actual.
 * @returns {[number, Rng]} Flotante en [0, 1) y el generador siguiente.
 */
export function next(rng: Rng): [number, Rng] {
  const a = (rng.s + 0x6d2b79f5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, { s: a }];
}

/**
 * Entero uniforme en [min, max], ambos incluidos.
 *
 * @returns {[number, Rng]} El entero y el generador siguiente.
 */
export function int(rng: Rng, min: number, max: number): [number, Rng] {
  const [v, r] = next(rng);
  return [min + Math.floor(v * (max - min + 1)), r];
}

/**
 * Tirar dados al estilo D&D: `roll(rng, 2, 6)` = 2d6.
 *
 * @returns {[number, Rng]} La suma de las tiradas y el generador siguiente.
 */
export function roll(rng: Rng, count: number, sides: number): [number, Rng] {
  let total = 0;
  let r = rng;
  for (let i = 0; i < count; i++) {
    const [v, next] = int(r, 1, sides);
    total += v;
    r = next;
  }
  return [total, r];
}

/** Un d20 pelado, que es la tirada de la casa (game-design.md §4b). */
export function d20(rng: Rng): [number, Rng] {
  return int(rng, 1, 20);
}

/**
 * Elegir un elemento al azar de una lista no vacía.
 *
 * @returns {[T, Rng]} El elemento elegido y el generador siguiente.
 */
export function pick<T>(rng: Rng, items: readonly T[]): [T, Rng] {
  if (items.length === 0) throw new Error("pick(): lista vacía");
  const [i, r] = int(rng, 0, items.length - 1);
  return [items[i], r];
}

/**
 * Elegir un elemento con pesos relativos. Los pesos ≤ 0 no salen nunca.
 * Es la primitiva de las tablas A y B del generador de mapa
 * (docs/board/board-map.md §2c).
 *
 * @param {ReadonlyArray<[T, number]>} entries - Pares [elemento, peso].
 * @returns {[T, Rng]} El elemento elegido y el generador siguiente.
 */
export function pickWeighted<T>(rng: Rng, entries: ReadonlyArray<readonly [T, number]>): [T, Rng] {
  const total = entries.reduce((sum, [, w]) => sum + Math.max(0, w), 0);
  if (total <= 0) throw new Error("pickWeighted(): todos los pesos son 0");
  const [v, r] = next(rng);
  let threshold = v * total;
  for (const [item, weight] of entries) {
    threshold -= Math.max(0, weight);
    if (threshold < 0) return [item, r];
  }
  // Solo alcanzable por error de redondeo en el último tramo.
  return [entries[entries.length - 1][0], r];
}

/**
 * Baraja de Fisher-Yates. Devuelve una copia; no toca la entrada.
 *
 * @returns {[T[], Rng]} La lista barajada y el generador siguiente.
 */
export function shuffle<T>(rng: Rng, items: readonly T[]): [T[], Rng] {
  const out = [...items];
  let r = rng;
  for (let i = out.length - 1; i > 0; i--) {
    const [j, nextR] = int(r, 0, i);
    [out[i], out[j]] = [out[j], out[i]];
    r = nextR;
  }
  return [out, r];
}
