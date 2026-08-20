"use client";

// =========================================================================
// Laboratorio de COMBATE — /dev/combate
//
// Banco de pruebas del motor mínimo jugable de PLAN-COMBATE.md: 1 héroe
// (cualquiera de las 4 clases de HERO_ROSTER) contra 1-2 enemigos Normales
// (ENEMY_ROSTER), en la rejilla de batalla vacía de board/battle.md §2.
// Combate por fases de bando (board/battle.md §6): la iniciativa se tira una
// sola vez al abrir la batalla y decide quién abre la ronda 1 y el orden
// dentro de cada fase, pero nunca entrelaza turnos entre bandos. La fase de
// Aliados resuelve una unidad tras otra —hoy el héroe y, si se ha invocado,
// su mercenario—; al terminar, la fase Enemiga resuelve SOLA a todos los
// enemigos vivos (cada uno con el árbol de prioridades determinista de
// characters/enemies.md §5b.6, lib/rules/enemy-ai.ts) antes de devolver el
// turno. Sin co-op, sin obstáculos y sin Retirada — eso sigue siendo la
// siguiente ronda.
//
// El kit inicial del héroe (arma + armadura) no viene de ningún catálogo de
// cartas todavía (eso es cards/weapons.md + un motor de equipo que no
// existe): HERO_WEAPON/HERO_ARMOR_BONUS son un espejo mínimo, a mano, de
// characters/heroes.md §2d, solo para que este laboratorio tenga algo con lo
// que atacar y una CA con la que defenderse.
//
// -------------------------------------------------------------------------
// LAS DOS COSAS QUE SE PRUEBAN AQUÍ, Y QUE SON INDEPENDIENTES
// -------------------------------------------------------------------------
// 1. **El mercenario como ficha** (cards/mercenaries.md §1b, board/battle.md
//    §5): una unidad aliada más, con su bloque por Rareza, su hueco en la
//    iniciativa y su turno propio. Es motor de reglas.
//
// 2. **La figura 3D sobre el tablero** (components/dev/battle-figure-scene.ts):
//    el mercenario se pinta como un personaje animado de pie sobre su
//    hexágono mientras el héroe y los enemigos siguen siendo el disco cenital
//    de board-map.md §4c. Es la comparación que decide una pregunta abierta —
//    si un personaje animado puede SER la ficha del tablero o tiene que vivir
//    en una pantalla aparte—, y por eso las dos cosas se ven a la vez en la
//    misma pantalla en vez de en dos laboratorios distintos.
//
// Que la figura sea justo el mercenario no es casual: es la única unidad que
// aparece a mitad de partida, así que su llegada es también la prueba de que
// una figura puede entrar, andar, pegar y caerse sin que el tablero se entere.
// =========================================================================

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import type { DamageType } from "@/lib/card-table";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord, HexKey } from "@/lib/rules/hex";
import {
  buildBattlefield,
  checkBattleOutcome,
  compositionBudget,
  resolveAttack,
  resolveDisengage,
  rollInitiative,
  type AttackOutcome,
  type BattleOutcome,
  type InitiativeCombatant,
  type Weapon,
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
import {
  blockFor,
  describeAttack as describeMercenaryAttack,
  MERCENARY_CARD_IDS,
  MERCENARY_CATALOG,
  MERCENARY_SAVES,
  type MercenaryCardId,
} from "@/lib/rules/mercenary-roster";
import { applyEffect, applyStartOfTurnDamage, attemptEndOfTurnSaves, hasEffect, type Effects } from "@/lib/rules/effects";
import { abilityMod, HERO_CLASS_IDS, HERO_ROSTER } from "@/lib/rules/hero-roster";
import { attackableTargets, MOVE_BASE, reachableHexes } from "@/lib/rules/movement";
import { abilityCheck } from "@/lib/rules/skill-check";
import * as Rng from "@/lib/rules/rng";
import type { Ability, AbilityScores, Board, CreatureNature, HeroClassId, Hex as HexCell } from "@/lib/rules/state";
import HexBoard, { type HeroMarker } from "@/components/game/board/HexBoard";
import CombatantDrawer, { type CombatantDrawerSubject } from "@/components/game/board/CombatantDrawer";
import { buttonClass } from "@/components/ui/Button";
import BattleFigure, { type FigureEvent } from "./BattleFigure";
import { CHARACTER_MODELS } from "./character-models";
import { DEFAULT_FIGURE_HEIGHT, FIGURE_POSES, type FigureInfo, type FigurePose } from "./battle-figure-scene";

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

/** Las dos unidades del bando aliado que este lab sabe manejar. */
type AllyId = "hero" | "mercenary";

type HeroSession = {
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
  readonly movePointsLeft: number;
  /** Acciones de ataque que le quedan este turno. El héroe tiene 1; un
   *  mercenario Épico o Legendario tiene 2 o 3 (columna Figuras de §1b). */
  readonly attacksLeft: number;
};

type MercenarySession = {
  readonly cardId: MercenaryCardId;
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
  readonly movePointsLeft: number;
  readonly attacksLeft: number;
};

type EnemySession = {
  readonly id: string;
  readonly defId: EnemyClassId;
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
};

/**
 * Héroe y mercenario vistos con la misma forma. Se deriva, no se guarda: el
 * estado sigue teniendo los dos por separado (tienen campos distintos y una
 * procedencia distinta), pero todo lo que el motor hace con una unidad aliada
 * —moverse, atacar, ser el objetivo de la IA— es idéntico, y duplicarlo sería
 * la vía rápida a que el mercenario y el héroe divergieran en alguna regla.
 */
type AllyUnit = {
  readonly id: AllyId;
  readonly label: string;
  readonly position: HexCoord;
  readonly pv: { readonly current: number; readonly max: number };
  readonly effects: Effects;
  readonly ca: number;
  /** `null` en el mercenario: su bloque es plano (mercenary-roster.ts). */
  readonly abilityScores: AbilityScores | null;
  /** Para las tiradas que el motor pide por característica y el bloque plano no cubre. */
  readonly saveScores: AbilityScores;
  readonly weapon: Weapon & { readonly label: string; readonly range: number };
  readonly speed: number;
  readonly movePointsLeft: number;
  readonly attacksLeft: number;
};

/** Pose que la figura 3D tiene que reproducir, con el sitio al que mirar. */
type FigureCue = { readonly pose: FigurePose; readonly facing: HexCoord | null };

type CombatState = {
  readonly hero: HeroSession;
  /** `null` hasta que se juega la carta que lo invoca (§1). */
  readonly mercenary: MercenarySession | null;
  readonly enemies: readonly EnemySession[];
  /** Orden fijo de los enemigos dentro de SU fase, decidido una sola vez en "roll-initiative" (board/battle.md §6). */
  readonly enemiesOrder: readonly string[];
  /** Lo mismo para el bando aliado. El mercenario se inserta al invocarse. */
  readonly allyOrder: readonly AllyId[];
  /** Lo que sacó el héroe: hace falta para colocar al mercenario en `allyOrder`. */
  readonly heroInitiative: number;
  /** Qué fase de bando está en curso — nunca se entrelazan (board/battle.md §6). */
  readonly side: "allies" | "enemies";
  /** Quién actúa dentro de su fase. */
  readonly activeAlly: AllyId;
  readonly activeEnemySlot: number;
  readonly phase: Phase;
  readonly outcome: BattleOutcome;
  readonly rng: Rng.Rng;
  readonly log: readonly string[];
  /**
   * Última pose pedida a la figura 3D, con un contador que sube en cada
   * evento. El contador no es decorativo: dos ataques seguidos son dos veces
   * la misma pose, y sin él React no vería ningún cambio y la segunda
   * animación no se reproduciría.
   */
  readonly figureCue: FigureCue | null;
  readonly figureCueCount: number;
};

type CombatAction =
  | { readonly type: "roll-initiative" }
  | { readonly type: "ally-move"; readonly to: HexCoord; readonly pointsLeft: number }
  | { readonly type: "ally-attack"; readonly targetId: string }
  | { readonly type: "summon-mercenary"; readonly cardId: MercenaryCardId }
  | { readonly type: "end-ally-turn" }
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
      attacksLeft: 1,
    },
    mercenary: null,
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
    allyOrder: ["hero"],
    heroInitiative: 0,
    side: "allies",
    activeAlly: "hero",
    activeEnemySlot: 0,
    phase: "setup",
    outcome: "en-curso",
    rng: Rng.rngFromSeed(`combate:${heroClassId}:${enemyClassIds.join(",")}`),
    log: [],
    figureCue: null,
    figureCueCount: 0,
  };
}

