"use client";

// =========================================================================
// Laboratorio de COMBATE — /dev/combate
//
// Banco de pruebas del motor mínimo jugable de PLAN-COMBATE.md: 1 héroe
// (cualquiera de las 4 clases de HERO_ROSTER) contra 1-2 enemigos Normales
// (ENEMY_ROSTER), en la rejilla de batalla vacía de board/battle.md §2.
// Combate por fases de bando (board/battle.md §6): la iniciativa se tira una
// sola vez al abrir la batalla y decide quién abre la ronda 1 y el orden
// dentro de cada fase, pero nunca entrelaza turnos entre bandos. El héroe
// mueve/ataca a golpe de clic; al terminar su turno, la fase Enemiga resuelve
// SOLA a todos los enemigos vivos, uno tras otro (cada uno con el árbol de
// prioridades determinista de characters/enemies.md §5b.6,
// lib/rules/enemy-ai.ts), antes de devolver el turno al héroe. Sin co-op, sin
// obstáculos, sin mercenario ni Retirada — eso es la siguiente ronda.
//
// El kit inicial del héroe (arma + armadura) no viene de ningún catálogo de
// cartas todavía (eso es cards/weapons.md + un motor de equipo que no
// existe): HERO_WEAPON/HERO_ARMOR_BONUS son un espejo mínimo, a mano, de
// characters/heroes.md §2d, solo para que este laboratorio tenga algo con lo
// que atacar y una CA con la que defenderse.
// =========================================================================

import { useEffect, useMemo, useReducer, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import type { DamageType } from "@/lib/card-table";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord, HexKey } from "@/lib/rules/hex";
import {
  buildBattlefield,
  checkBattleOutcome,
  resolveAttack,
  resolveDisengage,
  rollInitiative,
  type AttackOutcome,
  type BattleOutcome,
  type InitiativeCombatant,
} from "@/lib/rules/combat";
import {
  computeAttackAdvantage,
  decideEnemyAction,
  type EnemyAction,
  type EnemyDecisionContext,
} from "@/lib/rules/enemy-ai";
import {
  ENEMY_CLASS_IDS,
  ENEMY_ROSTER,
  resistancesFor,
  type EnemyAbilityHook,
  type EnemyClassDef,
  type EnemyClassId,
} from "@/lib/rules/enemy-roster";
import { applyEffect, applyStartOfTurnDamage, attemptEndOfTurnSaves, hasEffect, type Effects } from "@/lib/rules/effects";
import { abilityMod, HERO_CLASS_IDS, HERO_ROSTER } from "@/lib/rules/hero-roster";
import { attackableTargets, MOVE_BASE, reachableHexes } from "@/lib/rules/movement";
import { abilityCheck } from "@/lib/rules/skill-check";
import * as Rng from "@/lib/rules/rng";
import type { Ability, AbilityScores, Board, CreatureNature, HeroClassId, Hex as HexCell } from "@/lib/rules/state";
import HexBoard, { type HeroMarker } from "@/components/game/board/HexBoard";
import CombatantDrawer, { type CombatantDrawerSubject } from "@/components/game/board/CombatantDrawer";
import { buttonClass } from "@/components/ui/Button";

const ABILITY_LABEL: Readonly<Record<Ability, string>> = {
  fuerza: "Fuerza",
  destreza: "Destreza",
  constitucion: "Constitución",
  inteligencia: "Inteligencia",
  sabiduria: "Sabiduría",
  carisma: "Carisma",
};

const NATURE_LABEL: Readonly<Record<CreatureNature, string>> = {
  humanoide: "Humanoide",
  bestia: "Bestia",
  gigante: "Gigante",
  "no-muerto": "No muerto",
  sombrio: "Sombrío",
};

/** Traduce un gancho de habilidad (enemy-roster.ts) a texto para el panel de ficha. */
function describeAbilityHook(hook: EnemyAbilityHook): string {
  switch (hook.kind) {
    case "cazador-de-manada":
      return "Cazador de manada: ataca con ventaja si otro de su misma clase está adyacente al objetivo.";
    case "escurridizo":
      return "Escurridizo: por debajo del 50 % de PV, huye en vez de atacar.";
    case "veneno":
      return `Veneno: al impactar, salvación de ${ABILITY_LABEL[hook.save.ability]} CD ${hook.save.cd} o el objetivo queda Envenenado.`;
    case "telarana":
      return `Telaraña (alcance ${hook.range}): sin daño, salvación de ${ABILITY_LABEL[hook.save.ability]} CD ${hook.save.cd} o el objetivo queda Inmovilizado.`;
  }
}

const ENEMY_COUNT_OPTIONS = [1, 2] as const;
const HERO_COL = 0;
const ENEMY_COL = 13;
const CENTER_ROW = 4;

