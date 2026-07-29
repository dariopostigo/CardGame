// =========================================================================
// Qué es una LOSETA
//
// Una loseta es una pieza predefinida de hexágonos con su forma, su terreno y
// sus anclas. Es la unidad con la que se construye el tablero, y se maqueta a
// mano. Este archivo dice qué es una loseta y qué se puede hacer con ella;
// CUÁLES hay está en tile-library.ts, que lee data/tile-library.json. Quien las
// encaja es board-gen.ts; quien las enseña y las edita es /dev/losetas.
//
// El tablero no es una rejilla: se construye encajando losetas, como en los
// juegos de tablero modular. Es el sistema de docs/board/board-map.md §2.
//
// TRES palabras, y conviene no mezclarlas:
//   · BIBLIOTECA — todo lo que existe (tile-library.ts).
//   · TIPO       — un sitio del mundo: un Peñasco, una Ciénaga, una Posada. Lo
//     define UN terreno, tiene un peso en la bolsa y agrupa sus variantes.
//   · VARIANTE   — una loseta concreta de ese tipo. Varios peñascos distintos,
//     de formas y tamaños distintos, son variantes del mismo tipo, y al tablero
//     le da igual cuál le toque: son el mismo sitio dibujado de otra manera.
//
// Una loseta fija TRES cosas:
//   · FORMA   — qué hexágonos la componen, en coordenadas locales con (0,0)
//     dentro. Cuántos puede tener lo dice su TAMAÑO (TILE_SIZES).
//   · TERRENO — el de cada uno de sus hexágonos, y es OBLIGATORIO: no existe
//     "este lo sortea el tablero". Una loseta llega pintada entera, así que lo
//     que se ve en el catálogo es exactamente lo que va a salir en la partida, y
//     el terreno del tablero lo decide el maquetado y nada más. La variedad
//     entre partidas la dan las variantes de cada tipo y el giro, no el azar
//     hexágono a hexágono.
//   · ANCLAS  — los bordes exteriores por los que se une a otra loseta.
//
// ANCLAS. Una loseta solo se une a otra ancla contra ancla; el resto de su
// contorno es pared. Los bordes interiores no existen como ancla: un hexágono
// rodeado por los suyos no tiene ningún lado libre que ofrecer. La regla de
// encaje es simétrica —un ancla nunca puede quedar pegada a una pared ajena—,
// así que las anclas son el único sitio donde se decide la forma de unión
// entre dos losetas. Dibujadas, son flechitas que apuntan al lado por el que la
// loseta se ofrece, dentro del hexágono.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord } from "./hex";
import { TERRAINS, type TerrainId, isOpenGround } from "./terrain";

/** Un hexágono de la loseta. Todos llevan terreno; no hay hexágono sin pintar. */
export type TileCell = { readonly hex: HexCoord; readonly terrain: TerrainId };

/** Un borde de un hexágono: quién y hacia dónde (dirección 0-5). */
export type TileEdge = { readonly hex: HexCoord; readonly dir: number };

/** Una loseta concreta: una VARIANTE de un tipo, lista para el tablero. */
export type TileDef = {
  readonly id: string;
  readonly label: string;
  /** El tipo del que es variante (`TileType.id`). */
  readonly typeId: string;
  /**
   * Por qué está dibujada así. El juego no la usa: es la nota de maquetado, y
   * está en el dato porque la biblioteca vive en un JSON, que no admite
   * comentarios, y perder el "por qué" de una pieza es perder lo único que no se
   * puede deducir mirándola.
   */
  readonly note: string;
  /** Hexágonos con su terreno, en coordenadas locales; siempre incluye (0,0). */
  readonly cells: readonly TileCell[];
  /** Bordes exteriores por los que esta loseta se une a otra. */
  readonly anchors: readonly TileEdge[];
  /**
   * Frecuencia relativa en la bolsa. No se maqueta por loseta: es el peso de su
   * TIPO repartido entre sus variantes, porque lo que se elige es el sitio y no
   * el dibujo (`tileTypeToDefs`).
   */
  readonly weight: number;
};

// --- Tamaños ---------------------------------------------------------------

/**
 * Los 5 tamaños de loseta. La capacidad se dobla en cada nivel a partir de 4,
 * así que una loseta grande no es "un poco más grande": es otra escala de pieza
 * y se maqueta pensando en otra cosa (la Mínima es un accidente del terreno, la
 * Enorme es una región con su propio interior).
 *
 * `gridRadius` es cosa del editor: el papel cuadriculado que hace falta para
 * dibujar ese tamaño. La rejilla es redonda, así que una loseta muy alargada
 * necesita subir de tamaño aunque le sobren hexágonos.
 */
