// =========================================================================
// El polvo — un emisor de partículas sobre <canvas>, sin librería y sin React
//
// Mismo patrón que dice-scene.ts en /lab: una clase que se le entrega a un
// <canvas> y que no sabe que existe React. El componente la crea una vez, le
// pide reventones y la destruye al desmontarse.
//
// POR QUÉ CANVAS Y NO SVG, que es lo que usa el resto del tablero: porque
// treinta partículas son treinta nodos del DOM que el navegador tiene que
// maquetar, componer y volver a pintar SESENTA VECES POR SEGUNDO, y aquí el
// caso peor no son treinta. Con quince fichas por bando andando y pegando a la
// vez, un solo reventón por acción ya son cientos. En canvas son cientos de
// `drawImage`, que es lo que un canvas hace todo el día.
//
// POR QUÉ UNA IMAGEN Y NO UN CÍRCULO: pintar un degradado radial por partícula
// y por fotograma es rehacer el degradado miles de veces por segundo. En vez de
// eso se pinta UNA vez en un canvas aparte (`sprite`) y luego solo se copia,
// escalada y con la opacidad que toque. Es el truco de siempre de los sistemas
// de partículas y es la diferencia entre ir a 60 y arrastrarse.
//
// De ahí sale también la única mancha del proyecto que no vive en styles/: el
// color de las partículas llega como parámetro desde lib/v3/anim.ts (las tres
// nubes) porque es un argumento de dibujo, no una regla de hoja de estilos —el
// canvas no tiene cascada—. Si algún día hay que unificarlo, el sitio es
// settings/_colors.scss y que anim.ts lo lea de una variable CSS.
//
// El bucle SE PARA SOLO cuando no queda ninguna partícula viva. Un rAF
// permanente en una página de laboratorio que casi siempre está quieta es
// batería tirada.
// =========================================================================

import type { DustSpec } from "@/lib/v3/anim";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Segundos vividos y segundos totales. */
  age: number;
  life: number;
  size: number;
  color: string;
  additive: boolean;
  /** Cuánto ha crecido, de 1 a GROWTH. */
  scale: number;
  // La física va en la PARTÍCULA y no en el emisor, aunque el reventón entero
  // comparta valores: las nubes conviven —se puede pegar mientras todavía flota
  // el polvo del despliegue— y el polvo sube (gravedad negativa) mientras las
  // chispas del golpe caen. Con estos dos campos en el emisor, el segundo
  // reventón le cambiaba la física al primero a mitad de vuelo.
  gravity: number;
  drag: number;
};

/** Cuánto crece una partícula a lo largo de su vida. El polvo se expande. */
const GROWTH = 2.4;

/** El tope de salto entre fotogramas. Sin esto, volver a una pestaña de fondo
 *  teletransporta todas las partículas al infinito de una sola vez. */
const MAX_STEP = 1 / 30;

/**
 * Lo que se adelanta el reventón justo antes de congelarlo. Ver `pause()`.
 *
 * Dos fotogramas y no más: lo que se busca es que en el fotograma del impacto
 * la corona ya esté abierta, no que se haya disipado a medias antes de que la
 * escena vuelva a moverse.
 */
const FREEZE_PREROLL = 2 / 60;

export class DustField {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly particles: Particle[] = [];
  /** Una mancha pintada por color, reutilizada por todas sus partículas. */
  private readonly sprites = new Map<string, HTMLCanvasElement>();
  private frame: number | null = null;
  private last = 0;
  private paused = false;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("DustField: este navegador no da contexto 2D.");
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Ajusta el lienzo al tamaño que ocupa en pantalla.
   *
   * Los dos tamaños de un canvas son distintos y hay que llevarlos a mano: el
   * de CSS (lo que mide en la página) y el de su mapa de bits. Si el segundo no
   * multiplica por la densidad de la pantalla, en un portátil moderno el polvo
   * sale borroso. Con el `setTransform` de después, todo lo que se dibuje se
   * puede seguir midiendo en píxeles de CSS, que es lo que sabe el componente.
   */
  resize(width: number, height: number): void {
    const dpr = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Un reventón en un punto. Es lo único que el componente le pide. */
  emit(x: number, y: number, spec: DustSpec): void {
    const {
      count,
      speed,
      life,
      size,
      gravity,
      drag,
      color,
      additive = false,
      direction = -Math.PI / 2,
      spread = Math.PI * 2,
    } = spec;

    for (let i = 0; i < count; i++) {
      // El ángulo se reparte por el abanico con un pellizco de azar, en vez de
      // ser azar puro: con pocas partículas el azar puro deja huecos y racimos,
      // y un reventón con huecos no se lee como una nube.
      const slot = count > 1 ? i / (count - 1) - 0.5 : 0;
      const angle = direction + slot * spread + (Math.random() - 0.5) * (spread / count);
      // La velocidad al cuadrado reparte más partículas cerca del centro que en
      // el borde, que es como se ve un reventón de verdad.
      const v = speed * (0.35 + 0.65 * Math.random() ** 0.5);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        age: 0,
        life: (life / 1000) * (0.7 + Math.random() * 0.6),
        size: size * (0.6 + Math.random() * 0.8),
        color,
        additive,
        scale: 1,
        gravity,
        drag,
      });
    }