/**
 * Pausa entre un enemigo y el siguiente dentro de la fase Enemiga (ver el
 * `useEffect` de encadenado en `CombatSession`). Mismo patrón que
 * `$deck-fall-hold` en styles/settings/_motion.scss: el número real vive
 * aquí, en TS, y tiene que sobrar tiempo sobre `$piece-move-duration` (0,48s)
 * para que el movimiento se vea entero antes de leer el siguiente golpe.
 */
const ENEMY_STEP_DELAY_MS = 800;

// --- Kit inicial del héroe (heroes.md §2d, espejo mínimo para este lab) ----

type HeroWeapon = {
  readonly label: string;
  readonly dice: { readonly count: number; readonly sides: number };
  readonly ability: Ability;
  readonly damageType: DamageType;
  /** 1 = cuerpo a cuerpo (adyacente); >1 = a distancia (board/battle.md §2). */
  readonly range: number;
};

const HERO_WEAPON: Readonly<Record<HeroClassId, HeroWeapon>> = {
  guerrero: { label: "Espada", dice: { count: 1, sides: 8 }, ability: "fuerza", damageType: "cortante", range: 1 },
  mago: { label: "Bastón de mago", dice: { count: 1, sides: 6 }, ability: "inteligencia", damageType: "contundente", range: 2 },
  picaro: { label: "Dagas", dice: { count: 1, sides: 4 }, ability: "destreza", damageType: "perforante", range: 1 },
  clerigo: { label: "Maza bendita", dice: { count: 1, sides: 6 }, ability: "sabiduria", damageType: "contundente", range: 1 },
};

/** Bonus de armadura (+ escudo si aplica) del kit inicial. CA = 10 + mod DES + esto. */
const HERO_ARMOR_BONUS: Readonly<Record<HeroClassId, number>> = {
  guerrero: 4, // Cuero tachonado +2 + Escudo +2
  mago: 1, // Acolchada +1
  picaro: 1, // Cuero +1
  clerigo: 4, // Cota de escamas +4
};

function heroCA(classId: HeroClassId): number {
  return 10 + abilityMod(HERO_ROSTER[classId].abilityScores.destreza) + HERO_ARMOR_BONUS[classId];
}

// --- Sesión de combate: tipos ------------------------------------------------

type Phase = "setup" | "battle" | "ended";

type HeroSession = {
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
  readonly movePointsLeft: number;
  readonly hasActed: boolean;
};

type EnemySession = {
  readonly id: string;
  readonly defId: EnemyClassId;
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
};

type CombatState = {
  readonly hero: HeroSession;
  readonly enemies: readonly EnemySession[];
  /** Orden fijo de los enemigos dentro de SU fase, decidido una sola vez en "roll-initiative" (board/battle.md §6). */
  readonly enemiesOrder: readonly string[];
  /** Qué fase de bando está en curso — nunca se entrelazan (board/battle.md §6). */
  readonly side: "hero" | "enemies";
  /** A quién le toca dentro de `enemiesOrder`, mientras `side === "enemies"`. */
  readonly activeEnemySlot: number;
  readonly phase: Phase;
  readonly outcome: BattleOutcome;
  readonly rng: Rng.Rng;
  readonly log: readonly string[];
};

type CombatAction =
  | { readonly type: "roll-initiative" }
  | { readonly type: "hero-move"; readonly to: HexCoord; readonly pointsLeft: number }
  | { readonly type: "hero-attack"; readonly targetId: string }
  | { readonly type: "end-hero-turn" }
  | { readonly type: "enemy-turn" };

function enemyRow(index: number, total: number): number {
  if (total === 1) return CENTER_ROW;
  return index === 0 ? CENTER_ROW - 1 : CENTER_ROW + 1;
}

function buildInitialState(heroClassId: HeroClassId, enemyClassIds: readonly EnemyClassId[]): CombatState {
  const heroDef = HERO_ROSTER[heroClassId];
  return {
    hero: {
      position: Hex.offsetToAxial({ col: HERO_COL, row: CENTER_ROW }),
      pv: { current: heroDef.pvMax, max: heroDef.pvMax },
      effects: [],
      movePointsLeft: MOVE_BASE,
      hasActed: false,
    },
    enemies: enemyClassIds.map((defId, i) => {
      const def = ENEMY_ROSTER[defId];
      return {
        id: `enemy-${i}`,
        defId,
        position: Hex.offsetToAxial({ col: ENEMY_COL, row: enemyRow(i, enemyClassIds.length) }),
        pv: { current: def.pvMax, max: def.pvMax },
        effects: [],
      };
    }),
    enemiesOrder: [],
    side: "hero",
    activeEnemySlot: 0,
    phase: "setup",
    outcome: "en-curso",
    rng: Rng.rngFromSeed(`combate:${heroClassId}:${enemyClassIds.join(",")}`),
    log: [],
  };
}