// --- Vista uniforme del bando aliado ----------------------------------------

/** El mercenario tal como lo ve el motor: bloque plano por Rareza (§1b). */
function mercenaryUnit(mercenary: MercenarySession): AllyUnit {
  const card = MERCENARY_CATALOG[mercenary.cardId];
  const block = blockFor(mercenary.cardId);
  return {
    id: "mercenary",
    label: card.label,
    position: mercenary.position,
    pv: mercenary.pv,
    effects: mercenary.effects,
    ca: block.ca,
    abilityScores: null,
    saveScores: MERCENARY_SAVES,
    weapon: {
      // El catálogo de §3 no le pone nombre al arma —la fila es la compañía,
      // no la espada—, así que se nombra por familia: usar el nombre de la
      // carta dejaba en el registro "golpea con Mercenarios de las Llanuras".
      label: card.family === "distancia" ? "disparo" : "ataque cuerpo a cuerpo",
      dice: block.damageDice,
      damageType: card.damageType,
      range: card.range,
      flat: { attack: block.attackBonus, damage: block.damageBonus },
    },
    speed: block.speed,
    movePointsLeft: mercenary.movePointsLeft,
    attacksLeft: mercenary.attacksLeft,
  };
}

function heroUnit(hero: HeroSession, heroClassId: HeroClassId): AllyUnit {
  const def = HERO_ROSTER[heroClassId];
  return {
    id: "hero",
    label: def.label,
    position: hero.position,
    pv: hero.pv,
    effects: hero.effects,
    ca: heroCA(heroClassId),
    abilityScores: def.abilityScores,
    saveScores: def.abilityScores,
    weapon: HERO_WEAPON[heroClassId],
    speed: MOVE_BASE,
    movePointsLeft: hero.movePointsLeft,
    attacksLeft: hero.attacksLeft,
  };
}

function allyUnit(state: CombatState, id: AllyId, heroClassId: HeroClassId): AllyUnit | null {
  if (id === "hero") return heroUnit(state.hero, heroClassId);
  return state.mercenary ? mercenaryUnit(state.mercenary) : null;
}

/** Los aliados en pie, en el orden de la fase. */
function livingAllies(state: CombatState, heroClassId: HeroClassId): AllyUnit[] {
  return state.allyOrder
    .map((id) => allyUnit(state, id, heroClassId))
    .filter((unit): unit is AllyUnit => unit !== null && unit.pv.current > 0);
}

/** Lo que puede cambiar de una unidad aliada durante un turno. */
type AllyPatch = {
  readonly position?: HexCoord;
  readonly pvCurrent?: number;
  readonly effects?: Effects;
  readonly movePointsLeft?: number;
  readonly attacksLeft?: number;
};

function patchAlly(state: CombatState, id: AllyId, patch: AllyPatch): CombatState {
  if (id === "hero") {
    const hero = state.hero;
    return {
      ...state,
      hero: {
        ...hero,
        position: patch.position ?? hero.position,
        pv: patch.pvCurrent !== undefined ? { ...hero.pv, current: patch.pvCurrent } : hero.pv,
        effects: patch.effects ?? hero.effects,
        movePointsLeft: patch.movePointsLeft ?? hero.movePointsLeft,
        attacksLeft: patch.attacksLeft ?? hero.attacksLeft,
      },
    };
  }
  if (!state.mercenary) return state;
  const merc = state.mercenary;
  return {
    ...state,
    mercenary: {
      ...merc,
      position: patch.position ?? merc.position,
      pv: patch.pvCurrent !== undefined ? { ...merc.pv, current: patch.pvCurrent } : merc.pv,
      effects: patch.effects ?? merc.effects,
      movePointsLeft: patch.movePointsLeft ?? merc.movePointsLeft,
      attacksLeft: patch.attacksLeft ?? merc.attacksLeft,
    },
  };
}

