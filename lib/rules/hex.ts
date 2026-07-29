// =========================================================================
// Geometría hexagonal — coordenadas axiales
//
// Coordenadas axiales (q, r) con cúbicas derivadas (s = -q - r), que es el
// estándar del género: vecinos y distancias salen con una fórmula única, sin
// los casos especiales de fila par/impar de las coordenadas por filas
// (docs/board/board-map-dev.md §1). Las fórmulas son las canónicas de
// Red Blob Games; no conviene reinventarlas.
//
// Orientación de la casa: hexágono PUNTIAGUDO ARRIBA (pointy-top), con las
// filas en horizontal. El mapa del prototipo es un rectángulo de 12×12
// (docs/board/board-map.md §2c), y para eso se usan coordenadas "por filas"
// (offset odd-r) solo en la construcción de la rejilla; el resto del motor
// trabaja siempre en axiales.
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

// Las 6 direcciones, en orden horario empezando por el este.
const DIRECTIONS: readonly HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/**
 * Nombre de cada dirección, en el orden de DIRECTIONS. Vive aquí y no en la UI
 * porque es cómo se nombra la geometría en todo el proyecto (una salida de
 * sendero "al NE" tiene que querer decir lo mismo en el código, en el lab y en
 * los documentos de diseño).
 */
export const DIR_LABELS: readonly string[] = ["E", "NE", "NO", "O", "SO", "SE"];

export function add(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

/** `a` visto desde `b`: el vector que lleva de b a a. */
export function subtract(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q - b.q, r: a.r - b.r };
}

/** Los 6 vecinos de un hexágono (incluidos los que caigan fuera del mapa). */
export function neighbors(hex: HexCoord): HexCoord[] {
  return DIRECTIONS.map((d) => add(hex, d));
}

/**
 * Distancia en hexágonos (número mínimo de pasos), ignorando el terreno.
 * Para distancia con coste de movimiento hace falta un BFS con pesos, que
 * vive en el generador y en el motor de movimiento.
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

// --- Rejilla rectangular (offset odd-r) -----------------------------------
// Solo para construir el mapa 12×12 y para saber dónde están las esquinas.
// El motor no usa estas coordenadas para nada más.

export type OffsetCoord = { readonly col: number; readonly row: number };

export function offsetToAxial({ col, row }: OffsetCoord): HexCoord {
  return { q: col - ((row - (row & 1)) >> 1), r: row };
}

export function axialToOffset({ q, r }: HexCoord): OffsetCoord {
  return { col: q + ((r - (r & 1)) >> 1), row: r };
}

/** Los hexágonos de un rectángulo de width × height, por filas. */
export function rectangle(width: number, height: number): HexCoord[] {
  const out: HexCoord[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      out.push(offsetToAxial({ col, row }));
    }
  }
  return out;
}

/** Las 4 esquinas del rectángulo — la entrada sale de aquí (§2c paso 0). */
export function corners(width: number, height: number): HexCoord[] {
  return [
    { col: 0, row: 0 },
    { col: width - 1, row: 0 },
    { col: 0, row: height - 1 },
    { col: width - 1, row: height - 1 },
  ].map(offsetToAxial);
}

// --- Línea de visión ------------------------------------------------------
// La Montaña bloquea la línea de visión (docs/board/board-map.md §3a), así
// que no basta con el radio: hay que trazar la línea hexágono a hexágono.

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
 * Se usa para la visión y para cualquier efecto "en línea recta".
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
 * cuentan (ves la montaña que tienes delante, y desde una montaña se ve).
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
// Vive aquí y no en el componente porque es geometría, no cosmética: el
// tamaño en píxeles es el único parámetro visual. Así el tablero se puede
// pintar en SVG, en canvas o no pintarse (tests) sin duplicar fórmulas.
//
// El segundo parámetro visual es la INCLINACIÓN (`tilt`): cuánto se comprime
// el eje vertical, que es lo que hace que el tablero se vea desde delante en
// vez de a plomo desde arriba (docs/board/board-map.md §2d). Es una compresión
// ortográfica uniforme, así que los hexágonos vecinos siguen tocándose exacto:
// no hay que tocar nada del motor, solo proyectar más bajo.
//
// Por defecto vale 1 —tablero plano— porque el catálogo de losetas
// (/dev/losetas) enseña la PIEZA, no la mesa, y ahí la inclinación estorba:
// sólo el tablero de partida pide la suya.

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
 * Los dos vértices que delimitan el lado que da a la dirección `dir`.
 * Sirve para dibujar el contorno de un tile: se pinta solo el lado que da a
 * otro grupo o al vacío.
 *
 * @returns {[{x,y},{x,y}]} Los extremos del lado, en orden.
 */
export function edgeEndpoints(
  cx: number,
  cy: number,
  size: number,
  dir: number,
  tilt = 1,
): [{ x: number; y: number }, { x: number; y: number }] {
  // El lado que mira a `dir` va del vértice (6-dir) al (7-dir); comprobado
  // contra la orientación puntiagudo-arriba de toPixel().
  const d = ((dir % 6) + 6) % 6;
  return [corner(cx, cy, size, 6 - d, tilt), corner(cx, cy, size, 7 - d, tilt)];
}

/**
 * Las direcciones cuyo lado enseña el CANTO de la loseta cuando el tablero va
 * inclinado: solo las dos que miran hacia abajo en pantalla, SO y SE.
 *
 * Las otras cuatro no se ven, y por dos motivos distintos:
 *  - NE y NO miran hacia arriba, así que su pared queda al otro lado de la pieza.
 *  - E y O son lados VERTICALES en pantalla (sus dos vértices comparten x), así
 *    que extruirlos hacia abajo da un polígono de área cero. No es un atajo: la
 *    compresión de `tilt` es una proyección ortográfica inclinada sobre el eje
 *    horizontal, y en ella una pared que mira al este se ve exactamente de canto.
 *    Para que asomara haría falta una cámara en perspectiva, que es lo único de
 *    la referencia que esta proyección no da.
 *
 * Vive aquí porque es una consecuencia de la orientación de DIRECTIONS y de
 * toPixel(), no del componente: si algún día el hexágono pasara a plano-arriba,
 * esta lista cambia con las fórmulas de al lado y no con el SVG.
 */
export const SKIRT_DIRECTIONS: readonly number[] = [4, 5];
