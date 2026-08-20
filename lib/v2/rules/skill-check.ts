// =========================================================================
// Prueba de habilidad genérica: `1d20 + mod` vs CD (game-design.md §4b.2 y
// pareja en toda regla que diga "salvación" o "prueba").
//
// La casa solo tenía la primitiva del dado (`Rng.d20`); esto es la mitad que
// falta —comparar contra una CD y decir si pasa—, para no repetir el mismo
// `total >= cd` suelto en cada sitio que tire una prueba (ficha de Terreno,
// más adelante NPCs y maldiciones).
// =========================================================================

import * as Rng from "./rng";
import type { Ability } from "./state";

export type SkillCheckResult = {
  readonly success: boolean;
  readonly roll: number;
  readonly total: number;
};

/** `1d20 + mod` vs `cd`. Empatar con la CD cuenta como éxito. */
export function abilityCheck(rng: Rng.Rng, mod: number, cd: number): [SkillCheckResult, Rng.Rng] {
  const [roll, next] = Rng.d20(rng);
  const total = roll + mod;
  return [{ success: total >= cd, roll, total }, next];
}

/**
 * Puente entre la abreviatura de una salvación (`Hazard.save`, terrain.ts) y
 * el nombre completo de la estadística (`Ability`, state.ts) — son dos
 * vocabularios del mismo eje de 6 estadísticas, uno en siglas de prosa y otro
 * en el nombre de campo de `AbilityScores`.
 */
export const SAVE_ABILITY: Readonly<Record<"FUE" | "DES" | "CON" | "INT" | "SAB" | "CAR", Ability>> = {
  FUE: "fuerza",
  DES: "destreza",
  CON: "constitucion",
  INT: "inteligencia",
  SAB: "sabiduria",
  CAR: "carisma",
};
