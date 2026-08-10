// =========================================================================
// Los 6 terrenos del prototipo
//
// Espejo en código de la tabla de mecánicas oficiales de
// docs/board/board-map.md §3a y del peso de generación de la tabla A (§2c).
// Si cambia el documento, cambia este archivo en el mismo commit.
//
// NADA de terreno se sortea. Cada hexágono del tablero llega pintado por la
// loseta que lo trae (lib/rules/tile-library.ts), así que la tabla A ya no
// reparte terreno en tiempo de generación: es el OBJETIVO al que apunta el
// maquetado de la biblioteca, y el laboratorio de losetas enseña lo que sale de
// verdad al lado de esa cifra.
//
// Aun así, los terrenos no son todos la misma clase de cosa. Hay AMBIENTE
// —llanura, bosque, pantano, montaña—, que es el fondo del mapa y del que se
// espera que mande en la loseta donde aparece; y hay LUGAR —Camino y
// Mazmorra—, que son una red y un agujero: cruzan o perforan el fondo, y nunca
// son la masa. Los dos de lugar tampoco tienen cuota en la tabla A
// (`genWeight: 0` en Mazmorra): salen donde el maquetado quiera ponerlos, y ni
// una vez más.
//
// TODAS las cifras son primer pase sin balancear (docs/status.md §4).
// =========================================================================

export type TerrainId = "llanura" | "bosque" | "pantano" | "montana" | "camino" | "mazmorra";

/** Prueba de salvación que exige un terreno al cruzarlo. */
export type Hazard = {
  readonly save: "FUE" | "DES" | "CON" | "INT" | "SAB" | "CAR";
  readonly cd: number;
  /** Estado que aplica al fallar (docs/effects.md). */
  readonly effect: string;
};

export type TerrainDef = {
  readonly id: TerrainId;
  /** Nombre tal y como aparece en los documentos de diseño. */
  readonly label: string;
  /** Coste en puntos de movimiento para entrar. */
  readonly moveCost: number;
  /** Modificador al rango de detección del enemigo (Bosque −1: te oculta). */
  readonly enemyDetectionMod: number;
  /** Modificador a la visión del héroe (Bosque −1: no ves entre árboles). */
  readonly heroVisionMod: number;
  /** Bono de CA contra ataques a distancia (cobertura del Bosque). */
  readonly coverVsRanged: number;
  /** Corta la línea de visión (solo la Montaña). */
  readonly blocksLineOfSight: boolean;
  /** Se puede acampar con riesgo mínimo (game-design.md §4c.2). */
  readonly safeToCamp: boolean;
  /** Atacar sin haber sido detectado da ventaja (emboscada del Bosque). */
  readonly allowsAmbush: boolean;
  /** Peligro al cruzarlo, si tiene. */
  readonly hazard: Hazard | null;
  /**
   * Cuota de la tabla A (§2c), en porcentaje; los cinco que tienen cuota suman
   * 100. Ya no se sortea nada con ella —las losetas llegan pintadas—, así que es
   * el reparto de terreno al que APUNTA la biblioteca, y contra el que se compara
   * el que sale medido (`/dev/tiles`).
   */
  readonly genWeight: number;
  /**
   * Terreno de LUGAR: una red (el Camino) o un agujero (la Mazmorra), no el
   * fondo del mapa. No tiene cuota que cumplir en la tabla A y no se espera que
   * MANDE en su tipo de loseta: un hilo y un agujero nunca son la masa
   * (`typeNotes`).
   */
  readonly isPlace: boolean;
};

export const TERRAINS: Readonly<Record<TerrainId, TerrainDef>> = {
  llanura: {
    id: "llanura",
    label: "Llanura",
    moveCost: 1,
    enemyDetectionMod: 0,
    heroVisionMod: 0,
    coverVsRanged: 0,
    blocksLineOfSight: false,
    safeToCamp: false,
    allowsAmbush: false,
    hazard: null,
    genWeight: 40,
    isPlace: false,
  },
  camino: {
    id: "camino",
    label: "Camino",
    moveCost: 1,
    enemyDetectionMod: 0,
    heroVisionMod: 0,
    coverVsRanged: 0,
    blocksLineOfSight: false,
    safeToCamp: false,
    allowsAmbush: false,
    hazard: null,
    genWeight: 20,
    isPlace: true, // el sendero cruza el fondo, no es el fondo
  },
  bosque: {
    id: "bosque",
    label: "Bosque",
    moveCost: 1,
    enemyDetectionMod: -1,
    heroVisionMod: -1,
    coverVsRanged: 1,
    blocksLineOfSight: false,
    safeToCamp: true,
    allowsAmbush: true,
    hazard: null,
    genWeight: 20,
    isPlace: false,
  },
  pantano: {
    id: "pantano",
    label: "Pantano",
    moveCost: 2,
    enemyDetectionMod: 0,
    heroVisionMod: 0,
    coverVsRanged: 0,
    blocksLineOfSight: false,
    safeToCamp: false,
    allowsAmbush: false,
    hazard: { save: "CON", cd: 12, effect: "Envenenado" },
    genWeight: 10,
    isPlace: false,
  },
  montana: {
    id: "montana",
    label: "Montaña",
    moveCost: 3,
    enemyDetectionMod: 0,
    heroVisionMod: 0,
    coverVsRanged: 0,
    blocksLineOfSight: true,
    safeToCamp: false,
    allowsAmbush: false,
    hazard: null,
    genWeight: 10,
    isPlace: false,
  },
  // La Mazmorra es un refugio a oscuras, y sus dos cifras fuertes van en
  // sentidos contrarios a propósito: es el único sitio del mapa donde se acampa
  // seguro sin ser Bosque, y el que más te ciega. Entras a cubierto pagando con
  // no ver venir nada. No bloquea la línea de visión: la boca de la mazmorra no
  // tapa, lo que tapa es la montaña en la que se abre.
  mazmorra: {
    id: "mazmorra",
    label: "Mazmorra",
    moveCost: 2,
    enemyDetectionMod: -1,
    heroVisionMod: -2,
    coverVsRanged: 1,
    blocksLineOfSight: false,
    safeToCamp: true,
    allowsAmbush: true,
    hazard: null,
    genWeight: 0, // no tiene cuota: sale donde la maquetes
    isPlace: true,
  },
};

export const TERRAIN_IDS = Object.keys(TERRAINS) as TerrainId[];

/**
 * La cuota de la tabla A como fracción, para comparar con lo medido. `0` = ese
 * terreno no tiene cuota (ver `genWeight`).
 */
export function targetShare(terrain: TerrainId): number {
  return TERRAINS[terrain].genWeight / 100;
}

/**
 * El Camino da +1 de movimiento el turno que te desplazas por él
 * (§3a). No es un descuento de coste, es un punto extra al pool, así que no
 * puede vivir en `moveCost`.
 */
export const ROAD_MOVEMENT_BONUS = 1;

/**
 * ¿Es "transitable a efectos de generación"?
 * La Montaña es transitable en juego (coste 3), pero la generación la trata
 * como semi-barrera: no lleva ficha, no aloja localizaciones y el BFS de
 * conectividad la esquiva (§2c paso 3, §3a).
 */
export function isOpenGround(terrain: TerrainId): boolean {
  return terrain !== "montana";
}
