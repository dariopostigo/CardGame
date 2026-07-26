// =========================================================================
// Generación del TABLERO: encaje de losetas
//
// Aquí se monta el tablero de una partida; la loseta que se encaja es una
// pieza ya maquetada en lib/rules/tiles.ts. Son dos problemas separados a
// propósito (state.ts, "vocabulario"): esto no decide cómo es una loseta,
// solo cuántas, dónde y con qué giro.
//
// El tablero se construye encajando losetas borde con borde, como en un tablero
// modular: es el sistema de losetas de docs/board/board-map.md §2, adelantado
// desde la "versión rica". La silueta sale irregular porque depende de por dónde
// encajen, no de una rejilla. Las losetas no son todas del mismo tamaño (van de
// 3 a 21 hexágonos), así que POCAS losetas grandes dan tablero de sobra: lo que
// hay que mirar es el total de hexágonos, no el número de piezas.
//
// Reglas de encaje: el tablero solo crece por las ANCLAS. Un ancla libre de una
// loseta ya puesta se empareja con un ancla de la que entra, y donde dos losetas
// se toquen sin ancla tienen que ser pared contra pared: un ancla nunca queda
// pegada al contorno ciego de otra. Eso es lo único que decide qué encaja.
//
// El terreno lo trae la loseta hexágono a hexágono; los que deja sin fijar
// (`terrain: null`) se sortean aquí con los pesos de la tabla A (§2c).
//
// Lo que se conserva del generador anterior, porque no depende de la forma
// del tablero: conectividad garantizada, Guarida en el hexágono más lejano,
// Pueblo garantizado en la mitad cercana, Mazmorra opcional, fichas por la
// tabla B y reparto de los 3 Élite sin repetir.
//
// Puro y determinista: misma semilla → mismo tablero, siempre.
// =========================================================================

import * as Hex from "./hex";
import { type HexCoord, type HexKey } from "./hex";
import * as Rng from "./rng";
import {
  type Board,
  type BoardToken,
  type Chapter,
  type EliteId,
  type Hex as HexTile,
  type LocationId,
  type PlacedTile,
} from "./state";
import { TERRAIN_GEN_WEIGHTS, TERRAINS, type TerrainId, isOpenGround } from "./terrain";
import { TILES, type TileInstance, direction, instantiate, opposite } from "./tiles";

export type BoardConfig = {
  /** Semilla legible; la misma semilla da el mismo tablero. */
  readonly seed: string;
  /** Losetas a colocar. 9 × ~7,5 hexágonos ≈ 65 hexágonos. */
  readonly tileCount: number;
  /** Fracción de hexes transitables con ficha: ~15-20 % (§2c tabla B). */
  readonly tokenDensity: number;
  /** Probabilidad de que el tablero lleve Mazmorra (§2c paso 4: "opcional"). */
  readonly dungeonChance: number;
  /**
   * Cuánto se estira el tablero lejos de la entrada. 0 = crece por igual en
   * todas direcciones (tablero redondeado, travesía corta); 2 = tiende a
   * alargarse, que es lo que hace que la Guarida quede de verdad lejos.
   */
  readonly sprawl: number;
};

export const DEFAULT_BOARD_CONFIG: Omit<BoardConfig, "seed"> = {
  tileCount: 9,
  tokenDensity: 0.17,
  dungeonChance: 0.5,
  sprawl: 2,
};

// Tabla B — pesos de ficha por terreno (§2c). La Montaña no lleva ficha.
// El peso 1 de "terreno" en Bosque es deliberado (§4b): sin él la ficha de
// Terreno salía ~0,6 veces por tablero y era casi inalcanzable.
const TOKEN_WEIGHTS: Readonly<Record<TerrainId, ReadonlyArray<readonly [BoardToken, number]>>> = {
  llanura: [
    ["enemigo", 2],
    ["amenaza", 2],
    ["tesoro", 1],
    ["exploracion", 1],
    ["terreno", 0],
    ["personaje", 2],
  ],
  bosque: [
    ["enemigo", 1],
    ["amenaza", 3],
    ["tesoro", 2],
    ["exploracion", 2],
    ["terreno", 1],
    ["personaje", 1],
  ],
  pantano: [
    ["enemigo", 2],
    ["amenaza", 3],
    ["tesoro", 1],
    ["exploracion", 0],
    ["terreno", 2],
    ["personaje", 0],
  ],
  camino: [
    ["enemigo", 1],
    ["amenaza", 2],
    ["tesoro", 1],
    ["exploracion", 0],
    ["terreno", 0],
    ["personaje", 3],
  ],
  montana: [],
};

