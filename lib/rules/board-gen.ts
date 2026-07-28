// =========================================================================
// Generación del TABLERO: encaje de losetas
//
// Aquí se monta el tablero de una partida; la loseta que se encaja es una
// pieza ya maquetada en la biblioteca (lib/rules/tile-library.ts). Son dos
// problemas separados a propósito (state.ts, "vocabulario"): esto no decide
// cómo es una loseta, solo cuántas, dónde y con qué giro.
//
// El tablero se construye encajando losetas borde con borde, como en un tablero
// modular: es el sistema de losetas de docs/board/board-map.md §2, adelantado
// desde la "versión rica". La silueta sale irregular porque depende de por dónde
// encajen, no de una rejilla. Las losetas no son todas del mismo tamaño (van de
// 4 a 37 hexágonos), así que POCAS losetas grandes dan tablero de sobra: lo que
// hay que mirar es el total de hexágonos, no el número de piezas.
//
// Reglas de encaje: el tablero solo crece por las ANCLAS. Un ancla libre de una
// loseta ya puesta se empareja con un ancla de la que entra, y donde dos losetas
// se toquen sin ancla tienen que ser pared contra pared: un ancla nunca queda
// pegada al contorno ciego de otra. Eso es lo único que decide qué encaja.
//
// El terreno lo trae la loseta hexágono a hexágono, y viene ENTERO: aquí no se
// sortea ni un hexágono. Lo que decide el terreno del tablero es el maquetado de
// la biblioteca; la tabla A (§2c) es el objetivo al que ese maquetado apunta.
//
// Y como el maquetado es lo que manda, este archivo lo REPINTA lo menos posible:
// el único terreno que puede cambiar es la Montaña que hay que abrir para que no
// quede una bolsa aislada (paso 4), y se abre por el punto más estrecho que haya.
// Lo que se ve en el catálogo de /dev/losetas es lo que sale en la partida.
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
import { TERRAINS, type TerrainId, isOpenGround } from "./terrain";
import { TILES } from "./tile-library";
import { type TileInstance, direction, instantiate, opposite } from "./tiles";

export type BoardConfig = {
  /** Semilla legible; la misma semilla da el mismo tablero. */
  readonly seed: string;
  /** Losetas a colocar. 9 × ~8,6 hexágonos ≈ 78 hexágonos. */
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
  // La Cueva es el único terreno donde el Tesoro pesa más que la Amenaza: es un
  // hallazgo, y si no premiara no valdría la pena entrar. Sale poco porque no se
  // sortea (peso 0 en la tabla A), así que puede ser generosa sin desbalancear
  // el reparto: solo hay cuevas donde una loseta las dibuja.
  cueva: [
    ["enemigo", 2],
    ["amenaza", 1],
    ["tesoro", 3],
    ["exploracion", 3],
    ["terreno", 0],
    ["personaje", 0],
  ],
};

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
  /**
   * Las Montañas que hubo que abrir para no dejar una bolsa aislada (paso 4):
   * los únicos hexágonos del tablero cuyo terreno NO es el que maquetó su
   * loseta. Sale en el informe porque es la única grieta entre el catálogo y la
   * partida, y conviene poder mirarla (/dev/tablero la cuenta); vacía es lo
   * normal y lo deseable.
   */
  readonly openedPasses: readonly HexCoord[];
};

