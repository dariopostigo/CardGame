// =========================================================================
// El roster — las fichas reales de una raza, en Character
//
// `traits.ts` `parseRoster` da el ROSTER CRUDO: nombre, tier, y las
// Características y el tipo de daño tal y como están escritos en razas.md,
// como texto. Esto es lo que falta para que ese texto se convierta en fichas
// de verdad: cruza el roster con la anatomía de `character.ts` y produce un
// `Character` legal-o-no por cada raza, unidad de la progresión.
//
// SOLO LAS RAZAS PILOTO TIENEN BASE, y eso no es un descuido: `RACE_BASES`
// (character.ts) hoy solo trae Humanos, así que pedir cualquier otra raza
// lanza. Es la frontera "la v1 se juega con Humanos y Enanos, el resto en
// StandBy" (status.md §4) escrita en el código y no solo en un comentario.
//
// LAS CINCO DE ESCALÓN VAN EN SU VALOR POR DEFECTO, Y ESO NO ES UNA DECISIÓN.
// razas.md todavía no dice qué escalón (🛡️ 🔮 🎯 🍀 ⚡) le toca a cada una de
// las 132 fichas — eso es insumo de Dario, ficha a ficha (status.md §2,
// punto 4). Mientras no esté escrito, cada ficha del roster sale con las
// cinco en `DEFAULT_STEP` ("normal"), que ya es legal (mismo trato que
// `blankCharacter`): no finge un número que nadie ha decidido, y lo dice la
// interfaz que las pinta.
//
// Puro: sin React, sin node:fs. El roster crudo y el catálogo se inyectan.
// =========================================================================

import {
  ABILITY_STEPS,
  DEFAULT_STEP,
  HERO_TIER,
  RACE_BASES,
  STEP_NAMES,
  scaleByTier,
  type Character,
} from "./character";
import { DAMAGE_TYPE_IDS, DAMAGE_TYPES, type DamageTypeId } from "./damage";
import { MOVEMENT_BAND } from "./tempo";
import type { RosterEntry, Trait } from "./traits";

/**
 * Sin tildes, en minúsculas, y sin el emoji de cabeza: «👤 Humanos» → «humanos».
 *
 * Exportado porque no es solo la clave de `RACE_BASES`: es también el slug de
 * `public/assets/v3/races/<raceSlug>/…` que usa `lib/v3/cards.ts` para
 * derivar la ruta de una ilustración — mismo criterio, así que no se duplica.
 */
export function raceSlug(race: string): string {
  return race
    .replace(/^[^\p{L}]+/u, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

/** Un id legible y único: raza + rol + nombre, todo en minúsculas y con guiones. */
function characterId(race: string, kind: "heroe" | "unidad", name: string): string {
  return `${raceSlug(race)}-${kind}-${name}`
    .replace(/^[^\p{L}0-9-]+/u, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * El `DamageTypeId` de una celda «Tipo de daño» tal y como la escribe
 * razas.md: `🗡️ Cuerpo a cuerpo`, `✨ Mágico`, `🏹 A distancia`.
 *
 * Lanza si el texto no casa con ninguno de los tres: una ficha sin tipo de
 * daño reconocible no tiene alcance, ni mitigación, ni 👢, así que no hay
 * ficha en blanco que fingir aquí (dano.md).
 */
export function damageIdFromCell(raw: string): DamageTypeId {
  const found = DAMAGE_TYPE_IDS.find((id) => raw.includes(DAMAGE_TYPES[id].label));
  if (!found) {
    throw new Error(
      `«${raw}» no es ninguno de los tres tipos de daño: ${DAMAGE_TYPE_IDS.map(
        (id) => DAMAGE_TYPES[id].label,
      ).join(", ")}.`,
    );
  }
  return found;
}

/**
 * Las Características de una ficha, resueltas de texto crudo (`🛡️ Resistente
 * al daño físico`) a id de catálogo.
 *
 * Empareja por LABEL y no por icono, porque el icono se repite a propósito
 * entre familias (traits.ts `glyphClashes`). Lanza si una entrada no está en
 * el catálogo: una Característica que no existe no es un roster corto, es un
 * roster que miente.
 */
export function traitIdsFromCell(
  raw: readonly string[],
  catalog: readonly Trait[],
): readonly string[] {
  const byLabel = new Map(catalog.map((t) => [t.label, t]));
  return raw.map((cell) => {
    // El formato es siempre «<icono> <Nombre>»: el icono no lleva espacios
    // internos, así que el primero separa uno de otro.
    const label = cell.slice(cell.indexOf(" ") + 1).trim();
    const trait = byLabel.get(label);
    if (!trait) {
      throw new Error(`«${cell}» no está en el catálogo de Características de razas.md.`);
    }
    return trait.id;
  });
}

/** El valor de una Habilidad de escalones en `DEFAULT_STEP`. Nunca `null`: de las cinco, solo ⚡ en los extremos lo es, y "normal" no es un extremo. */
function defaultStepValue(ability: keyof typeof ABILITY_STEPS): number {
  const value = ABILITY_STEPS[ability][STEP_NAMES.indexOf(DEFAULT_STEP)];
  if (value === null) {
    throw new Error(
      `${ability}: el escalón "${DEFAULT_STEP}" no tiene valor en ABILITY_STEPS (character.ts). Eso rompería el punto de partida de todo el roster.`,
    );
  }
  return value;
}

/**
 * Las fichas reales de una raza: sus héroes y su progresión de 8 unidades,
 * como `Character` — ❤️/⚔️ de la curva de tier de su raza, 👢 de su tipo de
 * daño, las Características resueltas y las cinco de escalón en su valor por
 * defecto (ver cabecera).
 *
 * @param roster - El roster crudo (`traits-catalog.ts` `getRoster()`).
 * @param catalog - Las Características (`traits-catalog.ts` `getTraitCatalog()`).
 * @param race - Tal y como se escribe en razas.md: `👤 Humanos`.
 */
export function charactersOfRace(
  roster: readonly RosterEntry[],
  catalog: readonly Trait[],
  race: string,
): readonly Character[] {
  const base = RACE_BASES[raceSlug(race)];
  if (!base) {
    throw new Error(
      `«${race}» no tiene base de raza en RACE_BASES (character.ts): hoy solo la tiene Humanos. Enanos es la segunda raza piloto (status.md §4) y espera su par de cifras; las otras nueve quedan en StandBy hasta la v1.`,
    );
  }

  return roster
    .filter((entry) => entry.race === race)
    .map((entry): Character => {
      const damage = damageIdFromCell(entry.damage);
      const tier = entry.tier ?? HERO_TIER;

      return {
        id: characterId(race, entry.kind, entry.name),
        name: entry.name,
        role: entry.kind,
        tier: entry.kind === "unidad" ? (entry.tier as number) : undefined,
        race,
        damage,
        abilities: {
          vida: scaleByTier(base.vida, tier),
          ataque: scaleByTier(base.ataque, tier),
          defensa: defaultStepValue("defensa"),
          "resistencia-magica": defaultStepValue("resistencia-magica"),
          precision: defaultStepValue("precision"),
          suerte: defaultStepValue("suerte"),
          iniciativa: defaultStepValue("iniciativa"),
          movimiento: MOVEMENT_BAND[damage],
        },
        traits: traitIdsFromCell(entry.traits, catalog),
      };
    });
}
