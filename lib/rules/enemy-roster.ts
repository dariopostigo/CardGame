// =========================================================================
// Catálogo de enemigos Normales (docs/characters/enemies.md §5b.2)
//
// Mismo patrón que lib/rules/hero-roster.ts: los datos ya derivados (PV/CA
// salen de §5b.1, no se recalculan aquí) como un Record por id. Solo los 5
// bloques Normales de esta ronda (PLAN-COMBATE.md) — Élite y Jefes llegan con
// su propia fase.
//
// El "gancho de habilidad" de cada bloque (§5b.2, columna Habilidad) es una
// unión discriminada por `kind`: son solo 4 formas distintas entre los 5
// Normales, así que un switch en enemy-ai.ts/combat.ts las resuelve una a una
// en vez de inventar un motor de habilidades genérico para 4 casos.
// =========================================================================

import type { DamageType } from "@/lib/card-table";
import { abilityMod } from "./hero-roster";
import type { Ability, AbilityScores, CreatureNature } from "./state";

export type EnemyClassId =
  | "lobo-de-las-lindes"
  | "bandido-merodeador"
  | "trasgo-de-pantano"
  | "esqueleto-errante"
  | "arana-cavernaria";

export type EnemyAttack = {
  readonly label: string;
  readonly dice: { readonly count: number; readonly sides: number };
  /** Qué mod usa la tirada y el daño (§5b.1: FUE melee, DES a distancia/ligero/natural ágil). */
  readonly ability: Ability;
  readonly damageType: DamageType;
  /** 1 = cuerpo a cuerpo (adyacente); >1 = a distancia (board/battle.md §2). */
  readonly range: number;
};

/**
 * Los 4 ganchos de habilidad de los 5 Normales (§5b.2). "Roba un objeto" del
 * Bandido *Escurridizo* se deja fuera a propósito: no hay sistema de
 * inventario todavía, así que por debajo del 50 % de PV siempre intenta huir.
 */
export type EnemyAbilityHook =
  /** Lobo — Cazador de manada: ventaja al atacar si otro Lobo está adyacente al objetivo. */
  | { readonly kind: "cazador-de-manada" }
  /** Bandido — Escurridizo: por debajo del 50 % de PV, huye en vez de atacar. */
  | { readonly kind: "escurridizo" }
  /** Trasgo / Araña — Veneno: al impactar, el objetivo salva o queda Envenenado. */
  | { readonly kind: "veneno"; readonly save: { readonly ability: Ability; readonly cd: number } }
  /** Araña — Telaraña: a distancia, sin daño, el objetivo salva o queda Inmovilizado. */
  | {
      readonly kind: "telarana";
      readonly range: number;
      readonly save: { readonly ability: Ability; readonly cd: number };
    };

export type EnemyClassDef = {
  readonly label: string;
  readonly nature: CreatureNature;
  readonly abilityScores: AbilityScores;
  readonly pvMax: number;
  readonly ca: number;
  readonly speed: number;
  readonly attack: EnemyAttack;
  readonly abilities: readonly EnemyAbilityHook[];
};