// Hexágono mutable, solo dentro de este módulo. Lo que sale es readonly.
type Draft = {
  coord: HexCoord;
  terrain: TerrainId;
  location: LocationId | null;
  token: BoardToken | null;
  tileId: string;
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
  // No se puede arreglar desde dentro del bucle (ahí ya no hay sitio), así que se
  // vuelve a sembrar con el generador ya avanzado y se queda el mejor intento, no
  // el último. Con la biblioteca de hoy no llega a pasar en 300 semillas ni con
  // 12 losetas, pero depende del reparto de anclas de la bolsa: cada loseta nueva
  // puede volver a provocarlo, así que la red se queda puesta.
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

  // --- 2. El terreno, tal cual lo trae cada loseta --------------------------
  // No se sortea nada: la loseta llega pintada entera (`TileCell.terrain` es
  // obligatorio), así que el terreno del tablero lo decide el maquetado de la
  // biblioteca. Lo único que puede cambiarlo después es abrir un paso o arreglar
  // la entrada, más abajo, y eso son reparaciones de conectividad, no azar.
  const drafts = new Map<HexKey, Draft>();
  for (const [k, cell] of layout.cells) {
    drafts.set(k, {
      coord: cell.coord,
      terrain: cell.terrain,
      location: null,
      token: null,
      tileId: cell.tileId,
      isEntrance: false,
    });
  }

  // --- 3. La entrada --------------------------------------------------------
  // La "puerta" del tablero (§2c paso 0). Con losetas no hay esquinas, así que
  // se elige dentro de la PRIMERA loseta, que es por donde empezó a crecer todo,
  // y con preferencia por la boca de su camino (ver `pickEntrance`).
  const entranceDraft = pickEntrance(drafts, layout.tiles[0]);
  entranceDraft.isEntrance = true;
  // Último recurso: si la primera loseta es TODA roca no hay puerta posible, y
  // con el pool base de 2 no podrías ni salir del hexágono. Es el único sitio
  // fuera del paso 4 donde se repinta maquetado, y con la biblioteca de hoy no
  // llega a pasar nunca.
  if (!isOpenGround(entranceDraft.terrain)) entranceDraft.terrain = "llanura";
  const entrance = entranceDraft.coord;

  // --- 4. Conectividad ------------------------------------------------------
  const carved = carveConnectivity(drafts, entrance, rng);
  rng = carved.rng;
  const dist = bfsDistances(drafts, entrance);

  // --- 5. Localizaciones garantizadas (§2c paso 4) -------------------------
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
  // Nadie funda un pueblo dentro de una cueva; y los pueblos se asientan en el
  // camino, así que si hay alguno a mano va ahí. Las dos son preferencias, no
  // requisitos: si la única opción es una cueva, pueblo en la cueva antes que
  // tablero sin pueblo (que dejaría tienda y descanso largo inaccesibles).
  const outdoors = villagePool.filter((d) => d.terrain !== "cueva");
  const settleable = outdoors.length > 0 ? outdoors : villagePool;
  const onRoad = settleable.filter((d) => d.terrain === "camino");
  const [village, r2] = Rng.pick(rng, onRoad.length > 0 ? onRoad : settleable);
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
      // Una mazmorra se entra por un agujero en la roca: si la mitad lejana
      // tiene una cueva, es ahí. Es la contrapartida del pueblo en el camino, y
      // le da a la Cueva algo que hacer más allá de su tabla de fichas.
      const caves = farHalf.filter((d) => d.terrain === "cueva");
      const [dungeon, r4] = Rng.pick(rng, caves.length > 0 ? caves : farHalf);
      rng = r4;
      dungeon.location = "mazmorra";
    } else {
      hasDungeon = false;
    }
  }

  // --- 6. Fichas (tabla B) --------------------------------------------------
  rng = seedTokens(drafts, cfg, rng);

  // --- 7. Élites: boss y, si hay, el de la Mazmorra ------------------------
  const [shuffledElites, r5] = Rng.shuffle(rng, ELITES);
  rng = r5;

  // --- 8. Congelar ----------------------------------------------------------
  const hexes = new Map<HexKey, HexTile>();
  for (const [k, d] of drafts) {
    hexes.set(k, {
      coord: d.coord,
      terrain: d.terrain,
      location: d.location,
      token: d.token,
      tileId: d.tileId,
      isEntrance: d.isEntrance,
      // La niebla arranca cerrada; abrirla es trabajo de la visión del héroe.
      terrainRevealed: false,
      contentRevealed: false,
    });
  }

  return {
    board: {
      hexes,
      tiles: layout.tiles,
      entrance,
      distanceFromEntrance: dist,
      voids: findVoids(hexes),
    },
    openedPasses: carved.opened,
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

// --- Huecos cerrados -------------------------------------------------------

/**
 * Los huecos cerrados del tablero: vacío rodeado de losetas por todos lados.
 *
 * Aparecen solos al encajar —dos losetas se tocan pared contra pared y dejan un
 * rincón sin cubrir— y son PERMANENTES: la loseta más pequeña son 3 hexágonos y
 * aun así tendría que encajar ancla contra ancla, así que ahí ya no entra nada.
 * Son terreno intransitable, y están DECIDIDOS como parte del mapa (§2): una
 * sima, una laguna, un derrumbe. Salen en la mitad de los tableros y ocupan ~1,6
 * hexágonos, que es justo lo que hace que la silueta no parezca una rejilla.
 *
 * No hay que confundirlos con el exterior: se distinguen inundando el vacío
 * DESDE FUERA. Se rodea el tablero con un anillo de margen —que es todo vacío y
 * está conectado consigo mismo—, se llena desde ahí, y el vacío al que el
 * exterior no llega es un hueco cerrado.
 *
 * @returns {HexCoord[]} Los hexágonos de vacío encerrados, sin orden particular.
 */
function findVoids(hexes: ReadonlyMap<HexKey, HexTile>): HexCoord[] {
  const coords = [...hexes.values()].map((h) => h.coord);
  if (coords.length === 0) return [];

  const minQ = Math.min(...coords.map((c) => c.q)) - 1;
  const maxQ = Math.max(...coords.map((c) => c.q)) + 1;
  const minR = Math.min(...coords.map((c) => c.r)) - 1;
  const maxR = Math.max(...coords.map((c) => c.r)) + 1;
  const inside = (c: HexCoord) => c.q >= minQ && c.q <= maxQ && c.r >= minR && c.r <= maxR;

  const outside = new Set<HexKey>();
  const start = { q: minQ, r: minR };
  outside.add(Hex.key(start));
  const queue: HexCoord[] = [start];
  for (let head = 0; head < queue.length; head++) {
    for (const n of Hex.neighbors(queue[head])) {
      const nk = Hex.key(n);
      if (!inside(n) || hexes.has(nk) || outside.has(nk)) continue;
      outside.add(nk);
      queue.push(n);
    }
  }

  const voids: HexCoord[] = [];
  for (let q = minQ; q <= maxQ; q++) {
    for (let r = minR; r <= maxR; r++) {
      const coord = { q, r };
      const k = Hex.key(coord);
      if (!hexes.has(k) && !outside.has(k)) voids.push(coord);
    }
  }
  return voids;
}

// --- Colocación de losetas -------------------------------------------------

type Cell = { coord: HexCoord; tileId: string; terrain: TerrainId };

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
 * Elegir la entrada dentro de la primera loseta.
 *
 * Con losetas maquetadas hay un candidato mejor que "el hexágono de más afuera":
 * la BOCA DEL CAMINO. Un camino cruza su loseta de lado a lado y se ancla por sus
 * bocas (lib/rules/tile-library.ts), así que un hexágono de Camino de la primera
 * loseta ya está mirando al vacío, y entrar al mapa por el camino es lo que haría
 * cualquiera. Sale así en ~la mitad de los tableros, los que siembran con una
 * loseta que trae sendero.
 *
 * Cuando no hay camino, se vuelve al criterio de antes: el más alejado del centro
 * del tablero. Y se ordena por terreno para no tener que repintar nada después,
 * que es lo que hacía la versión anterior el 18 % de las veces.
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
  return candidates.reduce((best, d) => {
    const diff = doorRank(d.terrain) - doorRank(best.terrain);
    if (diff !== 0) return diff < 0 ? d : best;
    return squaredDistance(d.coord, center) > squaredDistance(best.coord, center) ? d : best;
  });
}

