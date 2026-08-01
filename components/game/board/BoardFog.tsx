"use client";

// =========================================================================
// Niebla de atmósfera: jirones a la deriva por delante del tablero
//
// Es la referencia que pidió Dario, «Forrest Fog»
// (codepen.io/faltastic/pen/evKbEV, a su vez fork de un jsfiddle de Jonny
// Cornwell): un lienzo con muchos sprites de humo semitransparentes, cada uno
// con su rumbo, rebotando en los bordes. Nada de ruido procedural animado —eso
// se probó antes y no se veía moverse—, y el motivo está medido: lo que hace
// que el ojo perciba movimiento no es la velocidad en píxeles, es cuánto recorre
// cada jirón EN RELACIÓN CON SU TAMAÑO. El intento anterior arrastraba manchas
// de 250 px a 11 px/s (un 4 % de su tamaño por segundo, invisible); aquí cada
// jirón mide unos 300 px y se mueve a ~66 px/s, más de un 20 % por segundo.
//
// Va en un <canvas> y no en SVG porque son decenas de sprites repintados 30
// veces por segundo: eso es dibujo, no documento.
//
// Y va DEBAJO del tablero: la niebla es de la MESA, no un velo sobre el mapa.
// Se probó por delante, como en la referencia, y las losetas se leían igual pero
// la niebla no se apreciaba encima de ellas: medido, el mismo jirón aclara la
// mesa un 54 % (rgb 28,21,18 → 43,36,32) y una loseta solo un 4 % (155,179,105 →
// 161,182,115). Sobre un verde ya claro un velo claro casi no cambia nada, así
// que lo que se ganaba era ensuciar el terreno sin ganar atmósfera. Debajo, el
// tablero queda limpio y la niebla se ve donde de verdad luce: alrededor, por
// debajo de su sombra y por los huecos cerrados, que son agujeros de verdad.
//
// Lo que NO hace: moverse con la cámara. La niebla está en la mesa, no pegada al
// mapa, así que acercar o arrastrar el tablero no la arrastra. Por eso vive aquí,
// hermana del <svg> y fuera del grupo de la cámara.
//
// Tampoco recibe el ratón (pointer-events en _board.scss): el arrastre y el
// clic en un hexágono tienen que atravesarla.
// =========================================================================

import { useEffect, useRef } from "react";
import { WISP_SIZE, WISP_VARIANTS, createWisp } from "./fog-wisp";

/**
 * Velocidad máxima de un jirón en cada eje, en píxeles por segundo. La
 * referencia usa 2 px por fotograma a 33 fps ≈ 66 px/s, y se mide por segundo y
 * no por fotograma para que la niebla vaya igual de rápido en una pantalla de
 * 60 Hz y en una de 144.
 */
const SPEED = 66;

/**
 * Cuánto marco le toca a cada jirón, en píxeles cuadrados. La referencia pone
 * 60 en un lienzo de unos 900×600. Es la palanca de la DENSIDAD: subirlo aclara
 * la niebla, bajarlo la cierra.
 */
const AREA_PER_WISP = 9000;

/** Topes del recuento: ni un marco diminuto se queda sin niebla ni uno enorme funde la GPU. */
const MIN_WISPS = 16;
const MAX_WISPS = 72;

/** Tamaño en pantalla, en múltiplos de WISP_SIZE. Mezclar tamaños da profundidad. */
const MIN_SCALE = 1.6;
const MAX_SCALE = 3.2;

/** Opacidad de cada jirón. La del conjunto la pone `.board__fog` en el SCSS. */
const MIN_ALPHA = 0.22;
const MAX_ALPHA = 0.55;

/**
 * Giro máximo de un jirón, en radianes (~25°). Poco a propósito: las vetas del
 * sprite son horizontales y es justo eso lo que lo hace leerse como niebla
 * tendida. Girado 90° parece humo subiendo.
 */
const MAX_TILT = 0.44;

/**
 * Tiempo máximo que se le pasa a un paso de la simulación. Al volver a una
 * pestaña que estuvo en segundo plano el primer fotograma trae un salto enorme,
 * y sin tope la niebla aparecería teletransportada.
 */
const MAX_STEP = 0.05;

/** Fotogramas por segundo. La referencia usa 33; para algo tan difuso, de sobra. */
const FPS = 30;

type Wisp = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  angle: number;
  art: HTMLCanvasElement;
};