// --- Helpers puros de la sesión ---------------------------------------------

/** Primer enemigo vivo de `enemiesOrder`, para abrir la fase enemiga. -1 si no queda ninguno. */
function firstAliveEnemySlot(enemiesOrder: readonly string[], enemies: readonly EnemySession[]): number {
  return enemiesOrder.findIndex((id) => enemies.find((e) => e.id === id)!.pv.current > 0);
}

/** Siguiente enemigo vivo tras `from` dentro de la MISMA fase. -1 si ya no queda ninguno (la fase termina). */
function nextAliveEnemySlot(enemiesOrder: readonly string[], from: number, enemies: readonly EnemySession[]): number {
  for (let i = from + 1; i < enemiesOrder.length; i++) {
    if (enemies.find((e) => e.id === enemiesOrder[i])!.pv.current > 0) return i;
  }
  return -1;
}

function checkOutcomeAndLog(
  hero: HeroSession,
  enemies: readonly EnemySession[],
  log: readonly string[],
): { outcome: BattleOutcome; phase: Phase; log: readonly string[] } {
  const outcome = checkBattleOutcome([hero], enemies);
  const phase: Phase = outcome === "en-curso" ? "battle" : "ended";
  if (outcome === "victoria") return { outcome, phase, log: [...log, "¡Victoria!"] };
  if (outcome === "derrota") return { outcome, phase, log: [...log, "El héroe cae. Derrota."] };
  return { outcome, phase, log };
}

/** Abre la fase de Aliados: recarga el turno del héroe (board/battle.md §6). */
function enterHeroTurn(state: CombatState): CombatState {
  // Daño de Envenenado al EMPEZAR el turno; los estados en sí no cambian aquí
  // (effects.md §1) — Inmovilizado sigue activo, por eso gatea el movimiento
  // de ESTE turno. La salvación que puede retirarlos es de fin de turno (ver
  // "end-hero-turn"), no de aquí.
  const [poisonDamage, rng] = applyStartOfTurnDamage(state.rng, state.hero.effects);
  const log = poisonDamage > 0 ? [...state.log, `Héroe sufre ${poisonDamage} de daño por Envenenado.`] : state.log;
  const hero: HeroSession = {
    ...state.hero,
    pv: { ...state.hero.pv, current: Math.max(0, state.hero.pv.current - poisonDamage) },
    movePointsLeft: hasEffect(state.hero.effects, "inmovilizado") ? 0 : MOVE_BASE,
    hasActed: false,
  };
  const checked = checkOutcomeAndLog(hero, state.enemies, log);
  return { ...state, hero, rng, log: checked.log, side: "hero", phase: checked.phase, outcome: checked.outcome };
}

/** Entra al turno de un enemigo concreto dentro de la fase Enemiga en curso. */
function enterEnemyTurn(state: CombatState, slot: number): CombatState {
  const activeId = state.enemiesOrder[slot];
  const i = state.enemies.findIndex((e) => e.id === activeId);
  const enemy = state.enemies[i];
  const def = ENEMY_ROSTER[enemy.defId];
  const [poisonDamage, rng] = applyStartOfTurnDamage(state.rng, enemy.effects);
  const log = poisonDamage > 0 ? [...state.log, `${def.label} sufre ${poisonDamage} de daño por Envenenado.`] : state.log;
  const enemies = state.enemies.map((e, idx) =>
    idx === i ? { ...e, pv: { ...e.pv, current: Math.max(0, e.pv.current - poisonDamage) } } : e,
  );
  const checked = checkOutcomeAndLog(state.hero, enemies, log);
  return {
    ...state,
    enemies,
    rng,
    log: checked.log,
    side: "enemies",
    activeEnemySlot: slot,
    phase: checked.phase,
    outcome: checked.outcome,
  };
}

function farthestReachableHex(
  board: Board,
  from: HexCoord,
  speed: number,
  awayFrom: HexCoord,
  occupied: ReadonlySet<HexKey>,
): HexCoord {
  const reachable = reachableHexes(board, from, speed, true, occupied);
  let best = from;
  let bestDistance = Hex.distance(from, awayFrom);
  for (const key of reachable.keys()) {
    const coord = Hex.fromKey(key);
    const distance = Hex.distance(coord, awayFrom);
    if (distance > bestDistance) {
      bestDistance = distance;
      best = coord;
    }
  }
  return best;
}