/** Apunta una pose para la figura 3D. Solo el mercenario tiene figura hoy. */
function cueFigure(state: CombatState, pose: FigurePose, facing: HexCoord | null = null): CombatState {
  return { ...state, figureCue: { pose, facing }, figureCueCount: state.figureCueCount + 1 };
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

/** Siguiente aliado vivo tras `from` dentro de la fase de Aliados; `null` si la fase termina. */
function nextAliveAlly(state: CombatState, from: AllyId, heroClassId: HeroClassId): AllyId | null {
  const start = state.allyOrder.indexOf(from);
  for (let i = start + 1; i < state.allyOrder.length; i++) {
    const unit = allyUnit(state, state.allyOrder[i], heroClassId);
    if (unit && unit.pv.current > 0) return unit.id;
  }
  return null;
}

function firstAliveAlly(state: CombatState, heroClassId: HeroClassId): AllyId | null {
  for (const id of state.allyOrder) {
    const unit = allyUnit(state, id, heroClassId);
    if (unit && unit.pv.current > 0) return unit.id;
  }
  return null;
}

function checkOutcomeAndLog(
  hero: HeroSession,
  enemies: readonly EnemySession[],
  log: readonly string[],
): { outcome: BattleOutcome; phase: Phase; log: readonly string[] } {
  // Derrota sigue siendo "el HÉROE cae" (board/battle.md §9): un mercenario a
  // 0 PV es una ficha que se retira y nada más — la carta ya volvió al Mazo al
  // invocar (mercenaries.md §1b, "Muerte").
  const outcome = checkBattleOutcome([hero], enemies);
  const phase: Phase = outcome === "en-curso" ? "battle" : "ended";
  if (outcome === "victoria") return { outcome, phase, log: [...log, "¡Victoria!"] };
  if (outcome === "derrota") return { outcome, phase, log: [...log, "El héroe cae. Derrota."] };
  return { outcome, phase, log };
}

/**
 * Abre el turno de una unidad aliada: daño de Envenenado al EMPEZAR y recarga
 * de movimiento y ataques (board/battle.md §6). Los estados en sí no cambian
 * aquí (effects.md §1) — Inmovilizado sigue activo, por eso gatea el
 * movimiento de ESTE turno; la salvación que puede retirarlo es de fin de
 * turno.
 */
function enterAllyTurn(state: CombatState, id: AllyId, heroClassId: HeroClassId): CombatState {
  const unit = allyUnit(state, id, heroClassId);
  if (!unit) return state;

  const [poisonDamage, rng] = applyStartOfTurnDamage(state.rng, unit.effects);
  const log =
    poisonDamage > 0 ? [...state.log, `${unit.label} sufre ${poisonDamage} de daño por Envenenado.`] : state.log;

  const attacksLeft = id === "mercenary" && state.mercenary ? blockFor(state.mercenary.cardId).figures : 1;
  const patched = patchAlly({ ...state, rng, log }, id, {
    pvCurrent: Math.max(0, unit.pv.current - poisonDamage),
    movePointsLeft: hasEffect(unit.effects, "inmovilizado") ? 0 : unit.speed,
    attacksLeft,
  });

  const checked = checkOutcomeAndLog(patched.hero, patched.enemies, patched.log);
  return {
    ...patched,
    log: checked.log,
    side: "allies",
    activeAlly: id,
    phase: checked.phase,
    outcome: checked.outcome,
  };
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

/**
 * Dónde aparece el mercenario al invocarse. board/battle.md §5 dice "en la
 * columna/fila del jugador que lo invocó"; sin fase de colocación manual, el
 * hexágono libre más cercano al héroe es la lectura literal de eso. Se busca
 * por anillos crecientes para que salga pegado a quien lo paga y no detrás de
 * las líneas enemigas.
 */
function deployHex(board: Board, from: HexCoord, blocked: ReadonlySet<HexKey>): HexCoord | null {
  for (let radius = 1; radius <= 4; radius++) {
    for (const coord of Hex.withinRadius(from, radius)) {
      if (Hex.distance(coord, from) !== radius) continue;
      const key = Hex.key(coord);
      if (!board.hexes.has(key) || blocked.has(key)) continue;
      return coord;
    }
  }
  return null;
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
  /**
   * A quién ataca un enemigo. `enemy-ai.ts` decide con UN objetivo, y su
   * propio comentario ya dice cuál sería en co-op: "la más cercana" (§5b.6).
   * Empate → el héroe, que es la amenaza que de verdad cierra la batalla.
   */
  function pickEnemyTarget(state: CombatState, from: HexCoord): AllyUnit | null {
    const candidates = livingAllies(state, heroClassId);
    if (candidates.length === 0) return null;
    return candidates.reduce((best, unit) => {
      const d = Hex.distance(from, unit.position);
      const bestD = Hex.distance(from, best.position);
      if (d !== bestD) return d < bestD ? unit : best;
      return best.id === "hero" ? best : unit;
    });
  }

  /** El resultado de la acción de un enemigo sobre su objetivo aliado. */
  type EnemyActionResult = {
    readonly targetPv: number;
    readonly targetEffects: Effects;
    readonly enemy: EnemySession;
    readonly rng: Rng.Rng;
    readonly log: readonly string[];
    /** El objetivo ha encajado un golpe: la figura 3D tiene que acusarlo. */
    readonly struck: boolean;
  };

  function applyEnemyAction(
    action: EnemyAction,
    def: EnemyClassDef,
    target: AllyUnit,
    enemy: EnemySession,
    allies: EnemyDecisionContext["allies"],
    blocked: ReadonlySet<HexKey>,
    rng: Rng.Rng,
    log: readonly string[],
  ): EnemyActionResult {
    const unchanged = {
      targetPv: target.pv.current,
      targetEffects: target.effects,
      enemy,
      struck: false,
    };

    switch (action.kind) {
      case "flee": {
        const [result, nextRng] = resolveDisengage(rng, def.abilityScores, target.saveScores, target.weapon.dice);
        const to = farthestReachableHex(board, enemy.position, def.speed, target.position, blocked);
        const movedEnemy = { ...enemy, position: to };
        if (result.leaverWins) {
          return { ...unchanged, enemy: movedEnemy, rng: nextRng, log: [...log, `${def.label} se desengancha y se aleja.`] };
        }
        return {
          ...unchanged,
          targetPv: Math.max(0, target.pv.current - result.damageToLeaver),
          enemy: movedEnemy,
          rng: nextRng,
          struck: result.damageToLeaver > 0,
          log: [
            ...log,
            `${def.label} intenta huir: ${target.label} recibe ${result.damageToLeaver} de daño al escapar, pero se aleja igualmente.`,
          ],
        };
      }

      case "ability": {
        if (action.hook.kind !== "telarana") return { ...unchanged, rng, log };
        const [failed, nextRng] = targetFailsSave(rng, target.saveScores, action.hook.save);
        if (failed) {
          return {
            ...unchanged,
            targetEffects: applyEffect(target.effects, "inmovilizado"),
            rng: nextRng,
            log: [...log, `${def.label} atrapa a ${target.label} en su Telaraña: queda Inmovilizado.`],
          };
        }
        return { ...unchanged, rng: nextRng, log: [...log, `${def.label} lanza Telaraña, pero ${target.label} la esquiva.`] };
      }

      case "attack": {
        const [outcome, afterAttack] = resolveAttack(rng, def.abilityScores, { ca: target.ca }, def.attack, action.advantageState);
        let pv = target.pv.current;
        let effects = target.effects;
        let rng2 = afterAttack;
        let log2 = [...log, describeAttack(def.label, target.label, def.attack.label, outcome, def.attack.damageType)];
        if (outcome.hit) {
          pv = Math.max(0, pv - outcome.damage);
          const veneno = def.abilities.find((a): a is EnemyAbilityHook & { kind: "veneno" } => a.kind === "veneno");
          if (veneno) {
            const [failed, afterSave] = targetFailsSave(rng2, target.saveScores, veneno.save);
            rng2 = afterSave;
            if (failed) {
              effects = applyEffect(effects, "envenenado");
              log2 = [...log2, `${target.label} queda Envenenado.`];
            }
          }
        }
        return { targetPv: pv, targetEffects: effects, enemy, rng: rng2, log: log2, struck: outcome.hit };
      }

      case "move": {
        const movedEnemy = { ...enemy, position: action.to };
        const distance = Hex.distance(action.to, target.position);
        if (distance <= def.attack.range) {
          const advantageState = computeAttackAdvantage(
            def,
            { defId: movedEnemy.defId, position: movedEnemy.position },
            target.position,
            allies,
          );
          return applyEnemyAction(
            { kind: "attack", targetId: target.id, advantageState },
            def,
            target,
            movedEnemy,
            allies,
            blocked,
            rng,
            log,
          );
        }
        return { ...unchanged, enemy: movedEnemy, rng, log: [...log, `${def.label} se acerca.`] };
      }

      case "wait":
        return { ...unchanged, rng, log: [...log, `${def.label} no encuentra nada útil que hacer.`] };
    }
  }

  return function reducer(state: CombatState, action: CombatAction): CombatState {
    switch (action.type) {
      case "roll-initiative": {
        const combatants: InitiativeCombatant[] = [
          { id: "hero", abilityScores: HERO_ROSTER[heroClassId].abilityScores, isHero: true },
          ...state.enemies.map((e) => ({ id: e.id, abilityScores: ENEMY_ROSTER[e.defId].abilityScores, isHero: false })),
        ];
        const [order, nextRng] = rollInitiative(state.rng, combatants);
        const enemiesOrder = order.map((e) => e.id).filter((id) => id !== "hero");
        const labelled = order.map((entry) =>
          entry.id === "hero"
            ? HERO_ROSTER[heroClassId].label
            : ENEMY_ROSTER[state.enemies.find((e) => e.id === entry.id)!.defId].label,
        );
        const withOrder: CombatState = {
          ...state,
          enemiesOrder,
          allyOrder: ["hero"],
          heroInitiative: order.find((e) => e.id === "hero")!.total,
          rng: nextRng,
          log: [...state.log, `Iniciativa: ${labelled.join(" → ")}`],
        };
        // Quién abre la ronda 1 (board/battle.md §6): el bando de la tirada más
        // alta — la fase enemiga, si le toca, resuelve TODOS sus enemigos de
        // corrido, no uno solo.
        return order[0].id === "hero"
          ? enterAllyTurn(withOrder, "hero", heroClassId)
          : enterEnemyTurn(withOrder, 0);
      }

      case "ally-move": {
        if (state.phase !== "battle" || state.side !== "allies") return state;
        return patchAlly(state, state.activeAlly, { position: action.to, movePointsLeft: action.pointsLeft });
      }

      case "ally-attack": {
        if (state.phase !== "battle" || state.side !== "allies") return state;
        const attacker = allyUnit(state, state.activeAlly, heroClassId);
        if (!attacker || attacker.attacksLeft <= 0) return state;

        const targetIndex = state.enemies.findIndex((e) => e.id === action.targetId);
        if (targetIndex === -1) return state;
        const target = state.enemies[targetIndex];
        const def = ENEMY_ROSTER[target.defId];
        const distance = Hex.distance(attacker.position, target.position);
        // A bocajarro: un arma a distancia contra un adyacente tira con
        // Desventaja (board/battle.md §2). Vale igual para el mercenario
        // Arquero que para el Bastón del Mago.
        const advantageState = distance === 1 && attacker.weapon.range > 1 ? "desventaja" : "normal";
        const [outcome, nextRng] = resolveAttack(
          state.rng,
          attacker.abilityScores,
          { ca: def.ca, ...resistancesFor(def.nature) },
          attacker.weapon,
          advantageState,
        );
        const enemies = state.enemies.map((e, i) =>
          i === targetIndex ? { ...e, pv: { ...e.pv, current: Math.max(0, e.pv.current - outcome.damage) } } : e,
        );
        const log = [
          ...state.log,
          describeAttack(attacker.label, def.label, attacker.weapon.label, outcome, attacker.weapon.damageType),
        ];
        const checked = checkOutcomeAndLog(state.hero, enemies, log);
        const attacked = patchAlly(
          { ...state, enemies, rng: nextRng, log: checked.log, phase: checked.phase, outcome: checked.outcome },
          attacker.id,
          { attacksLeft: attacker.attacksLeft - 1 },
        );
        return attacker.id === "mercenary" ? cueFigure(attacked, "attack", target.position) : attacked;
      }

      case "summon-mercenary": {
        if (state.phase !== "battle" || state.side !== "allies" || state.activeAlly !== "hero") return state;
        // Jugar la carta gasta la ACCIÓN principal del turno (mercenaries.md
        // §1), la misma que se gastaría atacando: por eso mira `attacksLeft`.
        if (state.mercenary || state.hero.attacksLeft <= 0) return state;

        const blocked = new Set<HexKey>([
          Hex.key(state.hero.position),
          ...state.enemies.filter((e) => e.pv.current > 0).map((e) => Hex.key(e.position)),
        ]);
        const position = deployHex(board, state.hero.position, blocked);
        if (!position) return state;

        const card = MERCENARY_CATALOG[action.cardId];
        const block = blockFor(action.cardId);

        // Tira iniciativa al aparecer, como los refuerzos (§6). El bono sale
        // de la columna "Ini" de §1b y no del "Nivel de su carta" que cita
        // §6: no hay sistema de Niveles de carta en el código, y la columna
        // Ini es lo que la propia tabla del bloque da para esto.
        const [roll, nextRng] = Rng.d20(state.rng);
        const initiative = roll + block.initiativeBonus;
        // Entra a mitad de la fase de Aliados, así que en ESTA ronda actúa
        // detrás del héroe (que ya está actuando) pase lo que pase; su tirada
        // decide el orden de las rondas siguientes. Es la misma regla que §6
        // da a los refuerzos: "se insertan en ese orden desde la fase
        // siguiente".
        const allyOrder: readonly AllyId[] =
          initiative > state.heroInitiative ? ["mercenary", "hero"] : ["hero", "mercenary"];

        const mercenary: MercenarySession = {
          cardId: action.cardId,
          position,
          pv: { current: block.pvMax, max: block.pvMax },
          effects: [],
          movePointsLeft: 0, // este turno ya no le toca: entra detrás del héroe
          attacksLeft: 0,
        };

        const summoned: CombatState = {
          ...state,
          mercenary,
          allyOrder,
          rng: nextRng,
          hero: { ...state.hero, attacksLeft: state.hero.attacksLeft - 1 },
          log: [
            ...state.log,
            `Se invoca a ${card.label} (${card.rarity.replace("-", " ")}): ${block.pvMax} PV, CA ${block.ca}, ${describeMercenaryAttack(block)}${block.figures > 1 ? `, ${block.figures} ataques/turno` : ""}.`,
            `Iniciativa del mercenario: ${initiative} (1d20 ${roll} + ${block.initiativeBonus}) — actúa ${initiative > state.heroInitiative ? "antes" : "después"} que el héroe a partir de la ronda siguiente.`,
            `El bando enemigo sube a presupuesto ${compositionBudget(1, 1)} (enemies.md §5b.6): en una partida de verdad esto traería refuerzos, que este laboratorio todavía no genera.`,
          ],
        };
        return cueFigure(summoned, "idle");
      }

      case "end-ally-turn": {
        if (state.phase !== "battle" || state.side !== "allies") return state;
        const unit = allyUnit(state, state.activeAlly, heroClassId);
        if (!unit) return state;
        // Salvación de FIN de turno (effects.md §1): el estado ya estuvo activo
        // todo el turno (gateando movimiento arriba); ahora se decide si sigue
        // para el turno siguiente.
        const [effects, nextRng] = attemptEndOfTurnSaves(state.rng, unit.effects, unit.saveScores);
        const advanced = patchAlly({ ...state, rng: nextRng }, unit.id, { effects });

        // ¿Queda algún aliado por actuar en esta fase? Si no, se abre la fase
        // Enemiga entera (board/battle.md §6).
        const nextAlly = nextAliveAlly(advanced, unit.id, heroClassId);
        if (nextAlly) return enterAllyTurn(advanced, nextAlly, heroClassId);

        const slot = firstAliveEnemySlot(advanced.enemiesOrder, advanced.enemies);
        if (slot !== -1) return enterEnemyTurn(advanced, slot);
        const reopened = firstAliveAlly(advanced, heroClassId);
        return reopened ? enterAllyTurn(advanced, reopened, heroClassId) : advanced;
      }

      case "enemy-turn": {
        if (state.phase !== "battle" || state.side !== "enemies") return state;
        const activeId = state.enemiesOrder[state.activeEnemySlot];

        const index = state.enemies.findIndex((e) => e.id === activeId);
        const self = state.enemies[index];
        const def = ENEMY_ROSTER[self.defId];
        const enemyAllies = state.enemies
          .filter((e) => e.id !== activeId && e.pv.current > 0)
          .map((e) => ({ defId: e.defId, position: e.position }));

        const target = pickEnemyTarget(state, self.position);
        if (!target) return state;

        // Nadie comparte hexágono (board/battle.md §2): para el enemigo son
        // intransitables tanto sus compañeros como las DOS fichas aliadas.
        const blocked = new Set<HexKey>([
          ...livingAllies(state, heroClassId).map((a) => Hex.key(a.position)),
          ...enemyAllies.map((a) => Hex.key(a.position)),
        ]);

        const ctx: EnemyDecisionContext = {
          board,
          def,
          self: { id: self.id, defId: self.defId, position: self.position, pv: self.pv },
          target: { id: target.id, position: target.position, effects: target.effects },
          allies: enemyAllies,
        };
        const decision = decideEnemyAction(ctx);
        const result = applyEnemyAction(decision, def, target, self, enemyAllies, blocked, state.rng, state.log);

        // Salvación de fin de turno del propio enemigo (sin uso hoy —ningún
        // Normal recibe estados—, pero misma matemática en los dos bandos).
        const [selfEffects, afterSaves] = attemptEndOfTurnSaves(result.rng, result.enemy.effects, def.abilityScores);
        const resolvedEnemy = { ...result.enemy, effects: selfEffects };
        const enemies = state.enemies.map((e, i) => (i === index ? resolvedEnemy : e));

        const withTarget = patchAlly(
          { ...state, enemies, rng: afterSaves, log: result.log },
          target.id,
          { pvCurrent: result.targetPv, effects: result.targetEffects },
        );

        const mercenaryFell =
          target.id === "mercenary" && target.pv.current > 0 && result.targetPv === 0;
        const withCue = mercenaryFell
          ? cueFigure({ ...withTarget, log: [...withTarget.log, `${target.label} cae.`] }, "die")
          : target.id === "mercenary" && result.struck
            ? cueFigure(withTarget, "hit")
            : withTarget;

        const checked = checkOutcomeAndLog(withCue.hero, withCue.enemies, withCue.log);
        const next: CombatState = {
          ...withCue,
          log: checked.log,
          phase: checked.phase,
          outcome: checked.outcome,
        };
        if (checked.outcome !== "en-curso") return next;
        // Siguiente enemigo vivo dentro de la MISMA fase — la fase enemiga
        // resuelve a todos de corrido; solo cuando ya no queda ninguno se
        // devuelve el turno al bando aliado (board/battle.md §6).
        const slot = nextAliveEnemySlot(next.enemiesOrder, next.activeEnemySlot, next.enemies);
        if (slot !== -1) return enterEnemyTurn(next, slot);
        const opener = firstAliveAlly(next, heroClassId);
        return opener ? enterAllyTurn(next, opener, heroClassId) : next;
      }

      default:
        return state;
    }
  };
}

// --- Componentes -------------------------------------------------------------

/** Etiquetas de las poses en el informe de cobertura del .glb. */
const POSE_LABEL: Readonly<Record<FigurePose, string>> = {
  idle: "Reposo",
  walk: "Andar",
  attack: "Atacar",
  hit: "Encajar",
  die: "Caer",
};

export default function CombatLab() {
  const [heroClassId, setHeroClassId] = useState<HeroClassId>(HERO_CLASS_IDS[0]);
  const [enemyClassIds, setEnemyClassIds] = useState<EnemyClassId[]>([ENEMY_CLASS_IDS[0]]);
  const [battleNonce, setBattleNonce] = useState(0);
  const [mercenaryCardId, setMercenaryCardId] = useState<MercenaryCardId>(MERCENARY_CARD_IDS[0]);

  // --- Mandos de la figura 3D ---
  const [figureOn, setFigureOn] = useState(true);
  const [showDisc, setShowDisc] = useState(true);
  const [figureModelId, setFigureModelId] = useState(CHARACTER_MODELS[0].id);
  const [figureHeight, setFigureHeight] = useState(DEFAULT_FIGURE_HEIGHT * 100);
  const [figureInfo, setFigureInfo] = useState<FigureInfo | null>(null);
  const [figureError, setFigureError] = useState<string | null>(null);

  const figureModel = CHARACTER_MODELS.find((m) => m.id === figureModelId) ?? CHARACTER_MODELS[0];

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
        <code>characters/enemies.md</code> §5b.6. Con la Acción del héroe se puede{" "}
        <b>invocar un mercenario</b> (<code>cards/mercenaries.md</code> §1b): una ficha aliada más, con su
        bloque por Rareza y su turno propio, que se pinta como <b>personaje 3D animado</b> mientras el resto
        siguen siendo discos — la comparación que decide si el personaje animado puede ser la ficha del
        tablero.
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

      {/* Mandos de la figura. Separados de los del combate a propósito: no
          deciden nada de la partida, solo cómo se ve el mercenario. */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Mercenario</span>
          <Dropdown
            value={mercenaryCardId}
            onChange={(e) => e.value != null && setMercenaryCardId(e.value)}
            options={MERCENARY_CARD_IDS.map((id) => ({
              label: `${MERCENARY_CATALOG[id].label} · ${MERCENARY_CATALOG[id].rarity.replace("-", " ")}`,
              id,
            }))}
            optionLabel="label"
            optionValue="id"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Figura</span>
          <SelectButton
            value={figureModelId}
            onChange={(e) => e.value != null && setFigureModelId(e.value)}
            options={CHARACTER_MODELS.map((m) => ({ label: m.label, id: m.id }))}
            optionLabel="label"
            optionValue="id"
            allowEmpty={false}
          />
        </div>

        <div className="flex w-56 flex-col gap-1">
          <span className={label}>Altura · {(figureHeight / 100).toFixed(2)} radios de hex</span>
          <Slider
            value={figureHeight}
            min={80}
            max={400}
            onChange={(e: SliderChangeEvent) => typeof e.value === "number" && setFigureHeight(e.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--wiki-text)]">
          <InputSwitch checked={figureOn} onChange={(e) => setFigureOn(Boolean(e.value))} />
          Figura 3D
        </label>

        <label
          className="flex items-center gap-2 text-sm text-[var(--wiki-text)]"
          title="El disco cenital de board-map.md §4c debajo de la figura: sirve para comprobar que se posa en su hexágono, y para comparar los dos lenguajes."
        >
          <InputSwitch checked={showDisc} onChange={(e) => setShowDisc(Boolean(e.value))} />
          Disco debajo
        </label>

        {figureInfo && (
          <div className="flex flex-col gap-1">
            <span className={label}>Poses que trae el .glb</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {FIGURE_POSES.map((pose) => (
                <span
                  key={pose}
                  className="rounded border border-[var(--wiki-border)] px-1.5 py-0.5"
                  style={{ opacity: figureInfo.poses[pose] ? 1 : 0.45 }}
                  title={figureInfo.poses[pose] ?? "No hay ningún clip para esta pose en el archivo"}
                >
                  {POSE_LABEL[pose]} {figureInfo.poses[pose] ? "✓" : "—"}
                </span>
              ))}
              <span className="text-[var(--wiki-muted)]">
                {figureInfo.triangles} tris · {figureInfo.bones} huesos
              </span>
            </div>
          </div>
        )}

        {figureError && <p className="text-sm text-[var(--wiki-danger)]">No se pudo cargar la figura: {figureError}</p>}
      </div>

      <CombatSession
        key={`${heroClassId}:${enemyClassIds.join(",")}:${battleNonce}`}
        heroClassId={heroClassId}
        enemyClassIds={enemyClassIds}
        mercenaryCardId={mercenaryCardId}
        figureOn={figureOn}
        showDisc={showDisc}
        figureUrl={figureModel.url}
        figureHeight={figureHeight / 100}
        onFigureInfo={setFigureInfo}
        onFigureError={setFigureError}
      />
    </div>
  );
}

type SessionProps = {
  heroClassId: HeroClassId;
  enemyClassIds: readonly EnemyClassId[];
  mercenaryCardId: MercenaryCardId;
  figureOn: boolean;
  showDisc: boolean;
  figureUrl: string;
  figureHeight: number;
  onFigureInfo: (info: FigureInfo) => void;
  onFigureError: (message: string) => void;
};

function CombatSession({
  heroClassId,
  enemyClassIds,
  mercenaryCardId,
  figureOn,
  showDisc,
  figureUrl,
  figureHeight,
  onFigureInfo,
  onFigureError,
}: SessionProps) {
  const board = useMemo(() => buildBattlefield(), []);
  const reducer = useMemo(() => makeReducer(heroClassId, board), [heroClassId, board]);
  const [state, dispatch] = useReducer(reducer, { heroClassId, enemyClassIds }, (init) =>
    buildInitialState(init.heroClassId, init.enemyClassIds),
  );
  const [selected, setSelected] = useState<HexCoord | null>(null);

  const isAllyTurn = state.phase === "battle" && state.side === "allies";
  const active = useMemo(
    () => allyUnit(state, state.activeAlly, heroClassId),
    [state, heroClassId],
  );
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

  // Nunca comparten hexágono (board/battle.md §2): los enemigos vivos son
  // intransitables para el movimiento aliado, tanto como destino como de
  // paso hacia otro más lejano. Y una unidad aliada tampoco puede pisar a la
  // otra, así que la que no está actuando también bloquea.
  const livingEnemies = useMemo(() => state.enemies.filter((e) => e.pv.current > 0), [state.enemies]);
  const blockedForActive = useMemo(() => {
    const keys = livingEnemies.map((e) => Hex.key(e.position));
    for (const ally of livingAllies(state, heroClassId)) {
      if (ally.id !== state.activeAlly) keys.push(Hex.key(ally.position));
    }
    return new Set(keys);
  }, [livingEnemies, state, heroClassId]);

  const reachable = useMemo(
    () =>
      isAllyTurn && active
        ? reachableHexes(board, active.position, active.movePointsLeft, true, blockedForActive)
        : new Map(),
    [isAllyTurn, active, board, blockedForActive],
  );
  const reachableHighlight = useMemo(() => {
    if (!active) return new Set<HexKey>();
    const selfKey = Hex.key(active.position);
    return new Set([...reachable.keys()].filter((k) => k !== selfKey));
  }, [reachable, active]);

  // Qué enemigos ya podrías golpear ESTE turno (lib/rules/movement.ts
  // `attackableTargets`): de los vivos, cuáles quedan al alcance del arma de
  // quien actúa desde algún hexágono que todavía puede alcanzar —incluido
  // quedarse donde está—. Se marca la casilla del ENEMIGO, no un destino:
  // nunca comparten hexágono (board/battle.md §2), así que el aviso es "a
  // este ya llegas", no "muévete aquí".
  const threatened = useMemo(() => {
    if (!isAllyTurn || !active) return new Set<HexKey>();
    return attackableTargets(reachable, active.weapon.range, livingEnemies.map((e) => e.position));
  }, [isAllyTurn, active, reachable, livingEnemies]);

  const mercenaryCard = state.mercenary ? MERCENARY_CATALOG[state.mercenary.cardId] : null;

  const heroMarkers: HeroMarker[] = [
    {
      id: "hero",
      position: state.hero.position,
      pieceId: "heroe-1",
      label: `Héroe — ${HERO_ROSTER[heroClassId].label} (${state.hero.pv.current}/${state.hero.pv.max} PV)`,
    },
    // El mercenario solo lleva disco si se ha pedido: cuando la figura 3D está
    // encendida y el disco apagado, esta ficha del tablero es el personaje
    // animado y nada más — que es justo la comparación que se viene a hacer.
    ...(state.mercenary && state.mercenary.pv.current > 0 && (showDisc || !figureOn)
      ? [
          {
            id: "mercenary",
            position: state.mercenary.position,
            pieceId: "heroe-2" as const,
            label: `${mercenaryCard!.label} (${state.mercenary.pv.current}/${state.mercenary.pv.max} PV)`,
          },
        ]
      : []),
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
        attack: HERO_WEAPON[heroClassId],
        effects: state.hero.effects,
      };
    }
    if (state.mercenary && state.mercenary.pv.current > 0 && Hex.equals(selected, state.mercenary.position)) {
      const unit = mercenaryUnit(state.mercenary);
      const block = blockFor(state.mercenary.cardId);
      return {
        piece: { family: "pawn", id: "heroe-2" },
        title: unit.label,
        subtitle: `Mercenario · ${MERCENARY_CATALOG[state.mercenary.cardId].rarity.replace("-", " ")}`,
        pv: unit.pv,
        ca: unit.ca,
        speed: unit.speed,
        attack: { label: unit.weapon.label, dice: unit.weapon.dice, damageType: unit.weapon.damageType, range: unit.weapon.range },
        abilityNotes: [
          `Bloque por Rareza (mercenaries.md §1b): ${describeMercenaryAttack(block)}.`,
          block.figures > 1
            ? `${block.figures} ataques por turno (columna Figuras).`
            : "1 ataque por turno, sin Acción rápida.",
          "Sin características propias: tira con el bono plano de su Rareza.",
        ],
        effects: unit.effects,
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
    if (isAllyTurn && active) {
      const target = state.enemies.find((e) => e.pv.current > 0 && Hex.equals(e.position, hex.coord));
      if (target && active.attacksLeft > 0) {
        const distance = Hex.distance(active.position, hex.coord);
        if (distance <= active.weapon.range) {
          dispatch({ type: "ally-attack", targetId: target.id });
          return;
        }
      }
      if (!Hex.equals(hex.coord, active.position)) {
        const step = reachable.get(Hex.key(hex.coord));
        if (step) {
          dispatch({ type: "ally-move", to: hex.coord, pointsLeft: step.pointsLeft });
          return;
        }
      }
    }
    setSelected((prev) => (prev && Hex.equals(prev, hex.coord) ? null : hex.coord));
  }

  const canSummon =
    isAllyTurn && state.activeAlly === "hero" && !state.mercenary && state.hero.attacksLeft > 0;

  // El evento que ve la figura 3D. Se deriva del estado y no de un `useState`
  // aparte para que no puedan desincronizarse: si el combate no ha pedido
  // ninguna pose, la figura simplemente sigue con la suya.
  const figureEvent: FigureEvent | null = useMemo(
    () =>
      state.figureCue
        ? { pose: state.figureCue.pose, nonce: state.figureCueCount, facing: state.figureCue.facing }
        : null,
    [state.figureCue, state.figureCueCount],
  );

  // Estables entre renders: BattleFigure los guarda en una ref, pero recrearlos
  // en cada pintado obligaría igualmente a React a recorrer sus efectos.
  const handleFigureInfo = useCallback((info: FigureInfo) => onFigureInfo(info), [onFigureInfo]);
  const handleFigureError = useCallback((message: string) => onFigureError(message), [onFigureError]);

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
            {isAllyTurn && active
              ? `Aliados — ${active.label}`
              : activeEnemy
                ? `Enemigos — ${ENEMY_ROSTER[activeEnemy.defId].label}`
                : "—"}
          </span>
          {isAllyTurn && active && (
            <>
              <span title="Se recarga al empezar turno; 0 si Inmovilizado.">
                <b>Movimiento:</b> {active.movePointsLeft}
              </span>
              <span title="El héroe tiene 1 acción; un mercenario Épico o Legendario tiene 2 o 3 ataques (Figuras, §1b).">
                <b>Acción:</b> {active.attacksLeft > 0 ? `${active.attacksLeft} disponible(s)` : "usada"}
              </span>
              {canSummon && (
                <button
                  className={buttonClass({})}
                  title="Gasta la Acción del héroe (mercenaries.md §1). La carta volvería al Mazo al invocar."
                  onClick={() => dispatch({ type: "summon-mercenary", cardId: mercenaryCardId })}
                >
                  Invocar mercenario
                </button>
              )}
              <button className={buttonClass({ variant: "primary" })} onClick={() => dispatch({ type: "end-ally-turn" })}>
                Terminar turno
              </button>
            </>
          )}
          {!isAllyTurn && state.phase === "battle" && (
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
        En el turno de una unidad aliada: clica una casilla resaltada para moverla, o a un enemigo dentro del
        alcance de su <b>{active?.weapon.label ?? "arma"}</b> (
        {(active?.weapon.range ?? 1) === 1 ? "cuerpo a cuerpo" : `alcance ${active?.weapon.range}`}) para
        atacarlo. Un enemigo marcado en rojo ya es alcanzable este turno. Cuando termine el turno de todas las
        fichas aliadas, la fase enemiga resuelve sola a todos los enemigos vivos, uno tras otro.
      </p>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]">
        <span className={isAllyTurn && state.activeAlly === "hero" ? "font-semibold text-[var(--wiki-text)]" : undefined}>
          Héroe: {state.hero.pv.current}/{state.hero.pv.max} PV
          {hasEffect(state.hero.effects, "envenenado") && " · Envenenado"}
          {hasEffect(state.hero.effects, "inmovilizado") && " · Inmovilizado"}
        </span>
        {state.mercenary && mercenaryCard && (
          <span
            className={
              isAllyTurn && state.activeAlly === "mercenary" ? "font-semibold text-[var(--wiki-text)]" : undefined
            }
          >
            {mercenaryCard.label}: {state.mercenary.pv.current}/{state.mercenary.pv.max} PV
            {state.mercenary.pv.current === 0 && " · caído"}
            {hasEffect(state.mercenary.effects, "envenenado") && " · Envenenado"}
            {hasEffect(state.mercenary.effects, "inmovilizado") && " · Inmovilizado"}
          </span>
        )}
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
          overlay={
            figureOn
              ? (projection) => (
                  <BattleFigure
                    projection={projection}
                    url={figureUrl}
                    coord={state.mercenary ? state.mercenary.position : null}
                    height={figureHeight}
                    event={figureEvent}
                    onInfo={handleFigureInfo}
                    onError={handleFigureError}
                  />
                )
              : undefined
          }
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