// El Camino no se sortea: o lo fija la loseta o no lo hay. El relleno de los
// hexágonos sin terreno sale de la tabla A sin esa fila, manteniendo las
// proporciones entre las otras cuatro.
const FILLER_WEIGHTS = TERRAIN_GEN_WEIGHTS.filter(([id]) => id !== "camino");

// Losetas que pueden ser la primera del tablero: las que dejan más de un punto
// de unión libre después de recibir a la segunda.
const SEED_TILES = TILES.filter((t) => t.anchors.length >= 2);

/** Veces que se reintenta el encaje si se cierra antes de colocarlas todas. */
const MAX_LAYOUT_ATTEMPTS = 6;

const ELITES: readonly EliteId[] = ["capitan-bandido", "trol-de-las-minas", "arana-matriarca"];

/** Lo que devuelve la generación: el tablero y el capítulo ya inicializado. */
export type GeneratedBoard = {
  readonly board: Board;
  readonly chapter: Chapter;
};

// Hexágono mutable, solo dentro de este módulo. Lo que sale es readonly.
type Draft = {
  coord: HexCoord;
  terrain: TerrainId;
  location: LocationId | null;
  token: BoardToken | null;
  tileId: string;
  roadLinks: number[];
  isEntrance: boolean;
};

/** Clave de un borde concreto: hexágono + dirección hacia fuera. */
type EdgeKey = string;
const edgeKey = (hex: HexCoord, dir: number): EdgeKey => `${Hex.key(hex)}|${dir}`;

/**
 * Generar un tablero de Partida rápida por encaje de losetas.
 *
 * @param {Partial<BoardConfig> & { seed: string }} config - Semilla obligatoria; el resto por defecto.
 * @returns {GeneratedBoard} Tablero y capítulo listos para jugar.
 */