export default function BoardFog() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // El color de la niebla lo pone el SCSS como `color` de este lienzo: es un
    // token de settings como cualquier otro, y aquí solo se lee. Es el mismo
    // truco que con `stop-color` en los degradados del SVG.
    const tint = getComputedStyle(canvas).color;
    const art = Array.from({ length: WISP_VARIANTS }, (_, i) => createWisp(tint, i));

    const wisps: Wisp[] = [];
    let width = 0;
    let height = 0;

    const between = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (): Wisp => {
      const size = WISP_SIZE * between(MIN_SCALE, MAX_SCALE);
      return {
        // Los centros se sortean con margen fuera del marco: así hay jirones a
        // medio entrar desde el primer fotograma y no se nota el arranque.
        x: between(-size / 2, width + size / 2),
        y: between(-size / 2, height + size / 2),
        vx: between(-SPEED, SPEED),
        vy: between(-SPEED, SPEED),
        size,
        alpha: between(MIN_ALPHA, MAX_ALPHA),
        angle: between(-MAX_TILT, MAX_TILT),
        art: art[Math.floor(Math.random() * art.length)],
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // El lienzo se queda a 1 px por píxel CSS, sin devicePixelRatio: en una
      // pantalla densa se escalaría por cuatro el relleno de cada fotograma
      // para ganar un detalle que la niebla no tiene. Que el navegador la
      // agrande difuminándola es exactamente lo que se quiere.
      const next = { w: Math.round(rect.width), h: Math.round(rect.height) };
      if (next.w === width && next.h === height) return;

      // Los jirones que ya andaban por ahí se recolocan a proporción en vez de
      // sortearse otra vez: cambiar el tamaño de la ventana no debería barrer la
      // niebla y volver a echarla.
      if (width && height) {
        for (const wisp of wisps) {
          wisp.x *= next.w / width;
          wisp.y *= next.h / height;
        }
      }

      width = next.w;
      height = next.h;
      canvas.width = width;
      canvas.height = height;

      const target = Math.min(
        MAX_WISPS,
        Math.max(MIN_WISPS, Math.round((width * height) / AREA_PER_WISP)),
      );
      while (wisps.length > target) wisps.pop();
      while (wisps.length < target) wisps.push(spawn());
      paint();
    };

    // Rebote en los bordes, como en la referencia, pero contra un rectángulo más
    // grande que el marco: si rebotaran justo en el borde se vería el sprite
    // recortado por el canto del lienzo, y la niebla se apelotonaría en los
    // bordes. Rebotando fuera de la vista, los jirones entran y salen.
    const step = (dt: number) => {
      for (const wisp of wisps) {
        const margin = wisp.size * 0.4;
        wisp.x += wisp.vx * dt;
        wisp.y += wisp.vy * dt;
        if (wisp.x <= -margin || wisp.x >= width + margin) {
          wisp.vx = -wisp.vx;
          wisp.x = Math.min(Math.max(wisp.x, -margin), width + margin);
        }
        if (wisp.y <= -margin || wisp.y >= height + margin) {
          wisp.vy = -wisp.vy;
          wisp.y = Math.min(Math.max(wisp.y, -margin), height + margin);
        }
      }
    };

    function paint() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const wisp of wisps) {
        ctx.globalAlpha = wisp.alpha;
        ctx.translate(wisp.x, wisp.y);
        ctx.rotate(wisp.angle);
        ctx.drawImage(wisp.art, -wisp.size / 2, -wisp.size / 2, wisp.size, wisp.size);
        // Devolver la matriz a mano sale más barato que save()/restore() por
        // jirón, y aquí solo hay una traslación y un giro que deshacer.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.globalAlpha = 1;
    }

    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = (now - last) / 1000;
      if (dt < 1 / FPS) return;
      last = now;
      step(Math.min(dt, MAX_STEP));
      paint();
    };

    // La niebla solo corre cuando hay algo que mirar: si el tablero está fuera de
    // la pantalla (el lab tiene bastante prosa debajo) o si quien mira ha pedido
    // menos movimiento, se queda quieta. Parada sigue siendo niebla: el último
    // fotograma pintado se queda donde está.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onScreen = true;

    const sync = () => {
      const shouldRun = onScreen && !calm.matches;
      if (shouldRun && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const seen = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    const box = new ResizeObserver(resize);

    resize();
    seen.observe(canvas);
    box.observe(canvas);
    calm.addEventListener("change", sync);
    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      seen.disconnect();
      box.disconnect();
      calm.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={canvasRef} className="board__fog" aria-hidden="true" />;
}
