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
// Y como el maquetado es lo que manda, este archivo NO REPINTA NADA. Ni un
// hexágono: el tablero de la partida son las losetas del catálogo tal y como se
// dibujaron, y lo que se ve en /dev/losetas es exactamente lo que sale al jugar.
// Se llegó aquí quitando las tres excepciones que quedaban, y las tres por el
// mismo motivo —un tablero que se corrige a sí mismo esconde el problema en vez
// de enseñarlo—:
//
//   · La MONTAÑA que dejaba una bolsa incomunicada ya no se abre: se INFORMA
//     (`stranded`). Que un trozo de terreno quede detrás de la roca es un fallo
//     de maquetado, y se arregla en la loseta, donde `typeNotes` ya avisa.
//   · La ENTRADA ya no se repinta si cae en roca: `pickEntrance` elige por
//     terreno, así que solo podría pasar con una primera loseta toda de Montaña,
//     y eso también es maquetado.
//   · El PUEBLO ya no se funda. Si el encaje no saca ninguna loseta de Pueblo,
//     esa partida no tiene Pueblo —ni tienda, ni descanso largo—, y eso se
//     arregla subiendo el peso de los tipos de Pueblo en la bolsa, que es donde
//     se decide cuánta gente hay en el mundo.
//
// Lo que se conserva del generador anterior, porque no depende de la forma
// del tablero: Guarida en el hexágono más lejano, fichas por la tabla B y
// reparto de los 3 Élite sin repetir.
//
// Lo que ha cambiado con Pueblo y Mazmorra convertidos en TERRENO: los dos
// sitios los trae ya maquetados la loseta, no los estampa el generador, y el
// segundo Élite ya no depende de un dado sino de que el tablero haya sacado
// Mazmorra en la mitad lejana. La Guarida es la única localización que queda, y
// ya no se ve: solo marca dónde espera el boss.
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
  type NpcType,
  type PlacedTile,
} from "./state";
import { TERRAINS, type TerrainId, isOpenGround } from "./terrain";
import { TILES } from "./tile-library";
import { type TileInstance, direction, instantiate, opposite } from "./tiles";

export type BoardConfig = {
  /** Semilla legible; la misma semilla da el mismo tablero. */
  readonly seed: string;
  /**
   * Losetas a colocar. Los tres tamaños de tablero son **12, 15 y 18**, y 12 es
   * el mínimo *(decidido)*: por debajo de eso el mapa no da para una travesía.
   * Con la media de ~8,6 hexágonos por pieza (por peso de bolsa) salen ~103,
   * ~129 y ~155 hexágonos — y lo que fija el tamaño del tablero es ese total,
   * no el número de piezas, porque la bolsa va de 4 a 37 hexágonos por loseta.
   */
  readonly tileCount: number;
  /** Fracción de hexes transitables con ficha: ~15-20 % (§2c tabla B). */
  readonly tokenDensity: number;
  /**
   * Cuánto se estira el tablero lejos de la entrada. 0 = crece por igual en
   * todas direcciones (tablero redondeado, travesía corta); 2 = tiende a
   * alargarse, que es lo que hace que la Guarida quede de verdad lejos.
   */
  readonly sprawl: number;
};

export const DEFAULT_BOARD_CONFIG: Omit<BoardConfig, "seed"> = {
  tileCount: 12,
  tokenDensity: 0.17,
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
  // La Mazmorra es el único terreno donde el Tesoro pesa más que la Amenaza: es
  // un hallazgo, y si no premiara no valdría la pena entrar. Sale poco porque no
  // se sortea (peso 0 en la tabla A), así que puede ser generosa sin
  // desbalancear el reparto: solo hay mazmorras donde una loseta las dibuja.
  mazmorra: [
    ["enemigo", 2],
    ["amenaza", 1],
    ["tesoro", 3],
    ["exploracion", 3],
    ["terreno", 0],
    ["personaje", 0],
  ],
  // El Pueblo no entra en este sorteo: sus NPC los reparte `seedTokens` con su
  // propia regla de tope por tamaño, y ninguna otra ficha aparece ahí. Es la
  // única entrada de la tabla que no es una tabla, y por eso está vacía.
  pueblo: [],
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
   * Terreno transitable al que no se llega desde la entrada sin cruzar Montaña:
   * una bolsa que la roca deja incomunicada.
   *
   * Antes esto se ARREGLABA abriendo la Montaña, y ya no: se informa y se deja
   * como está. El tablero es conexo por construcción —las losetas se encajan
   * borde con borde—, así que una bolsa incomunicada solo puede venir de una
   * loseta cuya propia roca parte su terreno en dos, y de eso avisa `typeNotes`
   * al maquetarla. Con la biblioteca de hoy sale vacío, y vacío es lo normal:
   * si /dev/tablero empieza a contar hexágonos aquí, lo que hay que arreglar es
   * una loseta, no la generación.
   */
  readonly stranded: readonly HexCoord[];
};

