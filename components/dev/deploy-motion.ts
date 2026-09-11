// =========================================================================
// Soltar una carta en un tablero de hexágonos — el gesto, escrito UNA vez
//
// Aquí vive lo que pasa entre que sueltas una carta y la ficha está puesta: el
// vuelo, el cruce de carta a ficha en el aire, la caída con su curva, el polvo,
// el temblor y el aplastado. Y vive aquí, y no dentro del componente que lo
// enseña, porque LO PIDEN DOS TABLEROS Y TIENEN QUE HACER LO MISMO. Dario, el
// 10 de septiembre de 2026, después de arrastrar una carta en los dos retales:
// «tenemos dos minitableros en Baraja y Oteo y en Animaciones, los dos —menos
// en apariencia— actúan diferente cuando se arrastra una carta a su interior.
// Quiero que los dos minitableros tengan ABSOLUTAMENTE el mismo
// comportamiento».
//
// Y no eran dos copias del mismo código con una cifra distinta: eran DOS
// RESPUESTAS a la misma pregunta. En /dev/animacion la carta volaba hasta el
// hexágono, se convertía en ficha a mitad del vuelo, caía, levantaba polvo,
// hacía temblar la escena un poco y se aplastaba contra el suelo; en /dev/baraja
// la ficha simplemente aparecía y la carta se iba al Mazo. Con los dos llamando
// aquí ya no hay dos respuestas que mantener afinadas: hay una, y los diales de
// lib/v3/anim.ts la mueven en los dos sitios a la vez.
//
// LO QUE NO ENTRA, y es lo que permite que sirva a los dos: nada que sepa de
// React, ni de qué es una ficha, ni de qué hexágonos hay. Se le pasan NODOS y
// PUNTOS ya medidos. Cada tablero mide con su propia geometría —el banco tiene
// diales en vivo y la baraja usa los tiempos por defecto— y cada uno dibuja lo
// que quiera dentro del nodo que vuela: allí un rectángulo con un rótulo y un
// disco con un glifo, aquí la carta de verdad y la ficha de verdad.
//
// LAS DOS CARAS SON HIJAS DEL MISMO ELEMENTO, y esa es la decisión que sostiene
// el archivo. El nodo que vuela lleva dentro la cara de CARTA y la cara de
// FICHA, y desplegar es cruzar sus opacidades mientras el padre viaja: así el
// vuelo es un solo `transform` sobre un solo nodo y el cruce una opacidad, en
// vez de dos animaciones sobre dos nodos que habría que sincronizar —y que se
// desincronizan en cuanto alguien toca un dial—. Cada tablero pone las dos caras
// al tamaño que le toque; lo único que esto necesita saber es a qué escala va el
// nodo cuando lo llevas cogido y a qué escala se queda al aterrizar.
// =========================================================================

import { CURVES, cubic, landingDust, rippleDelay, type Timings } from "@/lib/v3/anim";
import type { DustField } from "./dust";

/** Curvas que no son diales porque no se discuten. */
export const EASE_FLIGHT: readonly [number, number, number, number] = [0.3, 0.1, 0.2, 1];
export const EASE_BACK: readonly [number, number, number, number] = [0.3, 0, 0.3, 1];

/**
 * Lo que tarda una carta en volver a su sitio cuando la sueltas donde no vale.
 *
 * No es un dial y no debería serlo: los diales miden el DESPLIEGUE, que es lo
 * que hay que afinar porque es lo que el jugador va a ver mil veces. Recoger
 * una carta que no llegó a jugarse es deshacer, y deshacer se hace rápido y en
 * un solo tiempo.
 */
const RETURN_MS = 240;

/**
 * El `transform` de una pieza. La ALTURA se resta de la `y` porque en un
 * tablero inclinado subir es ir hacia arriba en pantalla; lo que dice que es
 * altura y no profundidad es la sombra, que se queda en el suelo.
 */
export function transform(
  x: number,
  y: number,
  height: number,
  scaleX: number,
  scaleY = scaleX,
  rotate = 0,
): string {
  const r = rotate ? ` rotate(${rotate.toFixed(2)}deg)` : "";
  return `translate(${x.toFixed(2)}px, ${(y - height).toFixed(2)}px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})${r}`;
}

