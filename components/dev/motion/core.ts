// =========================================================================
// Las primitivas del movimiento — lo que usan TODAS las secuencias
//
// Esto es la mesa de trabajo, no una secuencia: poner un `transform`, lanzar una
// animación y esperarla bien cerrada, mover una sombra, coger algo, hacer
// temblar la escena. Lo usan el despliegue, la embestida, el paso, la muerte y
// el aliento, y por eso está separado de todos ellos.
//
// LA REGLA DE TODO ESTE DIRECTORIO, que es lo que lo hace valer: aquí no entra
// nada que sepa de React, ni de qué es una ficha, ni de qué hexágonos hay. Se
// le pasan NODOS y PUNTOS YA MEDIDOS. Cada pantalla mide con su geometría y
// dibuja dentro del nodo lo que quiera —en el banco un disco con un glifo, en la
// baraja la ficha de verdad—, y la secuencia es la misma.
//
// DE DÓNDE VIENE: era deploy-motion.ts, un archivo solo, nacido el 10 de
// septiembre de 2026 porque Dario comparó los dos minitableros y pidió que
// hicieran «ABSOLUTAMENTE lo mismo». Se parte en piezas el 11 de septiembre por
// el motivo siguiente: mientras la embestida, el paso, el aliento y la muerte
// vivieran DENTRO de AnimationBench.tsx —unas 560 líneas—, no había forma de
// mirar una sola de ellas sin arrastrar la pantalla entera, y eso es lo que
// impedía que existiera un banco por animación. Un catálogo de secuencias
// necesita que cada secuencia sea una función a la que se pueda llamar.
// =========================================================================

import { cubic } from "@/lib/v3/anim";

/** Curvas que no son diales porque no se discuten. */
export const EASE_FLIGHT: readonly [number, number, number, number] = [0.3, 0.1, 0.2, 1];
export const EASE_BACK: readonly [number, number, number, number] = [0.3, 0, 0.3, 1];
/** La de la embestida: sale disparada y llega sin frenar. */
export const EASE_LUNGE: readonly [number, number, number, number] = [0.4, 0, 0.2, 1];

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
 * Cierra una animación dejando su postura final escrita, SIN despertar la
 * `transition` de CSS del elemento.
 *
 * EL CUARTO PASO DEL TRÍO *(11 de septiembre de 2026)*, y hacía falta porque
 * faltaba: `commitStyles()` escribe la postura final en el ESTILO EN LÍNEA, y a
 * un elemento que tenga `transition` en su hoja de estilos esa escritura le
 * arranca una transición —desde donde estaba ANTES de la animación, que es lo
 * único que el CSS sabe de él—. Mientras la animación sigue rellenando no se ve
 * nada, porque gana ella; en cuanto se la cancela, lo que se pinta es esa
 * transición recién nacida: la pieza reaparece de un fotograma para otro en la
 * postura de la que había salido y se queda ahí medio segundo.
 *
 * Lo vio Dario el 11 de septiembre de 2026 soltando una carta en el tablero de
 * /dev/baraja: «al llegar la ficha a tocar el tablero hace un flash y ya está al
 * 100%». Medido en Chrome, la carta volvía a `scale(2)` sobre el puntero durante
 * ~200 ms antes de aparecer posada de golpe; lo que se veía era el fotograma o
 * dos que tarda React en quitar la carta de en medio.
 *
 * Y era SOLO en la baraja porque es el único de los dos minitableros cuya carta
 * lleva `transition` puesta —la usa para repartir y para volver al Mazo—: el
 * banco de animación mueve todo con JS y por eso allí no se veía. O sea justo el
 * tipo de diferencia entre los dos que este directorio existe para borrar.
 *
 * El apagón dura lo que la escritura: se apaga la transición, se fija la
 * postura, se fuerza un recálculo de estilo —eso es lo que hace que el navegador
 * dé por buena la postura nueva sin nada que interpolar— y se devuelve la
 * transición a lo que fuera. Al terminar, quien escriba después en ese elemento
 * vuelve a tener su transición, que es de lo que vive el reparto del Oteo.
 */
