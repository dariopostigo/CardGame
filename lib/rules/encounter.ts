// =========================================================================
// Mazo de encuentro (docs/cards/encounter.md)
//
// Dos pilas separadas y no un mazo mezclado —Combate y Suceso—, porque §1 de
// encounter.md siempre pide una carta de un tipo concreto (decidido, §6 del
// mismo doc). Mismo espíritu inmutable que lib/rules/deck.ts (reutiliza su
// tipo `DeckCard`), pero con `Rng` explícito en vez de `Math.random()`: este
// mazo lo puede robar cualquier ficha del tablero generado con semilla, así
// que sí entra en el contrato "todo el motor usa azar con semilla" que deck.ts
// (un lab de solo cliente) no necesitaba.
//
// "Cada pila se baraja al agotarse, las cartas vuelven" (§7): no hay zona de
// "descartadas" que reponer una a una —el efecto de una carta de encuentro se
// resuelve al momento, no se queda en juego—, así que agotarse y rebarajar es
// sencillamente reconstruir la pila entera desde el catálogo la próxima vez
// que se robe de ella vacía.
// =========================================================================

import * as Rng from "./rng";
import type { CatalogCard } from "@/lib/card-catalog";
import type { DeckCard } from "./deck";

export type EncounterState = {
  readonly combate: readonly DeckCard[];
  readonly suceso: readonly DeckCard[];
};

type EncounterChip = "Combate" | "Suceso";

function pileFrom(catalog: readonly CatalogCard[], chip: EncounterChip): DeckCard[] {
  return catalog
    .filter((c) => c.category === "encuentro" && c.stats.some((s) => s.label === chip))
    .map((card, i) => ({ instanceId: `${card.id}#${i}`, card }));
}

export function buildEncounterState(catalog: readonly CatalogCard[]): EncounterState {
  return { combate: pileFrom(catalog, "Combate"), suceso: pileFrom(catalog, "Suceso") };
}

function draw(
  rng: Rng.Rng,
  pile: readonly DeckCard[],
  catalog: readonly CatalogCard[],
  chip: EncounterChip,
): [DeckCard, readonly DeckCard[], Rng.Rng] {
  const source = pile.length > 0 ? pile : pileFrom(catalog, chip);
  const [card, next] = Rng.pick(rng, source);
  return [card, source.filter((d) => d.instanceId !== card.instanceId), next];
}

/** 1 carta de Combate: al iniciar un combate (ficha de Enemigo o Amenaza resuelta como enemigo). */
export function drawCombate(
  state: EncounterState,
  catalog: readonly CatalogCard[],
  rng: Rng.Rng,
): [DeckCard, EncounterState, Rng.Rng] {
  const [card, rest, next] = draw(rng, state.combate, catalog, "Combate");
  return [card, { ...state, combate: rest }, next];
}

/** 1 carta de Suceso: al activar una ficha ambigua (Amenaza, Exploración) o acampar en terreno inseguro. */
export function drawSuceso(
  state: EncounterState,
  catalog: readonly CatalogCard[],
  rng: Rng.Rng,
): [DeckCard, EncounterState, Rng.Rng] {
  const [card, rest, next] = draw(rng, state.suceso, catalog, "Suceso");
  return [card, { ...state, suceso: rest }, next];
}
