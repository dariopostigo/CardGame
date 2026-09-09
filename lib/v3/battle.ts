// =========================================================================
// El combate resuelto — daño y ❤️ Vida de verdad, V3
//
// LO QUE FALTABA PARA MEDIR LAS DOS ÚLTIMAS DEL BANCO (dev-registry.ts,
// módulo «personaje»): ni `combat.ts` (§4.1, solo la tirada) ni `round.ts`
// (§5, solo apunta "a quién tuvo a tiro") resuelven un golpe entero, y las
// dos preguntas que quedan —el tier del héroe y el reparto de ⚡ Iniciativa—
// solo se manifiestan cuando hay un golpe que de verdad quita ❤️ Vida: ir
// primero o último en la ronda es indiferente mientras nadie pierda nada por
// ello, que es justo lo que se comprobó el 7 de septiembre de 2026 barriendo
// el `first` de `duel.ts` — el mismo resultado con las dos órdenes, porque
// ahí no hay daño que resolver.
//
// AQUÍ SOLO EL ATAQUE BÁSICO (§4.4): siempre tira, nunca entra gratis. El
// hechizo —que no tira— es una carta y no vive aquí.
//
// LO QUE SE DEJA FUERA A PROPÓSITO, porque ninguna de las dos medidas lo
// necesita: 🗡️ Perforante y cualquier otro modificador de carta, 💨 Evasivo
// y la cobertura del terreno —ya están fuera de `combat.ts` por el mismo
// motivo, y siguen en 0 (§4.1)—, y los Estados del §4.5: el crítico los
// dispara pero nada de esto dura más de un turno todavía.
//
// LA VUELTA A UNO ES `round.ts`: el movimiento y quién queda a tiro no se
// duplican, se reutilizan tal cual — esto solo añade el golpe y la ❤️ Vida
// encima. Y EL ORDEN DEJA DE SER EL SUSTITUTO de `round.ts` (su
// `alternatingOrder`, "el día que ⚡ tenga escala, esto se tira y se ordena
// de verdad"): aquí ya se ordena por ⚡ Iniciativa de verdad (§4.6).
//
// Puro: sin React. El azar de la tirada y el del desempate de ⚡ se pueden
// fijar desde fuera para que un combate sea reproducible, igual que ya hace
// `combat.ts` con `roll`.
//
// EL ESPEJO DE VARIOS POR BANDO YA NO ES SOSPECHOSO (7-sep-2026). El reparto
// de ⚡ se cerró con `fight()` en 1 contra 1 —resultado estable en 100.000
// combates por condición—, pero el intento de usarlo para el tier del héroe
// montó un espejo de 5 contra 5 con las mismas cifras a los dos lados y el
// resultado no salía simétrico (26% contra 44%). Auditado: la causa era
// round.ts `takeTurn` —al empatar dos casillas igual de buenas se quedaba con
// la PRIMERA que encontraba, y esa primera sale de Hex.DIRECTIONS, que es fijo
// y empieza por el Este. Quien avanza hacia el Este ganaba los empates más a
// menudo que quien avanza hacia el Oeste, no por nada del combate. Se
// comprobó invirtiendo DIRECTIONS: el sesgo se invirtió con él. La corrección
// desempata a azar (el mismo criterio que ya usa la ⚡ Iniciativa aquí abajo),
// así que `takeTurn` y `playRound` llevan un `rng` desde entonces.
// =========================================================================

import type { HexCoord } from "./hex";
import type { Arena, Side } from "./arena";
import { DAMAGE_TYPES, type DamageTypeId } from "./damage";
import { resolveAttack, type AttackResult } from "./combat";
import { takeTurn, type Actor } from "./round";
import { MOVEMENT_BAND, type MovementByType } from "./tempo";
import type { AnimEvent } from "./anim";
import type { Effect } from "./effects";
import { applyEffect, isIncapacitated, tickEnd, type EffectBag } from "./effects-runtime";