export type TileSize = {
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly label: string;
  /** Máximo de hexágonos de una loseta de este tamaño. */
  readonly capacity: number;
  /** Radio de la rejilla del editor que la contiene. */
  readonly gridRadius: number;
};

export const TILE_SIZES: readonly TileSize[] = [
  { level: 1, label: "Mínima", capacity: 4, gridRadius: 2 },
  { level: 2, label: "Pequeña", capacity: 8, gridRadius: 3 },
  { level: 3, label: "Mediana", capacity: 16, gridRadius: 4 },
  { level: 4, label: "Grande", capacity: 32, gridRadius: 5 },
  { level: 5, label: "Enorme", capacity: 64, gridRadius: 6 },
];

/** Hexágonos de la loseta más grande posible. */
export const MAX_TILE_HEXES = TILE_SIZES[TILE_SIZES.length - 1].capacity;

/** Mínimo para que una loseta sea una pieza y no un hexágono suelto. */
export const MIN_TILE_HEXES = 3;

/**
 * El tamaño de una loseta: el nivel más pequeño que la contiene. Se deriva del
 * número de hexágonos en vez de guardarse, para que no puedan discrepar.
 *
 * @param {number} hexes - Hexágonos de la loseta.
 * @returns {TileSize} El tamaño; el mayor si se pasa de la capacidad máxima.
 */
export function sizeForHexes(hexes: number): TileSize {
  return TILE_SIZES.find((s) => hexes <= s.capacity) ?? TILE_SIZES[TILE_SIZES.length - 1];
}

export function sizeOf(def: TileDef): TileSize {
  return sizeForHexes(def.cells.length);
}

// --- Consultas sobre una definición ---------------------------------------

/** Solo la forma, sin el terreno. */
export function shapeOf(def: TileDef): HexCoord[] {
  return def.cells.map((c) => c.hex);
}

/** Los hexágonos de Camino: los que la loseta fija como sendero. */
export function roadsOf(def: TileDef): HexCoord[] {
  return def.cells.filter((c) => c.terrain === "camino").map((c) => c.hex);
}

/** Cuántos hexágonos tiene la loseta de cada terreno. */
export function terrainCounts(def: TileDef): Map<TerrainId, number> {
  const counts = new Map<TerrainId, number>();
  for (const cell of def.cells) {
    counts.set(cell.terrain, (counts.get(cell.terrain) ?? 0) + 1);
  }
  return counts;
}

// --- Losetas dibujadas -----------------------------------------------------

/**
 * El carácter con el que se dibuja cada terreno. Fuente única de la letra: la
 * lee `drawn()` para leer un dibujo y `TERRAIN_CHAR` para escribirlo.
 * Dos letras no son la inicial porque la inicial estaba pedida: la Mazmorra es
 * "Z" (ma-Z-morra, la M es de Montaña) y el Pueblo es "U" (p-U-eblo, la P es de
 * Pantano).
 */
export const TERRAIN_CHARS: ReadonlyMap<string, TerrainId> = new Map<string, TerrainId>([
  ["L", "llanura"],
  ["C", "camino"],
  ["B", "bosque"],
  ["P", "pantano"],
  ["M", "montana"],
  ["Z", "mazmorra"],
  ["U", "pueblo"],
]);

/** La inversa: el carácter de cada terreno, para escribir un dibujo. */
export const TERRAIN_CHAR: Readonly<Record<TerrainId, string>> = Object.fromEntries(
  [...TERRAIN_CHARS].map(([char, id]) => [id, char]),
) as Record<TerrainId, string>;

/** Una loseta tal y como se maqueta: dibujada, con sus anclas sobre el dibujo. */
export type TileDrawing = {
  readonly id: string;
  readonly label: string;
  readonly typeId: string;
  readonly note: string;
  readonly weight: number;
  /** Una cadena por fila de hexágonos, un carácter por hexágono. */
  readonly art: readonly string[];
  /** Anclas como [columna, fila, dirección] del dibujo. */
  readonly anchors: ReadonlyArray<readonly [col: number, row: number, dir: number]>;
};

