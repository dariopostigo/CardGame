// =========================================================================
// El retal: un trozo de tablero medido contra la caja que lo contiene
//
// LO QUE HACE ESTE ARCHIVO es contestar «con esta caja de píxeles, ¿de qué
// tamaño sale cada hexágono y dónde cae su centro?». Es geometría, no dibujo:
// no sabe si el retal se va a pintar en SVG, en un lienzo o en nada. Por eso
// vive en lib/v3/ y no en el componente (ARCHITECTURE.md §6, la pregunta de
// «¿podría ejecutar esto sin pantalla?»): que quince hexágonos quepan en
// 800 × 400 es una cuenta que se puede comprobar sin abrir el navegador.
//
// POR QUÉ EXISTE, que es lo que importa. Estuvo escrito DOS VECES —el mismo
// `spanX`, el mismo `size`, el mismo origen, las mismas celdas, la misma
// malla— en AnimationBench.tsx y en BarajaModule.tsx, con dos números de
// margen distintos (96 y 48) y dos suelos distintos (18 y 16). Y una tercera
// media copia en ArenaBoard.tsx, que hace lo mismo con cámara. Dos copias de
// una fórmula no son dos copias de una fórmula: son dos respuestas a la misma
// pregunta esperando a divergir, y el aliento —que también estaba dos veces—
// ya había divergido cuando se fue a mirar (una animaba el disco y la otra el
// grupo). Es el mismo argumento que sacó el gesto de soltar una carta a
// motion/deploy.ts el 10 de septiembre de 2026.
//
// LO QUE NO ES: la arena. `lib/v3/arena.ts` construye el tablero de VERDAD
// —14 × 12, con sus bandas de despliegue y de quién es cada columna— y eso es
// una regla del §1. Esto es un trozo de suelo para poder mirar de cerca una
// caída o soltar una carta; su única regla es que quepa. Los dos se cruzan en
// un sitio, y a propósito: `buildArena({cols, rows, bandDepth})` acepta las
// medidas del retal, así que quien necesite preguntar «¿hasta dónde llega esta
// ficha?» se lo pregunta al motor de movimiento con un retal y no se inventa
// un `distance <= n` que ignoraría a quien haya en medio.
//
// Fundir esto con ArenaBoard es trabajo del módulo «tablero» y sigue
// pendiente: aquí no hay cámara, ni bandas, ni alcances. Lo que se ha quitado
// es la duplicación literal, no la abstracción que falta.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";

/**
 * La compresión vertical de la cámara, y es la MISMA que la de la arena.
 *
 * Vivía en ArenaBoard.tsx —un componente— y la copiaban a mano los dos retales
 * como `const TILT = 0.67`. Se muda aquí porque es geometría: el número salió
 * de superponer esta rejilla sobre `public/concepts/oldenEra/3.png` a varias
 * compresiones y ver a cuál caen encima las columnas y las filas de la
 * referencia, y esa medida no es propiedad de ningún componente.
 *
 * No cuadra exacto y no puede: la referencia usa una cámara en PERSPECTIVA —los
 * hexágonos de delante son mayores que los del fondo— y esto es una compresión
 * ortográfica uniforme. A cambio la geometría no se deforma y un hexágono mide
 * lo mismo en todo el tablero, que es lo que necesita un juego por casillas.
 */
export const ARENA_TILT = 0.67;

const SQRT3 = Math.sqrt(3);

/** Cuántas columnas y cuántas filas tiene el trozo de suelo. */
export type PatchSpec = {
  readonly cols: number;
  readonly rows: number;
};

/**
 * El retal de los dos bancos: cinco por tres.
 *
 * Es lo justo para que quepa una embestida —atacante, hueco y objetivo, con una
 * fila por encima y otra por debajo— y lo bastante poco para que un hexágono
 * salga grande y se pueda mirar un aplastado de 110 ms de cerca. Un retal más
 * grande no enseña más: enseña lo mismo más pequeño.
 */
