// =========================================================================
// IA de combate (docs/characters/enemies.md §5b.6)
//
// El árbol de prioridades determinista: huir si toca → habilidad lista y útil
// → atacar si en alcance → acercarse → sin nada útil. Función PURA: consulta
// adyacencia/alcance (lib/rules/hex.ts, lib/rules/movement.ts) y no tira
// dados ni muta nada — devuelve una acción declarativa que resuelve quien la
// llama (resolveAttack para atacar, la posición del héroe/el estado del
// combate para mover). El veneno al impactar y la salvación de Telaraña SÍ
// tiran dados, así que se resuelven fuera de aquí (combate.ts/CombatLab), no
// en la decisión.
//
// Un enemigo mueve su Velocidad completa Y ataca en el mismo turno si le
// queda en alcance (§5b.6 paso 4): quien llama a este módulo pide una
// decisión, ejecuta un "move" si sale eso, y vuelve a pedir una decisión con
// la posición ya actualizada — así el mismo árbol, llamado dos veces, cubre
// "acércate y golpea" sin que la función necesite devolver una acción
// compuesta.
// =========================================================================

import * as Hex from "./hex";
import type { HexCoord, HexKey } from "./hex";
import { hasEffect, type Effects } from "./effects";
import { reachableHexes } from "./movement";
import type { EnemyAbilityHook, EnemyClassDef, EnemyClassId } from "./enemy-roster";
import type { Board } from "./state";

export type EnemyDecisionContext = {
  readonly board: Board;
  readonly def: EnemyClassDef;
  readonly self: {
    readonly id: string;
    readonly defId: EnemyClassId;
    readonly position: HexCoord;
    readonly pv: { readonly current: number; readonly max: number };
  };
  /** En solo, la única ficha aliada del jugador; en co-op sería la más cercana (§5b.6). */
  readonly target: {
    readonly id: string;
    readonly position: HexCoord;
    readonly effects: Effects;
  };
  /** Otros enemigos vivos del mismo bando, para Cazador de manada (Lobo). */
  readonly allies: readonly { readonly defId: EnemyClassId; readonly position: HexCoord }[];
};

export type EnemyAction =
  | { readonly kind: "flee" }
  | { readonly kind: "ability"; readonly hook: EnemyAbilityHook; readonly targetId: string }
  | {
      readonly kind: "attack";
      readonly targetId: string;
      readonly advantageState: "normal" | "ventaja" | "desventaja";
    }
  | { readonly kind: "move"; readonly to: HexCoord }
  | { readonly kind: "wait" };

export function decideEnemyAction(ctx: EnemyDecisionContext): EnemyAction {
  const { board, def, self, target, allies } = ctx;
  const distanceToTarget = Hex.distance(self.position, target.position);

  // 1. ¿Debe huir? Solo el Bandido *Escurridizo*, por debajo del 50 % de PV.
  const escurridizo = def.abilities.some((a) => a.kind === "escurridizo");
  if (escurridizo && self.pv.current / self.pv.max < 0.5) {
    return { kind: "flee" };
  }

  // 2. ¿Habilidad lista y útil? Solo la Telaraña de la Araña, si el objetivo
  // todavía no está Inmovilizado y ya está a su alcance.
  const telarana = def.abilities.find(
    (a): a is EnemyAbilityHook & { kind: "telarana" } => a.kind === "telarana",
  );
  if (telarana && !hasEffect(target.effects, "inmovilizado") && distanceToTarget <= telarana.range) {
    return { kind: "ability", hook: telarana, targetId: target.id };
  }

  // 3. ¿Puede atacar ya?
  if (distanceToTarget <= def.attack.range) {
    return {
      kind: "attack",
      targetId: target.id,
      advantageState: computeAttackAdvantage(def, self, target.position, allies),
    };
  }

  // 4. ¿Acercarse? Ruta transitable más corta dentro de su Velocidad.
  const occupied = new Set<HexKey>([Hex.key(target.position), ...allies.map((a) => Hex.key(a.position))]);
  const step = bestApproachHex(board, self.position, def.speed, target.position, occupied);
  if (step) return { kind: "move", to: step };

  // 5. Sin nada útil (bloqueado, sin ruta).
  return { kind: "wait" };
}

/**
 * Ventaja/desventaja de un ataque enemigo (§5b.6 paso 3, exportada porque
 * quien llama vuelve a necesitarla al encadenar "mover y atacar en el mismo
 * turno", paso 4, con la posición ya actualizada).
 */
export function computeAttackAdvantage(
  def: EnemyClassDef,
  self: { readonly defId: EnemyClassId; readonly position: HexCoord },
  targetPosition: HexCoord,
  allies: EnemyDecisionContext["allies"],
): "normal" | "ventaja" | "desventaja" {
  const distanceToTarget = Hex.distance(self.position, targetPosition);

  // Enemigo a distancia con el héroe encima: dispara a bocajarro con
  // Desventaja, no se aleja (board/battle.md §2, precisado en §5b.6 paso 3).
  if (def.attack.range > 1 && distanceToTarget === 1) return "desventaja";

  // Cazador de manada (Lobo): ventaja si OTRO Lobo está adyacente al objetivo.
  const packHunter = def.abilities.some((a) => a.kind === "cazador-de-manada");
  if (packHunter) {
    const packMate = allies.some(
      (a) => a.defId === self.defId && Hex.distance(a.position, targetPosition) === 1,
    );
    if (packMate) return "ventaja";
  }

  return "normal";
}

/** El hexágono reachable que más acerca a `towards`, o null si ninguno mejora la distancia actual. */
function bestApproachHex(
  board: Board,
  from: HexCoord,
  speed: number,
  towards: HexCoord,
  occupied: ReadonlySet<HexKey>,
): HexCoord | null {
  const reachable = reachableHexes(board, from, speed, true, occupied);
  let best: HexCoord | null = null;
  let bestDistance = Hex.distance(from, towards);
  for (const key of reachable.keys()) {
    const coord = Hex.fromKey(key);
    const distance = Hex.distance(coord, towards);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = coord;
    }
  }
  return best;
}