/**
 * Lanza una animación y espera a que acabe, dejando el estado final escrito.
 *
 * `fill: "forwards"` + `commitStyles()` + `cancel()` es el trío obligatorio: sin
 * el primero la pieza vuelve de un salto a donde estaba; sin el segundo, el
 * salto ocurre al cancelar; y sin el tercero cada animación se queda viva para
 * siempre y a las cien caídas el navegador está manteniendo cien.
 *
 * Además marca la pieza con `data-moving` mientras dura, y solo mientras dura:
 * es lo que le enciende el `will-change`. Dejarlo puesto en el CSS parecía
 * gratis y no lo era —la carta quieta salía emborronada—; el porqué está en
 * styles/components/_animation-lab.scss, junto a la regla.
 */
export async function run(
  el: HTMLElement,
  frames: Keyframe[],
  duration: number,
  easing = "linear",
): Promise<void> {
  el.dataset.moving = "true";
  const anim = el.animate(frames, { duration: Math.max(1, duration), easing, fill: "forwards" });
  try {
    await anim.finished;
    if (el.isConnected) {
      try {
        anim.commitStyles();
      } catch {
        // Firefox lanza si el elemento no está pintado. El fill ya lo sostiene.
      }
    }
    anim.cancel();
  } catch {
    // Cancelada porque el componente se ha desmontado a mitad. No es un error.
  } finally {
    delete el.dataset.moving;
  }
}

/**
 * Cierra las animaciones que corrieron EN PARALELO a la principal (la sombra,
 * el cruce de carta a ficha) con la misma disciplina que `run`.
 *
 * Sin esto se quedan vivas con su `fill: forwards`, y una animación rellenando
 * gana al `style` en línea: se escribiría la posición nueva de la sombra al
 * cambiar el tamaño de la ventana y la sombra no se movería, clavada por una
 * animación que terminó hace diez minutos. Además se acumulan —tres por
 * despliegue— y el navegador las mantiene todas.
 */
