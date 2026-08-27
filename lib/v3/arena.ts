// =========================================================================
// La arena de batalla — V3
//
// docs/v3/board/battle.md §1, y nada más que el §1: este archivo es el
// ESCENARIO —qué hexágonos hay y de quién es cada banda— y no sabe nada de
// fichas, de iniciativa ni de ataques. La resolución vive en
// docs/v3/game-design.md §4 y su código todavía no existe.
//
// Rejilla hexagonal con bandas de despliegue de 2 columnas en los lados cortos.
// Se juega A CAMPO ABIERTO: ni terreno, ni obstáculos, ni cobertura (§7). Por
// eso aquí no hay coste de movimiento ni casillas bloqueadas —todos los
// hexágonos son iguales— y por eso la resta de cobertura del motor vale 0
// mientras esto sea así.
//
// EL TAMAÑO MÍNIMO ES 14×12 *(decisión de Dario, 27 de agosto de 2026)*, y son
// las medidas del tablero que el código de v2 jugó de verdad — la 7×5 que
// battle.md §1 daba por decidida nunca se jugó. Ese mismo día se reescribió el
// diseño para que el código y el documento digan lo mismo, y de ahí salen dos
// cosas que este archivo da por sentadas:
//
//   · EL TABLERO ES GRANDE Y NO SE ATA AL FORMATO. Se juega igual de grande con
//     un jugador que con tres (§1), porque la aproximación larga es la
//     intención y no un defecto: con frentes a 11 hexágonos hacen falta varias
//     rondas de maniobra antes del primer golpe, y ahí es donde el §1.1 quiere
//     que viva la estrategia.
//   · LOS TRES ALCANCES NO SE TOCAN, y lo que se adapta al tablero es
//     👢 Movimiento, repartido por tipo de daño (lib/v3/damage.ts
//     `movementBand`). `frontDistance` se sigue calculando, pero ya no para
//     delatar una contradicción: es la distancia que mide la aproximación.
//
// El tablero se construye en coordenadas de FILA Y COLUMNA y se traduce a
// axiales, no al contrario. Es el idioma del documento —"7 columnas × 5
// filas", "bandas de 2 columnas", "col 1 ↔ col 5"— y así el código se puede
// comparar con su diseño sin hacer cuentas de cabeza.
//
// Las medidas siguen siendo un DIAL, no constantes cableadas, y ahora la
// palanca es OTRA: battle.md §10 señala el ALTO —"si la pelea resulta ser
// siempre el mismo choque, el dial es el alto del tablero: más filas, más sitio
// por donde rodear"—, porque el ancho ya no cambia el ritmo. Al ritmo lo cambia
// 👢 Movimiento (§1.1), así que estirar el campo a lo largo solo alarga la
// caminata, y eso ya se decidió que está bien.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";

/** De quién es una banda de despliegue. Como lo nombra battle.md §1. */
export type Side = "propio" | "enemigo";

export const SIDES: readonly Side[] = ["propio", "enemigo"];

export const SIDE_LABEL: Record<Side, string> = {
  propio: "Banda propia",
  enemigo: "Banda enemiga",
};

/** Las medidas de una arena, en filas y columnas. */
export type ArenaSpec = {
  readonly cols: number;
  readonly rows: number;
  /** Cuántas columnas ocupa cada banda de despliegue, en los lados cortos. */
  readonly bandDepth: number;
};

/** El mínimo, y el tamaño con el que se abre: 14×12 con bandas de 2. */
export const ARENA: ArenaSpec = { cols: 14, rows: 12, bandDepth: 2 };

/**
 * Los cuatro tamaños. El primero es el MÍNIMO y los otros tres crecen poco a
 * poco: el mayor no llega al doble del menor en hexágonos (168 → 320), que es
 * lo que se pidió.
 *
 * Crecen de ancho Y de alto, y el alto es el que importa: es la palanca que
 * battle.md §10 señala ahora, porque con la pantalla convertida en peaje (§5)
 * cada fila de más es sitio por donde rodear. El ancho solo alarga la
 * aproximación, y la aproximación larga ya es la intención.
 *
 * El nombre de cada uno es sus medidas y nada más: no hay tamaño "pequeño" ni
 * "grande", hay 14×12 y hay 20×16.
 */
export const ARENA_SIZES: readonly ArenaSpec[] = [
  { cols: 14, rows: 12, bandDepth: 2 },
  { cols: 16, rows: 14, bandDepth: 2 },
  { cols: 18, rows: 15, bandDepth: 2 },
  { cols: 20, rows: 16, bandDepth: 2 },
];

/** Cómo se llama un tamaño: sus medidas. */
export function sizeLabel(spec: ArenaSpec): string {
  return `${spec.cols}×${spec.rows}`;
}

/**
 * Cinco fichas POR JUGADOR: su héroe y hasta cuatro unidades (battle.md §2).
 * La regla no cambió con el co-op, se multiplicó.
 */
export const FIGURES_PER_PLAYER = 5;

/**
 * El juego es co-op de uno a tres jugadores *(decidido el 27 de agosto de
 * 2026)*, y jugar en solitario es el mismo juego con un jugador: no hay dos
 * modos, hay un número.
 *
 * El tope es 3 porque es el formato que nombró Dario. v2 llegaba a 4 y de sitio
 * cabrían (40 fichas en 168 hexágonos), pero la lista de Iniciativa pasaría de
 * 30 entradas y eso hay que jugarlo antes de prometerlo (battle.md §8).
 */
export const PLAYERS_MAX = 3;

