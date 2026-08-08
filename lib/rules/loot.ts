// =========================================================================
// Tabla de loot (docs/game-design.md §6b.6)
//
// Solo las dos filas con fórmula cerrada que ya tienen ficha que las use:
// Tesoro (board-map.md §4) y Terreno en éxito (board-map.md §4b). El resto de
// filas de la tabla (botín de enemigo, Mazmorra, Sucesos) llegan cuando
// llegue su propio subsistema — no se adelantan aquí sin ficha que las pida.
//
// Paso 1 (¿cae carta?) no aplica a ninguna de las dos: las dos dan carta
// garantizada. Paso 2 (rareza) y Paso 3 (categoría) sí, con la regla de caída
// de rareza cuando el catálogo no tiene nada de ese tipo+rareza —épico y
// legendario casi no existen en el prototipo (items.md §5, weapons.md §5b).
// =========================================================================

import * as Rng from "./rng";
import { RARITY_LEVELS, type RarityLevel } from "@/lib/rarity";
import type { CardCategory } from "@/lib/card-table";
import type { CatalogCard } from "@/lib/card-catalog";

/** §6b.6 paso 2: 45 % Común / 40 % Poco común / 15 % Raro — Tesoro y Terreno comparten esta tabla. */
const RARITY_WEIGHTS: ReadonlyArray<readonly [RarityLevel, number]> = [
  ["comun", 45],
  ["poco-comun", 40],
  ["raro", 15],
];

/** §6b.6 paso 3, solo para Tesoro (Terreno no pasa por categoría). */
const CATEGORY_WEIGHTS: ReadonlyArray<readonly [CardCategory, number]> = [
  ["item", 50],
  ["arma", 22],
  ["armadura", 18],
  ["mercenario", 10],
];

function isRareOrBetter(rarity: RarityLevel): boolean {
  return RARITY_LEVELS.indexOf(rarity) >= RARITY_LEVELS.indexOf("raro");
}

/**
 * Uniforme dentro de tipo+rareza; si el catálogo no tiene ninguna carta de esa
 * combinación, baja al escalón de rareza más alto disponible (regla de caída,
 * §6b.6) hasta Común. `null` solo si ni Común tiene carta de esa categoría.
 */
function pickCard(
  rng: Rng.Rng,
  catalog: readonly CatalogCard[],
  category: CardCategory,
  rarity: RarityLevel,
): [CatalogCard | null, Rng.Rng] {
  for (let i = RARITY_LEVELS.indexOf(rarity); i >= 0; i--) {
    const tier = RARITY_LEVELS[i];
    const pool = catalog.filter((c) => c.category === category && c.rarity === tier);
    if (pool.length > 0) return Rng.pick(rng, pool);
  }
  return [null, rng];
}

function rollCategoryAndCard(
  rng: Rng.Rng,
  catalog: readonly CatalogCard[],
  rarity: RarityLevel,
): [CatalogCard | null, Rng.Rng] {
  const [category, next] = Rng.pickWeighted(rng, CATEGORY_WEIGHTS);
  return pickCard(next, catalog, category, rarity);
}

/**
 * Ficha de Tesoro: 1 carta garantizada; si la rareza sorteada es Raro o
 * superior, cae una 2ª (misma rareza ya decidida, categoría vuelta a sortear
 * — board-map.md §4, "los cofres de mayor rareza pueden dar ambos" no fija
 * cómo se reparte la 2ª, así que se trata como una tirada de categoría más).
 */
export function rollTreasureLoot(
  rng: Rng.Rng,
  catalog: readonly CatalogCard[],
): [readonly CatalogCard[], Rng.Rng] {
  const [rarity, r1] = Rng.pickWeighted(rng, RARITY_WEIGHTS);
  const [first, r2] = rollCategoryAndCard(r1, catalog, rarity);
  const cards = first ? [first] : [];
  if (!isRareOrBetter(rarity)) return [cards, r2];
  const [second, r3] = rollCategoryAndCard(r2, catalog, rarity);
  return [second ? [...cards, second] : cards, r3];
}

/**
 * Ficha de Terreno en éxito (board-map.md §4b): la misma tirada 45/40/15
 * elige directamente cuál de las 3 cartas de movimiento cae (1 por escalón,
 * `items.md` §5, etiquetadas `fichas="Movimiento"`) — sin pasar por categoría.
 */
export function rollTerrainLoot(
  rng: Rng.Rng,
  catalog: readonly CatalogCard[],
): [CatalogCard | null, Rng.Rng] {
  const [rarity, next] = Rng.pickWeighted(rng, RARITY_WEIGHTS);
  const pool = catalog.filter((c) => c.rarity === rarity && c.stats.some((s) => s.label === "Movimiento"));
  if (pool.length === 0) return [null, next];
  return Rng.pick(next, pool);
}