/**
 * Convertir un dibujo en una loseta.
 *
 * El dibujo es el formato de maquetado de la biblioteca: cada cadena es una
 * fila de hexágonos y cada carácter uno de ellos —espacio para el hueco y una
 * letra por terreno (`TERRAIN_CHARS`); todo hexágono lleva la suya, no hay
 * hexágono sin pintar—. Las filas impares van
 * medio hexágono a la derecha, que es la rejilla escalonada de hex.ts
 * (`offsetToAxial`), así que el dibujo se lee como el trozo de mapa que
 * representa. Se maqueta mirándolo, y no contando coordenadas: veinte
 * hexágonos escritos como literales {q, r} esconden un duplicado o un hueco sin
 * que nadie lo note.
 *
 * El (0,0) de la loseta cae en su primer hexágono (el de más arriba a la
 * izquierda), así que el dibujo se puede mover por el papel sin tocar nada.
 *
 * @param {TileDrawing} drawing - Dibujo, anclas y datos de bolsa.
 * @returns {TileDef} La loseta lista para la biblioteca.
 */
export function drawn(drawing: TileDrawing): TileDef {
  const marks: TileCell[] = [];
  for (let row = 0; row < drawing.art.length; row++) {
    const line = drawing.art[row];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (char === " ") continue;
      if (char === ".") {
        // El punto era "al sorteo", y ya no existe: todo hexágono lleva terreno.
        // Se avisa aparte porque la biblioteca vieja está llena de puntos y el
        // mensaje genérico no diría qué hacer.
        throw new Error(
          `Loseta ${drawing.id}: el "." era «al sorteo» y ya no existe; ` +
            `pinta ese hexágono con un terreno (${[...TERRAIN_CHARS.keys()].join(" ")})`,
        );
      }
      if (!TERRAIN_CHARS.has(char)) {
        // Error de maquetado, no de datos: mejor que reviente el build.
        throw new Error(`Loseta ${drawing.id}: "${char}" no es un terreno del dibujo`);
      }
      marks.push({ hex: Hex.offsetToAxial({ col, row }), terrain: TERRAIN_CHARS.get(char)! });
    }
  }
  if (marks.length === 0) {
    throw new Error(`Loseta ${drawing.id}: el dibujo está vacío`);
  }

  const base = marks[0].hex;
  const shift = (hex: HexCoord): HexCoord => ({ q: hex.q - base.q, r: hex.r - base.r });

  return {
    id: drawing.id,
    label: drawing.label,
    typeId: drawing.typeId,
    note: drawing.note,
    weight: drawing.weight,
    cells: marks.map((c) => ({ hex: shift(c.hex), terrain: c.terrain })),
    anchors: drawing.anchors.map(([col, row, dir]) => ({
      hex: shift(Hex.offsetToAxial({ col, row })),
      dir,
    })),
  };
}

/**
 * La loseta DIBUJADA: la inversa de `drawn()`. Una cadena por fila de hexágonos,
 * un carácter por hexágono, y las anclas como [columna, fila, dirección] de ese
 * mismo dibujo.
 *
 * El dibujo es CANÓNICO: la misma loseta da el mismo dibujo esté donde esté en el
 * papel, y por eso abrirla en el editor y guardarla sin tocar nada no mueve el
 * fichero. Para conseguirlo, la loseta se traslada primero en coordenadas
 * AXIALES —arrimarla a la fila 0 y a la columna 0— y solo después se pasa a la
 * rejilla escalonada. El orden importa: mover el dibujo por el papel (mover filas
 * dejando las columnas donde están) un número impar de filas no lo traslada, lo
 * deforma, porque las filas impares van medio hexágono a la derecha. Trasladar en
 * axiales y recalcular las columnas después es lo único que sale bien siempre.
 *
 * @param {TileDef} def - Una loseta cualquiera, esté donde esté.
 * @returns {TileDrawing} El dibujo, listo para `drawn()` o para escribirlo.
 */
export function toDrawing(def: TileDef): TileDrawing {
  const head = {
    id: def.id,
    label: def.label,
    typeId: def.typeId,
    note: def.note,
    weight: def.weight,
  };
  if (def.cells.length === 0) return { ...head, art: [], anchors: [] };

  // 1. Traslación en axiales, para arrimar la loseta a la esquina del papel.
  const minR = Math.min(...def.cells.map((c) => c.hex.r));
  const shift = (hex: HexCoord): HexCoord => ({ q: hex.q, r: hex.r - minR });
  const cells = def.cells.map((c) => ({ ...Hex.axialToOffset(shift(c.hex)), terrain: c.terrain }));
  const minCol = Math.min(...cells.map((c) => c.col));

  // 2. Y ahora sí, el dibujo.
  const grid: string[][] = [];
  for (const cell of cells) {
    grid[cell.row] ??= [];
    grid[cell.row][cell.col - minCol] = TERRAIN_CHAR[cell.terrain];
  }

  const art: string[] = [];
  for (let row = 0; row < grid.length; row++) {
    const chars = grid[row] ?? [];
    let line = "";
    for (let col = 0; col < chars.length; col++) line += chars[col] ?? " ";
    art.push(line);
  }

  return {
    ...head,
    art,
    anchors: def.anchors.map((a) => {
      const { col, row } = Hex.axialToOffset(shift(a.hex));
      return [col - minCol, row, a.dir] as const;
    }),
  };
}

