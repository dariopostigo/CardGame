// =========================================================================
// Geometría hexagonal — coordenadas axiales
//
// COPIA de lib/v2/rules/hex.ts, no un import. v2 está congelado y no se
// amplía (AGENTS.md), así que si lo vigente colgara de él el corte se
// rompería en el sitio más difícil de deshacer: la geometría, que es lo que
// toca todo lo demás. Copiado, además, puede evolucionar solo —y va a tener
// que hacerlo, porque el ancho del tablero sigue siendo un dial abierto
// (docs/v3/board/battle.md §10).
//
// Coordenadas axiales (q, r) con cúbicas derivadas (s = -q - r), que es el
// estándar del género: vecinos y distancias salen con una fórmula única, sin
// los casos especiales de fila par/impar de las coordenadas por filas. Las
// fórmulas son las canónicas de Red Blob Games; no conviene reinventarlas
// (ARCHITECTURE.md §10).
//
// Orientación de la casa: hexágono PUNTIAGUDO ARRIBA (pointy-top), con las
// filas en horizontal.
//
// Qué NO se trajo de v2, y a propósito: `SKIRT_DIRECTIONS`, que dice qué lados
// enseñan el CANTO de una loseta. Eso es del tablero de exploración —piezas de
// cartón encajadas—, y el de V3 sigue siendo un esqueleto
// (docs/v3/board/board-map.md). La arena de batalla no tiene losetas ni canto.
//
// `edgeEndpoints()` sí se trajo, y en una segunda pasada: la dirección de arte
// de la arena (public/concepts/oldenEra/3.png) pinta el suelo como una LÁMINA
// continua y la rejilla como trazo encima, así que hay que poder dibujar una
// arista sola. Con ella vienen `uniqueEdges()` y `boundaryEdges()`, que son
// nuevas y no de v2: la primera dibuja la malla sin repetir la arista que dos
// hexágonos comparten, y la segunda dibuja solo el CONTORNO de una región, que
// es la forma en que la referencia marca un área.
//
// Este archivo es puro: sin React, sin azar, sin estado.
// =========================================================================

export type HexCoord = { readonly q: number; readonly r: number };

/** Clave estable para usar hexágonos en Map/Set y como key de React. */
export type HexKey = `${number},${number}`;

export function key(hex: HexCoord): HexKey {
  return `${hex.q},${hex.r}`;
}

export function fromKey(k: HexKey): HexCoord {
  const [q, r] = k.split(",").map(Number);
  return { q, r };
}

export function equals(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

/** Las 6 direcciones, en orden horario empezando por el este. */
export const DIRECTIONS: readonly HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/**
 * Nombre de cada dirección, en el orden de DIRECTIONS. Vive aquí y no en la UI
 * porque es cómo se nombra la geometría en todo el proyecto: un empujón "al NE"
 * tiene que querer decir lo mismo en el código, en el módulo de /dev y en los
 * documentos de diseño.
 */
export const DIR_LABELS: readonly string[] = ["E", "NE", "NO", "O", "SO", "SE"];

export function add(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

/** `a` visto desde `b`: el vector que lleva de b a a. */
export function subtract(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q - b.q, r: a.r - b.r };
}

/** Los 6 vecinos de un hexágono (incluidos los que caigan fuera del tablero). */
export function neighbors(hex: HexCoord): HexCoord[] {
  return DIRECTIONS.map((d) => add(hex, d));
}

/**
 * Distancia en hexágonos (número mínimo de pasos), ignorando lo que haya en
 * medio. Es la que mide los tres alcances fijos por tipo de daño
 * (lib/v3/damage.ts): 🗡️ 1 · ✨ 2 · 🏹 4.
 *
 * Para distancia con coste de movimiento haría falta un BFS con pesos, y en la
 * arena de batalla no hace falta: se juega a campo abierto y todos los
 * hexágonos cuestan lo mismo (docs/v3/board/battle.md §7).
 */
export function distance(a: HexCoord, b: HexCoord): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const ds = -dq - dr; // s cúbica
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
}

