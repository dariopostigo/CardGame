// =========================================================================
// El boceto de loseta: estado y transiciones
//
// Lo que el editor de /lab/tiles va tocando con el ratón, sin nada de React.
// Está separado del componente por dos razones: las cascadas tienen reglas que
// se olvidan fácil (quitar un hexágono tiene que llevarse sus anclas, y AÑADIR
// uno también, porque tapa las anclas que ahora dan a un vecino propio) y así
// se pueden comprobar sin montar una pantalla.
//
// No es motor de reglas: no vive en lib/v2/rules/ porque el juego no conoce los
// bocetos. Es una herramienta de taller, y lo que produce es una LOSETA
// (`toDef`), que el laboratorio guarda como variante de un tipo en
// data/tile-library.json.
// =========================================================================

import * as Hex from "@/lib/v2/rules/hex";
import type { HexCoord, HexKey } from "@/lib/v2/rules/hex";
import type { TerrainId } from "@/lib/v2/rules/terrain";
import {
  ORIGIN,
  TILE_SIZES,
  type TileCell,
  type TileDef,
  type TileSize,
  direction,
} from "@/lib/v2/rules/tiles";

/** Un borde del boceto: `${hexKey}|${dir}`, el formato de bordes del motor. */
export type EdgeKey = string;

/** Un hexágono del boceto. Lleva terreno siempre: no hay hexágono sin pintar. */
export type SketchCell = { readonly hex: HexKey; readonly terrain: TerrainId };

export type Sketch = {
  readonly id: string;
  readonly label: string;
  /** El tipo del que va a ser variante; el boceto siempre pertenece a alguno. */
  readonly typeId: string;
  /** Nota de maquetado: por qué se dibuja así. */
  readonly note: string;
  /**
   * El peso que le va a tocar, solo informativo: el peso lo pone el TIPO y se
   * reparte entre sus variantes, así que aquí no se edita.
   */
  readonly weight: number;
  /** Nivel de TILE_SIZES: fija el tope de hexágonos y la rejilla del editor. */
  readonly sizeLevel: number;
  readonly cells: readonly SketchCell[];
  readonly anchors: readonly EdgeKey[];
};

/** El hexágono raíz: toda loseta contiene el (0,0), así que no se puede quitar. */
const ROOT: HexKey = "0,0";

/**
 * Un boceto recién empezado: la loseta válida más pequeña que existe, tres
 * hexágonos en línea con un ancla en cada punta. Se arranca de algo válido y no
 * de un hexágono suelto para que los avisos de validación signifiquen siempre
 * "has roto algo", y no "todavía no has empezado".
 *
 * @param {string} typeId - Tipo al que se va a añadir la variante.
 * @param {TerrainId} terrain - Terreno con el que nace pintada; la del tipo, normalmente.
 * @param {number} sizeLevel - Tamaño del papel donde se dibuja.
 */
export function initialSketch(typeId: string, terrain: TerrainId, sizeLevel = 1): Sketch {
  return {
    id: `${typeId}-nueva`,
    label: "Variante nueva",
    typeId,
    note: "",
    weight: 1,
    sizeLevel,
    cells: [
      { hex: ROOT, terrain },
      { hex: "1,0", terrain },
      { hex: "2,0", terrain },
    ],
    anchors: ["0,0|3", "2,0|0"],
  };
}

// --- Consultas -------------------------------------------------------------

export function sizeOfSketch(sketch: Sketch): TileSize {
  return TILE_SIZES[Math.min(Math.max(sketch.sizeLevel, 1), TILE_SIZES.length) - 1];
}

/** La rejilla del editor para un tamaño: el papel donde se dibuja. */
export function sketchGrid(sizeLevel: number): HexCoord[] {
  const size = TILE_SIZES[Math.min(Math.max(sizeLevel, 1), TILE_SIZES.length) - 1];
  return Hex.withinRadius(ORIGIN, size.gridRadius);
}

export function hasHex(sketch: Sketch, coord: HexCoord): boolean {
  const k = Hex.key(coord);
  return sketch.cells.some((c) => c.hex === k);
}

/** El terreno de un hexágono del boceto; `undefined` si ese hueco no es suyo. */
export function terrainAt(sketch: Sketch, coord: HexCoord): TerrainId | undefined {
  const k = Hex.key(coord);
  return sketch.cells.find((c) => c.hex === k)?.terrain;
}

export function hasAnchor(sketch: Sketch, coord: HexCoord, dir: number): boolean {
  return sketch.anchors.includes(`${Hex.key(coord)}|${dir}`);
}

// --- Transiciones ----------------------------------------------------------