/** Cuántas fichas pone un bando de `players` jugadores. */
export function figuresPerSide(players: number): number {
  return players * FIGURES_PER_PLAYER;
}

export type Arena = {
  readonly spec: ArenaSpec;
  /** Los hexágonos, en orden de lectura: fila a fila y dentro de cada fila por columna. */
  readonly hexes: readonly HexCoord[];
  readonly keys: ReadonlySet<HexKey>;
  /** Los hexágonos de cada banda de despliegue, en el mismo orden de lectura. */
  readonly bands: Readonly<Record<Side, readonly HexCoord[]>>;
  /**
   * Distancia entre los dos frentes, en hexágonos: de la última columna de tu
   * banda a la primera de la enemiga, dentro de la misma fila. Es el número que
   * valida los tres alcances (battle.md §1.1), así que se CALCULA y no se
   * escribe: si se mueve el dial, este número lo dice en vez de quedarse
   * mintiendo.
   */
  readonly frontDistance: number;
};

/**
 * Por qué una medida no vale, o null si vale.
 *
 * Se devuelve el motivo y no un boolean por lo mismo que el motor devuelve
 * `IllegalReason` (ARCHITECTURE.md §5): quien ofrezca el dial tiene que poder
 * explicar el "no", no solo apagar el botón.
 */
export function specProblem(spec: ArenaSpec, figures = FIGURES_PER_PLAYER): string | null {
  if (spec.cols < 1 || spec.rows < 1) return "El tablero tiene que tener al menos una fila y una columna.";
  if (spec.bandDepth < 1) return "Una banda de despliegue necesita al menos una columna.";
  if (spec.bandDepth * 2 > spec.cols) {
    return `Las dos bandas de ${spec.bandDepth} columnas no caben en ${spec.cols}: se solaparían.`;
  }
  if (spec.bandDepth * spec.rows < figures) {
    return `Una banda de ${spec.bandDepth}×${spec.rows} son ${spec.bandDepth * spec.rows} hexágonos, y hacen falta ${figures} para desplegar.`;
  }
  return null;
}

/** La columna (en filas y columnas) de un hexágono axial. */
export function columnOf(hex: HexCoord): number {
  return Hex.axialToOffset(hex).col;
}

/** En qué banda de despliegue cae una columna, o null si es campo de en medio. */
export function sideOfColumn(spec: ArenaSpec, col: number): Side | null {
  if (col < spec.bandDepth) return "propio";
  if (col >= spec.cols - spec.bandDepth) return "enemigo";
  return null;
}

export function sideOf(spec: ArenaSpec, hex: HexCoord): Side | null {
  return sideOfColumn(spec, columnOf(hex));
}

/** La columna del frente de una banda: la que mira al campo de en medio. */
export function frontColumn(spec: ArenaSpec, side: Side): number {
  return side === "propio" ? spec.bandDepth - 1 : spec.cols - spec.bandDepth;
}

/**
 * Construye la arena. `spec` tiene que ser válida (`specProblem`); una medida
 * imposible es un error de programación, no una jugada ilegal, así que aquí sí
 * corta.
 */
export function buildArena(spec: ArenaSpec = ARENA): Arena {
  const problem = specProblem(spec);
  if (problem) throw new Error(`Arena imposible: ${problem}`);

  const hexes: HexCoord[] = [];
  const bands: Record<Side, HexCoord[]> = { propio: [], enemigo: [] };

  for (let row = 0; row < spec.rows; row++) {
    for (let col = 0; col < spec.cols; col++) {
      const hex = Hex.offsetToAxial({ col, row });
      hexes.push(hex);
      const side = sideOfColumn(spec, col);
      if (side) bands[side].push(hex);
    }
  }

  // Los dos frentes, medidos dentro de una misma fila: es la distancia que el
  // §1.1 usa para validar los alcances, y la fila da igual porque la
  // separación horizontal es la misma en todas.
  const row = 0;
  const frontDistance = Hex.distance(
    Hex.offsetToAxial({ col: frontColumn(spec, "propio"), row }),
    Hex.offsetToAxial({ col: frontColumn(spec, "enemigo"), row }),
  );

  return {
    spec,
    hexes,
    keys: new Set(hexes.map(Hex.key)),
    bands: { propio: bands.propio, enemigo: bands.enemigo },
    frontDistance,
  };
}

export function contains(arena: Arena, hex: HexCoord): boolean {
  return arena.keys.has(Hex.key(hex));
}

/**
 * Distancia de un hexágono a todos los demás de la arena, él incluido (a 0).
 *
 * Es la consulta que contesta las preguntas de alcance sin necesidad de ninguna
 * ficha: cruzada con los alcances fijos de lib/v3/damage.ts dice qué amenaza
 * cada casilla, que es justo lo que el §1.1 da por hecho y lo que el §10 manda
 * vigilar (el 🏹 alcanzando al héroe en la ronda 1).
 */
export function distancesFrom(arena: Arena, from: HexCoord): Map<HexKey, number> {
  const out = new Map<HexKey, number>();
  for (const hex of arena.hexes) out.set(Hex.key(hex), Hex.distance(from, hex));
  return out;
}

/**
 * Los hexágonos de la arena a distancia ≤ range de `from`, sin contar el propio.
 * El alcance es un máximo y nunca incluye la casilla desde la que se mira: dos
 * fichas no comparten hexágono (battle.md §5).
 */
export function within(arena: Arena, from: HexCoord, range: number): HexCoord[] {
  return arena.hexes.filter((hex) => {
    const d = Hex.distance(from, hex);
    return d > 0 && d <= range;
  });
}