/** Todos los hexágonos a distancia ≤ radius del centro (el centro incluido). */
export function withinRadius(center: HexCoord, radius: number): HexCoord[] {
  const out: HexCoord[] = [];
  for (let dq = -radius; dq <= radius; dq++) {
    const from = Math.max(-radius, -dq - radius);
    const to = Math.min(radius, -dq + radius);
    for (let dr = from; dr <= to; dr++) {
      out.push({ q: center.q + dq, r: center.r + dr });
    }
  }
  return out;
}

// --- Rejilla escalonada (offset odd-r) -------------------------------------
// La rejilla de papel cuadriculado: filas y columnas. No la usa la geometría
// para nada, pero es el idioma en el que está ESCRITO el diseño —"7 columnas ×
// 5 filas", "bandas de 2 columnas", "frentes a 4 hexágonos" (battle.md §1)—,
// así que la arena se construye desde aquí y luego se traduce a axiales. Es lo
// que deja comparar el tablero con su documento sin hacer cuentas.

export type OffsetCoord = { readonly col: number; readonly row: number };

export function offsetToAxial({ col, row }: OffsetCoord): HexCoord {
  return { q: col - ((row - (row & 1)) >> 1), r: row };
}

export function axialToOffset({ q, r }: HexCoord): OffsetCoord {
  return { col: q + ((r - (r & 1)) >> 1), row: r };
}

// --- Línea de visión ------------------------------------------------------
// Todavía sin consumidor, y con su motivo escrito: battle.md §7 deja abierto
// si un obstáculo BLOQUEA la línea de visión o solo resta acierto, y avisa de
// que bloquear "exige un segundo sistema". Este es ese sistema, y se trae
// ahora porque es geometría canónica y no una decisión de juego: el día que la
// pregunta se responda, la respuesta no tiene que además reimplementar el
// trazado. Mientras se juegue a campo abierto no lo llama nadie.

// Interpolación en cúbicas con redondeo al hexágono más cercano.
function cubeRound(q: number, r: number): HexCoord {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);
  // Se recalcula la componente con más error, para que q + r + s = 0 siga siendo cierto.
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

/**
 * Hexágonos de la línea de a a b, ambos incluidos.
 * Sirve para la visión y para cualquier efecto "en línea recta".
 *
 * @returns {HexCoord[]} La línea ordenada de a hasta b.
 */
export function line(a: HexCoord, b: HexCoord): HexCoord[] {
  const n = distance(a, b);
  if (n === 0) return [a];
  const out: HexCoord[] = [];
  // El épsilon evita los empates exactos en las fronteras entre hexágonos,
  // que harían la línea dependiente del redondeo (y por tanto no determinista
  // a ojos del jugador: dos hexágonos simétricos darían resultados distintos).
  const eps = 1e-6;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push(cubeRound(a.q + (b.q - a.q + eps) * t, a.r + (b.r - a.r + eps) * t));
  }
  return out;
}

/**
 * ¿Hay línea de visión de from a to?
 * Bloquea si algún hexágono INTERMEDIO es opaco; el origen y el destino no
 * cuentan (ves el obstáculo que tienes delante, y desde encima de uno se ve).
 *
 * @param {(hex: HexCoord) => boolean} isOpaque - Si ese hexágono corta la visión.
 * @returns {boolean} True si la vista llega.
 */
export function hasLineOfSight(
  from: HexCoord,
  to: HexCoord,
  isOpaque: (hex: HexCoord) => boolean,
): boolean {
  const path = line(from, to);
  for (let i = 1; i < path.length - 1; i++) {
    if (isOpaque(path[i])) return false;
  }
  return true;
}

// --- Paso a píxeles -------------------------------------------------------
// Vive aquí y no en el componente porque es geometría, no cosmética: así el
// tablero se puede pintar en SVG, en canvas o no pintarse (tests) sin duplicar
// fórmulas.
//
// El segundo parámetro visual es la INCLINACIÓN (`tilt`): cuánto se comprime
// el eje vertical, que es lo que hace que el tablero se vea desde delante en
// vez de a plomo desde arriba. Es una compresión ortográfica uniforme, así que
// los hexágonos vecinos siguen tocándose exacto: no hay que tocar nada de la
// geometría, solo proyectar más bajo.
//
// Por defecto vale 1 —tablero plano— porque no toda vista quiere cámara: la
// inclinación de la arena la pone su componente (ARENA_TILT).

