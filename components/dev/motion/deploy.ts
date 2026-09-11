// =========================================================================
// DESPLEGAR — la carta vuela, se convierte en ficha y cae
//
// El gesto que Dario mandó escribir UNA vez, el 10 de septiembre de 2026,
// después de arrastrar una carta en los dos retales: «tenemos dos minitableros
// en Baraja y Oteo y en Animaciones, los dos —menos en apariencia— actúan
// diferente cuando se arrastra una carta a su interior. Quiero que los dos
// minitableros tengan ABSOLUTAMENTE el mismo comportamiento».
//
// Y no eran dos copias del mismo código con una cifra distinta: eran DOS
// RESPUESTAS a la misma pregunta. En /dev/animacion la carta volaba hasta el
// hexágono, se convertía en ficha a mitad del vuelo, caía, levantaba polvo,
// hacía temblar la escena un poco y se aplastaba contra el suelo; en /dev/baraja
// la ficha simplemente aparecía y la carta se iba al Mazo.
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

import { CURVES, cubic, landingDust, type Timings } from "@/lib/v3/anim";
import {
  EASE_BACK,
  EASE_FLIGHT,
  run,
  settleAnimations,
  shake,
  transform,
  type Ground,
} from "./core";

/**
 * Lo que tarda una carta en volver a su sitio cuando la sueltas donde no vale.
 *
 * No es un dial y no debería serlo: los diales miden el DESPLIEGUE, que es lo
 * que hay que afinar porque es lo que el jugador va a ver mil veces. Recoger
 * una carta que no llegó a jugarse es deshacer, y deshacer se hace rápido y en
 * un solo tiempo.
 */
const RETURN_MS = 240;

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

  // EL APLASTADO EMPIEZA DE PIE, y ese primer fotograma es todo el arreglo del
  // 11 de septiembre de 2026. Antes esta lista empezaba YA achatada: el primer
  // fotograma clave iba a 118 % de ancho por 82 % de alto, así que la pieza
  // llegaba al suelo y al fotograma siguiente estaba deformada del todo, sin
  // nada por medio. Lo vio Dario: «al llegar la ficha a tocar el tablero hace
  // como un parpadeo, un flash, y ya está al 100 %, no queda natural». Medido en
  // Chrome, la escala saltaba de 0,400 a 0,473 entre dos fotogramas seguidos.
  //
  // Achatarse es un MOVIMIENTO, no un cambio de dibujo: lo que golpea se comprime
  // contra el suelo, y esa compresión ocupa tiempo aunque sea poco. Ahora la
  // lista sale de la postura en la que la dejó la caída —la misma matriz con la
  // que acaba, así que las dos animaciones empalman sin escalón— y llega al
  // achatamiento máximo en el 28 % del tiempo: con los 110 ms de partida son
  // 31 ms, o sea dos fotogramas. Sigue siendo un golpe seco, pero es un golpe.
  //
  // Lo que NO cambia es cuánto aplasta ni cuánto dura: `squashAmount` sigue
  // llegando entero a su fotograma y el dial mide lo mismo que medía.
  if (t.squash > 0) {
    const s = t.squashAmount;
    const r = carry.rested;
    await run(
      el,
      [
        { transform: transform(target.x, target.y, 0, r, r), easing: "ease-out" },
        {
          transform: transform(target.x, target.y, 0, r * (1 + s), r * (1 - s)),
          offset: 0.28,
          easing: "ease-in-out",
        },
        {
          transform: transform(target.x, target.y, 0, r * (1 - s * 0.35), r * (1 + s * 0.35)),
          offset: 0.64,
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

/** Posar de nuevo lo que se cogió sin llegar a moverlo de casilla. */
export async function putDown(
  flyer: Pick<Flyer, "el" | "shadow">,
  at: { x: number; y: number },
  scale = 1,
): Promise<void> {
  const { el, shadow } = flyer;
  const parallel = shadow
    ? [
        shadow.animate([{ transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 0.55 }], {
          duration: 170,
          easing: "ease-out",
          fill: "forwards",
        }),
      ]
    : [];
  await run(el, [{ transform: transform(at.x, at.y, 0, scale) }], 170, "ease-out");
  settleAnimations(parallel);
}
