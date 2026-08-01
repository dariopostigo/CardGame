// =========================================================================
// Tipos del dominio de partida
//
// Traducción a TypeScript del modelo esbozado en
// docs/board/board-map-dev.md §2. Aquí solo hay tipos: ninguna función, ningún
// dato. Lo que todavía no se construye (Character, Enemy, Combat, Card) se
// añadirá al implementar su subsistema, no antes.
//
// Regla de la casa: modelar para que los estados imposibles no compilen.
//
// VOCABULARIO (cuatro cosas distintas, cuatro nombres distintos):
//   · hexágono (`Hex`)      — una casilla. Tiene terreno, ficha y niebla.
//   · loseta   (`TileDef` / `PlacedTile`) — pieza predefinida de hexágonos con
//     su forma, el terreno de cada uno y sus anclas. Cinco tamaños, de 4 a 64
//     hexágonos. Se maqueta a mano en la biblioteca (lib/rules/tile-library.ts)
//     y se edita en /dev/losetas. Las variantes de un mismo TIPO son el mismo
//     sitio dibujado de otra manera (`TileType` en lib/rules/tiles.ts).
//   · ancla    (`TileEdge` en `TileDef.anchors`) — borde exterior por el que una
//     loseta se une a otra. Solo existen en el contorno, y una loseta solo se
//     une ancla contra ancla: el resto de su borde es pared.
//   · tablero  (`Board`)    — el mapa completo de UNA partida rápida o
//     capítulo, resultado de unir losetas por sus anclas. Se genera en
//     board-gen.ts y se prueba en /dev/tablero.
// =========================================================================

import type { HexCoord, HexKey } from "./hex";
import type { TerrainId } from "./terrain";

// --- Contenido de un hexágono ---------------------------------------------

/** Las 6 fichas del tablero (docs/board/board-map.md §4, tabla de tokens). */
export type BoardToken =
  | "exploracion"
  | "amenaza"
  | "tesoro"
  | "terreno"
  | "personaje"
  | "enemigo";

/**
 * Los 7 tipos de NPC del prototipo (docs/characters/npcs.md §2), sin el Dador
 * de misión (solo Campaña). Se decide al generar el tablero y no al
 * interactuar, porque hace falta saberlo ya para no repetir oficio dentro de
 * un mismo Pueblo (board-gen.ts, `seedTokens`).
 */
export type NpcType =
  | "vendedor"
  | "tabernero"
  | "sacerdote"
  | "mago"
  | "capitan-mercenarios"
  | "informante"
  | "herrero";

/**
 * Localización especial, y ya solo queda UNA: la Guarida donde espera el boss.
 *
 * Eran tres. El Pueblo y la Mazmorra se fueron porque ahora son TERRENO
 * (`TerrainId`) y los trae maquetados la loseta que los dibuja: lo que un
 * hexágono es lo dice su terreno, y el contenido lo ponen sus fichas. La Guarida
 * se queda porque no es un sitio del mundo que se pueda maquetar —es "donde ha
 * salido el boss esta partida", y eso lo decide la generación mirando la
 * distancia a la entrada (board-gen.ts paso 5)—.
 *
 * Y no se VE: no tiene ficha, ni placa, ni dibujo. Es un dato del motor, y lo que
 * el jugador encuentra al llegar es la ficha de Enemigo del propio boss.
 */
export type LocationId = "guarida";

export type Hex = {
  readonly coord: HexCoord;
  readonly terrain: TerrainId;
  /** La Guarida del boss, si es este hexágono. Invisible: ver `LocationId`. */
  readonly location: LocationId | null;
  readonly token: BoardToken | null;
  /**
   * El oficio del NPC, si `token` es "personaje" y sale de un Pueblo. Los NPC
   * sueltos del resto del mapa todavía no tienen tipo (docs/characters/npcs.md
   * §5): null en todo lo que no sea Pueblo.
   */
  readonly npcType: NpcType | null;
  /** Loseta a la que pertenece — board-map.md §2. */
  readonly tileId: string;
  /** Hexágono de entrada al mapa (§2c paso 0). */
  readonly isEntrance: boolean;
  /** Capa 1 de niebla: se conoce el tipo de terreno (visión de terreno). */
  readonly terrainRevealed: boolean;
  /** Capa 2 de niebla: se conoce el contenido (visión de detalle). */
  readonly contentRevealed: boolean;
};

// --- El tablero ------------------------------------------------------------

/** Los 3 Élite del bestiario (docs/characters/enemies.md §5b.3). */
export type EliteId = "capitan-bandido" | "trol-de-las-minas" | "arana-matriarca";

/** Una loseta ya colocada en el tablero (board-map.md §2). */
export type PlacedTile = {
  /** Identificador de la instancia: "t0", "t1"… Es el tileId de sus hexágonos. */
  readonly id: string;
  /** Loseta de la biblioteca de la que sale (lib/rules/tile-library.ts). */
  readonly defId: string;
  /** Pasos de 60° con los que se colocó. */
  readonly rotation: number;
  readonly hexes: readonly HexCoord[];
};

/** El tablero de una partida: los hexágonos y las losetas que los trajeron. */
export type Board = {
  /** Indexado por hex.key() para acceso O(1) desde el motor y el render. */
  readonly hexes: ReadonlyMap<HexKey, Hex>;
  /** Las losetas colocadas, en orden de colocación. */
  readonly tiles: readonly PlacedTile[];
  /**
   * Huecos cerrados: vacío rodeado de tablero por todos lados. NO son hexágonos
   * —no están en `hexes`, no se puede entrar ni ver contenido en ellos— sino el
   * negativo del mapa: una sima, una laguna, un derrumbe. Los deja el encaje de
   * las losetas y ya no se pueden rellenar (board-map.md §2, `findVoids`).
   */
  readonly voids: readonly HexCoord[];
  readonly entrance: HexCoord;
  /** Distancia en pasos desde la entrada, esquivando Montaña. Infinity si es inalcanzable. */
  readonly distanceFromEntrance: ReadonlyMap<HexKey, number>;
};

// --- El capítulo (el reloj y el estado de la partida) ---------------------

/** Tope del Nivel de Amenaza = duración de la partida (game-design.md §6c.1). */
export const THREAT_MAX = 40;

/** Umbrales del reloj, en turnos (game-design.md §6c.3). Se disparan UNA vez. */
export const THREAT_THRESHOLDS: readonly number[] = [10, 20, 30];

export type Chapter = {
  /** Turno de héroe actual, empezando en 1. */
  readonly turn: number;
  /** Nivel de Amenaza, 0..THREAT_MAX. */
  readonly threat: number;
  /** Umbrales ya disparados, para la histéresis (§6c.3). */
  readonly thresholdsFired: readonly number[];
  /** El boss de la Guarida: 1 de los 3 Élite, al azar (§5b.3). */
  readonly bossElite: EliteId;
  /**
   * El Élite de la Mazmorra: 1 de los 2 restantes. Null si el encaje no sacó
   * ninguna loseta de Mazmorra en la mitad lejana del tablero, que es lo que
   * decide si esta partida lleva un segundo Élite o no.
   */
  readonly dungeonElite: EliteId | null;
  /** Semilla con la que se generó, para poder repetir la partida exacta. */
  readonly seed: string;
};

// --- Modalidad -------------------------------------------------------------

/** Solo Partida rápida en el prototipo (docs/board/board-map.md §2b). */
export type GameMode = "partida-rapida";
