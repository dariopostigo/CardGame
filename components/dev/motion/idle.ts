// =========================================================================
// LA MESA VIVA — el aliento, y lo que dice que una ficha ya ha andado
//
// Dos animaciones que parecen una sola porque lo son: lo que dice que una ficha
// YA HA ANDADO es que NO RESPIRA. Se lee por ausencia, y una ausencia solo se ve
// si lo demás está presente. Por eso viven en el mismo archivo y no en dos: el
// día que alguien apague el aliento «porque distrae», el hundimiento y el color
// se quedan solos y dejan de bastar — se comprueba bajando el dial a 0 en
// /dev/animacion, que es donde está el experimento.
//
// ESTE ES EL ARCHIVO QUE MÁS FALTA HACÍA, porque es el que ya había divergido.
// Estaba escrito dos veces —AnimationBench.tsx y BarajaModule.tsx— y las dos
// copias habían dejado de ser la misma: una animaba el disco con su centrado
// (`translate(-50%,-50%)`) y la otra el grupo SVG sin él, con distinta escala en
// el fotograma alto. Nadie lo había roto: se escribió dos veces y cada una
// evolucionó con su pantalla, que es exactamente lo que pasa siempre.
//
// LA DIFERENCIA QUE SÍ ERA REAL y por eso el contrato la admite: de qué cuelga
// el aliento. En el banco el disco está centrado por CSS con un `translate` que
// tiene que seguir en la cadena, y en la baraja el grupo se coloca por
// coordenadas y no lleva ninguno. Es un PREFIJO, y las dos cadenas —la de reposo
// y la del aliento— tienen que llevar LA MISMA LISTA DE FUNCIONES en el mismo
// orden: si una dice `translate scale` y otra `translate translateY scale`, el
// navegador no las interpola, las cambia de golpe y la ficha pega un salto.
//
// Y VA SOBRE EL DISCO, NUNCA SOBRE LA FICHA. El `transform` de la ficha lo lleva
// JS en cada secuencia, así que una animación infinita ahí pelearía con la
// caída, con la embestida y con el arrastre. El disco no lo toca nadie más, de
// modo que el aliento y las secuencias se SUMAN en vez de pisarse: una ficha
// respirando embiste igual, y respirando la llevas cogida.
// =========================================================================

import { cubic, idlePhase, type Timings } from "@/lib/v3/anim";
import { EASE_BACK, settleAll } from "./core";

/** Lo que tarda una ficha en acuclillarse tras andar, o en volver a levantarse. */
export const SPENT_MS = 240;

/** Quién respira: el nodo que sube y baja, y la mancha que lo acompaña al revés. */
export type Breather = {
  /** El disco, el grupo, o lo que sea que suba y baje. Nunca la ficha entera. */
  readonly el: Element | null | undefined;
  /** Su mancha en el suelo, si la tiene. */
  readonly blot?: Element | null;
  /**
   * Lo que ya lleva escrito la cadena de transformaciones de reposo, y que el
   * aliento tiene que conservar delante de lo suyo. Vacío si no lleva nada.
   */
  readonly prefix?: string;
};

/**
 * El coro: quién respira ahora mismo y cómo pararlo.
 *
 * Una clase y no un puñado de funciones porque lo que hay que mantener es un
 * MAPA vivo de animaciones infinitas, y un bucle sin final que nadie cancela es
 * la única fuga de memoria que este proyecto puede tener de verdad.
 */
export class IdleChorus {
  private running = new Map<string, Animation[]>();

  has(key: string): boolean {
    return this.running.has(key);
  }