// --- Tipos de loseta -------------------------------------------------------

/**
 * Un TIPO de loseta: un sitio del mundo con todas las maneras de dibujarlo.
 *
 * El tipo es lo que se elige al construir el tablero ("aquí va un peñasco") y la
 * variante es solo el dibujo que le toca. De ahí sale el reparto del peso: la
 * bolsa sortea TIPOS, y dentro del tipo las variantes salen a partes iguales.
 * Añadir un peñasco nuevo no hace que salgan más peñascos, hace que se repitan
 * menos, que es justo para lo que sirven las variantes.
 */
export type TileType = {
  readonly id: string;
  readonly label: string;
  /**
   * El terreno que define el tipo: un Peñasco es Montaña, una Ciénaga es
   * Pantano. Es su IDENTIDAD, no una restricción — una variante puede meter
   * cualquier otro terreno cuando el sitio lo pide (el Camino que cruza el paso
   * de montaña, el Pantano al que baja el vado), y para eso están los avisos de
   * `typeNotes`: que la excepción sea una decisión y no un descuido.
   */
  readonly terrain: TerrainId;
  /** Frecuencia relativa del TIPO en la bolsa. Se reparte entre sus variantes. */
  readonly weight: number;
  /** Qué sitio es y por qué existe en la bolsa (ver `TileDef.note`). */
  readonly note: string;
  readonly variants: readonly TileDef[];
};

/** Todas las variantes de todos los tipos: la bolsa como lista plana. */
export function allVariants(types: readonly TileType[]): TileDef[] {
  return types.flatMap((type) => [...type.variants]);
}

/** Cuántos hexágonos tiene cada variante, sumados. Mide el tamaño real de un tipo. */
export function typeHexes(type: TileType): number {
  return type.variants.reduce((sum, def) => sum + def.cells.length, 0);
}

// --- La biblioteca guardada ------------------------------------------------

/**
 * Un ancla en el dibujo: columna, fila y el NOMBRE de la dirección ("E", "NE"…).
 * En el fichero va el nombre y no el índice a propósito: `[3, 4, "SE"]` se
 * entiende leyéndolo y `[3, 4, 5]` hay que ir a buscarlo.
 */
export type StoredAnchor = readonly [col: number, row: number, dir: string];

/** Una variante tal y como se guarda: el dibujo y sus anclas, nada derivado. */
export type StoredVariant = {
  readonly id: string;
  readonly label: string;
  /** Nota de maquetado; el JSON no tiene comentarios y este campo los sustituye. */
  readonly note: string;
  readonly art: readonly string[];
  readonly anchors: readonly StoredAnchor[];
};

export type StoredType = {
  readonly id: string;
  readonly label: string;
  readonly terrain: TerrainId;
  readonly weight: number;
  readonly note: string;
  readonly variants: readonly StoredVariant[];
};

/** El contenido de data/tile-library.json. */
export type StoredLibrary = { readonly types: readonly StoredType[] };

/**
 * Leer la biblioteca guardada.
 *
 * Comprueba el JSON a mano, campo a campo, porque este mismo parser recibe lo
 * que manda el editor de /dev/losetas por la ruta de guardado: los datos vienen
 * de fuera del compilador, así que un fichero a medias tiene que dar un error
 * que se entienda y no un `undefined` tres capas más abajo.
 *
 * @param {unknown} data - El JSON ya parseado.
 * @returns {TileType[]} Los tipos con sus variantes ya dibujadas.
 */
export function parseLibrary(data: unknown): TileType[] {
  if (typeof data !== "object" || data === null || !Array.isArray((data as StoredLibrary).types)) {
    throw new Error("La biblioteca tiene que ser un objeto { types: [...] }");
  }
  return (data as { types: readonly unknown[] }).types.map(parseType);
}

