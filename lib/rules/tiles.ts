// =========================================================================
// Biblioteca de LOSETAS
//
// Una loseta es una pieza predefinida de hexágonos con su forma, su terreno y
// sus anclas. Es la unidad con la que se construye el tablero, y se maqueta a
// mano: este archivo es el catálogo, no un generador. Quien las encaja es
// board-gen.ts; quien las enseña y las dibuja es /dev/losetas.
//
// El tablero no es una rejilla: se construye encajando losetas, como en los
// juegos de tablero modular. Es el sistema de docs/board/board-map.md §2.
//
// Una loseta fija TRES cosas:
//   · FORMA   — qué hexágonos la componen, en coordenadas locales con (0,0)
//     dentro. Cuántos puede tener lo dice su TAMAÑO (TILE_SIZES).
//   · TERRENO — el de cada uno de sus hexágonos. `null` no es un terreno: es
//     "este lo sortea el tablero al colocarme" (pesos de la tabla A, §2c). Así
//     una misma loseta puede tener partes fijas (el sendero, una montaña que
//     corta la vista) y partes que cambian en cada partida.
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
import type { TerrainId } from "./terrain";

/** Un hexágono de la loseta. `terrain: null` = lo sortea el tablero al colocarla. */
export type TileCell = { readonly hex: HexCoord; readonly terrain: TerrainId | null };

/** Un borde de un hexágono: quién y hacia dónde (dirección 0-5). */
export type TileEdge = { readonly hex: HexCoord; readonly dir: number };

export type TileDef = {
  readonly id: string;
  readonly label: string;
  /** Hexágonos con su terreno, en coordenadas locales; siempre incluye (0,0). */
  readonly cells: readonly TileCell[];
  /** Bordes exteriores por los que esta loseta se une a otra. */
  readonly anchors: readonly TileEdge[];
  /** Frecuencia relativa en la bolsa. */
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

/** Cuántos hexágonos deja al sorteo de la tabla A. */
export function freeCount(def: TileDef): number {
  return def.cells.filter((c) => c.terrain === null).length;
}

// --- Losetas dibujadas -----------------------------------------------------

// Direcciones, para que las anclas se lean sin contar índices.
// El orden es el de hex.ts: 0=E, 1=NE, 2=NO, 3=O, 4=SO, 5=SE.
const E = 0;
const NE = 1;
const NO = 2;
const O = 3;
const SO = 4;
const SE = 5;

/** Qué terreno pone cada carácter del dibujo. */
const TERRAIN_CHARS: ReadonlyMap<string, TerrainId | null> = new Map<string, TerrainId | null>([
  [".", null], // al sorteo: lo decide el tablero al colocar la loseta
  ["L", "llanura"],
  ["C", "camino"],
  ["B", "bosque"],
  ["P", "pantano"],
  ["M", "montana"],
]);

/** Una loseta tal y como se maqueta: dibujada, con sus anclas sobre el dibujo. */
export type TileDrawing = {
  readonly id: string;
  readonly label: string;
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
 * fila de hexágonos y cada carácter uno de ellos —espacio para el hueco, punto
 * para "al sorteo" y L/C/B/P/M para los cinco terrenos—. Las filas impares van
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
    weight: drawing.weight,
    cells: marks.map((c) => ({ hex: shift(c.hex), terrain: c.terrain })),
    anchors: drawing.anchors.map(([col, row, dir]) => ({
      hex: shift(Hex.offsetToAxial({ col, row })),
      dir,
    })),
  };
}

/**
 * La biblioteca.
 *
 * Cada loseta es un TROZO DE PAISAJE reconocible, no un puñado de hexágonos con
 * terreno al azar: un peñasco, un bosque cerrado con su claro, una ciénaga con
 * la orilla arbolada, un paso entre dos crestas. De ahí salen los criterios de
 * maquetado:
 *
 *   · El terreno va en MASAS coherentes. Un bosque es una mancha compacta y una
 *     sierra es una cresta; el terreno salteado hexágono a hexágono no se lee
 *     como paisaje, se lee como ruido.
 *   · Las orillas se dejan AL SORTEO. Así la pieza se funde con sus vecinas y
 *     no sale idéntica en cada partida (§2c tabla A).
 *   · El camino CRUZA la loseta de un borde a otro y esquiva la roca y el agua,
 *     como en un mapa de verdad. Y las anclas de una loseta con camino están
 *     SOLO en las bocas de ese camino: así una pieza de camino se une siempre
 *     por donde el camino continúa, no por un lado cualquiera.
 *   · Las demás anclan en terreno abierto, nunca en una pared de roca ni en
 *     medio del pantano: el ancla es una invitación a seguir, y una montaña no
 *     invita a nada.
 *
 * Los TAMAÑOS hacen dos trabajos distintos. Las Mínimas y Pequeñas son la
 * argamasa —accidentes del terreno que rellenan y doblan el tablero—; las
 * Medianas y Grandes son regiones con interior propio, y pesan poco porque una
 * sola ya marca el carácter de la partida. No hay ninguna Enorme a propósito:
 * 64 hexágonos son un tablero entero, no una pieza.
 */