export function generateBoard(config: Partial<BoardConfig> & { seed: string }): GeneratedBoard {
  const cfg: BoardConfig = { ...DEFAULT_BOARD_CONFIG, ...config };
  let rng = Rng.rngFromSeed(cfg.seed);

  // --- 1. Colocar las losetas -----------------------------------------------
  // El encaje puede cerrarse antes de tiempo: si la siembra deja pocas anclas y
  // ninguna loseta cabe en las que quedan, el tablero se queda en 3 ó 4 piezas.
  // Pasa en ~1 semilla de 40, y no se puede arreglar desde dentro del bucle
  // (ahí ya no hay sitio), así que se vuelve a sembrar con el generador ya
  // avanzado. Se queda el mejor intento, no el último.
  let layout = layoutTiles(cfg, rng);
  for (
    let attempt = 1;
    attempt < MAX_LAYOUT_ATTEMPTS && layout.tiles.length < cfg.tileCount;
    attempt++
  ) {
    const retry = layoutTiles(cfg, layout.rng);
    layout = retry.tiles.length > layout.tiles.length ? retry : { ...layout, rng: retry.rng };
  }
  rng = layout.rng;

  // --- 2. Rellenar el terreno que la loseta dejó sin fijar ------------------
  const drafts = new Map<HexKey, Draft>();
  for (const [k, cell] of layout.cells) {
    let terrain: TerrainId;
    if (cell.terrain !== null) {
      terrain = cell.terrain;
    } else {
      const [picked, r] = Rng.pickWeighted(rng, FILLER_WEIGHTS);
      rng = r;
      terrain = picked;
    }
    drafts.set(k, {
      coord: cell.coord,
      terrain,
      location: null,
      token: null,
      tileId: cell.tileId,
      roadLinks: [],
      isEntrance: false,
    });
  }

  // --- 3. La entrada --------------------------------------------------------
  // La "puerta" del tablero (§2c paso 0). Con losetas no hay esquinas, así que
  // se usa el equivalente: el hexágono de la PRIMERA loseta más alejado del
  // centro, que es el borde por el que empezó a crecer todo.
  const entranceDraft = pickEntrance(drafts, layout.tiles[0]);
  entranceDraft.isEntrance = true;
  // No puede ser Montaña: con el pool base de 2 no podrías ni salir del hex.
  if (!isOpenGround(entranceDraft.terrain)) entranceDraft.terrain = "llanura";
  const entrance = entranceDraft.coord;

  // --- 4. Conectividad ------------------------------------------------------
  rng = carveConnectivity(drafts, entrance, rng);
  const dist = bfsDistances(drafts, entrance);

  // --- 5. Trazado de los senderos ------------------------------------------
  // Se calcula después del carvado, porque abrir un paso puede convertir una
  // Montaña en Llanura pero nunca crea ni destruye Camino.
  for (const draft of drafts.values()) {
    if (draft.terrain !== "camino") continue;
    for (let dir = 0; dir < 6; dir++) {
      const neighbor = drafts.get(Hex.key(Hex.add(draft.coord, direction(dir))));
      if (neighbor) {
        if (neighbor.terrain === "camino") draft.roadLinks.push(dir);
      } else if (layout.edges.get(edgeKey(draft.coord, dir)) === true) {
        // Ancla que se quedó sin pareja: el sendero se pierde en el borde.
        draft.roadLinks.push(dir);
      }
    }
  }

  // --- 6. Localizaciones garantizadas (§2c paso 4) -------------------------
  const placeable = [...drafts.values()].filter(
    (d) => !d.isEntrance && isOpenGround(d.terrain) && Number.isFinite(dist.get(Hex.key(d.coord))!),
  );

  // Guarida: el hexágono transitable MÁS LEJANO a la entrada.
  const lair = placeable.reduce((best, d) =>
    dist.get(Hex.key(d.coord))! > dist.get(Hex.key(best.coord))! ? d : best,
  );
  lair.location = "guarida";
  const maxDist = dist.get(Hex.key(lair.coord))!;

  // Pueblo: en la mitad cercana, y GARANTIZADO — si no cae, la tienda, el
  // descanso largo y la limpieza de Maldiciones quedan inaccesibles.
  const nearHalf = placeable.filter(
    (d) => d.location === null && dist.get(Hex.key(d.coord))! <= maxDist / 2,
  );
  const villagePool = nearHalf.length > 0 ? nearHalf : placeable.filter((d) => d.location === null);
  // Los pueblos se asientan en el camino: si hay alguno a mano, va ahí.
  const onRoad = villagePool.filter((d) => d.terrain === "camino");
  const [village, r2] = Rng.pick(rng, onRoad.length > 0 ? onRoad : villagePool);
  rng = r2;
  village.location = "pueblo";

  // Mazmorra: opcional, en la mitad lejana, no pegada a la Guarida.
  const [dungeonRoll, r3] = Rng.next(rng);
  rng = r3;
  let hasDungeon = dungeonRoll < cfg.dungeonChance;
  if (hasDungeon) {
    const farHalf = placeable.filter(
      (d) =>
        d.location === null &&
        dist.get(Hex.key(d.coord))! > maxDist / 2 &&
        Hex.distance(d.coord, lair.coord) > 1,
    );
    if (farHalf.length > 0) {
      const [dungeon, r4] = Rng.pick(rng, farHalf);
      rng = r4;
      dungeon.location = "mazmorra";
    } else {
      hasDungeon = false;
    }
  }

  // --- 7. Fichas (tabla B) --------------------------------------------------
  rng = seedTokens(drafts, cfg, rng);

  // --- 8. Élites: boss y, si hay, el de la Mazmorra ------------------------
  const [shuffledElites, r5] = Rng.shuffle(rng, ELITES);
  rng = r5;

  // --- 9. Congelar ----------------------------------------------------------
  const hexes = new Map<HexKey, HexTile>();
  for (const [k, d] of drafts) {
    hexes.set(k, {
      coord: d.coord,
      terrain: d.terrain,
      location: d.location,
      token: d.token,
      tileId: d.tileId,
      roadLinks: d.roadLinks,
      isEntrance: d.isEntrance,
      // La niebla arranca cerrada; abrirla es trabajo de la visión del héroe.
      terrainRevealed: false,
      contentRevealed: false,
    });
  }

  return {
    board: { hexes, tiles: layout.tiles, entrance, distanceFromEntrance: dist },
    chapter: {
      turn: 1,
      threat: 0,
      thresholdsFired: [],
      bossElite: shuffledElites[0],
      dungeonElite: hasDungeon ? shuffledElites[1] : null,
      seed: cfg.seed,
    },
  };
}

