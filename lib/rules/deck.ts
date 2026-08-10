// =========================================================================
// Mazo y Oteo (docs/game-design.md §4)
//
// Modela las dos zonas del mazo personal —el Mazo (20 cartas fijas) y "en
// juego" (5 huecos fijos)— y el Oteo: al empezar el turno se revelan 2
// cartas al azar del Mazo, se elige 1 o ninguna, y jugar una carta la
// devuelve siempre al Mazo (regla madre: nada se pierde, pero nada es
// permanente).
//
// Lo que NO modela: de dónde salen cartas nuevas (botín, tienda, §6b) ni el
// recurso de acción del turno (§4b.3) — son otros subsistemas. Aquí solo
// vive el Mazo/Oteo en sí, para probarlo en /dev/deck.
// =========================================================================

import type { CatalogCard } from "@/lib/card-catalog";

/** Tope duro del Mazo del capítulo (§4). */
export const DECK_MAX = 20;
/** Tope fijo de "en juego" (§4). */
export const IN_PLAY_MAX = 5;

/** Una instancia de carta dentro del mazo: la misma CatalogCard puede repetirse. */
export type DeckCard = {
  readonly instanceId: string;
  readonly card: CatalogCard;
};

export type DeckState = {
  readonly deck: readonly DeckCard[];
  readonly inPlay: readonly DeckCard[];
};

export function isInPlayFull(state: DeckState): boolean {
  return state.inPlay.length >= IN_PLAY_MAX;
}

/**
 * El kit de clase de un héroe: sus 8 cartas de habilidad (`cards/class.md`,
 * sin distinción Básica/Especial), repetidas cíclicamente hasta `DECK_MAX`.
 * El kit real suma además items de arranque (§4, aviso de contenido); como
 * los items no llevan ficha de héroe en el catálogo —solo prosa en
 * `characters/heroes.md` §2d—, aquí se simula el mismo engorde repitiendo el
 * propio kit de clase en vez de items reales.
 */
export function buildDeck(heroChip: string, classCards: readonly CatalogCard[]): DeckCard[] {
  const pool = classCards.filter(
    (c) => c.category === "clase" && c.stats.some((s) => s.label === heroChip),
  );
  if (pool.length === 0) return [];
  return Array.from({ length: DECK_MAX }, (_, i) => ({
    instanceId: `${pool[i % pool.length].id}#${i}`,
    card: pool[i % pool.length],
  }));
}

/**
 * Preparación de salida (§1b, paso 4): 2 de las 8 cartas de habilidad del
 * héroe arrancan ya "en juego" (cualquiera del roster, sin distinción
 * Básica/Especial — `cards/class.md` §6). Este laboratorio no modela la
 * elección de setup (cuáles 2) y toma las 2 primeras del kit.
 */
export function initialDeckState(heroChip: string, classCards: readonly CatalogCard[]): DeckState {
  const all = buildDeck(heroChip, classCards);
  const startInPlay = all.slice(0, 2);
  const startIds = new Set(startInPlay.map((d) => d.instanceId));
  return {
    deck: all.filter((d) => !startIds.has(d.instanceId)),
    inPlay: startInPlay,
  };
}

/** Lo que revela un Oteo: 2 cartas, o 1 si el Mazo tiene solo esa, o 0 si está vacío (§4). */
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
 * (obligatorio en ese caso: §4, "con en juego lleno, sustituyes una carta").
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

/** Jugar una carta: regla madre. Sale de "en juego" y vuelve siempre al Mazo. */
export function playCard(state: DeckState, played: DeckCard): DeckState {
  return {
    deck: [...state.deck, played],
    inPlay: state.inPlay.filter((d) => d.instanceId !== played.instanceId),
  };
}