// Hexágono mutable, solo dentro de este módulo. Lo que sale es readonly.
type Draft = {
  coord: HexCoord;
  terrain: TerrainId;
  location: LocationId | null;
  token: BoardToken | null;
  npcType: NpcType | null;
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
  // el último. Con la biblioteca de hoy no llegaba a pasar en 300 semillas hasta
  // 12 losetas —el mínimo de hoy—, y con 15 y 18 está sin medir: cuantas más
  // piezas se piden, más se agotan las anclas libres. Si el encaje se queda corto,
  // el tablero sale con menos losetas de las pedidas y /dev/tablero lo canta
  // («12 de 15 pedidas»); lo que hay que mirar entonces es el reparto de anclas de
  // la bolsa, no subir este número.
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
  // biblioteca. Y nada de lo que viene después lo cambia: este es el terreno
  // definitivo del tablero, hexágono a hexágono.
  const drafts = new Map<HexKey, Draft>();
  for (const [k, cell] of layout.cells) {
    drafts.set(k, {
      coord: cell.coord,
      terrain: cell.terrain,
      location: null,
      token: null,
      npcType: null,
      tileId: cell.tileId,
      isEntrance: false,
    });
  }

  // --- 3. La entrada --------------------------------------------------------
  // La "puerta" del tablero (§2c paso 0). Con losetas no hay esquinas, así que
  // se elige dentro de la PRIMERA loseta, que es por donde empezó a crecer todo,
  // y con preferencia por la boca de su camino (ver `pickEntrance`).
  // La entrada NO se repinta: `pickEntrance` ordena por terreno, así que solo
  // caería en roca si la primera loseta fuera toda de Montaña, y con la
  // biblioteca de hoy no existe esa loseta. Si algún día se maqueta, la partida
  // empezará pagando 3 de movimiento por salir, que es lo que dice el terreno.
  const entranceDraft = pickEntrance(drafts, layout.tiles[0]);
  entranceDraft.isEntrance = true;
  const entrance = entranceDraft.coord;

  // --- 4. Conectividad: se MIDE, no se arregla ------------------------------
  const dist = bfsDistances(drafts, entrance);
  const stranded = findStranded(drafts, dist);

  // --- 5. El boss y los sitios de la partida (§2c paso 4) ------------------
  const placeable = [...drafts.values()].filter(
    (d) => !d.isEntrance && isOpenGround(d.terrain) && Number.isFinite(dist.get(Hex.key(d.coord))!),
  );

  // La Guarida: el hexágono transitable MÁS LEJANO a la entrada. Es lo ÚNICO que
  // sigue siendo una localización, y ya no se ve: no lleva ficha ni placa, solo
  // marca para el motor dónde espera el boss, que es la condición de victoria
  // (§2b). Lo que el jugador ve de ella es la ficha de Enemigo del propio boss.
  const lair = placeable.reduce((best, d) =>
    dist.get(Hex.key(d.coord))! > dist.get(Hex.key(best.coord))! ? d : best,
  );
  lair.location = "guarida";
  const maxDist = dist.get(Hex.key(lair.coord))!;

  // Aquí no hay paso del Pueblo, y es a propósito: el Pueblo es TERRENO y lo
  // trae maquetado su loseta (Posada, Poblado, Iglesia, Torre de mago). Si el
  // encaje no saca ninguna, esa partida no tiene Pueblo —ni tienda, ni descanso
  // largo—, y eso se corrige en el peso de la bolsa, no repintando un hexágono.

  // El segundo Élite ya no lo aloja una localización: lo aloja la ROCA. Va en un
  // hexágono de Mazmorra de la mitad lejana, y si el tablero no ha sacado
  // ninguna loseta de Mazmorra allí, esta partida no lleva Élite de Mazmorra —el
  // tipo de loseta que salga es lo que decide qué contenido hay, y eso es todo
  // el sentido de que la Mazmorra sea terreno y no un sello encima—.
  const dungeonCells = placeable.filter(
    (d) =>
      d.terrain === "mazmorra" &&
      d.location === null &&
      dist.get(Hex.key(d.coord))! > maxDist / 2 &&
      Hex.distance(d.coord, lair.coord) > 1,
  );
  let dungeonHex: HexCoord | null = null;
  if (dungeonCells.length > 0) {
    // La cámara más honda de las que haya: la que más lejos queda de la entrada.
    dungeonHex = dungeonCells.reduce((best, d) =>
      dist.get(Hex.key(d.coord))! > dist.get(Hex.key(best.coord))! ? d : best,
    ).coord;
  }

  // --- 6. Fichas (tabla B) --------------------------------------------------
  rng = seedTokens(drafts, cfg, dungeonHex, rng, layout.tiles);

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
      npcType: d.npcType,
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
    stranded,
    chapter: {
      turn: 1,
      threat: 0,
      thresholdsFired: [],
      bossElite: shuffledElites[0],
      dungeonElite: dungeonHex ? shuffledElites[1] : null,
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
  // Al mapa no se entra saliendo de un agujero, y tampoco desde la plaza del
  // pueblo: la entrada es el borde del mundo conocido, no un sitio con nombre.
  if (terrain === "mazmorra" || terrain === "pueblo") return 2;
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
 * El terreno transitable al que no se llega desde la entrada (§2c paso 3).
 *
 * Antes esta comprobación ABRÍA la Montaña que estorbaba, y ahora solo cuenta:
 * el maquetado no se toca. Una bolsa incomunicada no se puede formar encajando
 * losetas —el tablero es conexo por construcción—, así que si aparece, viene de
 * una loseta cuya roca parte su propio terreno en dos y a la que ninguna vecina
 * se lo une por fuera. Eso se arregla en la loseta, y `typeNotes` lo avisa al
 * maquetarla; taparlo aquí solo conseguía que nadie se enterara.
 *
 * @param {ReadonlyMap<HexKey, number>} dist - Distancias desde la entrada, con
 *   Infinity en lo que no se alcanza sin cruzar Montaña.
 * @returns {HexCoord[]} Los hexágonos transitables incomunicados; vacío es lo normal.
 */
function findStranded(
  drafts: ReadonlyMap<HexKey, Draft>,
  dist: ReadonlyMap<HexKey, number>,
): HexCoord[] {
  return [...drafts.values()]
    .filter((d) => isOpenGround(d.terrain) && !Number.isFinite(dist.get(Hex.key(d.coord))!))
    .map((d) => d.coord);
}

// --- NPCs de pueblo ---------------------------------------------------------

/** Los 7 tipos de NPC del prototipo (docs/characters/npcs.md §2). */
const NPC_TYPES: readonly NpcType[] = [
  "vendedor",
  "tabernero",
  "sacerdote",
  "mago",
  "capitan-mercenarios",
  "informante",
  "herrero",
];

// Las tres losetas de Pueblo de UN hexágono ya vienen tematizadas por su nota
// (data/tile-library.json): la Posada es un tabernero y punto, la Iglesia el
// Sacerdote, la Torre de mago el Mago. Con un solo hexágono no hay sorteo que
// hacer, así que aquí se fija en vez de tirar entre los 7.
const FIXED_VILLAGE_NPC: Readonly<Record<string, NpcType>> = {
  posada: "tabernero",
  iglesia: "sacerdote",
  "torre-de-mago": "mago",
};

/**
 * Tope de NPC que da una instancia de Pueblo, según cuántos hexágonos de
 * Pueblo dibuja. No todos hablan: un Poblado grande saca sus cuatro
 * hexágonos de golpe, y con los cuatro oficios a la vez el mapa se llena de
 * gente. 1 y 2 hexágonos dan uno; 4 dan dos — el resto de hexágonos de esa
 * instancia se queda sin ficha, como Pueblo vacío.
 */
function npcCapFor(villageHexCount: number): number {
  if (villageHexCount <= 2) return 1;
  return Math.ceil(villageHexCount / 2);
}

/**
 * Repartir los NPC de una instancia de Pueblo: cuáles de sus hexágonos hablan
 * y qué oficio le toca a cada uno, sin repetir dentro de la misma instancia
 * —no puede haber dos taberneros en el mismo Poblado—.
 *
 * Muta los `Draft` elegidos.
 */
function seedVillageNpcs(
  defId: string,
  hexes: readonly Draft[],
  rng: Rng.Rng,
): Rng.Rng {
  const fixed = FIXED_VILLAGE_NPC[defId];
  if (fixed !== undefined) {
    hexes[0].token = "personaje";
    hexes[0].npcType = fixed;
    return rng;
  }

  const cap = npcCapFor(hexes.length);
  const [shuffledHexes, r1] = Rng.shuffle(rng, hexes);
  const [shuffledNpcs, r2] = Rng.shuffle(r1, NPC_TYPES);
  for (let i = 0; i < cap; i++) {
    shuffledHexes[i].token = "personaje";
    shuffledHexes[i].npcType = shuffledNpcs[i];
  }
  return r2;
}

// --- Fichas ---------------------------------------------------------------

/**
 * Sembrar fichas sobre los hexes transitables según la tabla B (§2c).
 *
 * Quedan fuera: la entrada, la Montaña, el hexágono de la Guarida y el de la
 * Mazmorra que aloja al segundo Élite —esos dos ya tienen su contenido, y es un
 * boss—. El Pueblo también queda fuera de la tabla B, pero con su propia regla
 * (`seedVillageNpcs`): tope de NPC por tamaño de la instancia, sin repetir
 * oficio dentro de ella —ver `npcCapFor` y `FIXED_VILLAGE_NPC`—.
 *
 * Muta `drafts`; devuelve el generador avanzado.
 *
 * @param {HexCoord | null} dungeonHex - El hexágono de Mazmorra con el segundo
 *   Élite, si el tablero lo lleva: no se siembra encima.
 * @param {readonly PlacedTile[]} tiles - Las losetas colocadas, para saber qué
 *   `defId` tiene cada instancia de Pueblo (`Draft.tileId` solo da el id de
 *   instancia, no el tipo de loseta).
 * @returns {Rng.Rng} El generador tras todos los sorteos.
 */
function seedTokens(
  drafts: Map<HexKey, Draft>,
  cfg: BoardConfig,
  dungeonHex: HexCoord | null,
  rng: Rng.Rng,
  tiles: readonly PlacedTile[],
): Rng.Rng {
  let r = rng;
  const candidates: Draft[] = [];
  const dungeonKey = dungeonHex ? Hex.key(dungeonHex) : null;

  const villageHexesByTile = new Map<string, Draft[]>();
  for (const draft of drafts.values()) {
    if (draft.terrain !== "pueblo") continue;
    const list = villageHexesByTile.get(draft.tileId);
    if (list) list.push(draft);
    else villageHexesByTile.set(draft.tileId, [draft]);
  }
  for (const [tileId, hexes] of villageHexesByTile) {
    const defId = tiles.find((t) => t.id === tileId)!.defId;
    r = seedVillageNpcs(defId, hexes, r);
  }

  for (const draft of drafts.values()) {
    if (draft.terrain === "pueblo") continue; // ya resuelto arriba
    // La Guarida aloja al boss y la Mazmorra elegida al segundo Élite: ninguna
    // de las dos lleva ficha de la tabla B.
    if (draft.location !== null || draft.isEntrance) continue;
    if (dungeonKey !== null && Hex.key(draft.coord) === dungeonKey) continue;
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
