// =========================================================================
// Motor de combate (docs/board/battle.md, docs/characters/enemies.md §5b)
//
// Arrancó con lo mínimo que ya tenía fórmula cerrada: el presupuesto de
// composición del bando enemigo. Esta ronda añade el resto del combate 1v1-2
// contra Normales (PLAN-COMBATE.md): iniciativa, la rejilla de batalla vacía,
// resolución de un ataque y el fin de combate. La IA enemiga (árbol de
// prioridades §5b.6) vive aparte, en enemy-ai.ts (ARCHITECTURE.md §4) — este
// archivo solo sabe tirar dados y aplicar sus resultados, no decidir qué
// hacer.
// =========================================================================

import { abilityMod } from "./hero-roster";
import * as Hex from "./hex";
import type { HexKey } from "./hex";
import * as Rng from "./rng";
import type { AbilityScores, Ability, Board, EnemyCategory, Hex as HexCell } from "./state";
import type { DamageType } from "@/lib/card-table";

/** Coste por Categoría dentro del presupuesto (enemies.md §5b.6). */
const COMPOSITION_COST: Readonly<Record<EnemyCategory, number>> = {
  normal: 1,
  elite: 2,
  "jefe-capitulo": 3,
  "jefe-final": 3,
};

/** Tope duro del presupuesto, sea cual sea el nº de héroes/mercenarios (§5b.6). */
export const COMPOSITION_CAP = 6;

/**
 * Presupuesto de composición del bando enemigo: héroes que entran a la
 * batalla + 1, + 1 más por cada mercenario invocado (una ficha aliada con
 * turno propio cuenta igual que un jugador más), sin pasar del tope.
 * Con 1 héroe solo y sin mercenarios da 2 — el tope fijo que había antes de
 * esta fórmula (enemies.md §5b.6).
 */
export function compositionBudget(heroCount: number, mercenaryCount = 0): number {
  return Math.min(heroCount + 1 + mercenaryCount, COMPOSITION_CAP);
}

/** Coste de meter una criatura de esa Categoría en el presupuesto (§5b.6). */
export function compositionCost(category: EnemyCategory): number {
  return COMPOSITION_COST[category];
}

// --- Iniciativa (game-design.md §4b.2) -------------------------------------

export type InitiativeCombatant = {
  readonly id: string;
  readonly abilityScores: AbilityScores;
  /** Empate de tirada → mayor Destreza bruta → héroe gana. */
  readonly isHero: boolean;
};

/**
 * `1d20 + mod Destreza` por unidad, orden descendente. Empate → mayor
 * Destreza bruta → si sigue empatado, gana el héroe (game-design.md §4b.2).
 * Se tira una sola vez al abrir la batalla; el orden no vuelve a calcularse
 * (board/battle.md §6).
 */
export function rollInitiative(
  rng: Rng.Rng,
  combatants: readonly InitiativeCombatant[],
): [readonly string[], Rng.Rng] {
  let r = rng;
  const rolled = combatants.map((c) => {
    const [roll, next] = Rng.d20(r);
    r = next;
    return { ...c, total: roll + abilityMod(c.abilityScores.destreza) };
  });
  rolled.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.abilityScores.destreza !== a.abilityScores.destreza) {
      return b.abilityScores.destreza - a.abilityScores.destreza;
    }
    return Number(b.isHero) - Number(a.isHero);
  });
  return [rolled.map((c) => c.id), r];
}

// --- Rejilla de batalla (board/battle.md §2) -------------------------------

/** 14 columnas × 12 filas, llano y sin obstáculos (fuera de alcance esta ronda). */
const BATTLEFIELD_COLS = 14;
const BATTLEFIELD_ROWS = 12;

/**
 * Rejilla de batalla sintética, del mismo tipo `Board` que usa board-gen.ts:
 * así `HexBoard` (components/game/board/HexBoard.tsx) la pinta sin ningún
 * cambio. Vacía y en Llanura (sin obstáculos por plantilla de terreno todavía,
 * battle.md §7) — no marca ningún hexágono como entrada porque ese anillo no
 * significa nada en una rejilla de batalla (`Hex.isEntrance` se queda a
 * `false` en todos), solo el campo `Board.entrance` necesita un valor válido.
 */
export function buildBattlefield(): Board {
  const hexes = new Map<HexKey, HexCell>();
  for (let row = 0; row < BATTLEFIELD_ROWS; row++) {
    for (let col = 0; col < BATTLEFIELD_COLS; col++) {
      const coord = Hex.offsetToAxial({ col, row });
      hexes.set(Hex.key(coord), {
        coord,
        terrain: "llanura",
        location: null,
        token: null,
        npcType: null,
        tileId: "battlefield",
        isEntrance: false,
        terrainRevealed: true,
        contentRevealed: true,
        resolved: false,
      });
    }
  }
  const entrance = Hex.offsetToAxial({ col: 0, row: Math.floor(BATTLEFIELD_ROWS / 2) });
  const distanceFromEntrance = new Map<HexKey, number>(
    [...hexes.values()].map((cell) => [Hex.key(cell.coord), Hex.distance(entrance, cell.coord)]),
  );
  return { hexes, tiles: [], voids: [], entrance, distanceFromEntrance };
}

// --- Resolución de un ataque (game-design.md §4b.4) ------------------------