export const PATCH: PatchSpec = { cols: 5, rows: 3 };

/** El retal mínimo para mirar UNA secuencia sola, en los previews del catálogo. */
export const PATCH_SMALL: PatchSpec = { cols: 3, rows: 2 };

export type PatchCell = {
  readonly hex: HexCoord;
  readonly key: HexKey;
  readonly x: number;
  readonly y: number;
  /** Los seis vértices listos para un <polygon>, ya en píxeles del escenario. */
  readonly points: string;
};

export type PatchSegment = {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
};

export type PatchLayout = {
  /** El radio de un hexágono, que es la unidad de todo lo demás. */
  readonly size: number;
  readonly tilt: number;
  readonly cells: readonly PatchCell[];
  readonly centers: ReadonlyMap<HexKey, { readonly x: number; readonly y: number }>;
  /** La rejilla en trazo, cada arista una sola vez. */
  readonly mesh: readonly PatchSegment[];
  /** Lo que hay que restar a un punto para deshacer `Hex.toPixel`. */
  readonly originX: number;
  readonly originY: number;
  /** La caja contra la que se midió, que es de donde cuelga todo lo de abajo. */
  readonly box: { readonly w: number; readonly h: number };
};

/** Cómo se encaja el retal en su caja. Todo opcional: los valores son los de los bancos. */
export type FitOptions = {
  readonly tilt?: number;
  /** Aire a los lados, en píxeles. Lo que el retal NO puede usar a lo ancho. */
  readonly gutter?: number;
  /** Qué parte del alto se lleva el suelo; el resto es para la mano y el Mazo. */
  readonly groundShare?: number;
  /** El aire de arriba, antes del primer hexágono. */
  readonly topPad?: number;
  /** Por debajo de esto el retal deja de ser mirable; no de ser correcto. */
  readonly minSize?: number;
  /** Caja por debajo de la cual no se mide nada: no hay sitio y devuelve null. */
  readonly minBox?: number;
};

const DEFAULTS = {
  tilt: ARENA_TILT,
  gutter: 48,
  groundShare: 0.55,
  topPad: 18,
  minSize: 16,
  minBox: 80,
} as const;

/** Los hexágonos de un retal, en el orden de lectura: por filas, de arriba abajo. */
export function patchHexes(spec: PatchSpec = PATCH): HexCoord[] {
  const out: HexCoord[] = [];
  for (let row = 0; row < spec.rows; row++) {
    for (let col = 0; col < spec.cols; col++) out.push(Hex.offsetToAxial({ col, row }));
  }
  return out;
}

/**
 * El retal medido contra la caja de la que dispone.
 *
 * EL TAMAÑO SALE DE ENCAJARLO, no de un número elegido, y ese es el asunto: la
 * mesa tiene que verse igual de cerca en una pantalla ancha que en una
 * estrecha. Se mide todo con radio 1 —de ahí `spanX` y `spanY`, el ancho y el
 * alto del retal en radios— y luego se escala por el radio que quepa.
 *
 * El `+ SQRT3` y el `+ 2 * tilt` del span no son un margen: `toPixel` da
 * CENTROS, así que al ancho entre el primer centro y el último le falta medio
 * hexágono por cada lado.
 *
 * @returns {PatchLayout | null} null si la caja es demasiado pequeña para medir
 *   —el primer pintado de React, antes de que el `ResizeObserver` diga nada—.
 */