/**
 * Lo que un combatiente pone en juego: las Habilidades que resuelven un
 * golpe (§4.1 y §4.2) más su posición y su ❤️ Vida actual. No es un
 * `Character` de `character.ts` a propósito — ahí vive la ANATOMÍA completa
 * (traits, tier, validación), y para pelear solo hacen falta seis números.
 */
export type Fighter = {
  readonly id: string;
  readonly side: Side;
  readonly damage: DamageTypeId;
  readonly hex: HexCoord;
  readonly ataque: number;
  readonly defensa: number;
  readonly resistenciaMagica: number;
  readonly precision: number;
  /** Ya saneada: tope 25 y nunca por encima de `precision` (combat.ts `cappedLuck`). */
  readonly suerte: number;
  readonly iniciativa: number;
  readonly vidaMax: number;
  readonly vida: number;
  /**
   * Ids del catálogo (effects.ts) que sus golpes pueden aplicar — "🔥 Fuego"
   * aplica Quemadura, "💫 Aturdimiento" aplica Aturdido, etc (effects.md §1 y
   * su columna "Lo aplica"). Vacío si esta ficha no aplica ningún estado.
   */
  readonly applies?: readonly string[];
  /** Los estados que lleva puestos ahora mismo. Vacío por defecto. */
  readonly effects?: EffectBag;
};

/** El tope de mitigación del §4.2: a 100 habría inmunidad. */
const MITIGATION_CAP = 75;

/**
 * Cuánta ❤️ Vida quita un golpe que ya ha entrado (§4.2). Sin 🗡️ Perforante:
 * es daño solo por rejilla y no lo necesita ninguna de las dos medidas.
 */
export function damageOf(attack: number, mitigation: number, critical: boolean): number {
  const capped = Math.min(MITIGATION_CAP, Math.max(0, mitigation));
  const base = attack * (1 - capped / 100);
  return Math.max(0, Math.round(critical ? base * 2 : base));
}

/** Qué Habilidad del defensor frena este tipo de daño (§4.2, §4.3). */
function mitigationOf(target: Fighter, attackerDamage: DamageTypeId): number {
  return DAMAGE_TYPES[attackerDamage].mitigatedBy === "defensa"
    ? target.defensa
    : target.resistenciaMagica;
}

export type Hit = {
  readonly attacker: string;
  readonly defender: string;
  readonly roll: number;
  readonly result: AttackResult;
  readonly damage: number;
};

/** Un ataque básico entero: tira (§4.1) y, si entra, hace daño (§4.2). */
export function resolveHit(attacker: Fighter, defender: Fighter, roll?: number): Hit {
  const resolution = resolveAttack(attacker.precision, attacker.suerte, roll);
  const damage =
    resolution.result === "fallo"
      ? 0
      : damageOf(
          attacker.ataque,
          mitigationOf(defender, attacker.damage),
          resolution.result === "critico",
        );
  return {
    attacker: attacker.id,
    defender: defender.id,
    roll: resolution.roll,
    result: resolution.result,
    damage,
  };
}

/**
 * La lista entrelazada del §4.6: ⚡ Iniciativa de mayor a menor, empate por
 * 🍀 Suerte de mayor a menor, empate por azar. Se calcula UNA VEZ por
 * combate —es "propiedad fija de la ficha, ningún estado la altera"— y se
 * repite ronda a ronda saltándose a quien ya haya caído.
 */
export function initiativeOrder(
  fighters: readonly Pick<Fighter, "id" | "iniciativa" | "suerte">[],
  rng: () => number = Math.random,
): readonly string[] {
  const groups = new Map<string, string[]>();
  for (const f of fighters) {
    const key = `${f.iniciativa} ${f.suerte}`;
    const existing = groups.get(key);
    if (existing) existing.push(f.id);
    else groups.set(key, [f.id]);
  }

  const sortedKeys = [...groups.keys()].sort((a, b) => {
    const [aIni, aLuck] = a.split(" ").map(Number);
    const [bIni, bLuck] = b.split(" ").map(Number);
    return bIni - aIni || bLuck - aLuck;
  });

  const out: string[] = [];
  for (const key of sortedKeys) {
    const ids = [...groups.get(key)!];
    // Empate → azar (§4.6): Fisher-Yates dentro del grupo empatado.
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    out.push(...ids);
  }
  return out;
}