    this.start();
  }

  /**
   * Congela el tiempo sin perder el estado. Es el hit-stop.
   *
   * Y antes de congelar, ADELANTA el reventón dos fotogramas y lo pinta. Sin
   * eso, el orden real de las cosas es: la secuencia emite el polvo y congela la
   * escena en el mismo instante, así que el bucle nunca llega a pintar ni una
   * partícula — durante todo el congelado no se ve nada, y el reventón aparece
   * de golpe cuando ya se ha reanudado y la ficha vuelve a su casilla. Es justo
   * lo contrario de para lo que existe el hit-stop, que es enseñar el fotograma
   * del impacto, y es tanto peor cuanto más largo: con el congelado del crítico
   * (×2,2) las chispas se las tragaba enteras. Con el adelanto, lo que se queda
   * quieto es la corona ya abierta.
   */
  pause(): void {
    if (this.paused) return;
    this.paused = true;
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
    this.step(FREEZE_PREROLL);
    this.draw();
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    // Sin esto, el tiempo parado cuenta como un salto enorme en el primer
    // fotograma y las partículas aparecen ya muertas al otro lado de la pantalla.
    this.last = performance.now();
    this.start();
  }

  clear(): void {
    this.particles.length = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy(): void {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.particles.length = 0;
    this.sprites.clear();
  }

  get count(): number {
    return this.particles.length;
  }

  // --- Bucle ---------------------------------------------------------------

  private start(): void {
    if (this.frame !== null || this.paused) return;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = (now: number): void => {
    this.frame = null;
    if (this.paused) return;

    const dt = Math.min((now - this.last) / 1000, MAX_STEP);
    this.last = now;

    this.step(dt);
    this.draw();

    if (this.particles.length > 0) {
      this.frame = requestAnimationFrame(this.tick);
    }
  };

  private step(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        // Se saca por intercambio con la última en vez de con splice: no
        // importa el orden y así no se recorre el resto del array.
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
        continue;
      }
      // El rozamiento es exponencial y no lineal: una partícula pierde una
      // FRACCIÓN de lo que le queda por segundo, así que frena mucho al
      // principio y casi nada al final. Restar una cantidad fija la pararía en
      // seco.
      const damping = Math.exp(-p.drag * dt);
      p.vy += p.gravity * dt;
      p.vx *= damping;
      p.vy *= damping;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.scale = 1 + (GROWTH - 1) * (p.age / p.life);
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    let additive = false;
    ctx.globalCompositeOperation = "source-over";

    for (const p of this.particles) {
      const t = p.age / p.life;
      // Entra de golpe y se va despacio: una nube de polvo aparece en un
      // fotograma y tarda en disiparse. El 0,12 es cuánto dura esa entrada.
      const alpha = t < 0.12 ? t / 0.12 : (1 - (t - 0.12) / 0.88) ** 1.6;
      if (alpha <= 0.01) continue;

      if (p.additive !== additive) {
        additive = p.additive;
        ctx.globalCompositeOperation = additive ? "lighter" : "source-over";
      }

      const sprite = this.spriteFor(p.color);
      const r = p.size * p.scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /** La mancha de un color, pintada una sola vez y guardada. */
  private spriteFor(color: string): HTMLCanvasElement {
    const cached = this.sprites.get(color);
    if (cached) return cached;

    const R = 32;
    const c = document.createElement("canvas");
    c.width = R * 2;
    c.height = R * 2;
    const g = c.getContext("2d");
    if (g) {
      const grad = g.createRadialGradient(R, R, 0, R, R, R);
      // Tres paradas y no dos: con dos, el borde de la mancha se ve como un
      // aro. La del 45 % es la que le da el centro lleno y el borde comido.
      grad.addColorStop(0, withAlpha(color, 0.85));
      grad.addColorStop(0.45, withAlpha(color, 0.35));
      grad.addColorStop(1, withAlpha(color, 0));
      g.fillStyle = grad;
      g.fillRect(0, 0, R * 2, R * 2);
    }
    this.sprites.set(color, c);
    return c;
  }
}

/** `#rrggbb` + opacidad → `rgba(…)`. Solo entiende hex de 6, que es lo que le llega. */
function withAlpha(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
