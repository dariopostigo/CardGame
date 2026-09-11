// =========================================================================
// ATACAR — embestida, contacto y vuelta, en sus TRES desenlaces. Y la baja.
//
// LA IDA ES LA MISMA EN LOS TRES, y no es una simplificación sino la regla que
// gobierna este archivo. V3 no enseña dados (§4.1): hay una tirada oculta 1..100
// contra dos umbrales, así que **la animación es el único canal por el que el
// jugador se entera de lo que ha pasado**. Si el fallo se notara en la embestida
// —más corta, más torcida, más lo que sea—, se aprendería a leer el desenlace en
// el gesto y la tirada oculta dejaría de tener suspense, que es lo único que una
// tirada oculta tiene que dar. Todo lo que separa fallar de golpear empieza en el
// fotograma del contacto y ni un milisegundo antes.
//
// Las duraciones no se calculan aquí: salen de `attackPhases` (lib/v3/anim.ts),
// que está allí justamente para poder comprobar esa propiedad SIN PANTALLA. Que
// la ida sea la misma en los tres es un test, no un detalle de dibujo.
//
// EL CONGELADO (hit-stop) se hace parando el polvo y RETRASANDO la vuelta, no
// pausando animaciones a mano: en el fotograma del contacto el atacante ya está
// quieto —acaba de terminar la ida y todavía no ha empezado la vuelta—, así que
// esperar ahí es literalmente congelar la escena. Cuando haya más cosas
// moviéndose a la vez habrá que pausarlas de verdad (`document.getAnimations()`),
// y este es el sitio.
//
// LA MUERTE VIVE AQUÍ Y NO EN SU ARCHIVO porque es el final de esta secuencia y
// no una cosa aparte: lo que mata es un golpe. Lo que NO puede ser es un
// fundido — una ficha que se desvanece se lee como un fallo de la pantalla, no
// como una baja. Tiene que pasar algo violento primero (el fogonazo) y tiene que
// quedar algo después (el polvo).
// =========================================================================

import {
  attackPhases,
  critDust,
  cubic,
  deathDust,
  hitDust,
  type AttackPhases,
  type Timings,
} from "@/lib/v3/anim";
import type { AttackResult } from "@/lib/v3/combat";
import {
  EASE_BACK,
  EASE_LUNGE,
  run,
  settleAnimations,
  shake,
  transform,
  wait,
  type Ground,
} from "./core";

const SQRT3 = Math.sqrt(3);

/** Quien pega y quien recibe: su nodo y su mancha de suelo. */
export type Fighter = {
  readonly el: HTMLElement;
  readonly shadow: HTMLElement | null;
};

export type AttackOptions = {
  /**
   * El daño que enseñará el texto flotante, si la pantalla tiene uno que
   * enseñar. Es marcador de posición hasta que exista el motor (§4.2) y por eso
   * lo pone quien llama; lo que NO es de mentira es que el crítico lo doble, que
   * es regla y se aplica aquí: un crítico que enseñara un número parecido al
   * normal no se leería como tal por muchas chispas que llevara.
   */
  readonly damage?: number | null;
};

/**
 * La secuencia entera de un ataque. Devuelve sus tres tramos ya resueltos, que
 * es lo que la pantalla escribe debajo.
 */
