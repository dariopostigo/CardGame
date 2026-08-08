// =========================================================================
// Resolución de fichas del tablero (docs/board/board-map.md §4, §4b)
//
// `board-gen.ts` solo decide QUÉ TIPO de ficha hay en un hexágono
// (`Hex.token`); nada en el motor decidía todavía QUÉ PASA al interactuar con
// ella. Esto cierra esa capa para las piezas que ya tienen fórmula cerrada:
//
//   · Terreno  — resolución completa (prueba + loot + peligro).
//   · Tesoro   — resolución completa de la parte de carta (el oro que da un
//     cofre no está decidido numéricamente en ningún doc, así que no se
//     inventa aquí).
//   · Amenaza / Exploración — roba 1 carta de Suceso y la devuelve; su texto
//     se muestra, no se aplica (la mayoría depende de sistemas que no existen
//     todavía: Maldición, reloj de Amenaza, Mercenario).
//   · Enemigo  — roba 1 carta de Combate; no abre combate de verdad (no hay
//     pantalla de batalla ni catálogo de bestiario todavía).
//   · Personaje (NPC) — solo lectura: qué oficio es y qué ofrece, sin
//     transacciones (`Hero` no tiene oro ni inventario todavía).
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord } from "./hex";
import type { Board, Hero, NpcType } from "./state";
import { TERRAINS } from "./terrain";
import * as Rng from "./rng";
import { abilityMod } from "./hero-roster";
import { abilityCheck, SAVE_ABILITY, type SkillCheckResult } from "./skill-check";
import { rollTerrainLoot, rollTreasureLoot } from "./loot";
import { drawCombate, drawSuceso, type EncounterState } from "./encounter";
import type { CatalogCard } from "@/lib/card-catalog";
import type { DeckCard } from "./deck";

/**
 * Marca la ficha de `coord` como resuelta (board-map.md §4c, estado 4): deja
 * huella grabada, no se puede volver a resolver. No borra `token` —la huella
 * también necesita saber qué familia de ficha fue—. Inmutable, mismo patrón
 * que `revealFromPosition` en vision.ts.
 */
export function retireToken(board: Board, coord: HexCoord): Board {
  const key = Hex.key(coord);
  const cell = board.hexes.get(key);
  if (!cell || cell.resolved) return board;
  const hexes = new Map(board.hexes);
  hexes.set(key, { ...cell, resolved: true });
  return { ...board, hexes };
}

function applyDamage(hero: Hero, damage: number): Hero {
  if (damage <= 0) return hero;
  return { ...hero, pv: { ...hero.pv, current: Math.max(0, hero.pv.current - damage) } };
}

// --- Terreno --------------------------------------------------------------

export type TerrainOutcome =
  | { readonly kind: "exito"; readonly check: SkillCheckResult; readonly card: CatalogCard | null }
  | {
      readonly kind: "fallo";
      readonly check: SkillCheckResult;
      /** La salvación propia del terreno, si tenía una que tirar (null = fallback sin salvación, daño directo). */
      readonly save: SkillCheckResult | null;
      /** Nombre del efecto que tocaría aplicar (docs/effects.md) — se informa, no se aplica: no hay lista de efectos activos en Hero todavía. */
      readonly effect: string | null;
      readonly damage: number;
    };

/**
 * Ficha de Terreno (board-map.md §4b): `1d20 + mejor de mod FUE/DES` vs CD 12.
 *
 * Éxito: cruza gratis, gana 1 carta de movimiento (`loot.ts`) y la ficha se
 * retira. Fallo: pierde el movimiento restante del turno —lo aplica quien
 * llama, esta función no conoce el pool de movimiento— y sufre el peligro del
 * terreno: si tiene una salvación propia (Pantano → CON, etc.) se tira, y solo
 * si también falla se informa el efecto; si el terreno no tiene peligro
 * propio, `1d6` contundente directo. La ficha NO se retira si falla: se puede
 * reintentar otro turno o rodear.
 */
