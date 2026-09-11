// =========================================================================
// De Character a Fighter — el puente que le faltaba al motor de combate
//
// `character.ts` es la anatomía (las 8 Habilidades, el tier, los rasgos) y
// `battle.ts` pelea con seis números y una posición (`Fighter`) A PROPÓSITO
// —no quiere saber de tier ni de rasgos—. Hasta el 8-sep-2026 ese `Fighter`
// se rellenaba a mano en un script de node porque no había ningún
// `Character` real con las 8 Habilidades puestas; ahora que el roster arma
// las 24 de Humanos y Enanos (`races.ts` `charactersOfRace`), lo que falta es
// esta conversión, no un motor nuevo.
//
// `id` lleva el bando por delante: dos bandos pueden traer LA MISMA ficha
// (un héroe contra sí mismo, para medir la paridad), y `battle.ts` identifica
// a cada combatiente por su `id` — sin el prefijo, un espejo colisionaría
// consigo mismo.
//
// `applies` YA NO SE INVENTA: `appliesOf()` cruza las Características que la
// ficha ya lleva en razas.md contra la columna "Lo aplica" de effects.md —
// 🩸 Hemorragia dispara Sangrado, 🔥 Fuego dispara Quemadura, etc (8-sep-2026).
// Es mecánico, no insumo de Dario: si una ficha no lleva ninguna Característica
// de las nueve, sale con `applies` vacío, y eso sigue siendo legal.
//
// Puro: sin React, sin node:fs.
// =========================================================================

import type { Side } from "./arena";
import type { Fighter } from "./battle";
import type { Character } from "./character";
import type { Effect } from "./effects";
import type { HexCoord } from "./hex";
import type { Trait } from "./traits";

/**
 * El nombre de una Característica a partir de cómo la escribe la columna "Lo
 * aplica" de effects.md: siempre «<icono> <Nombre>», igual que una celda de
 * razas.md — mismo criterio que `races.ts` `traitIdsFromCell`.
 */
function traitLabelOf(cell: string): string {
  return cell.slice(cell.indexOf(" ") + 1).trim();
}

/**
 * 😱 Miedo dispara Aturdido, pero NO al golpear: es un disparador propio —"la
 * primera vez que el PORTADOR baja de media Vida"—, no algo que sus ataques
 * apliquen al enemigo. `effects-runtime.ts` lo deja fuera a propósito (no
 * modela si la ficha ya pasó ese umbral en el combate), así que `applies` —que
 * `battle.ts` dispara al golpear— tiene que dejarlo fuera también: incluirlo
 * haría que llevar 😱 Miedo aturdiera a quien esta ficha golpee, que es justo
 * el mecanismo contrario.
 */
const SELF_TRIGGERED_TRAITS: ReadonlySet<string> = new Set(["Miedo"]);

/**
 * Qué Estados dispara `character` al golpear, porque ya lleva la
 * Característica que los aplica (effects.md §5, columna "Lo aplica").
 */
export function appliesOf(
  character: Character,
  traits: readonly Trait[],
  effects: readonly Effect[],
): readonly string[] {
  const traitIdByLabel = new Map(traits.map((t) => [t.label, t.id]));
  const has = new Set(character.traits);
  return effects
    .filter((effect) =>
      effect.appliedBy.some((cell) => {
        const label = traitLabelOf(cell);
        if (SELF_TRIGGERED_TRAITS.has(label)) return false;
        const traitId = traitIdByLabel.get(label);
        return traitId !== undefined && has.has(traitId);
      }),
    )
    .map((effect) => effect.id);
}

export function fighterOf(
  character: Character,
  side: Side,
  hex: HexCoord,
  applies: readonly string[] = [],
): Fighter {
  const { abilities } = character;
  return {
    id: `${side}-${character.id}`,
    side,
    damage: character.damage,
    hex,
    ataque: abilities.ataque,
    defensa: abilities.defensa,
    resistenciaMagica: abilities["resistencia-magica"],
    precision: abilities.precision,
    suerte: abilities.suerte,
    iniciativa: abilities.iniciativa,
    vidaMax: abilities.vida,
    vida: abilities.vida,
    applies,
  };
}