/**
 * Meter o sacar un hexágono de la forma, hasta el tope del tamaño elegido. El que
 * entra nace con el terreno del pincel, porque un hexágono sin terreno no existe.
 *
 * Las dos direcciones arrastran anclas: sacarlo se lleva las suyas, y METERLO
 * se lleva las que acaba de tapar (el ancla del vecino que ahora da a un
 * hexágono de la propia loseta ya no es contorno, es junta interior).
 *
 * @returns {Sketch} El boceto resultante; el mismo si la acción no aplica.
 */
export function toggleHex(sketch: Sketch, coord: HexCoord, terrain: TerrainId): Sketch {
  const k = Hex.key(coord);
  if (k === ROOT) return sketch;

  if (!hasHex(sketch, coord)) {
    if (sketch.cells.length >= sizeOfSketch(sketch).capacity) return sketch;
    const cells = [...sketch.cells, { hex: k, terrain }];
    return { ...sketch, cells, anchors: pruneAnchors(cells, sketch.anchors) };
  }

  const cells = sketch.cells.filter((c) => c.hex !== k);
  return { ...sketch, cells, anchors: pruneAnchors(cells, sketch.anchors) };
}

/**
 * Pintar el terreno de un hexágono de la loseta.
 *
 * @returns {Sketch} El boceto resultante; el mismo si el hexágono no es suyo.
 */
export function paintTerrain(sketch: Sketch, coord: HexCoord, terrain: TerrainId): Sketch {
  const k = Hex.key(coord);
  if (!hasHex(sketch, coord)) return sketch;
  return {
    ...sketch,
    cells: sketch.cells.map((c) => (c.hex === k ? { hex: c.hex, terrain } : c)),
  };
}

/**
 * Poner o quitar un ancla en un borde. Solo vale en el CONTORNO: si el lado da
 * a otro hexágono de la propia loseta no hay nada que unir ahí.
 *
 * @returns {Sketch} El boceto resultante; el mismo si la acción no aplica.
 */
export function toggleAnchor(sketch: Sketch, coord: HexCoord, dir: number): Sketch {
  if (!hasHex(sketch, coord)) return sketch;
  if (hasHex(sketch, Hex.add(coord, direction(dir)))) return sketch;

  const edge: EdgeKey = `${Hex.key(coord)}|${dir}`;
  return sketch.anchors.includes(edge)
    ? { ...sketch, anchors: sketch.anchors.filter((a) => a !== edge) }
    : { ...sketch, anchors: [...sketch.anchors, edge] };
}

/**
 * Cambiar el tamaño del boceto. Bajar de tamaño recorta: se quedan los primeros
 * hexágonos que quepan en el tope y en la rejilla nueva, en el orden en que se
 * dibujaron. Puede dejar la forma partida —el aviso de validación lo dirá—,
 * porque adivinar qué trozo quería conservar el autor sería peor.
 *
 * @returns {Sketch} El boceto en el tamaño nuevo.
 */
export function setSizeLevel(sketch: Sketch, sizeLevel: number): Sketch {
  const level = Math.min(Math.max(sizeLevel, 1), TILE_SIZES.length);
  const size = TILE_SIZES[level - 1];
  const inGrid = new Set(sketchGrid(level).map(Hex.key));

  const cells = sketch.cells
    .filter((c) => inGrid.has(c.hex))
    .slice(0, size.capacity);

  return { ...sketch, sizeLevel: level, cells, anchors: pruneAnchors(cells, sketch.anchors) };
}

/**
 * Rellenar hasta el tope del tamaño, creciendo desde el hexágono raíz hacia
 * fuera, con el terreno del pincel. Es un atajo del editor, no una regla:
 * maquetar una loseta Enorme a 64 clics no es trabajo de diseño, es tecleo.
 *
 * @returns {Sketch} El boceto con la forma completa (compacta).
 */
export function fillToCapacity(sketch: Sketch, terrain: TerrainId): Sketch {
  const size = sizeOfSketch(sketch);
  const present = new Set(sketch.cells.map((c) => c.hex));
  const cells = [...sketch.cells];

  const candidates = sketchGrid(sketch.sizeLevel)
    .map((coord) => ({ coord, k: Hex.key(coord), d: Hex.distance(coord, ORIGIN) }))
    .sort((a, b) => a.d - b.d || a.k.localeCompare(b.k));

  for (const candidate of candidates) {
    if (cells.length >= size.capacity) break;
    if (present.has(candidate.k)) continue;
    present.add(candidate.k);
    cells.push({ hex: candidate.k, terrain });
  }

  return { ...sketch, cells, anchors: pruneAnchors(cells, sketch.anchors) };
}

/** Pintar de golpe la loseta entera con un terreno. */
export function paintAll(sketch: Sketch, terrain: TerrainId): Sketch {
  return { ...sketch, cells: sketch.cells.map((c) => ({ hex: c.hex, terrain })) };
}

