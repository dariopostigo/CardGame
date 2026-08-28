// =========================================================================
// El despliegue — V3
//
// docs/v3/board/battle.md §3: "colocación libre dentro de tu banda, antes de la
// ronda 1". Cada una en un hexágono de las dos columnas del bando, y ninguna
// compartiendo casilla (§5).
//
// EL BANDO ES DE UNO A TRES JUGADORES *(decidido el 27 de agosto de 2026)*, cada
// uno con su héroe y hasta cuatro unidades (§2): cinco fichas por jugador, hasta
// quince. Y **la banda es del bando, no del jugador** —los tres comparten las
// dos columnas—, así que con quince fichas en veinticuatro hexágonos el
// despliegue deja de ser cosa de cada uno. Aquí eso no cuesta ni una regla: el
// dueño de la ficha es un dato, y las casillas se piden por orden de llegada.
//
// Es lo único del tablero que se puede escribir HOY completo, y por eso va
// antes que la iniciativa o el ataque: no necesita ni un valor de las 8
// Habilidades. Una ficha desplegada es un id y un hexágono, nada más.
//
// LO QUE AQUÍ NO SE INVENTA: las fichas no tienen Habilidades, ni Vida, ni
// nombre de carta. Lo único que llevan es su TIPO DE DAÑO, y eso porque ya está
// decidido y es lo que hace que colocar sea una decisión —un 🗡️ delante hace
// pantalla, un 🏹 detrás dispara igual—. El catálogo de verdad lo dirige Dario
// carta a carta; estos cinco son ranuras con forma, no personajes.
//
// El motor devuelve el MOTIVO de un "no", nunca un boolean (ARCHITECTURE.md
// §5): quien ofrezca colocar tiene que poder explicar por qué esa casilla no
// vale, y "esa es la banda enemiga" y "ahí ya hay alguien" son dos negativas
// distintas para el jugador.
//
// Puro: sin React, sin azar, sin estado.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord } from "./hex";
import { contains, frontColumn, sideOf, type Arena, type Side } from "./arena";
import { DAMAGE_TYPES, type DamageTypeId } from "./damage";

/**
 * Qué es la ficha en el bando. No es su clase ni su carta: es la única
 * distinción que el tablero necesita, porque el héroe es el que no puede caer
 * (§6) y las unidades son la pantalla que lo protege.
 */
export type FigureRole = "heroe" | "unidad";

export type Figure = {
  readonly id: string;
  /** De qué bando es. Los dos se construyen igual (ver `buildRoster`). */
  readonly side: Side;
  /**
   * Qué jugador la trae, empezando en 1. El bando es de uno a tres (§2). En el
   * bando enemigo no hay jugadores: es el número de GRUPO, y hay uno por
   * jugador porque la máquina trae lo mismo que la mesa.
   */
  readonly owner: number;
  readonly role: FigureRole;
  /** Cómo se llama en la pantalla mientras no haya catálogo. */
  readonly label: string;
  readonly damage: DamageTypeId;
};

export type Roster = readonly Figure[];

/**
 * Cómo se nombra una ficha cuando hay más de un grupo en su bando: J para el
 * jugador, E para el enemigo. Sin esto hay tres fichas que se llaman «Héroe» en
 * cada lado del campo.
 */
export function figureName(figure: Figure): string {
  return `${figure.label} (${figure.side === "propio" ? "J" : "E"}${figure.owner})`;
}

/**
 * El reparto de tipos de daño de un jugador: héroe y cuatro unidades.
 *
 * Tres 🗡️ de cinco no es un capricho: el §5 cuenta que las fichas de cuerpo a
 * cuerpo son 70 de las 132 del catálogo, más de la mitad, así que un bando
 * corriente lleva mayoría de 🗡️. Y el héroe entra como 🗡️ porque es el reparto
 * que más castiga al tablero grande —el que tiene que cruzar el campo entero es
 * justo el que más caro se paga perder (§6)—: si el despliegue funciona con
 * esto, funciona.
 */