export const ENEMY_ROSTER: Readonly<Record<EnemyClassId, EnemyClassDef>> = {
  "lobo-de-las-lindes": {
    label: "Lobo de las lindes",
    nature: "bestia",
    abilityScores: { fuerza: 10, destreza: 13, constitucion: 12, inteligencia: 8, sabiduria: 11, carisma: 9 },
    pvMax: 12,
    ca: 12,
    speed: 3,
    attack: { label: "Mordisco", dice: { count: 1, sides: 6 }, ability: "destreza", damageType: "perforante", range: 1 },
    abilities: [{ kind: "cazador-de-manada" }],
  },
  "bandido-merodeador": {
    label: "Bandido merodeador",
    nature: "humanoide",
    abilityScores: { fuerza: 13, destreza: 12, constitucion: 11, inteligencia: 8, sabiduria: 9, carisma: 10 },
    pvMax: 10,
    ca: 12,
    speed: 2,
    attack: { label: "Cimitarra", dice: { count: 1, sides: 6 }, ability: "destreza", damageType: "cortante", range: 1 },
    abilities: [{ kind: "escurridizo" }],
  },
  "trasgo-de-pantano": {
    label: "Trasgo de pantano",
    nature: "humanoide",
    abilityScores: { fuerza: 9, destreza: 13, constitucion: 12, inteligencia: 11, sabiduria: 10, carisma: 8 },
    pvMax: 6, // 1 DV, no 2: el gancho "bajo HP" de §5b.2 (excepción de §5b.1)
    ca: 12,
    speed: 2,
    attack: { label: "Daga emponzoñada", dice: { count: 1, sides: 4 }, ability: "destreza", damageType: "perforante", range: 1 },
    abilities: [{ kind: "veneno", save: { ability: "constitucion", cd: 12 } }],
  },
  "esqueleto-errante": {
    label: "Esqueleto errante",
    nature: "no-muerto",
    abilityScores: { fuerza: 12, destreza: 13, constitucion: 11, inteligencia: 8, sabiduria: 10, carisma: 9 },
    pvMax: 10,
    ca: 12,
    speed: 2,
    attack: { label: "Espada mellada", dice: { count: 1, sides: 6 }, ability: "fuerza", damageType: "cortante", range: 1 },
    abilities: [],
  },
  "arana-cavernaria": {
    label: "Araña cavernaria",
    nature: "bestia",
    abilityScores: { fuerza: 10, destreza: 13, constitucion: 11, inteligencia: 9, sabiduria: 12, carisma: 8 },
    pvMax: 10,
    ca: 12,
    speed: 2,
    attack: { label: "Mordisco", dice: { count: 1, sides: 6 }, ability: "destreza", damageType: "perforante", range: 1 },
    abilities: [
      { kind: "veneno", save: { ability: "constitucion", cd: 12 } },
      { kind: "telarana", range: 2, save: { ability: "destreza", cd: 12 } },
    ],
  },
};

/** Orden de la tabla de enemies.md §5b.2, de más a menos frecuente en el bosquejo de §5. */
export const ENEMY_CLASS_IDS: readonly EnemyClassId[] = [
  "lobo-de-las-lindes",
  "bandido-merodeador",
  "trasgo-de-pantano",
  "esqueleto-errante",
  "arana-cavernaria",
];

/** `2 hex + 1 por punto de mod SAB` (§5b.1) — no se guarda como literal, es derivada. */
export function enemyDetection(def: EnemyClassDef): number {
  return 2 + abilityMod(def.abilityScores.sabiduria);
}

// --- Naturaleza de criatura y resistencias (enemies.md §3b) ----------------

export type NatureResistance = {
  readonly resistantTo: readonly DamageType[];
  readonly vulnerableTo: readonly DamageType[];
};

/**
 * Tabla completa de §3b. Solo Humanoide/Bestia/No-muerto tocan a los 5
 * Normales de esta ronda; Gigante y Sombrío se incluyen igual porque ya están
 * decididos en el documento y no cuesta nada tenerlos completos.
 */
export const NATURE_RESISTANCES: Readonly<Record<CreatureNature, NatureResistance>> = {
  humanoide: { resistantTo: [], vulnerableTo: [] },
  bestia: { resistantTo: [], vulnerableTo: [] },
  gigante: { resistantTo: [], vulnerableTo: [] },
  "no-muerto": { resistantTo: ["perforante"], vulnerableTo: ["contundente", "radiante"] },
  sombrio: { resistantTo: ["cortante", "perforante"], vulnerableTo: ["radiante"] },
};

export function resistancesFor(nature: CreatureNature): NatureResistance {
  return NATURE_RESISTANCES[nature];
}