function targetFailsSave(
  rng: Rng.Rng,
  targetAbilityScores: AbilityScores,
  save: { readonly ability: Ability; readonly cd: number },
): [boolean, Rng.Rng] {
  const mod = abilityMod(targetAbilityScores[save.ability]);
  const [check, nextRng] = abilityCheck(rng, mod, save.cd);
  return [!check.success, nextRng];
}

function describeAttack(
  attackerLabel: string,
  targetLabel: string,
  weaponLabel: string,
  outcome: AttackOutcome,
  damageType: DamageType,
): string {
  if (!outcome.hit) {
    return outcome.fumble
      ? `${attackerLabel} falla con ${weaponLabel} contra ${targetLabel} (pifia).`
      : `${attackerLabel} falla con ${weaponLabel} contra ${targetLabel} (tirada ${outcome.attackRoll}).`;
  }
  const crit = outcome.critical ? " ¡Crítico!" : "";
  return `${attackerLabel} golpea a ${targetLabel} con ${weaponLabel}: ${outcome.damage} de daño ${damageType}.${crit}`;
}

// --- El reductor: cierra sobre la clase de héroe y el tablero (estables durante la sesión) ---

function makeReducer(heroClassId: HeroClassId, board: Board) {
  const heroAbilityScores = HERO_ROSTER[heroClassId].abilityScores;
  const heroWeapon = HERO_WEAPON[heroClassId];
  const heroCombatCA = heroCA(heroClassId);

  function applyEnemyAction(
    action: EnemyAction,
    def: EnemyClassDef,
    hero: HeroSession,
    enemy: EnemySession,
    allies: EnemyDecisionContext["allies"],
    rng: Rng.Rng,
    log: readonly string[],
  ): { hero: HeroSession; enemy: EnemySession; rng: Rng.Rng; log: readonly string[] } {
    switch (action.kind) {
      case "flee": {
        const [result, nextRng] = resolveDisengage(rng, def.abilityScores, heroAbilityScores, heroWeapon.dice);
        const occupied = new Set<HexKey>([Hex.key(hero.position), ...allies.map((a) => Hex.key(a.position))]);
        const to = farthestReachableHex(board, enemy.position, def.speed, hero.position, occupied);
        const movedEnemy = { ...enemy, position: to };
        if (result.leaverWins) {
          return { hero, enemy: movedEnemy, rng: nextRng, log: [...log, `${def.label} se desengancha y se aleja.`] };
        }
        const hurtHero = { ...hero, pv: { ...hero.pv, current: Math.max(0, hero.pv.current - result.damageToLeaver) } };
        return {
          hero: hurtHero,
          enemy: movedEnemy,
          rng: nextRng,
          log: [...log, `${def.label} intenta huir: recibe ${result.damageToLeaver} de daño al escapar, pero se aleja igualmente.`],
        };
      }

      case "ability": {
        if (action.hook.kind !== "telarana") return { hero, enemy, rng, log };
        const [failed, nextRng] = targetFailsSave(rng, heroAbilityScores, action.hook.save);
        if (failed) {
          return {
            hero: { ...hero, effects: applyEffect(hero.effects, "inmovilizado") },
            enemy,
            rng: nextRng,
            log: [...log, `${def.label} atrapa al héroe en su Telaraña: queda Inmovilizado.`],
          };
        }
        return { hero, enemy, rng: nextRng, log: [...log, `${def.label} lanza Telaraña, pero el héroe la esquiva.`] };
      }

      case "attack": {
        const [outcome, afterAttack] = resolveAttack(rng, def.abilityScores, { ca: heroCombatCA }, def.attack, action.advantageState);
        let nextHero = hero;
        let rng2 = afterAttack;
        let log2 = [...log, describeAttack(def.label, "Héroe", def.attack.label, outcome, def.attack.damageType)];
        if (outcome.hit) {
          nextHero = { ...nextHero, pv: { ...nextHero.pv, current: Math.max(0, nextHero.pv.current - outcome.damage) } };
          const veneno = def.abilities.find((a): a is EnemyAbilityHook & { kind: "veneno" } => a.kind === "veneno");
          if (veneno) {
            const [failed, afterSave] = targetFailsSave(rng2, heroAbilityScores, veneno.save);
            rng2 = afterSave;
            if (failed) {
              nextHero = { ...nextHero, effects: applyEffect(nextHero.effects, "envenenado") };
              log2 = [...log2, "El héroe queda Envenenado."];
            }
          }
        }
        return { hero: nextHero, enemy, rng: rng2, log: log2 };
      }

      case "move": {
        const movedEnemy = { ...enemy, position: action.to };
        const distance = Hex.distance(action.to, hero.position);
        if (distance <= def.attack.range) {
          const advantageState = computeAttackAdvantage(def, { defId: movedEnemy.defId, position: movedEnemy.position }, hero.position, allies);
          return applyEnemyAction({ kind: "attack", targetId: "hero", advantageState }, def, hero, movedEnemy, allies, rng, log);
        }
        return { hero, enemy: movedEnemy, rng, log: [...log, `${def.label} se acerca.`] };
      }

      case "wait":
        return { hero, enemy, rng, log: [...log, `${def.label} no encuentra nada útil que hacer.`] };
    }
  }

  return function reducer(state: CombatState, action: CombatAction): CombatState {
    switch (action.type) {
      case "roll-initiative": {
        const combatants: InitiativeCombatant[] = [
          { id: "hero", abilityScores: heroAbilityScores, isHero: true },
          ...state.enemies.map((e) => ({ id: e.id, abilityScores: ENEMY_ROSTER[e.defId].abilityScores, isHero: false })),
        ];
        const [order, nextRng] = rollInitiative(state.rng, combatants);
        const enemiesOrder = order.filter((id) => id !== "hero");
        const labelled = order.map((id) =>
          id === "hero" ? HERO_ROSTER[heroClassId].label : ENEMY_ROSTER[state.enemies.find((e) => e.id === id)!.defId].label,
        );
        const withOrder: CombatState = {
          ...state,
          enemiesOrder,
          rng: nextRng,
          log: [...state.log, `Iniciativa: ${labelled.join(" → ")}`],
        };
        // Quién abre la ronda 1 (board/battle.md §6): el bando de la tirada más
        // alta — la fase enemiga, si le toca, resuelve TODOS sus enemigos de
        // corrido, no uno solo.
        return order[0] === "hero" ? enterHeroTurn(withOrder) : enterEnemyTurn(withOrder, 0);
      }

      case "hero-move": {
        if (state.phase !== "battle" || state.side !== "hero") return state;
        return { ...state, hero: { ...state.hero, position: action.to, movePointsLeft: action.pointsLeft } };
      }

      case "hero-attack": {
        if (state.phase !== "battle" || state.side !== "hero" || state.hero.hasActed) return state;
        const targetIndex = state.enemies.findIndex((e) => e.id === action.targetId);
        if (targetIndex === -1) return state;
        const target = state.enemies[targetIndex];
        const def = ENEMY_ROSTER[target.defId];
        const distance = Hex.distance(state.hero.position, target.position);
        const advantageState = distance === 1 && heroWeapon.range > 1 ? "desventaja" : "normal";
        const [outcome, nextRng] = resolveAttack(
          state.rng,
          heroAbilityScores,
          { ca: def.ca, ...resistancesFor(def.nature) },
          heroWeapon,
          advantageState,
        );
        const enemies = state.enemies.map((e, i) =>
          i === targetIndex ? { ...e, pv: { ...e.pv, current: Math.max(0, e.pv.current - outcome.damage) } } : e,
        );
        const log = [...state.log, describeAttack("Héroe", def.label, heroWeapon.label, outcome, heroWeapon.damageType)];
        const checked = checkOutcomeAndLog(state.hero, enemies, log);
        return {
          ...state,
          enemies,
          rng: nextRng,
          hero: { ...state.hero, hasActed: true },
          log: checked.log,
          phase: checked.phase,
          outcome: checked.outcome,
        };
      }

      case "end-hero-turn": {
        if (state.phase !== "battle" || state.side !== "hero") return state;
        // Salvación de FIN de turno (effects.md §1): el estado ya estuvo activo
        // todo el turno (gateando movimiento arriba); ahora se decide si sigue
        // para el turno siguiente.
        const [effects, nextRng] = attemptEndOfTurnSaves(state.rng, state.hero.effects, heroAbilityScores);
        const hero = { ...state.hero, effects };
        const advanced = { ...state, hero, rng: nextRng };
        // Fin de la fase de Aliados → abre la fase Enemiga entera (board/battle.md
        // §6); si por lo que sea ya no queda ningún enemigo vivo, se reabre la
        // fase de Aliados (la victoria ya se habría detectado antes de llegar aquí).
        const slot = firstAliveEnemySlot(advanced.enemiesOrder, advanced.enemies);
        return slot === -1 ? enterHeroTurn(advanced) : enterEnemyTurn(advanced, slot);
      }

      case "enemy-turn": {
        if (state.phase !== "battle" || state.side !== "enemies") return state;
        const activeId = state.enemiesOrder[state.activeEnemySlot];

        const index = state.enemies.findIndex((e) => e.id === activeId);
        const self = state.enemies[index];
        const def = ENEMY_ROSTER[self.defId];
        const allies = state.enemies
          .filter((e) => e.id !== activeId && e.pv.current > 0)
          .map((e) => ({ defId: e.defId, position: e.position }));

        const ctx: EnemyDecisionContext = {
          board,
          def,
          self: { id: self.id, defId: self.defId, position: self.position, pv: self.pv },
          target: { id: "hero", position: state.hero.position, effects: state.hero.effects },
          allies,
        };
        const decision = decideEnemyAction(ctx);
        const result = applyEnemyAction(decision, def, state.hero, self, allies, state.rng, state.log);

        // Salvación de fin de turno del propio enemigo (sin uso hoy —ningún
        // Normal recibe estados—, pero misma matemática en los dos bandos).
        const [selfEffects, afterSaves] = attemptEndOfTurnSaves(result.rng, result.enemy.effects, def.abilityScores);
        const resolvedEnemy = { ...result.enemy, effects: selfEffects };

        const enemies = state.enemies.map((e, i) => (i === index ? resolvedEnemy : e));
        const checked = checkOutcomeAndLog(result.hero, enemies, result.log);

        const next: CombatState = {
          ...state,
          hero: result.hero,
          enemies,
          rng: afterSaves,
          log: checked.log,
          phase: checked.phase,
          outcome: checked.outcome,
        };
        if (checked.outcome !== "en-curso") return next;
        // Siguiente enemigo vivo dentro de la MISMA fase — la fase enemiga
        // resuelve a todos de corrido; solo cuando ya no queda ninguno se
        // devuelve el turno al héroe (board/battle.md §6).
        const slot = nextAliveEnemySlot(next.enemiesOrder, next.activeEnemySlot, next.enemies);
        return slot === -1 ? enterHeroTurn(next) : enterEnemyTurn(next, slot);
      }

      default:
        return state;
    }
  };
}