const PLAYER_DAMAGE: readonly DamageTypeId[] = [
  "cuerpo-a-cuerpo", // el héroe
  "cuerpo-a-cuerpo",
  "cuerpo-a-cuerpo",
  "magico",
  "a-distancia",
];

/**
 * El bando de `players` grupos, cinco fichas cada uno. La composición se puede
 * cambiar en la pantalla, así que esto es solo por dónde abre.
 *
 * LA MISMA FUNCIÓN CONSTRUYE LOS DOS BANDOS, y eso es una decisión de diseño,
 * no un atajo: **la máquina trae lo mismo que la mesa** —un héroe y hasta cuatro
 * unidades por jugador— *(decidido por Dario el 28 de agosto de 2026)*. Cierra
 * el presupuesto que el §8 dejaba abierto y era su único bloqueo para poner un
 * bando enemigo de verdad en el tablero.
 *
 * Se eligió el espejo entre tres, y por lo que resuelve: es la única forma en la
 * que la victoria se lee igual por los dos lados —caen todos sus héroes ↔ caen
 * todos los tuyos (§6)—, así que mata la asimetría que el propio §8 señalaba
 * (con un solo héroe enemigo, tú ganas tumbando uno y él tiene que tumbar tres).
 *
 * > **Lo que arrastra:** el §6 dice "cae el héroe enemigo" en singular, escrito
 * > cuando enfrente había uno. Con el espejo hay un héroe enemigo por jugador y
 * > esa línea hay que corregirla en el documento.
 *
 * @param {Side} side - De qué lado. Solo cambia los ids y cómo se nombra: la
 *   composición es idéntica, que es justo la decisión.
 */
export function buildRoster(players: number, side: Side = "propio"): Roster {
  const out: Figure[] = [];
  const prefix = side === "propio" ? "j" : "e";
  for (let p = 1; p <= players; p++) {
    PLAYER_DAMAGE.forEach((damage, i) => {
      out.push({
        id: `${prefix}${p}-${i === 0 ? "heroe" : `unidad-${i}`}`,
        side,
        owner: p,
        role: i === 0 ? "heroe" : "unidad",
        label: i === 0 ? "Héroe" : `Unidad ${i}`,
        damage,
      });
    });
  }
  return out;
}

/** Una ficha colocada. El despliegue es la lista de las que ya están. */
export type Placement = { readonly figureId: string; readonly hex: HexCoord };

export type Deployment = readonly Placement[];

export function hexOf(deployment: Deployment, figureId: string): HexCoord | null {
  return deployment.find((p) => p.figureId === figureId)?.hex ?? null;
}

/** Qué ficha ocupa ese hexágono, si hay alguna. */
export function figureAt(deployment: Deployment, hex: HexCoord): string | null {
  return deployment.find((p) => Hex.equals(p.hex, hex))?.figureId ?? null;
}

export function isPlaced(deployment: Deployment, figureId: string): boolean {
  return deployment.some((p) => p.figureId === figureId);
}

/**
 * Por qué esa ficha no puede ir a ese hexágono, o null si puede.
 *
 * @param {Roster} roster - Hace falta para poder NOMBRAR a quien ya está ahí:
 *   "ahí está tu Héroe" es una negativa útil y "ocupado" no lo es.
 */
export function placementProblem(
  arena: Arena,
  side: Side,
  roster: Roster,
  deployment: Deployment,
  figureId: string,
  hex: HexCoord,
): string | null {
  if (!contains(arena, hex)) return "Ese hexágono no está en el tablero.";

  const where = sideOf(arena.spec, hex);
  if (where !== side) {
    return where === null
      ? "El despliegue es libre pero dentro de tu banda: esa columna ya es campo de en medio (§3)."
      : "Esa es la banda enemiga: cada bando despliega en la suya (§3).";
  }

  const occupant = figureAt(deployment, hex);
  if (occupant && occupant !== figureId) {
    const other = roster.find((f) => f.id === occupant);
    const name = other ? figureName(other) : "otra ficha";
    return `Ahí está ${name}, y dos fichas nunca comparten hexágono (§5).`;
  }

  return null;
}