// --- Colocación de losetas -------------------------------------------------

type Cell = { coord: HexCoord; tileId: string; terrain: TerrainId | null };

type Layout = {
  cells: Map<HexKey, Cell>;
  /** Cada borde exterior de cada loseta colocada: true si es ancla. */
  edges: Map<EdgeKey, boolean>;
  tiles: PlacedTile[];
  rng: Rng.Rng;
};

/**
 * Colocar `tileCount` losetas uniéndolas por sus anclas.
 *
 * Cada vuelta elige un ancla libre del tablero (con sesgo hacia las lejanas,
 * para que se estire) y busca qué loseta, en qué giro, se le puede unir sin
 * solaparse y sin dejar ningún ancla contra una pared ajena —se comprueban
 * TODOS los bordes que toque, no solo el elegido. Si ninguna encaja, esa ancla
 * se cierra y no se vuelve a intentar.
 *
 * @returns {Layout} Celdas ocupadas, contorno de cada loseta y las colocadas.
 */
function layoutTiles(cfg: BoardConfig, rng: Rng.Rng): Layout {
  let r = rng;
  const cells = new Map<HexKey, Cell>();
  const edges = new Map<EdgeKey, boolean>();
  const tiles: PlacedTile[] = [];
  const blocked = new Set<EdgeKey>();

  const commit = (inst: TileInstance) => {
    const id = `t${tiles.length}`;
    for (const cell of inst.cells) {
      cells.set(Hex.key(cell.hex), { coord: cell.hex, tileId: id, terrain: cell.terrain });
    }
    for (const edge of inst.edges) {
      edges.set(edgeKey(edge.hex, edge.dir), edge.isAnchor);
    }
    tiles.push({ id, defId: inst.defId, rotation: inst.rotation, hexes: inst.hexes });
  };

  // Primera loseta en el origen, con giro al azar para que no siempre empiece
  // igual orientada. Solo entran en el sorteo las que tienen 2 anclas o más:
  // sembrar el tablero con una de un ancla lo mata en la segunda loseta —la que
  // llega consume ese único punto de unión y ya no queda por dónde crecer.
  const [firstDef, r1] = Rng.pickWeighted(
    r,
    SEED_TILES.map((t) => [t, t.weight] as const),
  );
  const [firstRotation, r2] = Rng.int(r1, 0, 5);
  r = r2;
  commit(instantiate(firstDef, firstRotation, { q: 0, r: 0 }));

  while (tiles.length < cfg.tileCount) {
    // Anclas libres: las que dan a un hexágono vacío y no se han descartado. El
    // resto del contorno es pared, así que por ahí el tablero no crece.
    const open: Array<{ hex: HexCoord; dir: number; weight: number }> = [];
    for (const cell of cells.values()) {
      for (let dir = 0; dir < 6; dir++) {
        const ek = edgeKey(cell.coord, dir);
        if (blocked.has(ek)) continue;
        if (cells.has(Hex.key(Hex.add(cell.coord, direction(dir))))) continue;
        if (edges.get(ek) !== true) continue;
        // Sesgo de elongación: cuanto más lejos del origen (la primera loseta),
        // más probable es crecer por ahí.
        const d = Hex.distance(cell.coord, { q: 0, r: 0 });
        open.push({ hex: cell.coord, dir, weight: Math.pow(d + 1, cfg.sprawl) });
      }
    }
    if (open.length === 0) break;

    const [edge, rPick] = Rng.pickWeighted(
      r,
      open.map((o) => [o, o.weight] as const),
    );
    r = rPick;

    const candidates = fittingTiles(cells, edges, edge);
    if (candidates.length === 0) {
      blocked.add(edgeKey(edge.hex, edge.dir));
      continue;
    }

    const [chosen, rTile] = Rng.pickWeighted(
      r,
      candidates.map((c) => [c, c.weight] as const),
    );
    r = rTile;
    commit(chosen.instance);
  }

  return { cells, edges, tiles, rng: r };
}

/**
 * Todas las losetas (y giros y posiciones) que se pueden unir a un ancla libre.
 *
 * @returns {Array<{instance: TileInstance, weight: number}>} Candidatas con su peso de bolsa.
 */