export async function attackMotion(
  attacker: Fighter,
  victim: Fighter,
  from: { x: number; y: number },
  to: { x: number; y: number },
  ground: Ground,
  result: AttackResult,
  t: Timings,
  options: AttackOptions = {},
): Promise<AttackPhases> {
  const p = attackPhases(result, t);
  const miss = result === "fallo";
  const crit = result === "critico";

  const dx = (to.x - from.x) * t.lungeDistance;
  const dy = (to.y - from.y) * t.lungeDistance;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const { el, shadow } = attacker;

  // La sombra acompaña a la embestida. No es un detalle: una ficha que se lanza
  // hacia delante dejando su sombra clavada en la casilla de origen no se lee
  // como que embiste, se lee como que se ha despegado del tablero.
  const withShadow = (frames: Keyframe[], duration: number, easing: string) =>
    shadow ? [shadow.animate(frames, { duration, easing, fill: "forwards" })] : [];

  // --- La ida. Idéntica en los tres desenlaces ---
  // Un salto de nada durante el trayecto: golpear es empujar hacia arriba y
  // hacia delante, no deslizarse.
  const out = withShadow(
    [
      { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, opacity: 0.55 },
      {
        transform: `translate(${from.x + dx * 0.4}px, ${from.y + dy * 0.4}px) scale(1.12)`,
        opacity: 0.4,
        offset: 0.6,
      },
      { transform: `translate(${from.x + dx}px, ${from.y + dy}px) scale(1)`, opacity: 0.55 },
    ],
    Math.max(1, p.lunge),
    cubic(EASE_LUNGE),
  );

  await run(
    el,
    [
      { transform: transform(from.x, from.y, 0, 1) },
      { transform: transform(from.x + dx * 0.4, from.y + dy * 0.4, 10, 1.04), offset: 0.6 },
      { transform: transform(from.x + dx, from.y + dy, 0, 1.06, 0.96) },
    ],
    p.lunge,
    cubic(EASE_LUNGE),
  );
  settleAnimations(out);

  // --- El fotograma del contacto: aquí y solo aquí se separan los tres ---
  const hit = { x: from.x + (to.x - from.x) * 0.68, y: from.y + (to.y - from.y) * 0.68 };

  // El respingo del objetivo arranca EN el contacto, no antes. Un esquive que
  // empieza a mitad de la ida es un aviso: se ve venir el fallo con tiempo de
  // sobra para leerlo, y eso es exactamente lo que la ida idéntica evitaba.
  const dodge = miss ? dodgeAside(victim, to, angle, t.missDodge * ground.size, p.back) : [];

  if (miss) {
    // Ni destello, ni polvo, ni temblor. La ausencia de las tres ES la
    // información: lo que dice que no ha entrado es que no pasa nada de lo que
    // siempre pasa.
    floatText(ground.scene, hit.x, hit.y, "Fallo", "fallo");
  } else {
    ground.dust?.emit(hit.x, hit.y, crit ? critDust(t, angle) : hitDust(t, angle));
    shake(ground.scene, t.shake * (crit ? t.critShake : 1), t.shakeTime);
    flash(victim.el, t.flash * (crit ? t.critFlash : 1), crit ? 7 : 4);
    if (options.damage != null) {
      const shown = crit ? options.damage * 2 : options.damage;
      floatText(ground.scene, hit.x, hit.y, `−${shown}`, result);
    }
  }

  if (p.stop > 0) {
    ground.dust?.pause();
    await wait(p.stop);
    ground.dust?.resume();
  }

  // --- La vuelta, que es donde cada desenlace cobra o paga ---
  // La del fallo lleva un tramo de más: el que se ha vaciado en un golpe que no
  // estaba se pasa de largo antes de recomponerse, y ese sobrepaso va DESPUÉS
  // del contacto — nunca en la ida, que sería el aviso.
  const end = { x: from.x + dx * t.missOvershoot, y: from.y + dy * t.missOvershoot };
  const back = withShadow(
    miss
      ? [
          { transform: `translate(${from.x + dx}px, ${from.y + dy}px) scale(1)`, opacity: 0.55 },
          { transform: `translate(${end.x}px, ${end.y}px) scale(1.06)`, opacity: 0.5, offset: 0.22 },
          { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, opacity: 0.55 },
        ]
      : [
          { transform: `translate(${from.x + dx}px, ${from.y + dy}px) scale(1)`, opacity: 0.55 },
          { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, opacity: 0.55 },
        ],
    Math.max(1, p.back),
    cubic(EASE_BACK),
  );

  await run(
    el,
    miss
      ? [
          { transform: transform(from.x + dx, from.y + dy, 0, 1.06, 0.96) },
          { transform: transform(end.x, end.y, 6, 1.04, 0.98, 9), offset: 0.22 },
          { transform: transform(from.x, from.y, 0, 1) },
        ]
      : [
          { transform: transform(from.x + dx, from.y + dy, 0, 1.06, 0.96) },
          { transform: transform(from.x, from.y, 0, 1) },
        ],
    p.back,
    cubic(EASE_BACK),
  );
  settleAnimations(back);
  settleAnimations(dodge);

  return p;
}

/**
 * El respingo del que esquiva: se aparta DE LADO y vuelve.
 *
 * De lado y no hacia atrás: retroceder por el eje del golpe se confunde con el
 * empuje de haberlo recibido, que es justo lo contrario de lo que hay que decir.
 * Y corto —una fracción de hexágono— porque medio hexágono deja a la ficha
 * pisando la casilla de al lado, y en un tablero de hexágonos esa mentira se ve.
 */
export function dodgeAside(
  victim: Fighter,
  at: { x: number; y: number },
  angle: number,
  distance: number,
  back: number,
): Animation[] {
  if (distance <= 0) return [];
  const d = SQRT3 * distance;
  const px = Math.cos(angle + Math.PI / 2) * d;
  const py = Math.sin(angle + Math.PI / 2) * d;
  const options: KeyframeAnimationOptions = {
    duration: Math.max(1, back * 0.85),
    easing: cubic(EASE_LUNGE),
    fill: "forwards",
  };
  const list = [
    victim.el.animate(
      [
        { transform: transform(at.x, at.y, 0, 1) },
        { transform: transform(at.x + px, at.y + py, 5, 1, 1, -8), offset: 0.3 },
        { transform: transform(at.x, at.y, 0, 1) },
      ],
      options,
    ),
  ];
  if (victim.shadow) {
    list.push(
      victim.shadow.animate(
        [
          { transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 0.55 },
          {
            transform: `translate(${at.x + px}px, ${at.y + py}px) scale(1.08)`,
            opacity: 0.45,
            offset: 0.3,
          },
          { transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 0.55 },
        ],
        options,
      ),
    );
  }
  return list;
}