function parseType(raw: unknown, index: number): TileType {
  const where = `tipo #${index + 1}`;
  const type = asObject(raw, where);
  const id = asString(type.id, `${where}: id`);
  const label = asString(type.label, `tipo ${id}: label`);
  const terrain = asString(type.terrain, `tipo ${id}: terrain`);
  const weight = asNumber(type.weight, `tipo ${id}: weight`);

  if (!(terrain in TERRAINS)) {
    throw new Error(`tipo ${id}: "${terrain}" no es un terreno de terrain.ts`);
  }
  const variants = asArray(type.variants, `tipo ${id}: variants`);
  if (variants.length === 0) {
    throw new Error(`tipo ${id}: sin variantes; un tipo sin dibujos no es nada`);
  }

  // El peso del tipo, repartido: lo que se sortea es el sitio.
  const share = weight / variants.length;

  return {
    id,
    label,
    terrain: terrain as TerrainId,
    weight,
    note: asNote(type.note),
    variants: variants.map((variant, i) => parseVariant(variant, i, id, share)),
  };
}

function parseVariant(raw: unknown, index: number, typeId: string, weight: number): TileDef {
  const where = `${typeId}, variante #${index + 1}`;
  const variant = asObject(raw, where);
  const id = asString(variant.id, `${where}: id`);
  const label = asString(variant.label, `variante ${id}: label`);

  const art = asArray(variant.art, `variante ${id}: art`).map((line, row) =>
    asString(line, `variante ${id}: art[${row}]`),
  );
  const anchors = asArray(variant.anchors, `variante ${id}: anchors`).map((anchor, i) => {
    const parts = asArray(anchor, `variante ${id}: anchors[${i}]`);
    if (parts.length !== 3) {
      throw new Error(`variante ${id}: el ancla #${i + 1} no es [columna, fila, dirección]`);
    }
    const dir = Hex.DIR_LABELS.indexOf(asString(parts[2], `variante ${id}: anchors[${i}][2]`));
    if (dir < 0) {
      throw new Error(
        `variante ${id}: "${parts[2]}" no es una dirección (${Hex.DIR_LABELS.join(", ")})`,
      );
    }
    return [
      asNumber(parts[0], `variante ${id}: anchors[${i}][0]`),
      asNumber(parts[1], `variante ${id}: anchors[${i}][1]`),
      dir,
    ] as const;
  });

  return drawn({ id, label, typeId, weight, note: asNote(variant.note), art, anchors });
}

/** La nota es opcional: una loseta sin explicar es peor, pero no está rota. */
function asNote(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * La vuelta: de tipos a lo que se escribe en el fichero. Es la inversa de
 * `parseLibrary`, y se usa para dos cosas —guardar lo que edita /dev/losetas y
 * tener la forma guardada sin castear el JSON importado—, así que el ida y vuelta
 * tiene que ser exacto: lo que se lee y se vuelve a escribir sin tocar nada no
 * puede salir distinto, o cada guardado ensuciaría el diff.
 *
 * @returns {StoredLibrary} El contenido del fichero.
 */
export function toStoredLibrary(types: readonly TileType[]): StoredLibrary {
  return { types: types.map(toStoredType) };
}

export function toStoredType(type: TileType): StoredType {
  return {
    id: type.id,
    label: type.label,
    terrain: type.terrain,
    weight: type.weight,
    note: type.note,
    variants: type.variants.map(toStoredVariant),
  };
}

export function toStoredVariant(def: TileDef): StoredVariant {
  const drawing = toDrawing(def);
  return {
    id: drawing.id,
    label: drawing.label,
    note: drawing.note,
    art: drawing.art,
    anchors: drawing.anchors.map(([col, row, dir]) => [col, row, Hex.DIR_LABELS[dir]] as const),
  };
}

function asObject(value: unknown, where: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${where}: se esperaba un objeto`);
  }
  return value as Record<string, unknown>;
}

function asArray(value: unknown, where: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new Error(`${where}: se esperaba una lista`);
  return value;
}

function asString(value: unknown, where: string): string {
  if (typeof value !== "string") throw new Error(`${where}: se esperaba texto`);
  return value;
}

function asNumber(value: unknown, where: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${where}: se esperaba un número`);
  }
  return value;
}

// --- Rotación --------------------------------------------------------------

/**
 * Girar un hexágono local `steps` pasos de 60° en sentido antihorario.
 * En cúbicas el giro antihorario es (q,r,s) → (-s,-q,-r); en axiales queda
 * (q,r) → (q+r, -q).
 *
 * @returns {HexCoord} El hexágono girado.
 */