function toActor(f: Fighter): Actor {
  return { id: f.id, side: f.side, damage: f.damage, hex: f.hex };
}

export type BattleTurn = {
  readonly round: number;
  readonly id: string;
  readonly from: HexCoord;
  readonly to: HexCoord;
  /** Hexágonos andados. Es lo que cuesta tiempo (anim.ts `AnimEvent` "paso"), no la distancia en línea recta. */
  readonly steps: number;
  /** El golpe que se resolvió al terminar el movimiento, si tenía a alguien a tiro. */
  readonly hit: Hit | null;
  readonly defenderDied: boolean;
  /** Cuánta ❤️ Vida le quitó el tic de sus propios Estados al final de SU turno (effects.md §3). 0 sin Estados que tiqueteen. */
  readonly selfDamage: number;
  /** Si ese mismo tic le quitó la última ❤️ Vida. */
  readonly selfDied: boolean;
};

export type BattleResult = {
  /** El bando que queda en pie, o "empate" si caen los dos a la vez o llega `maxRounds`. */
  readonly winner: Side | "empate";
  readonly rounds: number;
  readonly turns: readonly BattleTurn[];
  readonly survivors: readonly Fighter[];
};

export type BattleOptions = {
  readonly movement?: MovementByType;
  readonly maxRounds?: number;
  /** Desempata ⚡ Iniciativa (§4.6). Fijarlo hace el combate reproducible. */
  readonly rng?: () => number;
  /** La tirada del §4.1, ya hecha. Sin ella sale de `Math.random()`, como en `combat.ts`. */
  readonly roll?: () => number;
  /**
   * El catálogo de Estados (effects.ts `parseEffects`). Sin él, ningún golpe
   * aplica nada y ningún estado tiquetea — `fight()` se comporta exactamente
   * como antes de que este catálogo existiera.
   */
  readonly effects?: readonly Effect[];
};

/** Qué estados aplica este golpe, según `attacker.applies` y si fue crítico (effects.md §1). */
function triggeredEffects(
  attacker: Fighter,
  result: AttackResult,
  catalog: readonly Effect[],
): readonly Effect[] {
  return (attacker.applies ?? [])
    .map((id) => catalog.find((e) => e.id === id))
    .filter((effect): effect is Effect => effect !== undefined)
    .filter((effect) => effect.family === "dano" || result === "critico");
}

/**
 * Un combate entero: movimiento (`round.ts`) y golpe (§4.1 + §4.2) turno a
 * turno, en el orden de ⚡ Iniciativa (§4.6), hasta que un bando cae entero o
 * se llega a `maxRounds`.
 */