const SQRT3 = Math.sqrt(3);

/**
 * Centro en píxeles de un hexágono puntiagudo arriba, para un radio dado.
 *
 * @param {number} [tilt=1] - Compresión vertical; 1 es plano visto desde arriba.
 */
export function toPixel(hex: HexCoord, size: number, tilt = 1): { x: number; y: number } {
  return {
    x: size * SQRT3 * (hex.q + hex.r / 2),
    y: size * 1.5 * hex.r * tilt,
  };
}

/** Los 6 vértices de un hexágono centrado en (cx, cy), listos para <polygon>. */
export function polygonPoints(cx: number, cy: number, size: number, tilt = 1): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const { x, y } = corner(cx, cy, size, i, tilt);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

/** Ancho y alto de un hexágono puntiagudo arriba. */
export function hexSize(size: number, tilt = 1): { width: number; height: number } {
  return { width: SQRT3 * size, height: 2 * size * tilt };
}

function corner(
  cx: number,
  cy: number,
  size: number,
  index: number,
  tilt = 1,
): { x: number; y: number } {
  const angle = (Math.PI / 180) * (60 * (((index % 6) + 6) % 6) - 30);
  return { x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) * tilt };
}

/**
 * Los dos vértices que delimitan el lado que da a la dirección `dir`, con `dir`
 * en el orden de DIRECTIONS.
 *
 * El lado que mira a `dir` va del vértice (6-dir) al (7-dir). Comprobado contra
 * la orientación puntiagudo-arriba de toPixel(): con dir 0 (el este) salen los
 * vértices 0 y 1, que son el lado VERTICAL derecho, y con dir 1 (el noreste) el
 * vértice de arriba y el de arriba a la derecha.
 */
export function edgeEndpoints(
  cx: number,
  cy: number,
  size: number,
  dir: number,
  tilt = 1,
): [{ x: number; y: number }, { x: number; y: number }] {
  const d = ((dir % 6) + 6) % 6;
  return [corner(cx, cy, size, 6 - d, tilt), corner(cx, cy, size, 7 - d, tilt)];
}

// --- Aristas de un conjunto de hexágonos ----------------------------------
// Las dos funciones que hacen falta para pintar la arena como la pinta la
// referencia: el suelo es una lámina y la rejilla va ENCIMA, en trazo. Con
// polígonos no se puede —cada hexágono repintaría el lado que comparte con su
// vecino, así que el trazo interior saldría al doble de opacidad y el contorno
// de una región no se podría separar de la malla—.

/** Una arista: el hexágono al que pertenece y a qué dirección mira. */
export type HexEdge = { readonly hex: HexCoord; readonly dir: number };

/**
 * Todas las aristas del conjunto, cada una UNA sola vez.
 *
 * La que dos hexágonos comparten la dibuja solo uno de los dos, el de clave
 * mayor: comparar las claves da un orden total y estable, así que la elección
 * no depende de en qué orden llegue la lista.
 */
export function uniqueEdges(hexes: readonly HexCoord[]): HexEdge[] {
  const inside = new Set(hexes.map(key));
  const out: HexEdge[] = [];
  for (const hex of hexes) {
    const own = key(hex);
    for (let dir = 0; dir < 6; dir++) {
      const other = key(add(hex, DIRECTIONS[dir]));
      if (inside.has(other) && other < own) continue;
      out.push({ hex, dir });
    }
  }
  return out;
}

/**
 * Solo el CONTORNO de una región: las aristas cuyo vecino queda fuera de ella.
 *
 * Es cómo la referencia marca un área —un trazo cerrado alrededor, no un tinte
 * de relleno—, y por eso hace falta la arista y no el polígono: un polígono con
 * borde dibujaría también las divisiones internas del área.
 *
 * @param {readonly HexCoord[]} hexes - Los hexágonos de la región.
 */
export function boundaryEdges(hexes: readonly HexCoord[]): HexEdge[] {
  const inside = new Set(hexes.map(key));
  const out: HexEdge[] = [];
  for (const hex of hexes) {
    for (let dir = 0; dir < 6; dir++) {
      if (inside.has(key(add(hex, DIRECTIONS[dir])))) continue;
      out.push({ hex, dir });
    }
  }
  return out;
}
