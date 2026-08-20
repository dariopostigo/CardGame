// =========================================================================
// Catálogo de las 4 clases jugables (docs/characters/heroes.md §2b-§2c)
//
// Fuente única de las estadísticas y PV de cada clase: antes cada lab que
// necesitaba un héroe se lo montaba a mano (MovementLab solo guardaba el mod
// de Sabiduría ya calculado, DeckLab solo una lista de nombres). Con Hero/
// HeroClassId ya definidos en state.ts, este es el sitio donde vive el dato
// real, mismo patrón que TERRAINS en terrain.ts: un Record por id.
// =========================================================================

import type { AbilityScores, HeroClassId } from "./state";

export type HeroClassDef = {
  readonly label: string;
  readonly abilityScores: AbilityScores;
  /** PV a nivel 1 = dado de vida máximo + mod CON + 10 de aguante de protagonista (§2c). */
  readonly pvMax: number;
};

export const HERO_ROSTER: Readonly<Record<HeroClassId, HeroClassDef>> = {
  guerrero: {
    label: "Guerrero",
    abilityScores: {
      fuerza: 15,
      destreza: 13,
      constitucion: 14,
      inteligencia: 8,
      sabiduria: 12,
      carisma: 10,
    },
    pvMax: 22,
  },
  picaro: {
    label: "Pícaro",
    abilityScores: {
      fuerza: 8,
      destreza: 15,
      constitucion: 13,
      inteligencia: 12,
      sabiduria: 10,
      carisma: 14,
    },
    pvMax: 19,
  },
  mago: {
    label: "Mago",
    abilityScores: {
      fuerza: 8,
      destreza: 14,
      constitucion: 10,
      inteligencia: 15,
      sabiduria: 13,
      carisma: 12,
    },
    pvMax: 16,
  },
  clerigo: {
    label: "Clérigo",
    abilityScores: {
      fuerza: 13,
      destreza: 10,
      constitucion: 14,
      inteligencia: 8,
      sabiduria: 15,
      carisma: 12,
    },
    pvMax: 20,
  },
};

export const HERO_CLASS_IDS: readonly HeroClassId[] = ["guerrero", "picaro", "mago", "clerigo"];

/** `mod = floor((stat - 10) / 2)`, game-design.md §2. */
export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}