function fittingTiles(
  cells: ReadonlyMap<HexKey, Cell>,
  edges: ReadonlyMap<EdgeKey, boolean>,
  target: { hex: HexCoord; dir: number },
): Array<{ instance: TileInstance; weight: number }> {
  const landing = Hex.add(target.hex, direction(target.dir));
  const incoming = opposite(target.dir);
  const out: Array<{ instance: TileInstance; weight: number }> = [];

  for (const def of TILES) {
    for (let rotation = 0; rotation < 6; rotation++) {
      // Se instancia en el origen solo para saber qué hexágono local lleva el
      // ancla que buscamos; luego se recoloca para que caiga en su sitio.
      const probe = instantiate(def, rotation, { q: 0, r: 0 });
      for (const anchor of probe.anchors) {
        if (anchor.dir !== incoming) continue;
        const origin = { q: landing.q - anchor.hex.q, r: landing.r - anchor.hex.r };
        const instance = instantiate(def, rotation, origin);
        if (fits(cells, edges, instance)) out.push({ instance, weight: def.weight });
      }
    }
  }
  return out;
}

/**
 * ¿Cabe esta loseta? Sin solapes, y con cada contacto emparejado: ancla contra
 * ancla o pared contra pared. La comprobación es de los DOS lados a propósito
 * —un ancla pegada a una pared es igual de ilegal se mire desde donde se mire—,
 * y así el ancla sigue siendo el único punto de unión posible.
 */
function fits(
  cells: ReadonlyMap<HexKey, Cell>,
  edges: ReadonlyMap<EdgeKey, boolean>,
  instance: TileInstance,
): boolean {
  for (const coord of instance.hexes) {
    if (cells.has(Hex.key(coord))) return false;
  }
  for (const edge of instance.edges) {
    const neighbor = Hex.add(edge.hex, direction(edge.dir));
    if (!cells.has(Hex.key(neighbor))) continue; // da al vacío, nada que comprobar
    const theirs = edges.get(edgeKey(neighbor, opposite(edge.dir)));
    if (theirs !== edge.isAnchor) return false;
  }
  return true;
}

/**
 * Elegir la entrada dentro de la primera loseta: su hexágono más alejado del
 * centro del tablero, que es el que queda mirando afuera.
 *
 * @returns {Draft} El hexágono de entrada (se marca fuera de esta función).
 */
function pickEntrance(drafts: ReadonlyMap<HexKey, Draft>, firstTile: PlacedTile): Draft {
  const all = [...drafts.values()];
  const center = {
    q: all.reduce((s, d) => s + d.coord.q, 0) / all.length,
    r: all.reduce((s, d) => s + d.coord.r, 0) / all.length,
  };
  const candidates = firstTile.hexes.map((c) => drafts.get(Hex.key(c))!);
  return candidates.reduce((best, d) =>
    squaredDistance(d.coord, center) > squaredDistance(best.coord, center) ? d : best,
  );
}

// Distancia euclídea (al cuadrado) en el plano de píxeles, para comparar
// "cuál está más afuera". No es distancia de juego, así que no vale hex.distance.
function squaredDistance(a: HexCoord, b: { q: number; r: number }): number {
  const ax = a.q + a.r / 2;
  const bx = b.q + b.r / 2;
  const dy = a.r - b.r;
  return (ax - bx) ** 2 + (dy * 0.866) ** 2;
}

// --- Conectividad ---------------------------------------------------------

/**
 * BFS en pasos desde la entrada, esquivando Montaña.
 * La Montaña es transitable en juego (coste 3) pero la generación la trata
 * como semi-barrera, así que un hexágono solo rodeado de Montaña sale con
 * distancia Infinity.
 *
 * @returns {Map<HexKey, number>} Distancia en pasos, o Infinity.
 */
function bfsDistances(drafts: ReadonlyMap<HexKey, Draft>, from: HexCoord): Map<HexKey, number> {
  const dist = new Map<HexKey, number>();
  for (const k of drafts.keys()) dist.set(k, Infinity);
  dist.set(Hex.key(from), 0);

  const queue: HexCoord[] = [from];
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const d = dist.get(Hex.key(current))!;
    for (const n of Hex.neighbors(current)) {
      const nk = Hex.key(n);
      const draft = drafts.get(nk);
      if (!draft || !isOpenGround(draft.terrain)) continue;
      if (dist.get(nk)! <= d + 1) continue;
      dist.set(nk, d + 1);
      queue.push(n);
    }
  }
  return dist;
}