/**
 * El destello del que recibe: es lo que dice CUÁL de las dos se ha llevado el
 * golpe, y con movimiento reducido es lo ÚNICO que lo dice.
 */
export function flash(el: HTMLElement, duration: number, brightness = 4): void {
  if (duration <= 0) return;
  el.animate(
    [
      { filter: "brightness(1)" },
      { filter: `brightness(${brightness})`, offset: 0.15 },
      { filter: "brightness(1)" },
    ],
    { duration, easing: "ease-out" },
  );
}

/**
 * El texto que sale flotando del contacto: la cifra, o la palabra del fallo.
 *
 * Las cifras son marcador de posición —saldrán del motor cuando exista (§4.2)—
 * pero el MOVIMIENTO de cada una no lo es, y es donde está el trabajo: el golpe
 * sale disparado hacia arriba y frena, que es un impacto; el fallo no sube, se
 * escurre de lado y se apaga, que es algo que no llegó a pasar. Si los tres
 * subieran igual, el color sería lo único que los separa y el color es lo
 * primero que se pierde de reojo.
 */
export function floatText(
  scene: HTMLElement | null,
  x: number,
  y: number,
  text: string,
  kind: AttackResult,
): void {
  if (!scene) return;
  const el = document.createElement("div");
  el.className = `patch__damage${kind === "impacto" ? "" : ` patch__damage--${kind}`}`;
  el.textContent = text;
  el.style.transform = `translate(${x}px, ${y}px)`;
  scene.append(el);

  const frames: Keyframe[] =
    kind === "fallo"
      ? [
          { transform: `translate(${x}px, ${y}px) scale(0.9)`, opacity: 0 },
          { transform: `translate(${x + 10}px, ${y - 6}px) scale(1)`, opacity: 0.85, offset: 0.2 },
          { transform: `translate(${x + 30}px, ${y - 16}px) scale(1)`, opacity: 0 },
        ]
      : [
          { transform: `translate(${x}px, ${y}px) scale(0.6)`, opacity: 0 },
          {
            transform: `translate(${x}px, ${y - (kind === "critico" ? 22 : 14)}px) scale(${kind === "critico" ? 1.35 : 1.15})`,
            opacity: 1,
            offset: 0.18,
          },
          { transform: `translate(${x}px, ${y - 52}px) scale(1)`, opacity: 0 },
        ];

  const anim = el.animate(frames, { duration: kind === "fallo" ? 620 : 720, easing: "ease-out" });
  anim.finished.finally(() => el.remove()).catch(() => el.remove());
}

/**
 * MUERTE: fogonazo, la ficha crece, y se deshace hacia abajo dejando polvo.
 *
 * El polvo sale cuando la ficha se ROMPE, no cuando empieza el fogonazo: es lo
 * que queda en el campo cuando la ficha ya no está, y por eso se emite a un
 * tercio de la secuencia y no al principio.
 */
export async function vanish(
  who: Fighter,
  at: { x: number; y: number },
  ground: Ground,
  t: Timings,
): Promise<void> {
  const { el, shadow } = who;
  const parallel = shadow
    ? [
        shadow.animate(
          [{ opacity: 0.55 }, { opacity: 0, transform: `translate(${at.x}px, ${at.y}px) scale(0.4)` }],
          { duration: t.death, easing: "ease-in", fill: "forwards" },
        ),
      ]
    : [];

  const burst = window.setTimeout(() => {
    ground.dust?.emit(at.x, at.y, deathDust(t));
    shake(ground.scene, t.shake * 0.7, t.shakeTime);
  }, t.death * 0.34);

  try {
    await run(
      el,
      [
        { transform: transform(at.x, at.y, 0, 1), filter: "brightness(1)", opacity: 1 },
        { transform: transform(at.x, at.y, 8, 1.18), filter: "brightness(3.2)", opacity: 1, offset: 0.24 },
        { transform: transform(at.x, at.y, 0, 1.05, 0.9), filter: "brightness(1.6)", opacity: 1, offset: 0.4 },
        { transform: transform(at.x, at.y, -4, 0.72, 0.3), filter: "brightness(0.5)", opacity: 0 },
      ],
      t.death,
      "ease-in",
    );
  } finally {
    window.clearTimeout(burst);
  }

  settleAnimations(parallel);
}