export function fitPatch(
  spec: PatchSpec,
  box: { w: number; h: number },
  options: FitOptions = {},
): PatchLayout | null {
  const o = { ...DEFAULTS, ...options };
  if (box.w < o.minBox || box.h < o.minBox) return null;

  const hexes = patchHexes(spec);
  const unit = hexes.map((h) => Hex.toPixel(h, 1, o.tilt));
  const minX = Math.min(...unit.map((p) => p.x));
  const maxX = Math.max(...unit.map((p) => p.x));
  const minY = Math.min(...unit.map((p) => p.y));
  const maxY = Math.max(...unit.map((p) => p.y));
  const spanX = maxX - minX + SQRT3;
  const spanY = maxY - minY + 2 * o.tilt;

  const size = Math.max(
    o.minSize,
    Math.min((box.w - o.gutter) / spanX, (box.h * o.groundShare - o.topPad) / spanY),
  );

  // El retal se centra a lo ancho y se cuelga del aire de arriba. El medio
  // hexágono que se suma es el mismo que se sumó al span: lo que se coloca son
  // centros, y el primero está a medio hexágono del borde izquierdo.
  const originX = (box.w - spanX * size) / 2 + (SQRT3 / 2) * size - minX * size;
  const originY = o.topPad + o.tilt * size - minY * size;

  const cells: PatchCell[] = hexes.map((hex, i) => {
    const x = unit[i].x * size + originX;
    const y = unit[i].y * size + originY;
    return { hex, key: Hex.key(hex), x, y, points: Hex.polygonPoints(x, y, size, o.tilt) };
  });

  const centers = new Map(cells.map((c) => [c.key, { x: c.x, y: c.y }]));

  // Cada arista UNA sola vez: el lado que comparten dos hexágonos se pintaría
  // dos veces y saldría al doble de opacidad (misma razón que en ArenaBoard).
  const mesh = Hex.uniqueEdges(hexes).map((edge) => {
    const { x, y } = centers.get(Hex.key(edge.hex)) ?? { x: 0, y: 0 };
    const [a, b] = Hex.edgeEndpoints(x, y, size, edge.dir, o.tilt);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });

  return { size, tilt: o.tilt, cells, centers, mesh, originX, originY, box: { w: box.w, h: box.h } };
}

/**
 * La celda bajo un punto del escenario, o null si el punto cae fuera.
 *
 * `Hex.fromPixel` deshace la fórmula de `toPixel` y redondea al hexágono más
 * cercano, así que SIEMPRE devuelve uno: quien dice que el punto está fuera es
 * la comprobación de que ese hexágono pertenece al retal, más un radio de
 * tolerancia para que soltar dos píxeles por debajo del borde no cuente como
 * haber acertado en la última fila.
 *
 * Había otra versión de esto —recorrer las celdas buscando la más cercana— y no
 * es equivalente aunque lo pareciera: aquella no deshacía la compresión al medir
 * la tolerancia, así que la generosidad salía elíptica y la fila de abajo
 * aceptaba clics de bastante más lejos que el resto.
 */
export function cellAt(layout: PatchLayout, x: number, y: number): PatchCell | null {
  const hex = Hex.fromPixel(x - layout.originX, y - layout.originY, layout.size, layout.tilt);
  const key = Hex.key(hex);
  const center = layout.centers.get(key);
  if (!center) return null;
  const dx = x - center.x;
  // El alto va comprimido por la cámara: sin deshacerlo, la tolerancia sería
  // una elipse y la fila de abajo aceptaría clics de mucho más lejos.
  const dy = (y - center.y) / layout.tilt;
  if (dx * dx + dy * dy > (layout.size * 1.05) ** 2) return null;
  return layout.cells.find((c) => c.key === key) ?? null;
}

/**
 * El hexágono por el que entra la mano: abajo y en el centro.
 *
 * Una ficha que se mueve hace nacer la onda de la oferta en ella misma, pero una
 * CARTA no está en el tablero: viene de la mano, que está abajo. Así el terreno
 * se abre hacia el fondo, en la misma dirección en la que va el gesto, en vez de
 * encenderse desde una esquina cualquiera.
 */
export function handEntry(spec: PatchSpec = PATCH): HexCoord {
  return Hex.offsetToAxial({ col: Math.floor(spec.cols / 2), row: spec.rows - 1 });
}
