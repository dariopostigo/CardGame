// =========================================================================
// Estados de combate (docs/effects.md)
//
// Solo los dos que disparan los 5 Normales de esta ronda (docs/effects.md
// §2): Envenenado e Inmovilizado. Unión discriminada extensible por `EffectId`
// — el resto de los 11 del catálogo se añaden ampliando las tres tablas de
// abajo, sin tocar la forma de `Effect`.
//
// CD de salvación fija en 12 para todo el prototipo (docs/effects.md §1).
//
// Dos funciones, no una, porque el documento fija dos MOMENTOS distintos
// (§1 "Momento"): el daño de Envenenado es AL EMPEZAR el turno del portador,
// la salvación que retira un estado es AL TERMINAR ese mismo turno. Van
// separadas a propósito: si se resolvieran juntas al empezar el turno, un
// Inmovilizado recién aplicado se retiraría antes de que el propio turno
// llegara a sentir su efecto (no podrías moverte, pero la salvación ya lo
// habría quitado para el turno SIGUIENTE, no para este).
// =========================================================================

import { abilityMod } from "./hero-roster";
import * as Rng from "./rng";
import { abilityCheck } from "./skill-check";
import type { Ability, AbilityScores } from "./state";

export type EffectId = "envenenado" | "inmovilizado";

export type Effect = {
  readonly id: EffectId;
  /** Turnos que le quedan al estado, contando el actual. */
  readonly turnsLeft: number;
};

export type Effects = readonly Effect[];

const SAVE_CD = 12;

/** Salvación de fin de turno que retira el estado si se supera (docs/effects.md §2). */
const EFFECT_SAVE: Readonly<Record<EffectId, Ability>> = {
  envenenado: "constitucion",
  inmovilizado: "destreza",
};

/** Duración máxima si nunca se supera la salvación (docs/effects.md §2). */
const EFFECT_MAX_TURNS: Readonly<Record<EffectId, number>> = {
  envenenado: 3,
  inmovilizado: 1,
};

export function hasEffect(effects: Effects, id: EffectId): boolean {
  return effects.some((e) => e.id === id);
}

/** Aplica (o refresca a su duración máxima) un estado. No se acumulan copias. */
export function applyEffect(effects: Effects, id: EffectId): Effects {
  return [...effects.filter((e) => e.id !== id), { id, turnsLeft: EFFECT_MAX_TURNS[id] }];
}

export function removeEffect(effects: Effects, id: EffectId): Effects {
  return effects.filter((e) => e.id !== id);
}

/**
 * Daño de Envenenado (1d4) al EMPEZAR el turno del portador (docs/effects.md
 * §2). No retira nada: el estado sigue activo (y por tanto visible/efectivo)
 * durante todo el turno — la salvación que puede quitarlo es
 * `attemptEndOfTurnSaves`, aparte.
 */
export function applyStartOfTurnDamage(rng: Rng.Rng, effects: Effects): [number, Rng.Rng] {
  let r = rng;
  let poisonDamage = 0;
  for (const effect of effects) {
    if (effect.id !== "envenenado") continue;
    const [dmg, next] = Rng.roll(r, 1, 4);
    poisonDamage += dmg;
    r = next;
  }
  return [poisonDamage, r];
}

/**
 * Salvación de fin de turno de cada estado activo (CON para Envenenado, DES
 * para Inmovilizado, CD 12): los que la superan, o agotan su duración
 * máxima, se retiran. Se llama al TERMINAR el turno del portador, para que
 * el estado haya estado activo (moviendo, dañando) durante el turno entero.
 */
export function attemptEndOfTurnSaves(
  rng: Rng.Rng,
  effects: Effects,
  abilityScores: AbilityScores,
): [Effects, Rng.Rng] {
  let r = rng;
  const kept: Effect[] = [];

  for (const effect of effects) {
    const mod = abilityMod(abilityScores[EFFECT_SAVE[effect.id]]);
    const [check, next] = abilityCheck(r, mod, SAVE_CD);
    r = next;
    if (check.success) continue; // salvación superada: se retira

    const turnsLeft = effect.turnsLeft - 1;
    if (turnsLeft > 0) kept.push({ id: effect.id, turnsLeft });
  }

  return [kept, r];
}
