// =========================================================================
// La tirada del §4.1 — el primer trozo del motor de combate de V3
//
// POR QUÉ EXISTE YA, con el módulo «Motor de combate» todavía en planificado:
// la resolución de un ataque NO depende de los valores de las 8 Habilidades,
// solo los consume. Faltan siete de las ocho por decidir, pero eso bloquea
// la ficha de personaje, no esta fórmula, que está cerrada desde el 22 de
// agosto de 2026 y con sus diales fijados el 23 (docs/v3/game-design.md §4.1).
//
// Y hace falta HOY porque el laboratorio de animación (/dev/animacion) tiene
// que enseñar el fallo y el crítico, y "sin dados" significa que la animación
// es el único sitio donde el jugador se entera de lo que ha pasado. Enseñar un
// fallo con un `Math.random() < 0.15` metido en el componente sería inventarse
// la regla en la capa equivocada (ARCHITECTURE.md §6) y, peor, mentir sobre la
// distribución: lo interesante del banco es ver cómo se siente una tanda con la
// banda de acierto REAL, que es 65–95.
//
// Lo que aquí NO está, a propósito, porque depende de cosas que no existen:
// el daño y su mitigación por tipo (§4.2), 💨 Evasivo del defensor, la
// cobertura del terreno —que hoy vale 0 por decisión del tablero §7— y los
// modificadores de carta. Todos entran restando en `acierto`, así que entran
// sin tocar esta función: por eso recibe el umbral ya calculado y no la ficha.
// =========================================================================

/** Los tres desenlaces del §4.1. No hay más: una tirada, dos umbrales. */
export type AttackResult = "fallo" | "impacto" | "critico";

export type Resolution = {
  /** La tirada oculta, 1..100. Se guarda porque un solo número explica todo. */
  readonly roll: number;
  readonly result: AttackResult;
  /** Los dos umbrales con los que se comparó, ya saneados. */
  readonly hit: number;
  readonly luck: number;
};

/** El tope de 🍀 Suerte del §4.1: a 25, uno de cada cuatro golpes critica. */
export const LUCK_CAP = 25;

/** La banda de acierto del §4.1: ni garantizado ni roto. */
export const HIT_BAND = { min: 65, max: 95 } as const;

/**
 * Sanea 🍀 Suerte: tope 25 y nunca por encima del acierto.
 *
 * Lo segundo no es una comprobación defensiva sino la regla: si Suerte pudiera
 * pasar de Precisión habría tiradas que critican sin haber acertado, y el
 * "monótona —mejor tirada, mejor resultado—" del documento dejaría de ser
 * cierto.
 */
export function cappedLuck(luck: number, hit: number): number {
  return Math.max(0, Math.min(luck, LUCK_CAP, hit));
}

/**
 * Una tirada oculta contra los dos umbrales.
 *
 * `roll` se puede pasar para poder comprobar la función sin azar; si no viene,
 * sale de `Math.random()`. Cuando exista la partida de verdad, la semilla
 * tendrá que venir de fuera para que un duelo sea reproducible —igual que ya
 * hace duel.ts— pero eso es problema del motor, no de la fórmula.
 */
export function resolveAttack(
  hitThreshold: number,
  luckThreshold: number,
  roll = 1 + Math.floor(Math.random() * 100),
): Resolution {
  const hit = Math.max(0, Math.min(100, Math.round(hitThreshold)));
  const luck = cappedLuck(Math.round(luckThreshold), hit);
  const result: AttackResult = roll > hit ? "fallo" : roll <= luck ? "critico" : "impacto";
  return { roll, result, hit, luck };
}

/**
 * Cuántos de cada desenlace salen, de media, en `n` ataques.
 *
 * Se usa para medir la cola sin jugarla: una ronda de treinta ataques no dura
 * lo mismo si la mitad fallan, y esa cifra decide si hace falta un botón de
 * saltar animaciones. Redondea repartiendo el resto al impacto, que es el caso
 * mayoritario, para que la cuenta sume `n` exacto.
 */
export function expectedMix(
  n: number,
  hitThreshold: number,
  luckThreshold: number,
): Record<AttackResult, number> {
  const hit = Math.max(0, Math.min(100, Math.round(hitThreshold)));
  const luck = cappedLuck(Math.round(luckThreshold), hit);
  const fallo = Math.round((n * (100 - hit)) / 100);
  const critico = Math.round((n * luck) / 100);
  return { fallo, critico, impacto: Math.max(0, n - fallo - critico) };
}