export function rotate(hex: HexCoord, steps: number): HexCoord {
  let { q, r } = hex;
  for (let i = 0; i < ((steps % 6) + 6) % 6; i++) {
    [q, r] = [q + r, -q];
  }
  return { q, r };
}

/** La dirección `dir` girada los mismos pasos: el índice avanza igual. */
export function rotateDir(dir: number, steps: number): number {
  return (((dir + steps) % 6) + 6) % 6;
}

// --- Instancia colocada ----------------------------------------------------

/** Un borde exterior de una loseta colocada, y si es ancla o pared. */
export type PlacedEdge = {
  readonly hex: HexCoord;
  readonly dir: number;
  readonly isAnchor: boolean;
};

/** Una loseta ya girada y trasladada: lo que de verdad se coloca en el tablero. */
export type TileInstance = {
  readonly defId: string;
  /** Pasos de 60° aplicados. */
  readonly rotation: number;
  /** Dónde cae el (0,0) local. */
  readonly origin: HexCoord;
  /** Hexágonos con su terreno, en coordenadas del tablero. */
  readonly cells: readonly TileCell[];
  /** Solo las coordenadas, para comprobar solapes rápido. */
  readonly hexes: readonly HexCoord[];
  /** TODO el contorno: cada borde exterior, sea ancla o pared. */
  readonly edges: readonly PlacedEdge[];
  /** Los bordes que son ancla — subconjunto de `edges`. */
  readonly anchors: readonly TileEdge[];
};

/**
 * Girar y trasladar una loseta de la biblioteca.
 *
 * @param {TileDef} def - Loseta de la biblioteca.
 * @param {number} rotation - Pasos de 60° antihorarios.
 * @param {HexCoord} origin - Dónde cae el (0,0) local, ya girado.
 * @returns {TileInstance} La loseta lista para comprobar encaje y colocar.
 */
export function instantiate(def: TileDef, rotation: number, origin: HexCoord): TileInstance {
  const place = (h: HexCoord) => Hex.add(rotate(h, rotation), origin);
  const cells = def.cells.map((c) => ({ hex: place(c.hex), terrain: c.terrain }));
  const hexes = cells.map((c) => c.hex);

  const local = new Set(def.cells.map((c) => Hex.key(c.hex)));
  const anchorKeys = new Set(def.anchors.map((a) => `${Hex.key(a.hex)}|${a.dir}`));

  const edges: PlacedEdge[] = [];
  const anchors: TileEdge[] = [];
  for (const localCell of def.cells) {
    for (let dir = 0; dir < 6; dir++) {
      const outside = Hex.add(localCell.hex, DIRECTIONS[dir]);
      if (local.has(Hex.key(outside))) continue; // borde interior: no da a ninguna parte
      const hex = place(localCell.hex);
      const placedDir = rotateDir(dir, rotation);
      const isAnchor = anchorKeys.has(`${Hex.key(localCell.hex)}|${dir}`);
      edges.push({ hex, dir: placedDir, isAnchor });
      if (isAnchor) anchors.push({ hex, dir: placedDir });
    }
  }

  return { defId: def.id, rotation, origin, cells, hexes, edges, anchors };
}

/** El origen: donde se instancia una loseta para verla en sus propias coordenadas. */
export const ORIGIN: HexCoord = { q: 0, r: 0 };

/** Peso total de la bolsa: el denominador de la probabilidad de cada loseta. */
export function bagWeight(tiles: readonly TileDef[]): number {
  return tiles.reduce((sum, t) => sum + t.weight, 0);
}

/**
 * Giros que dan orientaciones DISTINTAS. Una loseta simétrica repite forma al
 * girarla (la Cañada, una línea de 3 con un ancla en cada punta, solo tiene 3
 * orientaciones reales de las 6), y eso cambia cuántas maneras tiene de encajar
 * en el tablero.
 *
 * @param {TileDef} def - Loseta de la biblioteca.
 * @returns {number[]} Los pasos de 60° que producen una orientación nueva.
 */
export function distinctRotations(def: TileDef): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  for (let rotation = 0; rotation < 6; rotation++) {
    const print = footprint(instantiate(def, rotation, ORIGIN));
    if (seen.has(print)) continue;
    seen.add(print);
    out.push(rotation);
  }
  return out;
}