export type AttackDice = { readonly count: number; readonly sides: number };

/** Lo mínimo que resolveAttack necesita de un arma/ataque: tirada, stat y tipo de daño. */
export type Weapon = {
  readonly dice: AttackDice;
  readonly ability: Ability;
  readonly damageType: DamageType;
};

export type AttackTarget = {
  readonly ca: number;
  /** Por Naturaleza de criatura (enemies.md §3b); los héroes no tienen ninguna por ahora. */
  readonly resistantTo?: readonly DamageType[];
  readonly vulnerableTo?: readonly DamageType[];
};

export type AttackOutcome = {
  /** Total de la tirada de ataque (con ventaja/desventaja ya resuelta), sin contar crítico/pifia. */
  readonly attackRoll: number;
  readonly hit: boolean;
  readonly critical: boolean;
  readonly fumble: boolean;
  /** 0 si no impacta. Ya con resistencia/vulnerabilidad aplicada. */
  readonly damage: number;
};

/**
 * `1d20 + mod` vs CA (§4b.4, pasos 2-4). Natural 20 = impacto automático y
 * dados de daño doblados; natural 1 = fallo automático (paso 5). Ventaja/
 * desventaja tira 2d20 y coge el mejor/peor (paso 6). Daño = dados + mod,
 * con la resistencia (mitad) o vulnerabilidad (doble) del objetivo (§4b.10).
 */
export function resolveAttack(
  rng: Rng.Rng,
  attackerAbilityScores: AbilityScores,
  target: AttackTarget,
  weapon: Weapon,
  advantageState: "normal" | "ventaja" | "desventaja" = "normal",
): [AttackOutcome, Rng.Rng] {
  const mod = abilityMod(attackerAbilityScores[weapon.ability]);

  let r = rng;
  let natural: number;
  if (advantageState === "normal") {
    const [roll, next] = Rng.d20(r);
    natural = roll;
    r = next;
  } else {
    const [a, afterA] = Rng.d20(r);
    const [b, afterB] = Rng.d20(afterA);
    natural = advantageState === "ventaja" ? Math.max(a, b) : Math.min(a, b);
    r = afterB;
  }

  const critical = natural === 20;
  const fumble = natural === 1;
  const attackRoll = natural + mod;
  const hit = !fumble && (critical || attackRoll >= target.ca);

  let damage = 0;
  if (hit) {
    const diceCount = critical ? weapon.dice.count * 2 : weapon.dice.count;
    const [rolled, afterDamage] = Rng.roll(r, diceCount, weapon.dice.sides);
    r = afterDamage;
    damage = rolled + mod;
    if (target.resistantTo?.includes(weapon.damageType)) damage = Math.floor(damage / 2);
    if (target.vulnerableTo?.includes(weapon.damageType)) damage *= 2;
  }

  return [{ attackRoll, hit, critical, fumble, damage }, r];
}

// --- Desengancharse (board/battle.md §6) -----------------------------------

export type DisengageOutcome = {
  readonly leaverWins: boolean;
  /** Daño directo (sin tirada de ataque) al que se va, solo si pierde. */
  readonly damageToLeaver: number;
};

/**
 * Tirada enfrentada `1d20 + mod DES`, simétrica entre quien se va y quien
 * retiene. Empate → gana el que se va (§6). Perder no impide moverse: solo
 * cuesta el golpe básico del que retiene, sin comparar con la CA.
 */
export function resolveDisengage(
  rng: Rng.Rng,
  leaverAbilityScores: AbilityScores,
  holderAbilityScores: AbilityScores,
  holderBasicAttackDice: AttackDice,
): [DisengageOutcome, Rng.Rng] {
  const leaverMod = abilityMod(leaverAbilityScores.destreza);
  const holderMod = abilityMod(holderAbilityScores.destreza);

  const [leaverRoll, afterLeaver] = Rng.d20(rng);
  const [holderRoll, afterHolder] = Rng.d20(afterLeaver);
  const leaverWins = leaverRoll + leaverMod >= holderRoll + holderMod;

  if (leaverWins) return [{ leaverWins, damageToLeaver: 0 }, afterHolder];

  const [rolled, afterDamage] = Rng.roll(afterHolder, holderBasicAttackDice.count, holderBasicAttackDice.sides);
  return [{ leaverWins, damageToLeaver: rolled + holderMod }, afterDamage];
}

// --- Fin de combate (board/battle.md §9, versión solo de game-design.md §4b.8) ---

export type BattleOutcome = "en-curso" | "victoria" | "derrota";

/** Lo mínimo que hace falta para saber si una batalla sigue: los PV de cada bando. */
type Combatant = { readonly pv: { readonly current: number } };

/**
 * Victoria (todos los enemigos a 0 PV) / derrota (el héroe a 0 PV) — versión
 * solo, sin estado Derribado ni co-op (board/battle.md §9.1 es de otra ronda).
 * Toma solo los PV (no `Hero`/`Enemy` completos) para no acoplar el motor a
 * esos tipos por un campo que no usa.
 */
export function checkBattleOutcome(heroes: readonly Combatant[], enemies: readonly Combatant[]): BattleOutcome {
  if (!heroes.some((h) => h.pv.current > 0)) return "derrota";
  if (!enemies.some((e) => e.pv.current > 0)) return "victoria";
  return "en-curso";
}