// --- Componentes -------------------------------------------------------------

export default function CombatLab() {
  const [heroClassId, setHeroClassId] = useState<HeroClassId>(HERO_CLASS_IDS[0]);
  const [enemyClassIds, setEnemyClassIds] = useState<EnemyClassId[]>([ENEMY_CLASS_IDS[0]]);
  const [battleNonce, setBattleNonce] = useState(0);

  function setEnemyCount(n: number) {
    setEnemyClassIds((prev) => {
      if (n <= prev.length) return prev.slice(0, n);
      const grown = [...prev];
      while (grown.length < n) grown.push(ENEMY_CLASS_IDS[grown.length % ENEMY_CLASS_IDS.length]);
      return grown;
    });
  }

  function setEnemyClass(index: number, defId: EnemyClassId) {
    setEnemyClassIds((prev) => prev.map((id, i) => (i === index ? defId : id)));
  }

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Combate</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        1 héroe contra 1-2 enemigos Normales en una rejilla de batalla vacía (<code>docs/board/battle.md</code>{" "}
        §2). Iniciativa una sola vez al abrir la batalla (<code>game-design.md</code> §4b.2); luego el héroe
        mueve y ataca a golpe de clic, y el enemigo sigue el árbol de prioridades determinista de{" "}
        <code>characters/enemies.md</code> §5b.6.
      </p>

      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Héroe</span>
          <SelectButton
            value={heroClassId}
            onChange={(e) => e.value != null && setHeroClassId(e.value)}
            options={HERO_CLASS_IDS.map((id) => ({ label: HERO_ROSTER[id].label, id }))}
            optionLabel="label"
            optionValue="id"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1" title="El tope de solo: compositionBudget(1) da 2 (enemies.md §5b.6).">
          <span className={label}>Enemigos</span>
          <SelectButton
            value={enemyClassIds.length}
            onChange={(e) => e.value != null && setEnemyCount(e.value)}
            options={[...ENEMY_COUNT_OPTIONS]}
            allowEmpty={false}
          />
        </div>

        {enemyClassIds.map((defId, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className={label}>Enemigo {i + 1}</span>
            <SelectButton
              value={defId}
              onChange={(e) => e.value != null && setEnemyClass(i, e.value)}
              options={ENEMY_CLASS_IDS.map((id) => ({ label: ENEMY_ROSTER[id].label, id }))}
              optionLabel="label"
              optionValue="id"
              allowEmpty={false}
            />
          </div>
        ))}

        <button className={buttonClass({})} onClick={() => setBattleNonce((n) => n + 1)}>
          Nueva batalla
        </button>
      </div>

      <CombatSession
        key={`${heroClassId}:${enemyClassIds.join(",")}:${battleNonce}`}
        heroClassId={heroClassId}
        enemyClassIds={enemyClassIds}
      />
    </div>
  );
}