/**
 * Huella canónica de una loseta colocada: forma + terreno + anclas, con la
 * traslación quitada (se referencia todo al primer hexágono en orden estable).
 * Dos orientaciones con la misma huella son la misma loseta movida de sitio.
 */
function footprint(inst: TileInstance): string {
  const order = (a: HexCoord, b: HexCoord) => a.r - b.r || a.q - b.q;
  const cells = [...inst.cells].sort((a, b) => order(a.hex, b.hex));
  const base = cells[0].hex;
  const rel = (h: HexCoord) => `${h.q - base.q},${h.r - base.r}`;

  const shape = cells.map((c) => `${rel(c.hex)}:${c.terrain ?? "-"}`).join(" ");
  const anchors = inst.anchors
    .map((a) => `${rel(a.hex)}|${a.dir}`)
    .sort()
    .join(" ");

  return `${shape}#${anchors}`;
}

// Las 6 direcciones en el mismo orden que hex.ts. Se repiten aquí porque
// hex.ts no las exporta como dato (solo como neighbors()).
const DIRECTIONS: readonly HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function direction(dir: number): HexCoord {
  return DIRECTIONS[((dir % 6) + 6) % 6];
}

/** La dirección contraria: el borde con el que encaja. */
export function opposite(dir: number): number {
  return (dir + 3) % 6;
}

// --- Validación de la biblioteca ------------------------------------------

/**
 * Comprobar que los TIPOS de la biblioteca son coherentes. Es la puerta por la
 * que pasa todo lo que se guarda: la llama la ruta de /dev/losetas antes de
 * escribir el fichero y el script de verificación sobre lo que hay en disco.
 *
 * Valida lo que es del tipo —identidad, peso y variantes— y delega en
 * `validateTileLibrary` lo que es de cada loseta.
 *
 * @param {readonly TileType[]} types - La biblioteca entera.
 * @returns {string[]} Lista de problemas; vacía si todo está bien.
 */
export function validateTileTypes(types: readonly TileType[]): string[] {
  const problems: string[] = [];
  const typeIds = new Set<string>();
  const variantIds = new Set<string>();

  for (const type of types) {
    if (!/^[a-z0-9-]+$/.test(type.id)) {
      problems.push(`tipo ${type.id || "(sin id)"}: el id va en minúsculas y guiones`);
    }
    if (typeIds.has(type.id)) problems.push(`tipo ${type.id}: id repetido`);
    typeIds.add(type.id);

    if (type.label.trim() === "") problems.push(`tipo ${type.id}: sin nombre`);
    if (!(type.terrain in TERRAINS)) {
      problems.push(`tipo ${type.id}: "${type.terrain}" no es un terreno`);
    }
    if (type.weight <= 0) problems.push(`tipo ${type.id}: peso ${type.weight}`);
    if (type.variants.length === 0) problems.push(`tipo ${type.id}: sin variantes`);

    for (const def of type.variants) {
      // El id de variante es único en TODA la biblioteca, no solo en su tipo:
      // el tablero guarda `defId` a secas para reconstruir lo que colocó.
      if (variantIds.has(def.id)) problems.push(`variante ${def.id}: id repetido`);
      variantIds.add(def.id);
      if (def.typeId !== type.id) {
        problems.push(`variante ${def.id}: dice ser del tipo ${def.typeId}`);
      }
    }
  }

  return [...problems, ...validateTileLibrary(allVariants(types))];
}

/**
 * Avisos de maquetado de un tipo: lo que probablemente esté mal pero puede ser
 * deliberado, así que NO es un problema de validación. El terreno del tipo es su
 * identidad y las excepciones son legítimas —el Camino cruza el paso de montaña,
 * el Vado baja al pantano—, pero una variante en la que el terreno del tipo no
 * aparece o no manda casi siempre es un descuido, o una variante archivada en el
 * tipo equivocado.
 *
 * El otro aviso es de la roca: si la Montaña de la variante parte su terreno
 * transitable en trozos, ese trozo puede quedar INCOMUNICADO en la partida —el
 * tablero ya no abre la roca para arreglarlo (board-gen.ts, paso 4): lo cuenta y
 * lo deja—. Vale la pena saberlo aquí, que es donde se decide, y no descubrirlo
 * como un rincón del mapa al que no se puede llegar.
 *
 * @returns {string[]} Avisos; vacía si el tipo se lee como lo que dice ser.
 */
