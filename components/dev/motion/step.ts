// =========================================================================
// ANDAR — de hexágono en hexágono, con un saltito y una pisada en cada uno
//
// LOS PASOS SE ANIMAN UNO A UNO y no se desliza la ficha hasta el destino, y esa
// es toda la decisión de este archivo. El camino lo da `movement.ts pathTo` y
// puede tener más pasos que la distancia en línea recta, porque no se atraviesa
// a nadie (§5). Eso es exactamente lo que la animación tiene que enseñar: el
// rodeo se ve andando, y es lo que convierte «no llegas» en «llegas, pero te
// cuesta». Un deslizamiento recto atravesaría al que estorba y contaría una
// mentira.
//
// EMPIEZA EN EL PUNTO MÁS ALTO DEL SALTO y no en el suelo, y eso sale gratis de
// otra decisión: la postura de estar cogida es exactamente el ápice de un paso
// (`stepHop`), así que al soltar no hay que recomponer nada — la ficha ya está
// en el aire y el primer tramo del camino es su aterrizaje.
//
// EL POLVO DE LA PISADA es el reventón más pequeño del catálogo y el que más
// veces se va a emitir: una ficha con 👢 3 deja tres por turno, y quince fichas
// por bando son noventa pisadas por ronda. Aquí la cantidad no es gusto, es
// presupuesto.
// =========================================================================

import { stepDust, type Timings } from "@/lib/v3/anim";
import { run, settleAnimations, transform, type Ground } from "./core";

/** Quién anda: el nodo que se desplaza y su mancha en el suelo. */
export type Walker = {
  readonly el: HTMLElement;
  readonly shadow: HTMLElement | null;
};

/**
 * Anda el camino entero, punto por punto.
 *
 * @param {readonly {x,y}[]} way - Los centros del camino YA medidos, el primero
 *   el de salida. Quien llama ya tradujo hexágonos a píxeles: aquí no hay
 *   geometría, por la regla de todo este directorio.
 * @returns {number} Lo que ha durado, que es lo que la pantalla escribe debajo.
 */
export async function walkPath(
  walker: Walker,
  way: readonly { x: number; y: number }[],
  ground: Ground,
  t: Timings,
): Promise<number> {
  const { el, shadow } = walker;
  if (way.length < 2) return 0;

  const steps = way.length - 1;
  const total = Math.max(1, steps * t.step);
  const apex = (at: { x: number; y: number }) =>
    `translate(${at.x}px, ${at.y}px) scale(${(1 + t.stepHop / 120).toFixed(3)})`;

  const frames: Keyframe[] = [
    { transform: transform(way[0].x, way[0].y, t.stepHop, 1.05, 0.97), offset: 0, easing: "ease-in" },
  ];
  const shadowFrames: Keyframe[] = [
    { transform: apex(way[0]), opacity: 0.4, offset: 0, easing: "ease-in" },
  ];

  for (let i = 1; i <= steps; i++) {
    const last = i === steps;
    frames.push({
      transform: transform(way[i].x, way[i].y, 0, last ? 1 : 1.02, last ? 1 : 0.98),
      offset: i / steps,
      easing: "ease-out",
    });
    shadowFrames.push({
      transform: `translate(${way[i].x}px, ${way[i].y}px) scale(1)`,
      opacity: 0.55,
      offset: i / steps,
      easing: "ease-out",
    });
    if (last) break;
    // El ápice entre esta casilla y la siguiente: andar es una sucesión de
    // saltitos, así que el punto alto va EN MEDIO de cada tramo y no encima de
    // los hexágonos.
    const mid = { x: (way[i].x + way[i + 1].x) / 2, y: (way[i].y + way[i + 1].y) / 2 };
    frames.push({
      transform: transform(mid.x, mid.y, t.stepHop, 1.03, 0.97),
      offset: (i + 0.5) / steps,
      easing: "ease-in",
    });
    shadowFrames.push({ transform: apex(mid), opacity: 0.4, offset: (i + 0.5) / steps, easing: "ease-in" });
  }

  // Una mota por pisada, en el momento de cada aterrizaje.
  const timers: number[] = [];
  for (let i = 1; i <= steps; i++) {
    timers.push(
      window.setTimeout(
        () => ground.dust?.emit(way[i].x, way[i].y + ground.size * 0.42, stepDust(t)),
        (i / steps) * total,
      ),
    );
  }

  const parallel = shadow
    ? [shadow.animate(shadowFrames, { duration: total, easing: "linear", fill: "forwards" })]
    : [];
  try {
    await run(el, frames, total);
  } finally {
    // Si la pantalla se va a mitad del camino, las pisadas que faltaban no
    // pueden seguir emitiéndose contra un lienzo que ya no existe.
    for (const id of timers) window.clearTimeout(id);
  }
  settleAnimations(parallel);
  return total;
}