type SessionProps = {
  heroClassId: HeroClassId;
  enemyClassIds: readonly EnemyClassId[];
};

function CombatSession({ heroClassId, enemyClassIds }: SessionProps) {
  const board = useMemo(() => buildBattlefield(), []);
  const reducer = useMemo(() => makeReducer(heroClassId, board), [heroClassId, board]);
  const [state, dispatch] = useReducer(reducer, { heroClassId, enemyClassIds }, (init) =>
    buildInitialState(init.heroClassId, init.enemyClassIds),
  );
  const [selected, setSelected] = useState<HexCoord | null>(null);

  const isHeroTurn = state.phase === "battle" && state.side === "hero";
  const activeEnemy =
    state.phase === "battle" && state.side === "enemies"
      ? state.enemies.find((e) => e.id === state.enemiesOrder[state.activeEnemySlot])
      : undefined;

  // La fase Enemiga resuelve a TODOS sus enemigos de corrido, sin que el
  // jugador tenga que pulsar nada por cada uno (board/battle.md §6): en
  // cuanto le toca a un enemigo, se encadena solo tras una pausa breve — el
  // tiempo justo para que se vea su movimiento (transition de
  // styles/settings/_motion.scss `$piece-move-duration`) y se lea el log
  // antes de pasar al siguiente.
  useEffect(() => {
    if (state.phase !== "battle" || state.side !== "enemies") return;
    const timer = setTimeout(() => dispatch({ type: "enemy-turn" }), ENEMY_STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.side, state.activeEnemySlot, dispatch]);

  const heroWeapon = HERO_WEAPON[heroClassId];

  // Nunca comparten hexágono (board/battle.md §2): los enemigos vivos son
  // intransitables para el movimiento del héroe, tanto como destino como de
  // paso hacia otro más lejano.
  const livingEnemies = useMemo(() => state.enemies.filter((e) => e.pv.current > 0), [state.enemies]);
  const enemyOccupied = useMemo(() => new Set(livingEnemies.map((e) => Hex.key(e.position))), [livingEnemies]);

  const reachable = useMemo(
    () =>
      isHeroTurn ? reachableHexes(board, state.hero.position, state.hero.movePointsLeft, true, enemyOccupied) : new Map(),
    [isHeroTurn, board, state.hero.position, state.hero.movePointsLeft, enemyOccupied],
  );
  const reachableHighlight = useMemo(() => {
    const heroKey = Hex.key(state.hero.position);
    return new Set([...reachable.keys()].filter((k) => k !== heroKey));
  }, [reachable, state.hero.position]);

  // Qué enemigos ya podrías golpear ESTE turno (lib/rules/movement.ts
  // `attackableTargets`): de los vivos, cuáles quedan al alcance de tu arma
  // desde algún hexágono que todavía puedes alcanzar con el movimiento que
  // te queda —incluido quedarte donde estás—. Se marca la casilla del
  // ENEMIGO, no un destino: nunca comparten hexágono (board/battle.md §2),
  // así que el aviso es "a este ya llegas", no "muévete aquí".
  const threatened = useMemo(() => {
    if (!isHeroTurn) return new Set<HexKey>();
    return attackableTargets(reachable, heroWeapon.range, livingEnemies.map((e) => e.position));
  }, [isHeroTurn, reachable, heroWeapon.range, livingEnemies]);

  const heroMarkers: HeroMarker[] = [
    {
      id: "hero",
      position: state.hero.position,
      pieceId: "heroe-1",
      label: `Héroe — ${HERO_ROSTER[heroClassId].label} (${state.hero.pv.current}/${state.hero.pv.max} PV)`,
    },
    ...livingEnemies.map((e) => ({
      id: e.id,
      position: e.position,
      pieceId: "enemigo-activo" as const,
      label: `${ENEMY_ROSTER[e.defId].label} (${e.pv.current}/${ENEMY_ROSTER[e.defId].pvMax} PV)`,
    })),
  ];

  // Ficha a enseñar en el panel lateral: se deriva de `selected`, que ya es el
  // toggle de "esto es lo que estás mirando" (handleHexClick, rama final). Sin
  // estado nuevo: clicar la misma ficha lo cierra, clicar otra lo cambia.
  function buildDrawerSubject(): CombatantDrawerSubject | null {
    if (!selected) return null;
    if (Hex.equals(selected, state.hero.position)) {
      return {
        piece: { family: "pawn", id: "heroe-1" },
        title: HERO_ROSTER[heroClassId].label,
        abilityScores: HERO_ROSTER[heroClassId].abilityScores,
        pv: state.hero.pv,
        ca: heroCA(heroClassId),
        attack: heroWeapon,
        effects: state.hero.effects,
      };
    }
    const enemy = livingEnemies.find((e) => Hex.equals(selected, e.position));
    if (!enemy) return null;
    const def = ENEMY_ROSTER[enemy.defId];
    return {
      piece: { family: "pawn", id: "enemigo-activo" },
      title: def.label,
      subtitle: NATURE_LABEL[def.nature],
      abilityScores: def.abilityScores,
      pv: enemy.pv,
      ca: def.ca,
      speed: def.speed,
      attack: def.attack,
      abilityNotes: def.abilities.map(describeAbilityHook),
      effects: enemy.effects,
    };
  }
  const drawerSubject = buildDrawerSubject();

  function handleHexClick(hex: HexCell) {
    if (isHeroTurn) {
      const target = state.enemies.find((e) => e.pv.current > 0 && Hex.equals(e.position, hex.coord));
      if (target && !state.hero.hasActed) {
        const distance = Hex.distance(state.hero.position, hex.coord);
        if (distance <= heroWeapon.range) {
          dispatch({ type: "hero-attack", targetId: target.id });
          return;
        }
      }
      if (!Hex.equals(hex.coord, state.hero.position)) {
        const step = reachable.get(Hex.key(hex.coord));
        if (step) {
          dispatch({ type: "hero-move", to: hex.coord, pointsLeft: step.pointsLeft });
          return;
        }
      }
    }
    setSelected((prev) => (prev && Hex.equals(prev, hex.coord) ? null : hex.coord));
  }

  return (
    <>
      {state.phase === "setup" && (
        <div className="mb-4">
          <button className={buttonClass({ variant: "primary" })} onClick={() => dispatch({ type: "roll-initiative" })}>
            Tirar iniciativa
          </button>
        </div>
      )}

      {state.phase !== "setup" && (
        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
          <span>
            <b>Fase:</b>{" "}
            {isHeroTurn
              ? `Aliados — Héroe (${HERO_ROSTER[heroClassId].label})`
              : activeEnemy
                ? `Enemigos — ${ENEMY_ROSTER[activeEnemy.defId].label}`
                : "—"}
          </span>
          {isHeroTurn && (
            <>
              <span title="Se recarga a MOVE_BASE al empezar turno; 0 si Inmovilizado.">
                <b>Movimiento:</b> {state.hero.movePointsLeft}
              </span>
              <span>
                <b>Acción:</b> {state.hero.hasActed ? "usada" : "disponible"}
              </span>
              <button className={buttonClass({ variant: "primary" })} onClick={() => dispatch({ type: "end-hero-turn" })}>
                Terminar turno
              </button>
            </>
          )}
          {!isHeroTurn && state.phase === "battle" && (
            <span className="text-[var(--wiki-muted)]">La IA está actuando…</span>
          )}
        </div>
      )}

      {state.phase === "ended" && (
        <div className="mb-4 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-center text-lg font-bold text-[var(--wiki-text)]">
          {state.outcome === "victoria" ? "¡Victoria!" : "Derrota"}
        </div>
      )}

      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        En tu turno: clica una casilla resaltada para moverte, o a un enemigo dentro del alcance de tu{" "}
        <b>{heroWeapon.label}</b> ({heroWeapon.range === 1 ? "cuerpo a cuerpo" : `alcance ${heroWeapon.range}`}) para
        atacarlo — una vez por turno. Un enemigo marcado en rojo ya es alcanzable este turno: hay alguna casilla a tu
        alcance (en azul, o la tuya si no te mueves) desde la que tu arma llega hasta él. Cuando termines tu turno, la
        fase enemiga resuelve sola a todos los enemigos vivos, uno tras otro.
      </p>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]">
        <span className={isHeroTurn ? "font-semibold text-[var(--wiki-text)]" : undefined}>
          Héroe: {state.hero.pv.current}/{state.hero.pv.max} PV
          {hasEffect(state.hero.effects, "envenenado") && " · Envenenado"}
          {hasEffect(state.hero.effects, "inmovilizado") && " · Inmovilizado"}
        </span>
        {state.enemies.map((e) => (
          <span key={e.id} className={activeEnemy?.id === e.id ? "font-semibold text-[var(--wiki-text)]" : undefined}>
            {ENEMY_ROSTER[e.defId].label}: {e.pv.current}/{ENEMY_ROSTER[e.defId].pvMax} PV
            {hasEffect(e.effects, "envenenado") && " · Envenenado"}
          </span>
        ))}
      </div>

      <div className="board rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
        <HexBoard
          board={board}
          revealAll
          heroes={heroMarkers}
          selected={selected}
          reachable={reachableHighlight}
          threatened={threatened}
          onHexClick={handleHexClick}
        />
      </div>

      <CombatantDrawer subject={drawerSubject} onClose={() => setSelected(null)} />

      <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
        {state.log.length === 0 ? (
          <p className="text-[var(--wiki-muted)]">El registro de la batalla aparecerá aquí.</p>
        ) : (
          <ul className="grid gap-0.5">
            {state.log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