function settle(anim: Animation, el: HTMLElement | SVGElement): void {
  if (!el.isConnected) {
    anim.cancel();
    return;
  }
  const before = el.style.transition;
  el.style.transition = "none";
  try {
    anim.commitStyles();
  } catch {
    // Firefox lanza si el elemento no está pintado. El fill ya lo sostiene.
  }
  anim.cancel();
  // Leer el estilo calculado obliga al recálculo AQUÍ y no al final del
  // fotograma, que es lo que hay que provocar mientras la transición está
  // apagada. `getComputedStyle` y no `offsetWidth` porque esto vale también
  // para nodos de SVG, que no tienen caja.
  void getComputedStyle(el).transform;
  el.style.transition = before;
}

/**
 * Lanza una animación y espera a que acabe, dejando el estado final escrito.
 *
 * `fill: "forwards"` + `commitStyles()` + `cancel()` es el trío obligatorio: sin
 * el primero la pieza vuelve de un salto a donde estaba; sin el segundo, el
 * salto ocurre al cancelar; y sin el tercero cada animación se queda viva para
 * siempre y a las cien caídas el navegador está manteniendo cien. El cierre lo
 * hace `settle`, que además impide que esa escritura despierte la `transition`
 * de CSS del elemento — ver su cabecera, que es donde está el porqué.
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
    settle(anim, el);
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
    // Y SE FIJA TAMBIÉN LO QUE CORRE SOBRE SVG, que es el arreglo del 11 de
    // septiembre de 2026 y no un detalle de tipos: aquí ponía `instanceof
    // HTMLElement`, y un `<svg>` NO es un HTMLElement —es un SVGSVGElement—, así
    // que la cara de FICHA del despliegue, que es el único `<svg>` de la lista,
    // era la única a la que no se le fijaba nada.
    //
    // Lo que se veía: la ficha se cruzaba con la carta en el aire porque la
    // animación estaba RELLENANDO, no porque su opacidad estuviera escrita. Al
    // tocar el suelo se cierra la animación, y sin fijar la opacidad el `<svg>`
    // volvía al `opacity: 0` con el que nace — así que la ficha DESAPARECÍA del
    // tablero y no volvía hasta que React la cambiaba por la ficha de verdad,
    // ~150 ms después. Medido: pintada a 1 en el milisegundo 463 y a 0 en el 481.
    // Eso es el parpadeo que Dario vio tres veces seguidas *(«justo después de
    // caer en el tablero hace un parpadeo»)*, y las dos veces anteriores que lo
    // busqué miré la POSTURA de la carta, que estaba perfecta, en vez de mirar si
    // se veía.
    //
    // El aliento no entra por aquí —`IdleChorus.stop()` cancela a mano, y una
    // respiración infinita no tiene estado final que fijar—, así que fijar lo de
    // SVG no le afecta.
    const target = (anim.effect as KeyframeEffect | null)?.target ?? null;
    if (target instanceof HTMLElement || target instanceof SVGElement) settle(anim, target);
    else anim.cancel();
  }
}

/** Espera a que todas terminen y las cierra con la misma disciplina. */
export async function settleAll(list: readonly Animation[]): Promise<void> {
  await Promise.allSettled(list.map((a) => a.finished));
  settleAnimations(list);
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
 * Lo que una secuencia necesita saber del tablero donde ocurre: lo justo para el
 * polvo y el temblor.
 *
 * No lleva el retal ni la geometría a propósito. Quien llama ya ha medido: le
 * pasa PUNTOS. Lo único que viaja de la geometría es el radio de la casilla,
 * porque de él cuelga de dónde sale el polvo y cuánto se aparta quien esquiva.
 */
export type Ground = {
  /** El nodo que tiembla. Es la escena, nunca el escenario que se mide. */
  readonly scene: HTMLElement | null;
  readonly dust: DustLike | null;
  readonly size: number;
};

/**
 * Lo que las secuencias le piden al campo de partículas.
 *
 * Es la interfaz y no la clase para que este directorio no dependa del lienzo:
 * una secuencia se puede ejecutar contra un campo de mentira —o contra null— y
 * sigue durando lo mismo, que es justo la propiedad que hace comprobable a
 * `schedule()`.
 */
export type DustLike = {
  emit(x: number, y: number, spec: import("@/lib/v3/anim").DustSpec): void;
  pause(): void;
  resume(): void;
};