/** Coloca (o mueve) una ficha. No comprueba nada: eso es `placementProblem`. */
export function place(deployment: Deployment, figureId: string, hex: HexCoord): Deployment {
  return [...deployment.filter((p) => p.figureId !== figureId), { figureId, hex }];
}

export function clear(deployment: Deployment, figureId: string): Deployment {
  return deployment.filter((p) => p.figureId !== figureId);
}

// --- Colocación de muestra -------------------------------------------------
// Para no empezar siempre con el tablero vacío. Es una colocación RAZONABLE, no
// una regla: el jugador coloca libremente y esto solo ahorra los cinco clics.

/** Las columnas de una banda, de delante hacia atrás. */
function bandColumns(arena: Arena, side: Side): number[] {
  const { spec } = arena;
  const front = frontColumn(spec, side);
  const step = side === "propio" ? -1 : 1;
  return Array.from({ length: spec.bandDepth }, (_, i) => front + i * step);
}

/** Las filas, de la de en medio hacia los bordes: es por donde se coloca. */
function rowsFromMiddle(rows: number): number[] {
  const mid = Math.floor(rows / 2);
  const out = [mid];
  for (let d = 1; d < rows; d++) {
    if (mid - d >= 0) out.push(mid - d);
    if (mid + d < rows) out.push(mid + d);
  }
  return out;
}

/**
 * El bando puesto como lo pondría alguien: el cuerpo a cuerpo en la columna del
 * frente haciendo pantalla, y detrás el alcance y los héroes —que son las fichas
 * que más caro se pagan (§6)—. Si una columna se llena, se sigue por la de
 * detrás, y con tres jugadores eso pasa: son quince fichas para veinticuatro
 * hexágonos, así que el reparto real es una conversación entre aliados y esto
 * solo ahorra los quince clics.
 */
export function autoDeploy(arena: Arena, roster: Roster, side: Side): Deployment {
  const cols = bandColumns(arena, side);
  const rows = rowsFromMiddle(arena.spec.rows);

  // Índice de columna preferido: 0 es el frente. El 🗡️ delante; el héroe, lo
  // más atrás que dé la banda; el resto, una detrás del frente.
  const wanted = (f: Figure) => {
    if (f.role === "heroe") return cols.length - 1;
    return DAMAGE_TYPES[f.damage].range <= 1 ? 0 : Math.min(1, cols.length - 1);
  };

  const taken = new Set<string>();
  const out: Placement[] = [];

  for (const figure of roster) {
    const start = wanted(figure);
    let placed = false;
    for (let i = 0; i < cols.length && !placed; i++) {
      const col = cols[(start + i) % cols.length];
      for (const row of rows) {
        const hex = Hex.offsetToAxial({ col, row });
        const k = Hex.key(hex);
        if (taken.has(k)) continue;
        taken.add(k);
        out.push({ figureId: figure.id, hex });
        placed = true;
        break;
      }
    }
  }

  return out;
}

// Aquí vivía `mirror`, que reflejaba TU despliegue al otro lado para tener algo
// enfrente con lo que medir. Se retira el 28 de agosto de 2026 y no por
// limpieza: con el presupuesto del bando enemigo decidido, enfrente hay un bando
// de verdad con su propio roster y su propio despliegue, así que el espejo dejó
// de ser una muleta y pasó a ser código muerto. Y `autoDeploy` lo devuelve
// gratis cuando las dos composiciones coinciden: el algoritmo es simétrico
// —mismas filas, columna del frente de cada lado—, así que el espejo sale solo.