export function fight(
  arena: Arena,
  fighters: readonly Fighter[],
  {
    movement = MOVEMENT_BAND,
    maxRounds = 40,
    rng = Math.random,
    roll,
    effects = [],
  }: BattleOptions = {},
): BattleResult {
  const alive = new Map(fighters.map((f) => [f.id, f]));
  const order = initiativeOrder(fighters, rng);
  const turns: BattleTurn[] = [];

  const sidesLeft = () => new Set([...alive.values()].map((f) => f.side));

  for (let round = 1; round <= maxRounds; round++) {
    for (const id of order) {
      let self = alive.get(id);
      if (!self) continue; // ya ha caído

      // 😵 Aturdido y 🧊 Congelación a pila llena no dejan actuar (effects.md
      // §5, §5.1): no hay movimiento ni ataque este turno, pero el tic de sus
      // propios Estados sigue pasando al final igual — "Aturdido ya se cobró".
      const incapacitated = effects.length > 0 && isIncapacitated(self.effects ?? [], effects);

      let from = self.hex;
      let to = self.hex;
      let steps = 0;
      let hit: Hit | null = null;
      let defenderDied = false;

      if (!incapacitated) {
        const actors = [...alive.values()].map(toActor);
        const { actor, log } = takeTurn(arena, actors, id, movement, rng);
        self = { ...self, hex: actor.hex };
        alive.set(id, self);
        from = log.from;
        to = log.to;
        steps = log.steps;

        if (log.attacked) {
          const defender = alive.get(log.attacked)!;
          hit = resolveHit(self, defender, roll?.());
          let updated: Fighter = { ...defender, vida: Math.max(0, defender.vida - hit.damage) };

          if (effects.length > 0 && hit.result !== "fallo") {
            let bag = updated.effects ?? [];
            for (const effect of triggeredEffects(self, hit.result, effects)) {
              bag = applyEffect(bag, effect, self.ataque);
            }
            updated = { ...updated, effects: bag };
          }

          if (updated.vida <= 0) {
            alive.delete(defender.id);
            defenderDied = true;
          } else {
            alive.set(defender.id, updated);
          }
        }
      }

      // El final del turno del afectado (effects.md §2-§3): tiquetea sus
      // propios Estados, sea cual sea su bando y aunque este turno estuviera
      // incapacitado. Si `self` cayó por el golpe de arriba (imposible: uno no
      // se pega a sí mismo) esto no se alcanzaría; sigue vivo por construcción.
      let selfDamage = 0;
      let selfDied = false;
      if (effects.length > 0) {
        const current = alive.get(id)!;
        const tick = tickEnd(current.effects ?? [], effects, current, current.suerte, rng);
        selfDamage = tick.damage;
        const vida = Math.max(0, current.vida - tick.damage);
        if (vida <= 0) {
          alive.delete(id);
          selfDied = true;
        } else {
          alive.set(id, { ...current, vida, effects: tick.bag });
        }
      }

      turns.push({ round, id, from, to, steps, hit, defenderDied, selfDamage, selfDied });

      const sides = sidesLeft();
      if (sides.size <= 1) {
        return {
          winner: sides.size === 0 ? "empate" : ([...sides][0] as Side),
          rounds: round,
          turns,
          survivors: [...alive.values()],
        };
      }
    }
  }

  return { winner: "empate", rounds: maxRounds, turns, survivors: [...alive.values()] };
}

/**
 * Traduce lo que jugó `fight()` al vocabulario de anim.ts: **paso**, **ataque**
 * y **muerte**. Es lo que hacía falta para que la Animación deje de tirar de
 * sus sustitutos (una carta suelta, discos con un glifo) y se enchufe al
 * motor de verdad — sin esto, `AnimEvent[]` solo lo rellenaba a mano el
 * laboratorio (`AnimationModule.tsx` `sampleRound`).
 *
 * El **despliegue** no sale de aquí a propósito: `fight()` empieza con las
 * fichas ya puestas en el tablero, y soltar una carta es de otro módulo (la
 * Baraja). Un turno sin movimiento no lleva "paso" —quedarse quieto no cuesta
 * tiempo— y un golpe sin baja no lleva "muerte".
 */
export function toAnimEvents(turns: readonly BattleTurn[]): AnimEvent[] {
  const events: AnimEvent[] = [];
  for (const turn of turns) {
    if (turn.steps > 0) events.push({ kind: "paso", id: turn.id, steps: turn.steps });
    if (turn.hit) {
      events.push({ kind: "ataque", id: turn.id, target: turn.hit.defender, result: turn.hit.result });
      if (turn.defenderDied) events.push({ kind: "muerte", id: turn.hit.defender });
    }
    // La baja por el tic de un Estado propio (effects.md §3) no viene de un
    // golpe: no hay "ataque" que la anteceda, solo la "muerte".
    if (turn.selfDied) events.push({ kind: "muerte", id: turn.id });
  }
  return events;
}
