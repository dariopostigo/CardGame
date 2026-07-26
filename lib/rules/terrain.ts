// =========================================================================
// Los 5 terrenos del prototipo
//
// Espejo en código de la tabla de mecánicas oficiales de
// docs/board/board-map.md §3a y del peso de generación de la tabla A (§2c).
// Si cambia el documento, cambia este archivo en el mismo commit.
//
// TODAS las cifras son primer pase sin balancear (docs/status.md §4).
// =========================================================================

export type TerrainId = "llanura" | "bosque" | "pantano" | "montana" | "camino";

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
  /** Peso de la tabla A de generación (§2c). Suman 100. */
  readonly genWeight: number;
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
  },
};

export const TERRAIN_IDS = Object.keys(TERRAINS) as TerrainId[];

/** Pesos de la tabla A, listos para rng.pickWeighted. */
export const TERRAIN_GEN_WEIGHTS: ReadonlyArray<readonly [TerrainId, number]> = TERRAIN_IDS.map(
  (id) => [id, TERRAINS[id].genWeight] as const,
);

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