export const TILES: readonly TileDef[] = [
  // --- Mínimas: accidentes del terreno -------------------------------------
  drawn({
    id: "penasco",
    label: "Peñasco",
    weight: 4,
    // Un risco suelto y dos hexágonos de lo que haya alrededor.
    art: ["M.", "."],
    anchors: [
      [1, 0, E],
      [0, 1, SE],
      [0, 1, SO],
    ],
  }),
  drawn({
    id: "soto",
    label: "Soto",
    weight: 5,
    // Bosquete al borde de un claro: la pieza más común de la bolsa.
    art: ["BB", "L."],
    anchors: [
      [0, 0, O],
      [1, 0, NE],
      [1, 1, E],
    ],
  }),
  drawn({
    id: "trocha",
    label: "Trocha",
    weight: 6,
    // Tres hexágonos de camino de un borde al otro: el eslabón de la red.
    art: ["CCC", " L"],
    anchors: [
      [0, 0, O],
      [2, 0, E],
    ],
  }),
  drawn({
    id: "juncal",
    label: "Juncal",
    weight: 2,
    // Un rincón encharcado; se ancla por el lado seco.
    art: ["P.", "P."],
    anchors: [
      [1, 0, NE],
      [1, 0, E],
      [1, 1, SE],
    ],
  }),
  drawn({
    id: "vado",
    label: "Vado",
    weight: 4,
    // El camino cruza la charca por el único sitio donde se puede pasar.
    art: ["PC.", " C"],
    anchors: [
      [1, 0, NO],
      [1, 1, SE],
    ],
  }),

  // --- Pequeñas ------------------------------------------------------------
  drawn({
    id: "bosque-cerrado",
    label: "Bosque cerrado",
    weight: 2,
    // Corona de árboles alrededor de un claro. Pesa poco: seis hexágonos de
    // Bosque seguidos son mucho tablero sin visibilidad.
    art: [" BB", "B.B", " BB"],
    anchors: [
      [1, 0, NO],
      [2, 1, E],
      [1, 2, SO],
    ],
  }),
  drawn({
    id: "camino-del-bosque",
    label: "Camino del bosque",
    weight: 4,
    // El camino entra en la espesura y sale por el otro lado.
    art: ["BC.", "LCBB", " B"],
    anchors: [
      [1, 0, NO],
      [1, 1, SE],
    ],
  }),
  drawn({
    id: "cresta",
    label: "Cresta",
    weight: 3,
    // Pared de roca con su falda al sur; por la roca no se une nada.
    art: ["MMM", "LL."],
    anchors: [
      [0, 1, O],
      [2, 1, E],
      [1, 1, SO],
    ],
  }),
  drawn({
    id: "marisma",
    label: "Marisma",
    weight: 2,
    // Pantano abierto con un borde firme por el que rodearlo.
    art: [".PP", "PP.", " L"],
    anchors: [
      [0, 0, O],
      [2, 1, E],
      [1, 2, SE],
    ],
  }),
  drawn({
    id: "encrucijada",
    label: "Encrucijada",
    weight: 3,
    // Tres bocas de camino: es la única pieza que ramifica la red.
    art: [" C.", ".CC", " .C"],
    anchors: [
      [1, 0, NO],
      [2, 1, E],
      [2, 2, SE],
    ],
  }),

  // --- Medianas: regiones con interior -------------------------------------
  drawn({
    id: "vega-del-camino",
    label: "Vega del camino",
    weight: 5,
    // Camino recto por el fondo del valle, con el bosque en la ladera alta.
    art: ["BB..", "CCCC", "LL."],
    anchors: [
      [0, 1, O],
      [3, 1, E],
    ],
  }),
  drawn({
    id: "robledal",
    label: "Robledal",
    weight: 1,
    // Bosque grande con dos claros dentro: se cruza, pero a ciegas.
    art: [".BB.", "BBBB", "BL.B", " LB"],
    anchors: [
      [1, 0, NO],
      [3, 1, E],
      [0, 2, O],
      [1, 3, SO],
    ],
  }),
  drawn({
    id: "sierra",
    label: "Sierra",
    weight: 2,
    // Dos macizos y un paso de tierra entre ellos: un cuello de botella.
    art: ["MLM.", "MLMM", "ML.", " M"],
    anchors: [
      [1, 0, NO],
      [1, 2, SO],
      [2, 2, SE],
    ],
  }),
  drawn({
    id: "cienaga",
    label: "Ciénaga",
    weight: 2,
    // Charca grande con la orilla arbolada; el agua nunca toca el contorno.
    art: [".BB.", "BPPB", "LPP", " B"],
    anchors: [
      [1, 0, NO],
      [3, 1, E],
      [1, 3, SE],
    ],
  }),

  // --- Grandes: una sola ya marca la partida -------------------------------
  drawn({
    id: "paso-de-montana",
    label: "Paso de montaña",
    weight: 1,
    // El camino serpentea entre dos macizos. Veinte hexágonos y solo dos
    // bocas: cuando sale, el tablero entero se organiza alrededor de ella.
    art: ["MMM..", "CCMMM", "MCMM", " CC.M", "  .C"],
    anchors: [
      [0, 1, O],
      [3, 4, SE],
    ],
  }),
  drawn({
    id: "paramo",
    label: "Páramo",
    weight: 3,
    // Campo abierto con dos sotos y una hondonada encharcada. Es la pieza que
    // da aire al tablero: sin ella todo son árboles y roca.
    art: [".LLL.", "LLLBB", "LL.LB", " LPP.", "  LL"],
    anchors: [
      [1, 0, NO],
      [4, 1, E],
      [0, 2, O],
      [2, 4, SO],
    ],
  }),
];

export const TILES_BY_ID: Readonly<Record<string, TileDef>> = Object.fromEntries(
  TILES.map((t) => [t.id, t]),
);

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
export function bagWeight(tiles: readonly TileDef[] = TILES): number {
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
 * Comprobar que una biblioteca de losetas es coherente. La usa el script de
 * verificación (una loseta mal definida no debe llegar a producción y el
 * compilador no puede pillarlo) y también el editor de /dev/losetas, que la
 * llama sobre el boceto en curso para avisar en caliente.
 *
 * @returns {string[]} Lista de problemas; vacía si todo está bien.
 */
export function validateTileLibrary(tiles: readonly TileDef[] = TILES): string[] {
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