export function settleAnimations(list: readonly Animation[]): void {
  for (const anim of list) {
    const target = (anim.effect as KeyframeEffect | null)?.target ?? null;
    if (target instanceof HTMLElement && target.isConnected) {
      try {
        anim.commitStyles();
      } catch {
        // El elemento ya no se pinta. No hay nada que fijar.
      }
    }
    anim.cancel();
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** La sombra en el suelo de algo que llevas cogido: grande y clara. */
export function moveShadow(
  shadow: HTMLElement | null,
  x: number,
  y: number,
  height: number,
): void {
  if (!shadow) return;
  shadow.style.transform = `translate(${x}px, ${y}px) scale(${1.4 + height / 120})`;
  shadow.style.opacity = "0.16";
}

/** Coger una ficha sin sacarla de su casilla: sube a la altura de un salto. */
export function pickUp(
  el: HTMLElement,
  shadow: HTMLElement | null,
  at: { x: number; y: number },
  hop: number,
): Animation[] {
  const options: KeyframeAnimationOptions = {
    duration: 130,
    easing: cubic(EASE_BACK),
    fill: "forwards",
  };
  const list = [el.animate([{ transform: transform(at.x, at.y, hop, 1.05, 0.97) }], options)];
  if (shadow) {
    list.push(
      shadow.animate(
        [
          {
            transform: `translate(${at.x}px, ${at.y}px) scale(${(1 + hop / 120).toFixed(3)})`,
            opacity: 0.4,
          },
        ],
        options,
      ),
    );
  }
  return list;
}

/** El temblor de cámara: una oscilación que se apaga. */
export function shake(scene: HTMLElement | null, amount: number, duration: number): void {
  if (!scene || amount <= 0 || duration <= 0) return;
  const steps = 7;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const decay = 1 - i / steps;
    const m = amount * decay;
    frames.push({
      transform:
        i === steps
          ? "translate(0px, 0px)"
          : `translate(${(Math.random() * 2 - 1) * m}px, ${(Math.random() * 2 - 1) * m * 0.6}px)`,
    });
  }
  scene.animate(frames, { duration, easing: "linear" });
}

/**
 * El estilo de un hexágono del terreno ofrecido, según a cuántos pasos esté.
 *
 * Los pasos son lo que ordena la ONDA: el hexágono de al lado se levanta antes
 * que el de tres más allá, y eso es lo que hace que la oferta parezca salir de
 * donde está el gesto en vez de encenderse toda de golpe. La duración de un
 * levantarse va en el CSS (`--offer-rise-ms`); lo que se escribe aquí es el
 * retraso de CADA UNO, que no se puede poner en una hoja de estilos porque
 * depende del hexágono.
 */
export function offerCell(
  steps: number | undefined,
  t: Timings,
): { transform: string | undefined; transitionDelay: string } {
  if (steps === undefined) return { transform: undefined, transitionDelay: "0ms" };
  return {
    transform: `translateY(${-t.offerRise}px)`,
    transitionDelay: `${rippleDelay(steps, t)}ms`,
  };
}

/** Las dos caras de lo que vuela, y su sombra en el suelo. */
export type Flyer = {
  /** El nodo que viaja. Lo único que se traslada. */
  readonly el: HTMLElement;
  /** La cara de CARTA, que se apaga en el primer tercio del vuelo. */
  readonly face: HTMLElement | null;
  /** La cara de FICHA, que aparece debajo. */
  readonly token: HTMLElement | null;
  /** Su mancha en el suelo, si el tablero tiene capa de sombras. */
  readonly shadow: HTMLElement | null;
};

/** El tablero donde cae: lo justo para el polvo y el temblor. */
export type Ground = {
  /** El nodo que tiembla al aterrizar. */
  readonly scene: HTMLElement | null;
  readonly dust: DustField | null;
  /** El radio de la casilla. De él cuelga de dónde sale el polvo. */
  readonly size: number;
};

/**
 * Cómo va el nodo mientras lo llevas cogido y cómo se queda puesto.
 *
 * Son los ÚNICOS números que cambian de un tablero a otro, y cambian porque una
 * carta y una ficha no miden lo mismo en cada sitio: en el banco de animación la
 * carta va a `cardScale` y la ficha se queda a 1; en la baraja la carta va a su
 * escala de arrastre y se queda a la que la deja del ancho de la ficha de
 * verdad. El resto de la secuencia —tiempos, curvas, cruce, polvo, temblor y
 * aplastado— es el mismo.
 *
 * `lift` es la altura a la que la llevas, que no tiene por qué ser la del dial
 * de Altura: esa es desde la que CAE, o sea la que tiene ya sobre su hexágono.
 * En el banco coinciden y en la baraja no —la carta se cuelga por encima del
 * puntero para no tapar el hexágono al que apuntas—, así que el vuelo sale de
 * donde estaba de verdad y no de donde habría estado en el otro tablero.
 */
export type Carry = {
  /** La escala a la que va cogido. */
  readonly scale: number;
  /** Y la altura sobre el suelo a la que va cogido. */
  readonly lift: number;
  /** La escala a la que se queda puesto. Es también la que se aplasta. */
  readonly rested: number;
};

/**
 * DESPLIEGUE: la carta vuela, se convierte en ficha, cae y levanta polvo.
 *
 * Va en DOS animaciones y no en una: el vuelo y la caída son un solo movimiento
 * continuo —una sola animación con un fotograma clave en medio, cada tramo con
 * su curva— y el aplastado es otra que empieza cuando la primera acaba.
 * Partirlo así tiene un motivo concreto: entre dos animaciones encadenadas
 * puede colarse un fotograma de nada, y ese hueco se ve si cae en mitad de un
 * desplazamiento, pero no se ve cuando la pieza ya está parada en el suelo.
 * Justo en ese punto es donde se emite el polvo.
 */
export async function flyAndLand(
  flyer: Flyer,
  ground: Ground,
  from: { x: number; y: number },
  target: { x: number; y: number },
  carry: Carry,
  t: Timings,
): Promise<void> {
  const { el, face, token, shadow } = flyer;
  const total = Math.max(1, t.flight + t.fall);
  const share = t.flight / total;
  const parallel: Animation[] = [];

  // La carta se cruza con la ficha durante el primer tercio del vuelo: si se
  // cruzan al final, lo que se ve es una carta que aterriza y luego cambia.
  if (face) {
    parallel.push(
      face.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: Math.max(1, t.flight * 0.55),
        easing: "ease-in",
        fill: "forwards",
      }),
    );
  }
  if (token) {
    parallel.push(
      token.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: Math.max(1, t.flight * 0.7),
        easing: "ease-out",
        fill: "forwards",
      }),
    );
  }

  // La sombra: arranca grande y casi invisible —la pieza está alta— y acaba
  // pequeña y marcada. Es lo único que dice que esto ha bajado.
  if (shadow) {
    parallel.push(
      shadow.animate(
        [
          {
            transform: `translate(${from.x}px, ${from.y}px) scale(${1.6 + carry.lift / 90})`,
            opacity: 0.12,
          },
          {
            transform: `translate(${target.x}px, ${target.y}px) scale(${1 + t.hover / 140})`,
            opacity: 0.3,
            offset: share,
          },
          { transform: `translate(${target.x}px, ${target.y}px) scale(1)`, opacity: 0.55 },
        ],
        { duration: total, easing: "linear", fill: "forwards" },
      ),
    );
  }

  await run(
    el,
    [
      {
        transform: transform(from.x, from.y, carry.lift, carry.scale),
        easing: cubic(EASE_FLIGHT),
      },
      {
        transform: transform(target.x, target.y, t.hover, carry.rested),
        offset: share,
        easing: cubic(CURVES[t.fallCurve].curve),
      },
      { transform: transform(target.x, target.y, 0, carry.rested) },
    ],
    total,
  );

  settleAnimations(parallel);

  // El suelo. Aquí es donde se levanta el polvo y donde tiembla la escena —un
  // poco, que esto es dejar una ficha, no un meteorito.
  //
  // El reventón sale del BORDE DE ABAJO de la peana y no de su centro, y no es
  // un matiz: la peana es un disco opaco de su mismo tamaño, así que un reventón
  // centrado se queda entero detrás de ella y no se ve nada durante los primeros
  // cien milisegundos, que son justo los que importan. Abajo es además donde la
  // ficha toca el suelo, que es de donde se levanta el polvo.
  ground.dust?.emit(target.x, target.y + ground.size * 0.42, landingDust(t));
  shake(ground.scene, t.shake * 0.5, t.shakeTime * 0.6);

  if (t.squash > 0) {
    const s = t.squashAmount;
    const r = carry.rested;
    await run(
      el,
      [
        {
          transform: transform(target.x, target.y, 0, r * (1 + s), r * (1 - s)),
          easing: "ease-out",
        },
        {
          transform: transform(target.x, target.y, 0, r * (1 - s * 0.35), r * (1 + s * 0.35)),
          offset: 0.55,
          easing: "ease-in-out",
        },
        { transform: transform(target.x, target.y, 0, r, r) },
      ],
      t.squash,
    );
  }
}