/** Lo buena que es una puerta cada terreno; cuanto más bajo, mejor. */
function doorRank(terrain: TerrainId): number {
  if (terrain === "camino") return 0; // la boca del sendero
  if (terrain === "cueva") return 2; // al mapa no se entra saliendo de un agujero
  if (!isOpenGround(terrain)) return 3; // Montaña: no hay puerta, hay que abrirla
  return 1;
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
 * (§2c paso 3). Cuando una masa de Montaña deja una bolsa aislada, se abre un
 * paso convirtiendo en Llanura las Montañas que hagan falta.
 *
 * Con el terreno maquetado esto es lo ÚNICO que repinta una loseta, así que abre
 * el paso MÁS ESTRECHO que haya: de todas las bolsas aisladas se conecta primero
 * la que cuesta menos roca, y por la ruta que menos roca cruza.
 *
 * Con la biblioteca de hoy no llega a hacer falta ni una vez en 300 tableros, y no
 * por suerte: la bolsa aislada aparecía cuando una variante tenía su terreno
 * transitable partido por su propia roca, y de eso avisa ahora `typeNotes`. Esto
 * es la red de seguridad, no el caso normal.
 *
 * Muta `drafts` a propósito: es un paso de construcción, no una regla de juego.
 *
 * @returns {{rng: Rng.Rng, opened: HexCoord[]}} El generador tras los sorteos de
 * desempate y las Montañas repintadas, para poder contarlas.
 */
function carveConnectivity(
  drafts: Map<HexKey, Draft>,
  entrance: HexCoord,
  rng: Rng.Rng,
): { rng: Rng.Rng; opened: HexCoord[] } {
  let r = rng;
  const opened: HexCoord[] = [];
  // Cada iteración conecta una bolsa. El bucle termina porque cada pasada
  // reduce en al menos uno el número de hexes inalcanzables.
  for (let guard = 0; guard < drafts.size; guard++) {
    const dist = bfsDistances(drafts, entrance);
    const stranded = [...drafts.values()].filter(
      (d) => isOpenGround(d.terrain) && !Number.isFinite(dist.get(Hex.key(d.coord))!),
    );
    if (stranded.length === 0) return { rng: r, opened };

    const search = mountainCosts(drafts, entrance);
    const rockOf = (d: Draft) => search.cost.get(Hex.key(d.coord)) ?? Infinity;
    const cheapest = Math.min(...stranded.map(rockOf));
    // No puede pasar —el tablero es conexo por construcción, que para eso se
    // encajan las losetas—, pero si pasara, repintar nada dejaría el bucle
    // dando vueltas hasta el guard.
    if (!Number.isFinite(cheapest)) return { rng: r, opened };

    // Entre las bolsas que empatan a roca se sortea, para que el tablero no
    // herede un sesgo de forma del orden de recorrido.
    const [target, nextR] = Rng.pick(
      r,
      stranded.filter((d) => rockOf(d) === cheapest),
    );
    r = nextR;
    for (const coord of pathTo(search, target.coord)) {
      const draft = drafts.get(Hex.key(coord))!;
      if (isOpenGround(draft.terrain)) continue;
      draft.terrain = "llanura";
      opened.push(coord);
    }
  }
  return { rng: r, opened };
}

/** Lo que cuesta llegar a cada hexágono en Montañas abiertas, y por dónde. */
type PassSearch = {
  readonly cost: ReadonlyMap<HexKey, number>;
  readonly cameFrom: ReadonlyMap<HexKey, HexCoord | null>;
};

/**
 * Coste de llegar a cada hexágono medido en ROCA ROTA: entrar en terreno
 * transitable es gratis y entrar en Montaña cuesta uno. No busca la ruta más
 * corta, busca la que destroza menos maquetado —rodea la sierra hasta su punto
 * más estrecho y la cruza por ahí—, que es la diferencia entre abrir un paso y
 * hacerle un agujero.
 *
 * Dijkstra a mano, buscando el mínimo con un recorrido lineal: el tablero son
 * ~70 hexágonos, así que una cola de prioridad costaría más de leer que de correr.
 *
 * @returns {PassSearch} Coste y predecesor de cada hexágono del tablero.
 */
function mountainCosts(drafts: ReadonlyMap<HexKey, Draft>, from: HexCoord): PassSearch {
  const cost = new Map<HexKey, number>([[Hex.key(from), 0]]);
  const cameFrom = new Map<HexKey, HexCoord | null>([[Hex.key(from), null]]);
  const pending = new Set<HexKey>([Hex.key(from)]);
  const settled = new Set<HexKey>();

  while (pending.size > 0) {
    let current: HexKey | null = null;
    for (const k of pending) {
      if (current === null || cost.get(k)! < cost.get(current)!) current = k;
    }
    pending.delete(current!);
    settled.add(current!);

    const coord = drafts.get(current!)!.coord;
    for (const n of Hex.neighbors(coord)) {
      const nk = Hex.key(n);
      const draft = drafts.get(nk);
      if (!draft || settled.has(nk)) continue;
      const next = cost.get(current!)! + (isOpenGround(draft.terrain) ? 0 : 1);
      if (next >= (cost.get(nk) ?? Infinity)) continue;
      cost.set(nk, next);
      cameFrom.set(nk, coord);
      pending.add(nk);
    }
  }
  return { cost, cameFrom };
}

/**
 * Rehacer la ruta hasta `to` desde una búsqueda ya hecha.
 *
 * @returns {HexCoord[]} La ruta incluyendo extremos, o vacía si no se alcanzó.
 */
function pathTo(search: PassSearch, to: HexCoord): HexCoord[] {
  if (!search.cameFrom.has(Hex.key(to))) return [];
  const path: HexCoord[] = [];
  let step: HexCoord | null = to;
  while (step) {
    path.push(step);
    step = search.cameFrom.get(Hex.key(step)) ?? null;
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
