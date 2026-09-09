// =========================================================================
// Mazo y Oteo — V3, banco de pruebas de la mecánica
//
// Traducción directa de lib/v2/rules/deck.ts (Mazo de 20, "en juego" a 5,
// Oteo con sustitución, "jugar" siempre vuelve al Mazo) sobre `UnitCard`
// (lib/v3/cards.ts) en vez del `CatalogCard` de v2. La mecánica no cambia —es
// UI, no regla de juego— y game-design.md §6.1/§6.2 ya fija los dos topes
// (DECK_MAX, IN_PLAY_MAX), así que no hay nada que inventar ahí.
//
// CARTAS DE UNIDAD DE RELLENO, NO CATÁLOGO REAL: las cartas de clase que
// deberían llenar este Mazo (docs/v3/cards/class.md) siguen en StandBy
// (Dario, 9-sep-2026: "no quiero tocar todavia la wiki con respecto a
// cartas"). `buildDeck` repite cíclicamente lo que se le pase —típicamente
// las 16 cartas de unidad de Humanos y Enanos— hasta llenar el Mazo, y eso
// es lo que hace que "jugar" siempre vuelva al Mazo aquí: una carta de
// unidad no tiene Tipo (Acción/Pasiva/Turnos, §6.5) que decida otra cosa.
//
// Puro: sin React, sin node:fs.
// =========================================================================

import type { UnitCard } from "./cards";

/** Tope duro del Mazo (game-design.md §6.1). */
export const DECK_MAX = 20;
/** Tope fijo de "en juego" (game-design.md §6.2). */
export const IN_PLAY_MAX = 5;

/** Una instancia de carta dentro del mazo: la misma UnitCard puede repetirse. */
export type DeckCard = {
  readonly instanceId: string;
  readonly card: UnitCard;
};

export type DeckState = {
  readonly deck: readonly DeckCard[];
  readonly inPlay: readonly DeckCard[];
};

export function isInPlayFull(state: DeckState): boolean {
  return state.inPlay.length >= IN_PLAY_MAX;
}

/**
 * Llena un Mazo de `DECK_MAX` repitiendo cíclicamente las cartas que se le
 * pasen. Sin ellas no hay Mazo que barajar.
 */
export function buildDeck(cards: readonly UnitCard[]): DeckCard[] {
  if (cards.length === 0) return [];
  return Array.from({ length: DECK_MAX }, (_, i) => ({
    instanceId: `${cards[i % cards.length].character.id}#${i}`,
    card: cards[i % cards.length],
  }));
}

/** Lo que revela un Oteo: 2 cartas, o 1 si el Mazo tiene solo esa, o 0 si está vacío (§6.3). */
export type OteoDraw = readonly DeckCard[];

/** Revela al azar cartas sin preparar del Mazo. No las saca todavía: eso lo hace takeOteo. */
export function drawOteo(state: DeckState): OteoDraw {
  if (state.deck.length === 0) return [];
  if (state.deck.length === 1) return [state.deck[0]];
  const pool = [...state.deck];
  const first = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  const second = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  return [first, second];
}

/**
 * Toma una carta oteada. Si "en juego" tiene hueco entra directa; si está
 * lleno, `swapOutId` dice qué carta de "en juego" vuelve al Mazo en su lugar
 * (obligatorio en ese caso: §6.3, "con en juego lleno, sustituyes una carta").
 */
export function takeOteo(state: DeckState, chosen: DeckCard, swapOutId?: string): DeckState {
  const deckWithout = state.deck.filter((d) => d.instanceId !== chosen.instanceId);
  if (!isInPlayFull(state)) {
    return { deck: deckWithout, inPlay: [...state.inPlay, chosen] };
  }
  const swapOut = state.inPlay.find((d) => d.instanceId === swapOutId);
  if (!swapOut) {
    throw new Error("En juego está lleno: hace falta indicar qué carta sustituir.");
  }
  return {
    deck: [...deckWithout, swapOut],
    inPlay: [...state.inPlay.filter((d) => d.instanceId !== swapOutId), chosen],
  };
}

/** Jugar una carta: sale de "en juego" y vuelve siempre al Mazo (ver cabecera). */
export function playCard(state: DeckState, played: DeckCard): DeckState {
  return {
    deck: [...state.deck, played],
    inPlay: state.inPlay.filter((d) => d.instanceId !== played.instanceId),
  };
}