/**
 * Garantizar que todo hexágono transitable es alcanzable desde la entrada
 * (§2c paso 3). Cuando queda una bolsa aislada, se abre un paso convirtiendo
 * en Llanura las Montañas del camino más corto hasta ella.
 *
 * Muta `drafts` a propósito: es un paso de construcción, no una regla de juego.
 *
 * @returns {Rng.Rng} El generador tras los sorteos de desempate.
 */
function carveConnectivity(drafts: Map<HexKey, Draft>, entrance: HexCoord, rng: Rng.Rng): Rng.Rng {
  let r = rng;
  // Cada iteración conecta una bolsa. El bucle termina porque cada pasada
  // reduce en al menos uno el número de hexes inalcanzables.
  for (let guard = 0; guard < drafts.size; guard++) {
    const dist = bfsDistances(drafts, entrance);
    const stranded = [...drafts.values()].filter(
      (d) => isOpenGround(d.terrain) && !Number.isFinite(dist.get(Hex.key(d.coord))!),
    );
    if (stranded.length === 0) return r;

    // Se elige una bolsa al azar (no siempre la primera) para que el tablero no
    // tenga un sesgo de forma según el orden de recorrido.
    const [target, nextR] = Rng.pick(r, stranded);
    r = nextR;
    for (const coord of pathThroughMountains(drafts, entrance, target.coord)) {
      const draft = drafts.get(Hex.key(coord))!;
      if (!isOpenGround(draft.terrain)) draft.terrain = "llanura";
    }
  }
  return r;
}

/**
 * Camino más corto de `from` a `to` pudiendo atravesar Montaña.
 * Solo se usa para abrir pasos: devuelve la ruta, no la modifica.
 *
 * @returns {HexCoord[]} La ruta incluyendo extremos, o vacía si no existe.
 */
function pathThroughMountains(
  drafts: ReadonlyMap<HexKey, Draft>,
  from: HexCoord,
  to: HexCoord,
): HexCoord[] {
  const cameFrom = new Map<HexKey, HexCoord | null>([[Hex.key(from), null]]);
  const queue: HexCoord[] = [from];

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (Hex.equals(current, to)) break;
    for (const n of Hex.neighbors(current)) {
      const nk = Hex.key(n);
      if (!drafts.has(nk) || cameFrom.has(nk)) continue;
      cameFrom.set(nk, current);
      queue.push(n);
    }
  }

  if (!cameFrom.has(Hex.key(to))) return [];
  const path: HexCoord[] = [];
  let step: HexCoord | null = to;
  while (step) {
    path.push(step);
    step = cameFrom.get(Hex.key(step)) ?? null;
  }
  return path.reverse();
}

// --- Fichas ---------------------------------------------------------------

/**
 * Sembrar fichas sobre los hexes transitables según la tabla B (§2c).
 * Quedan fuera: la entrada, la Montaña y los hexes con localización especial
 * (que colocan sus propias fichas). El Pueblo recibe siempre una de Personaje,
 * porque es donde viven los NPCs de tienda y descanso.
 *
 * Muta `drafts`; devuelve el generador avanzado.
 *
 * @returns {Rng.Rng} El generador tras todos los sorteos.
 */
function seedTokens(drafts: Map<HexKey, Draft>, cfg: BoardConfig, rng: Rng.Rng): Rng.Rng {
  let r = rng;
  const candidates: Draft[] = [];

  for (const draft of drafts.values()) {
    if (draft.location === "pueblo") {
      draft.token = "personaje";
      continue;
    }
    // Guarida y Mazmorra alojan su propio Élite, no una ficha de la tabla B.
    if (draft.location !== null || draft.isEntrance) continue;
    if (TOKEN_WEIGHTS[draft.terrain].length === 0) continue;
    candidates.push(draft);
  }

  const target = Math.round(candidates.length * cfg.tokenDensity);
  const [shuffled, r2] = Rng.shuffle(r, candidates);
  r = r2;

  for (const draft of shuffled.slice(0, target)) {
    const [token, nextR] = Rng.pickWeighted(r, TOKEN_WEIGHTS[draft.terrain]);
    r = nextR;
    draft.token = token;
  }
  return r;
}

// --- Consulta -------------------------------------------------------------

/** Coste de movimiento para entrar en un hexágono. */
export function moveCostOf(hex: HexTile): number {
  return TERRAINS[hex.terrain].moveCost;
}