/**
 * La carta vuelve a su sitio: sin peso, porque no cae — la recoges.
 *
 * `to` lleva su propio giro porque el sitio del que salió puede estar girado
 * (el abanico de la mano lo está). El giro va DETRÁS de la escala en la lista de
 * transformaciones, igual que en `transform()`, y con escala uniforme eso da la
 * misma matriz que ponerlo delante: por eso el `transform` que deja escrito esta
 * animación empalma sin salto con el que escriba después la hoja de estilos,
 * aunque las dos cadenas no estén en el mismo orden.
 */
export async function returnHome(
  flyer: Flyer,
  from: { x: number; y: number },
  to: { x: number; y: number; scale: number; rotate?: number },
  carry: Pick<Carry, "scale" | "lift">,
): Promise<void> {
  const { el, shadow } = flyer;
  const parallel = shadow
    ? [
        shadow.animate(
          [{ transform: `translate(${to.x}px, ${to.y}px) scale(1.6)`, opacity: 0.18 }],
          { duration: RETURN_MS, easing: cubic(EASE_BACK), fill: "forwards" },
        ),
      ]
    : [];
  await run(
    el,
    [
      { transform: transform(from.x, from.y, carry.lift, carry.scale) },
      { transform: transform(to.x, to.y, 0, to.scale, undefined, to.rotate ?? 0) },
    ],
    RETURN_MS,
    cubic(EASE_BACK),
  );
  settleAnimations(parallel);
}