/**
 * Cargar una loseta de la biblioteca para editarla TAL CUAL: mismo id y misma
 * etiqueta, así que el literal que salga sustituye a la de la biblioteca.
 *
 * La loseta se recoloca para que caiga centrada en el papel. Una loseta se
 * guarda con el (0,0) en uno de sus hexágonos, que en una pieza grande es una
 * punta; sin recolocarla, media loseta se quedaría fuera de la rejilla.
 *
 * @returns {Sketch} El boceto, en el tamaño más pequeño que la contiene.
 */
export function fromDef(def: TileDef): Sketch {
  const cells = centered(def.cells);
  const root = def.cells[0] && cells[0] ? Hex.subtract(cells[0].hex, def.cells[0].hex) : ORIGIN;
  const reach = Math.max(0, ...cells.map((c) => Hex.distance(c.hex, ORIGIN)));

  // El tamaño tiene que aguantar dos cosas: el número de hexágonos y el papel.
  // Una loseta muy alargada necesita más rejilla de la que le pediría su cuenta.
  const size =
    TILE_SIZES.find((s) => cells.length <= s.capacity && reach <= s.gridRadius) ??
    TILE_SIZES[TILE_SIZES.length - 1];

  return {
    id: def.id,
    label: def.label,
    typeId: def.typeId,
    note: def.note,
    weight: def.weight,
    sizeLevel: size.level,
    cells: cells.map((c) => ({ hex: Hex.key(c.hex), terrain: c.terrain })),
    anchors: def.anchors.map((a) => `${Hex.key(Hex.add(a.hex, root))}|${a.dir}`),
  };
}

/**
 * Cargar una loseta como COPIA: mismo tipo, otro id. Lo que se guarde se añade
 * como una variante MÁS de ese tipo en vez de sustituir a la original, que es la
 * forma normal de dibujar el segundo peñasco: partiendo del primero.
 */
export function copyOfDef(def: TileDef): Sketch {
  const sketch = fromDef(def);
  return { ...sketch, id: `${sketch.id}-copia`, label: `${sketch.label} (copia)` };
}

/**
 * La misma loseta con el (0,0) en su hexágono más céntrico. Trasladar una
 * loseta no la cambia —el tablero la coloca por su ancla, no por su (0,0)—,
 * pero centrarla es lo que la hace caber en la rejilla del editor.
 */
function centered(cells: readonly TileCell[]): readonly TileCell[] {
  if (cells.length === 0) return cells;

  // Centro en el plano de píxeles, no la media de (q, r): en coordenadas
  // axiales la media se va de sitio en cuanto la loseta tiene filas largas.
  const point = (hex: HexCoord) => ({ x: hex.q + hex.r / 2, y: hex.r * 0.866 });
  const cx = cells.reduce((sum, c) => sum + point(c.hex).x, 0) / cells.length;
  const cy = cells.reduce((sum, c) => sum + point(c.hex).y, 0) / cells.length;
  const away = (hex: HexCoord) => (point(hex).x - cx) ** 2 + (point(hex).y - cy) ** 2;

  const root = cells.reduce((best, c) => (away(c.hex) < away(best.hex) ? c : best)).hex;
  return cells.map((c) => ({ hex: Hex.subtract(c.hex, root), terrain: c.terrain }));
}

/** El boceto como TileDef, que es lo que entienden el motor y la validación. */
export function toDef(sketch: Sketch): TileDef {
  return {
    id: sketch.id.trim() || "sin-id",
    label: sketch.label.trim() || "Sin etiqueta",
    typeId: sketch.typeId,
    note: sketch.note.trim(),
    cells: sketch.cells.map((c) => ({ hex: Hex.fromKey(c.hex), terrain: c.terrain })),
    anchors: sketch.anchors.map((edge) => {
      const [k, dir] = edge.split("|");
      return { hex: Hex.fromKey(k as HexKey), dir: Number(dir) };
    }),
    weight: sketch.weight,
  };
}

/**
 * Anclas que siguen siendo válidas para una forma: las de un hexágono que
 * existe y que dan al exterior. Se pasa por aquí en TODO cambio de forma.
 */
function pruneAnchors(
  cells: readonly SketchCell[],
  anchors: readonly EdgeKey[],
): readonly EdgeKey[] {
  const present = new Set(cells.map((c) => c.hex));
  return anchors.filter((edge) => {
    const [k, dir] = edge.split("|");
    if (!present.has(k as HexKey)) return false;
    const outside = Hex.add(Hex.fromKey(k as HexKey), direction(Number(dir)));
    return !present.has(Hex.key(outside));
  });
}