export function typeNotes(type: TileType): string[] {
  const notes: string[] = [];
  const label = TERRAINS[type.terrain]?.label ?? type.terrain;
  // Los terrenos de LUGAR (`isPlace`: Camino, Mazmorra y Pueblo) no tienen por
  // qué mandar en su loseta. Un camino es un hilo que cruza otra cosa, una
  // mazmorra es un agujero en la roca y un pueblo son cuatro casas en un claro:
  // pedirles que sean mayoría sería pedirles que dejaran de ser lo que son. Del
  // terreno de ambiente sí se espera que domine.
  const mustDominate = !TERRAINS[type.terrain]?.isPlace;

  for (const def of type.variants) {
    // La Montaña de la loseta no puede dejar terreno transitable a un lado y a
    // otro: dentro de la loseta no hay manera de ir de uno al otro.
    const open = def.cells.filter((c) => isOpenGround(c.terrain)).map((c) => c.hex);
    if (!isConnected(open)) {
      notes.push(
        `${def.label}: la roca parte su terreno transitable en trozos; si la loseta vecina no ` +
          `los une por fuera, en la partida quedará un trozo incomunicado`,
      );
    }

    const own = def.cells.filter((c) => c.terrain === type.terrain).length;
    if (own === 0) {
      notes.push(`${def.label}: no tiene ni un hexágono de ${label}`);
      continue;
    }
    if (!mustDominate) continue;

    // Contra el terreno más numeroso de la loseta.
    for (const [terrain, count] of terrainCounts(def)) {
      if (count > own) {
        notes.push(
          `${def.label}: tiene más ${TERRAINS[terrain].label} (${count}) que ${label} (${own})`,
        );
      }
    }
  }

  return notes;
}

/**
 * Comprobar que unas losetas son coherentes, una a una. La usa
 * `validateTileTypes` y también el editor de /dev/losetas, que la llama sobre el
 * boceto en curso para avisar en caliente.
 *
 * @returns {string[]} Lista de problemas; vacía si todo está bien.
 */
export function validateTileLibrary(tiles: readonly TileDef[]): string[] {
  const problems: string[] = [];

  for (const def of tiles) {
    const shape = shapeOf(def);
    const keys = new Set(shape.map(Hex.key));

    if (shape.length < MIN_TILE_HEXES) {
      problems.push(`${def.id}: ${shape.length} hexágonos (mínimo ${MIN_TILE_HEXES})`);
    }
    if (shape.length > MAX_TILE_HEXES) {
      problems.push(
        `${def.id}: ${shape.length} hexágonos, se pasa del tamaño Enorme (${MAX_TILE_HEXES})`,
      );
    }
    if (keys.size !== shape.length) {
      problems.push(`${def.id}: hexágonos repetidos en la forma`);
    }
    if (!keys.has("0,0")) {
      problems.push(`${def.id}: la forma no contiene (0,0)`);
    }
    if (!isConnected(shape)) {
      problems.push(`${def.id}: la forma no es conexa`);
    }

    // Anclas: solo en bordes exteriores, y al menos una o la loseta no se puede
    // unir a nada (solo podría salir como primera loseta del tablero).
    const seenAnchors = new Set<string>();
    for (const anchor of def.anchors) {
      const ak = `${Hex.key(anchor.hex)}|${anchor.dir}`;
      if (seenAnchors.has(ak)) {
        problems.push(`${def.id}: ancla repetida en ${ak}`);
      }
      seenAnchors.add(ak);

      if (!keys.has(Hex.key(anchor.hex))) {
        problems.push(`${def.id}: ancla en ${Hex.key(anchor.hex)}, que no es de la loseta`);
        continue;
      }
      if (keys.has(Hex.key(Hex.add(anchor.hex, direction(anchor.dir))))) {
        problems.push(
          `${def.id}: el ancla ${ak} da a un hexágono de la propia loseta (solo van en el contorno)`,
        );
      }
    }
    if (def.anchors.length === 0) {
      problems.push(`${def.id}: sin anclas, no se puede unir a ninguna otra loseta`);
    }

    if (def.weight <= 0) {
      problems.push(`${def.id}: peso ${def.weight}`);
    }
  }

  return problems;
}

function isConnected(hexes: readonly HexCoord[]): boolean {
  if (hexes.length === 0) return true;
  const remaining = new Set(hexes.map(Hex.key));
  const queue = [hexes[0]];
  remaining.delete(Hex.key(hexes[0]));
  for (let head = 0; head < queue.length; head++) {
    for (const n of Hex.neighbors(queue[head])) {
      const k = Hex.key(n);
      if (remaining.delete(k)) queue.push(n);
    }
  }
  return remaining.size === 0;
}
