// =========================================================================
// Motor de combate (docs/board/battle.md, docs/characters/enemies.md §5b)
//
// Arranca con lo mínimo que ya tiene fórmula cerrada: el presupuesto de
// composición del bando enemigo. El resto (resolución de ataque, iniciativa,
// árbol de IA) se añade aquí mismo cuando se construya ese subsistema —
// mismo patrón que movement.ts/vision.ts: constantes + funciones puras sobre
// los tipos de state.ts, sin componentes ni estado de React.
// =========================================================================

import type { EnemyCategory } from "./state";

/** Coste por Categoría dentro del presupuesto (enemies.md §5b.6). */
const COMPOSITION_COST: Readonly<Record<EnemyCategory, number>> = {
  normal: 1,
  elite: 2,
  "jefe-capitulo": 3,
  "jefe-final": 3,
};

/** Tope duro del presupuesto, sea cual sea el nº de héroes/mercenarios (§5b.6). */
export const COMPOSITION_CAP = 6;

/**
 * Presupuesto de composición del bando enemigo: héroes que entran a la
 * batalla + 1, + 1 más por cada mercenario invocado (una ficha aliada con
 * turno propio cuenta igual que un jugador más), sin pasar del tope.
 * Con 1 héroe solo y sin mercenarios da 2 — el tope fijo que había antes de
 * esta fórmula (enemies.md §5b.6).
 */
export function compositionBudget(heroCount: number, mercenaryCount = 0): number {
  return Math.min(heroCount + 1 + mercenaryCount, COMPOSITION_CAP);
}

/** Coste de meter una criatura de esa Categoría en el presupuesto (§5b.6). */
export function compositionCost(category: EnemyCategory): number {
  return COMPOSITION_COST[category];
}