  /**
   * Que esta ficha respire, si no lo estaba haciendo ya.
   *
   * A los que YA respiran no se les toca, y por eso `restart` va aparte: una
   * animación infinita relanzada vuelve al mismo punto de su ciclo —la fase es
   * fija por ficha—, así que rearrancarla a mitad de una inspiración da un
   * tirón.
   *
   * @param {number} size - El radio del hexágono: la amplitud va en fracción de
   *   él, no en píxeles, para que respire igual de cerca en cualquier pantalla.
   */
  start(key: string, who: Breather, t: Timings, size: number): void {
    if (t.idleRise <= 0 || this.running.has(key)) return;
    const { el, blot, prefix = "" } = who;
    if (!el) return;

    const rise = size * t.idleRise;
    const options: KeyframeAnimationOptions = {
      duration: Math.max(200, t.idleCycle),
      easing: "ease-in-out",
      iterations: Infinity,
      // Negativo: la animación empieza YA EMPEZADA, en el punto de su ciclo que
      // le toca a esta ficha. Sin esto todas arrancan abajo a la vez y lo que se
      // ve no son quince fichas vivas, es el tablero entero bombeando.
      delay: -idlePhase(key, t.idleCycle),
    };

    const list = [
      el.animate(
        [
          { transform: `${prefix}translateY(0px) scale(1, 1)` },
          {
            transform: `${prefix}translateY(${-rise.toFixed(2)}px) scale(1.015, 1.015)`,
            offset: 0.5,
          },
          { transform: `${prefix}translateY(0px) scale(1, 1)` },
        ],
        options,
      ),
    ];

    // La mancha respira AL REVÉS —se encoge y se aclara cuando la ficha sube—
    // porque es lo único que dice que ha subido y no que ha crecido.
    if (blot) {
      list.push(
        blot.animate(
          [
            { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
            { transform: "translate(-50%, -50%) scale(0.93)", opacity: 0.78, offset: 0.5 },
            { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          ],
          options,
        ),
      );
    }

    this.running.set(key, list);
  }

  stop(key: string): void {
    for (const anim of this.running.get(key) ?? []) anim.cancel();
    this.running.delete(key);
  }

  /** Para el aliento de todo el que ya no esté en la lista. */
  keepOnly(keys: Iterable<string>): void {
    const alive = new Set(keys);
    for (const key of [...this.running.keys()]) {
      if (!alive.has(key)) this.stop(key);
    }
  }

  stopAll(): void {
    for (const list of this.running.values()) for (const anim of list) anim.cancel();
    this.running.clear();
  }
}

/**
 * Lo que hace que el dial del aliento se vea funcionar.
 *
 * Un aliento ya en marcha no cambia de amplitud porque sí, así que mover el
 * slider no cambiaría nada hasta la siguiente jugada — que es la peor forma de
 * que un mando esté roto. La clave junta los dos diales y el tamaño del
 * hexágono: cuando cambia, se para todo y el efecto de turno lo vuelve a montar
 * con la medida nueva.
 */
export function idleKeyOf(t: Timings, size: number): string {
  return `${t.idleRise}|${t.idleCycle}|${size}`;
}

/**
 * La postura de reposo del disco: recto y con su color, o acuclillado y apagado
 * si ya ha andado.
 *
 * ANDADO y no «agotada», y la precisión decide el aspecto: el §5 dice que una
 * ficha «mueve hasta 👢 Movimiento hexágonos **y** hace su ataque, en cualquier
 * orden», así que haber andado no la deja fuera del turno —todavía puede pegar—.
 * Por eso se apaga a medias y no del todo: una ficha que parece muerta deja de
 * contarse, y esta cuenta.
 *
 * El filtro se emite SIEMPRE completo, incluso cuando no hace nada
 * (`saturate(1) brightness(1)`), por lo mismo que la lista de transformaciones:
 * interpolar desde `none` no está garantizado y lo que se ve es un corte.
 */
export function tokenRest(
  moved: boolean,
  size: number,
  t: Timings,
  /**
   * OBLIGATORIO, y sin valor por defecto a propósito.
   *
   * Lo tuvo durante media hora el 11 de septiembre de 2026 y costó un fallo que
   * no hizo ruido: una llamada se quedó sin pasarlo, el disco perdió su
   * `translate(-50%, -50%)` y se descentró medio hexágono. No se vio —el disco
   * seguía dibujándose— pero la ficha dejó de poder cogerse, porque el puntero
   * apuntaba a donde ya no estaba. Un parámetro que descoloca en silencio no
   * puede ser opcional; quien no tenga prefijo pasa "" y lo dice.
   */
  prefix: string,
): { transform: string; filter: string } {
  const sink = moved ? size * t.spentSink : 0;
  const fade = moved ? t.spentFade : 0;
  return {
    transform: `${prefix}translateY(${sink.toFixed(2)}px) scale(1, 1)`,
    // El brillo baja bastante menos que el color: una ficha que ya ha andado
    // tiene que seguir viéndose sobre el suelo, porque todavía puede atacar.
    filter: `saturate(${(1 - fade).toFixed(2)}) brightness(${(1 - fade * 0.3).toFixed(2)})`,
  };
}

/**
 * Se agacha porque ya ha andado, o se endereza porque hay turno nuevo.
 *
 * El ESCALÓN entre una y la siguiente es lo único que hay aquí y es más de lo
 * que parece: es la misma forma que va a tener el tic de estados al empezar el
 * turno —diez fichas por tres estados, que en fila india resulta eterno—. A 0 se
 * levantan todas de golpe y parece un repintado.
 */
export async function slump(
  tokens: readonly (Element | null | undefined)[],
  moved: boolean,
  t: Timings,
  size: number,
  /** El mismo de `tokenRest`, y obligatorio por el mismo motivo. */
  prefix: string,
  stagger = 0,
): Promise<void> {
  const list: Animation[] = [];
  tokens.forEach((token, i) => {
    if (!token) return;
    list.push(
      token.animate([tokenRest(!moved, size, t, prefix), tokenRest(moved, size, t, prefix)], {
        duration: SPENT_MS,
        delay: i * stagger,
        // Al agacharse, se deja caer; al levantarse, se pasa un poco. Un turno
        // nuevo tiene que sentirse como que algo se te devuelve.
        easing: moved ? "ease-out" : cubic(EASE_BACK),
        fill: "forwards",
      }),
    );
  });
  await settleAll(list);
}