export function resolveTerreno(
  board: Board,
  coord: HexCoord,
  hero: Hero,
  catalog: readonly CatalogCard[],
  rng: Rng.Rng,
): { readonly outcome: TerrainOutcome; readonly board: Board; readonly hero: Hero; readonly rng: Rng.Rng } {
  const cell = board.hexes.get(Hex.key(coord));
  if (!cell) throw new Error(`resolveTerreno: hexágono ${Hex.key(coord)} fuera del tablero`);

  const bestMod = Math.max(abilityMod(hero.abilityScores.fuerza), abilityMod(hero.abilityScores.destreza));
  const [check, r1] = abilityCheck(rng, bestMod, 12);

  if (check.success) {
    const [card, r2] = rollTerrainLoot(r1, catalog);
    return { outcome: { kind: "exito", check, card }, board: retireToken(board, coord), hero, rng: r2 };
  }

  const hazard = TERRAINS[cell.terrain].hazard;
  if (!hazard) {
    const [damage, r2] = Rng.roll(r1, 1, 6);
    return {
      outcome: { kind: "fallo", check, save: null, effect: null, damage },
      board,
      hero: applyDamage(hero, damage),
      rng: r2,
    };
  }

  const saveMod = abilityMod(hero.abilityScores[SAVE_ABILITY[hazard.save]]);
  const [save, r2] = abilityCheck(r1, saveMod, hazard.cd);
  return {
    outcome: { kind: "fallo", check, save, effect: save.success ? null : hazard.effect, damage: 0 },
    board,
    hero,
    rng: r2,
  };
}

// --- Tesoro -----------------------------------------------------------------

/** Ficha de Tesoro (board-map.md §4, game-design.md §6b.6): 1-2 cartas de loot. El oro que da un cofre no está numéricamente decidido en los docs, así que no se resuelve aquí. */
export function resolveTesoro(
  rng: Rng.Rng,
  catalog: readonly CatalogCard[],
): { readonly cards: readonly CatalogCard[]; readonly rng: Rng.Rng } {
  const [cards, next] = rollTreasureLoot(rng, catalog);
  return { cards, rng: next };
}

// --- Amenaza / Exploración / Enemigo (mazo de encuentro) --------------------

/**
 * Ficha de Amenaza o Exploración (board-map.md §4, cards/encounter.md §5):
 * las dos roban 1 carta de Suceso — es la misma operación, la ambigüedad de
 * cuál de las dos fichas era ya la resolvió el propio icono. El texto de la
 * carta se muestra; su efecto mecánico no se aplica (ver cabecera del
 * archivo).
 */
export function resolveSuceso(
  state: EncounterState,
  catalog: readonly CatalogCard[],
  rng: Rng.Rng,
): { readonly card: DeckCard; readonly encounterState: EncounterState; readonly rng: Rng.Rng } {
  const [card, encounterState, next] = drawSuceso(state, catalog, rng);
  return { card, encounterState, rng: next };
}

/** Ficha de Enemigo (board-map.md §4): roba 1 carta de Combate. No abre la pantalla de batalla —no existe todavía. */
export function resolveEnemigo(
  state: EncounterState,
  catalog: readonly CatalogCard[],
  rng: Rng.Rng,
): { readonly card: DeckCard; readonly encounterState: EncounterState; readonly rng: Rng.Rng } {
  const [card, encounterState, next] = drawCombate(state, catalog, rng);
  return { card, encounterState, rng: next };
}

// --- Personaje (NPC) — solo lectura ------------------------------------------

/** Nombre legible de cada oficio (docs/characters/npcs.md §2). */
export const NPC_LABEL: Readonly<Record<NpcType, string>> = {
  vendedor: "Vendedor",
  tabernero: "Tabernero",
  sacerdote: "Sacerdote",
  mago: "Mago",
  "capitan-mercenarios": "Capitán de mercenarios",
  informante: "Informante",
  herrero: "Herrero",
};

/** 1 frase por oficio (docs/characters/npcs.md §2). Sin transacciones: Hero no tiene oro ni inventario todavía. */
export const NPC_BLURB: Readonly<Record<NpcType, string>> = {
  vendedor: "Compra y vende Items (no armas ni armaduras).",
  tabernero: "Descanso largo (cura total) y baja 10 de Amenaza pagando 50 oro, una vez por partida.",
  sacerdote: "Baja 1 Nivel de Maldición pagando su coste, o con una prueba gratuita arriesgada.",
  mago: "Vende hechizos y pergaminos, y encanta objetos.",
  "capitan-mercenarios": "Vende cartas de Mercenario por oro.",
  informante: "Revela información del mapa: adelanta un grupo vecino a Detectado.",
  herrero: "Compra y vende Arma y Armadura, y reforja (sube 1 Nivel por oro).",
};
