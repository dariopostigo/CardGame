// =========================================================================
// OFRECER EL TERRENO — el hexágono que se levanta cuando puedes soltar ahí
//
// Es la más pequeña del directorio y la única que NO es una secuencia: es un
// estado —«estos hexágonos te aceptan»— que se enciende y se apaga con el gesto.
// Eso en CSS es una transición, y por eso lo único que hay aquí es el estilo de
// cada hexágono; la duración de un levantarse vive en la hoja de estilos
// (`--offer-rise-ms`). Hacerlo con la Web Animations API obligaría a lanzar y
// cancelar quince animaciones cada vez que se coge algo.
//
// LO QUE SÍ NO PUEDE VIVIR EN CSS es el RETRASO DE CADA UNO, que es lo que hace
// la onda: depende de a cuántos pasos esté ese hexágono del origen, y una hoja
// de estilos no sabe contar hexágonos.
//
// Y LOS PASOS NO SON LA DISTANCIA. Para una ficha los da el propio recorrido en
// anchura de `movement.ts reachable`, que RODEA los cuerpos: un hexágono al que
// hay que dar la vuelta se levanta más tarde que uno a la misma distancia en
// línea recta, y esa diferencia es el peaje del §5 hecho visible.
// =========================================================================

import { rippleDelay, type Timings } from "@/lib/v3/anim";

/**
 * El estilo de un hexágono del terreno ofrecido, según a cuántos pasos esté.
 *
 * @param {number | undefined} steps - Pasos desde el origen de la onda, o
 *   `undefined` si este hexágono no se ofrece.
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
