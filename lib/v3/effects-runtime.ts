// =========================================================================
// Lo que un estado HACE — V3
//
// effects.ts es solo el catálogo (nombre, glifo, cifras leídas de
// sistemas/effects.md); este archivo es el módulo 8 de la cadena que ese
// mismo comentario decía que faltaba: aplicar un estado, cobrar su daño al
// final del turno, dejar que 🍀 Suerte se lo quite antes de tiempo, contar sus
// rondas y apilarlo cuando el catálogo lo permite (effects.md §1-§4).
//
// Puro: sin battle.ts, sin round.ts, sin React. Lo que hace falta para
// enchufarlo a un combate de verdad son tres números por ficha (⚔️ Ataque de
// quien aplicó, y 🛡️/🔮 de quien lo sufre) y el catálogo ya parseado — nada
// que obligue a importar el motor entero.
//
// LO QUE ESTE ARCHIVO NO HACE TODAVÍA, y hay que decirlo en voz alta en vez de
// fingir que no falta:
//   · Los estados que MODIFICAN una Habilidad mientras están puestos —🌑
//     Ceguera (−30 🎯), 🐌 Lentitud e 🕸️ Inmovilización (👢 a la mitad o a 0)—
//     no tienen aquí ningún "valor efectivo": round.ts `takeTurn` recibe un
//     único 👢 Movimiento por TIPO de daño, compartido por todas las fichas de
//     ese tipo, y no hay hueco para que UNA ficha concreta lo lleve distinto
//     sin tocar esa firma. Se necesita esa firma antes de que esto sirva de
//     verdad en combate.
//   · 🌀 Confusión —"su acción va a un objetivo válido al azar"— cambia A QUIÉN
//     ataca la ficha, no cuánta Vida pierde: eso vive en la elección de
//     objetivo de round.ts `nearestFoe`, no aquí.
//   · 😱 Miedo como disparador de 😵 Aturdido (§5.1, "la primera vez que baja de
//     media Vida") necesita recordar SI YA PASÓ en este combate, que es estado
//     de la ficha y no del estado — no está modelado.
// Lo que SÍ hace, y es lo que `isIncapacitated` existe para decirle a quien
// juegue el turno: 😵 Aturdido y 🧊 Congelación a pila llena impiden actuar
// (§5, §5.1), y eso no depende de ninguna Habilidad — se puede comprobar hoy.
// =========================================================================

import type { Effect } from "./effects";

/** Un estado puesto en una ficha, con lo que hace falta para tickearlo. */
export type ActiveEffect = {
  readonly id: string;
  /** 1 salvo 🧊 Congelación, que sube hasta el tope de su catálogo. */
  readonly stacks: number;
  /** Turnos que le quedan, sin contar el de 🍀 Suerte (§2). */
  readonly remaining: number;
  /**
   * ⚔️ Ataque de quien lo aplicó, congelado en el momento de aplicarlo (§3:
   * "cuelga del Ataque de QUIEN LO APLICÓ", no de la víctima ni de un valor
   * fijo). Si quien lo aplicó muere o cambia, el tic no se entera y sigue
   * pegando lo mismo — es lo que el documento pide.
   */
  readonly sourceAtaque: number;
};

export type EffectBag = readonly ActiveEffect[];

/** El tope de mitigación del §4.2, el mismo que usa battle.ts `damageOf`. */
const MITIGATION_CAP = 75;

/** Qué Habilidad frena el tic de cada estado de daño (§3). Sangrado es físico; los tres elementales pasan por 🔮. */
function mitigationFieldOf(id: string): "defensa" | "resistenciaMagica" {
  return id === "sangrado" ? "defensa" : "resistenciaMagica";
}

/**
 * Aplica un estado sobre lo que ya llevaba la ficha (§4).
 *
 * Estados de daño y de control **refrescan** la duración a la base sin
 * apilarse; 🧊 Congelación es la única excepción y además sube una pila, hasta
 * el tope que diga su catálogo. `effect` decide cuál de los dos caminos toca
 * — no hace falta que quien llama sepa cuál es Congelación.
 */
export function applyEffect(bag: EffectBag, effect: Effect, sourceAtaque: number): EffectBag {
  const existing = bag.find((a) => a.id === effect.id);
  if (!existing) {
    return [...bag, { id: effect.id, stacks: 1, remaining: effect.duration, sourceAtaque }];
  }
  const stacks =
    effect.stacks !== null ? Math.min(effect.stacks, existing.stacks + 1) : existing.stacks;
  return bag.map((a) =>
    a.id === effect.id ? { id: effect.id, stacks, remaining: effect.duration, sourceAtaque } : a,
  );
}

export type TickResult = {
  readonly bag: EffectBag;
  /** Daño total ya sumado de todos los estados que tocaban (§3). */
  readonly damage: number;
  /** Los que se han caído este turno, por Suerte o por agotar sus rondas. */
  readonly expired: readonly string[];
};

/**
 * El final del turno del afectado (§2 y §3), en ese orden: primero cobra su
 * daño quien lo tenga, y LUEGO se decide si el estado sigue —🍀 Suerte puede
 * tirarlo ya, y si no, pierde una ronda—. En un estado de 1 turno la tirada no
 * cambia nada y está bien así (§2, "cuando llega el final de tu turno,
 * Aturdido ya se cobró").
 *
 * @param target - Las dos Habilidades que frenan el tic (§3), no la ficha
 *   entera: este módulo no sabe qué es un `Fighter`.
 */
export function tickEnd(
  bag: EffectBag,
  catalog: readonly Effect[],
  target: { readonly defensa: number; readonly resistenciaMagica: number },
  suerte: number,
  rng: () => number = Math.random,
): TickResult {
  let damage = 0;
  const expired: string[] = [];
  const next: ActiveEffect[] = [];

  for (const active of bag) {
    const effect = catalog.find((e) => e.id === active.id);
    if (!effect) continue; // no está en el catálogo: no se puede tickear un estado que no existe

    if (effect.damagePerTurn !== null) {
      const mitigation = Math.min(MITIGATION_CAP, Math.max(0, target[mitigationFieldOf(effect.id)]));
      damage += Math.max(
        0,
        Math.round(((active.sourceAtaque * effect.damagePerTurn) / 100) * (1 - mitigation / 100)),
      );
    }

    const roll = rng() * 100;
    if (roll <= suerte) {
      expired.push(active.id);
      continue;
    }
    const remaining = active.remaining - 1;
    if (remaining <= 0) {
      expired.push(active.id);
      continue;
    }
    next.push({ ...active, remaining });
  }

  return { bag: next, damage, expired };
}

/**
 * ¿Puede actuar esta ficha este turno? Las dos únicas puertas que lo impiden
 * hoy (§5, §5.1): 😵 Aturdido puesto, o 🧊 Congelación a su pila máxima. No
 * cubre 🌀 Confusión —esa no impide actuar, redirige la acción— ni 😱 Miedo
 * como disparador, que no está modelado (ver cabecera del archivo).
 */
export function isIncapacitated(bag: EffectBag, catalog: readonly Effect[]): boolean {
  return bag.some((active) => {
    if (active.id === "aturdido") return true;
    const effect = catalog.find((e) => e.id === active.id);
    return effect !== undefined && effect.stacks !== null && active.stacks >= effect.stacks;
  });
}
