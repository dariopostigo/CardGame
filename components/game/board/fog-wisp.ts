// =========================================================================
// El jirón de niebla: un sprite generado, no una imagen
//
// La referencia (codepen.io/faltastic/pen/evKbEV, «Forrest Fog») dibuja un PNG
// de humo repetido muchas veces. Aquí ese PNG se GENERA al montar, por dos
// motivos: el del pen es un archivo ajeno colgado de un blog de 2012 —el enlace
// que se rompe y deja el efecto sin niebla—, y generándolo el color sale del
// token de siempre en vez de venir cocido en los píxeles.
//
// La receta se ajustó a ojo contra ImageMagick antes de traerla:
//
//   alfa = ruido + radial − 1     (recortado a 0…1)
//
// La resta es lo importante y es lo que costó acertar. Multiplicar el ruido por
// una máscara redonda —lo evidente— da una BOLA de algodón: por muy irregular
// que sea el ruido, la silueta la acaba dibujando el círculo. Restando, el
// contorno lo decide el ruido al cruzar el umbral, así que el jirón sale con los
// bordes rotos y con huecos, y el radial solo garantiza que no toque el borde
// del sprite (donde se vería el corte).
// =========================================================================

/**
 * Lado del sprite en píxeles. Pequeño a propósito: en pantalla se dibuja de dos
 * a tres veces más grande, y el difuminado que eso provoca es gratis y a la
 * niebla le sienta bien. Generarlo a 256 costaría cuatro veces más tiempo de
 * montaje para un detalle que nadie va a mirar de cerca.
 */
export const WISP_SIZE = 128;

/** Cuántos jirones distintos se generan. Con menos se lee el patrón al repetir. */
export const WISP_VARIANTS = 4;

/**
 * Octavas de ruido y celdas de la más gruesa. Cinco octavas desde 3 celdas
 * llegan a ~2,7 px por celda en la más fina: a partir de ahí el detalle se lo
 * come el escalado a pantalla.
 */
const OCTAVES = 5;
const BASE_CELLS = 3;

/**
 * Con cuánta suavidad muere el jirón hacia el borde. Es la gamma del
 * `radial-gradient` de la prueba: por debajo de 1 el jirón se queda en un grumo
 * central, por encima de ~1,3 vuelve a asomar el círculo.
 */
const FALLOFF = 0.556;

/**
 * Cuánto se comprime el ruido en horizontal antes de muestrearlo, de la primera
 * variante a la última. Comprimir en X estira las estructuras en X, y las vetas
 * horizontales son lo que hace que una mancha se lea como niebla y no como humo
 * de un cigarro. Pasado 3 el jirón empieza a parecer un planeta con bandas.
 */
const STRETCH = [1.6, 2.6] as const;

/** PRNG con semilla: dos montajes del mismo lab dan la misma niebla. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Una octava de value noise: valores al azar en una rejilla, interpolados con
 * smoothstep. La interpolación suave es la que hace que no haga falta desenfocar
 * después, que es lo que hacía la prueba con ImageMagick.
 */
function octave(rand: () => number, cells: number) {
  const grid = new Float32Array((cells + 1) * (cells + 1));
  for (let i = 0; i < grid.length; i++) grid[i] = rand();

  return (x: number, y: number) => {
    const fx = x * cells;
    const fy = y * cells;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = smoothstep(fx - x0);
    const ty = smoothstep(fy - y0);
    const at = (cx: number, cy: number) => grid[cy * (cells + 1) + cx];
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return top * (1 - ty) + bottom * ty;
  };
}

/**
 * Pinta un jirón en un lienzo aparte, listo para repetirlo con `drawImage`.
 *
 * @param color Cualquier color CSS. Lo resuelve el propio navegador (ver abajo),
 *   así que puede llegar tal cual desde `getComputedStyle`.
 * @param variant Índice de la variante, de 0 a WISP_VARIANTS − 1.
 */
export function createWisp(color: string, variant: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = WISP_SIZE;
  canvas.height = WISP_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas; // sin 2d no hay niebla, pero tampoco hay tablero

  // El color se resuelve pintándolo y leyendo el píxel: así vale cualquier
  // formato CSS (hex, rgb(), color-mix(), una custom property ya calculada) sin
  // escribir aquí un parseador que iría por detrás del navegador.
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [red, green, blue] = ctx.getImageData(0, 0, 1, 1).data;
  ctx.clearRect(0, 0, 1, 1);

  const rand = mulberry32(variant * 9973 + 7);
  const layers: Array<{ sample: (x: number, y: number) => number; amp: number }> = [];
  let amp = 1;
  let total = 0;
  for (let o = 0; o < OCTAVES; o++) {
    layers.push({ sample: octave(rand, BASE_CELLS * 2 ** o), amp });
    total += amp;
    amp *= 0.5;
  }

  const spread = WISP_VARIANTS > 1 ? variant / (WISP_VARIANTS - 1) : 0;
  const stretch = STRETCH[0] + (STRETCH[1] - STRETCH[0]) * spread;

  const image = ctx.createImageData(WISP_SIZE, WISP_SIZE);
  const half = WISP_SIZE / 2;
  for (let y = 0; y < WISP_SIZE; y++) {
    for (let x = 0; x < WISP_SIZE; x++) {
      const u = 0.5 + (x / WISP_SIZE - 0.5) / stretch;
      const v = y / WISP_SIZE;
      let noise = 0;
      for (const layer of layers) noise += layer.sample(u, v) * layer.amp;
      noise /= total;

      const distance = Math.hypot(x - half, y - half) / half;
      const radial = distance >= 1 ? 0 : (1 - distance) ** FALLOFF;

      const i = (y * WISP_SIZE + x) * 4;
      image.data[i] = red;
      image.data[i + 1] = green;
      image.data[i + 2] = blue;
      image.data[i + 3] = Math.max(0, Math.min(1, noise + radial - 1)) * 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}
