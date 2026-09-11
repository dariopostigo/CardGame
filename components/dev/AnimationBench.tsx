"use client";

// =========================================================================
// El banco de animación — el escenario donde se miden las secuencias
//
// ESTO NO ES EL TABLERO, y la distinción importa: ArenaBoard es la arena de
// verdad —14×12, con cámara arrastrable, bandas, alcances y una lámina de
// suelo— y este banco son quince hexágonos quietos cuyo único trabajo es que se
// pueda mirar una caída de cerca y repetirla cien veces. Cuando los números
// estén decididos, lo que se muda a ArenaBoard son las CIFRAS (lib/v3/anim.ts),
// no este archivo.
//
// LO QUE YA NO ESTÁ AQUÍ *(11 de septiembre de 2026)*, y es más de la mitad de
// lo que había:
//
//   · LA GEOMETRÍA del retal —cuántos hexágonos, de qué tamaño salen, dónde cae
//     cada centro y cuál está bajo el puntero— es lib/v3/patch.ts. Era la misma
//     fórmula escrita otra vez en BarajaModule.tsx, con dos márgenes distintos.
//   · EL SUELO que se pinta —lámina, oferta, rejilla, polvo y manchas— es
//     HexPatch.tsx y su parcial _hex-patch.scss. Lo mismo: dos copias con dos
//     prefijos de clase.
//   · LAS SECUENCIAS —el despliegue, el paso, el aliento, la embestida con sus
//     tres desenlaces y la baja— son components/dev/motion/, una por archivo.
//     Vivían aquí, unas 560 líneas, y mientras vivieran aquí no se podía mirar
//     una sola sin montar la pantalla entera: es lo que impedía que existiera un
//     banco por animación (`ANIMATIONS` en lib/v3/anim.ts).
//
// Lo que QUEDA es lo que solo sabe esta pantalla: qué fichas hay, quién puede
// coger qué, adónde llega cada una y qué se escribe debajo de cada gesto.
//
// LAS FICHAS SON DOM Y NO SVG, que es la decisión que manda en todo lo demás.
// Motivos, por orden:
//   1. La carta tiene que convertirse en ficha SIN CORTE. Si la carta es un div
//      y la ficha un <ellipse>, hay dos elementos y el cambio es un
//      intercambio, no una transformación. Aquí hay UN elemento con dos caras
//      que se cruzan durante el vuelo.
//   2. Se anima con la Web Animations API sobre `transform` y `opacity`, que
//      son las dos únicas propiedades que el navegador puede mover sin
//      recalcular nada. Un SVG dentro de un <g> con filtro —que es como está la
//      capa de fichas de ArenaBoard— no las tiene gratis.
//   3. El polvo va en un <canvas> por encima, y para emitir en el sitio exacto
//      hacen falta coordenadas de pantalla. El SVG del suelo usa por eso un
//      viewBox de 1 unidad = 1 píxel: así las tres capas —suelo, polvo y
//      fichas— comparten sistema de coordenadas y no hay que convertir nada.
//
// LA ALTURA ES FALSA y se dice con dos cosas a la vez: la ficha sube en `y` y
// su SOMBRA se queda en el suelo, creciendo y difuminándose. La sombra es la
// que hace el trabajo —sin ella, subir en `y` es indistinguible de moverse
// hacia el fondo del tablero— y por eso es un elemento aparte y no un
// `box-shadow`: tiene que poder escalar y opacarse por su cuenta.
//
// Ninguna regla de juego vive aquí (ARCHITECTURE.md §6). Los tiempos llegan por
// props desde lib/v3/anim.ts, y lo único que este componente decide es a quién
// le toca moverse.
// =========================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord, HexKey } from "@/lib/v3/hex";
import { CURVES, OFFER_RISE_MS, cubic, type Timings } from "@/lib/v3/anim";
import { resolveAttack, type AttackResult } from "@/lib/v3/combat";
import { DAMAGE_TYPES, type DamageTypeId } from "@/lib/v3/damage";
import { buildArena, type Side } from "@/lib/v3/arena";
import { moveProblem, pathTo, reachable } from "@/lib/v3/movement";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import { PATCH, handEntry, cellAt, type PatchLayout } from "@/lib/v3/patch";
// El SUELO no se pinta aquí: la lámina, la oferta, la rejilla, el polvo y las
// manchas los comparte con /dev/baraja desde el 11 de septiembre de 2026.
import {
  PatchDust,
  PatchGround,
  PatchShadow,
  useDustField,
  usePatchLayout,
} from "./HexPatch";
// NI EL MOVIMIENTO. Cada secuencia es una función de components/dev/motion/, y
// las dos pantallas llaman a las mismas: es lo que Dario pidió el 10 de
// septiembre —«los dos minitableros, ABSOLUTAMENTE el mismo comportamiento»— y
// lo que el 11 se partió en piezas para que se pudiera mirar una sola.
import {
  EASE_BACK,
  IdleChorus,
  attackMotion,
  flyAndLand,
  idleKeyOf,
  moveShadow,
  pickUp,
  putDown,
  returnHome,
  settleAnimations,
  slump,
  tokenRest,
  transform,
  vanish,
  walkPath,
  wait,
  type Ground,
} from "./motion";
import { buttonClass } from "@/components/ui/Button";

/**
 * El retal, pero como ARENA de verdad.
 *
 * Existe para no reimplementar aquí ni una sola regla de movimiento: quién llega
 * a dónde lo contesta lib/v3/movement.ts (`reachable`, que rodea los cuerpos
 * porque no se atraviesa a nadie, §5) y por qué no se puede lo contesta
 * `moveProblem`. `buildArena` acepta las medidas del retal —dos columnas de
 * banda caben en cinco y las tres filas dan sitio para las cinco fichas del §2—,
 * así que el banco puede pedirle las cuentas al motor en vez de inventárselas
 * con un `distance <= n` que ignoraría a quien haya en medio.
 *
 * La GEOMETRÍA del retal (cuántos hexágonos, de qué tamaño salen y dónde cae
 * cada centro) no está aquí desde el 11 de septiembre de 2026: es lib/v3/patch.ts
 * y la comparte con /dev/baraja, donde estaba escrita por segunda vez.
 */
const ARENA_PATCH = buildArena({ cols: PATCH.cols, rows: PATCH.rows, bandDepth: 2 });

/** De dónde sale la onda cuando lo que se ofrece es un DESPLIEGUE: de la mano. */
const HAND_ENTRY = handEntry(PATCH);

/**
 * Cómo se encaja el retal en este escenario.
 *
 * `groundShare` es qué parte del alto ocupa el suelo, y lo que queda es para la
 * mano: necesita el alto de una carta ENTERA con su aire, o las cartas se salen
 * por abajo y el escenario las recorta.
 */
const FIT = { gutter: 48, groundShare: 0.55, topPad: 18, minSize: 16 } as const;

/** A qué altura del borde de abajo se abre el abanico. */
const HAND_BOTTOM = 100;

/**
 * El respiro entre dos sucesos de una tanda. Es el mismo `gap` por defecto de
 * `schedule()`, y aquí está a mano a propósito: la tanda tiene que sonar igual
 * que sonará la cola de verdad, o mediría otra cosa.
 */
const QUEUE_GAP = 60;

type Piece = {
  readonly id: string;
  readonly damage: DamageTypeId;
  readonly side: Side;
  /** Dónde está, si está puesta. En la mano o en el aire, `null`. */
  hex: HexCoord | null;
  /**
   * El estado que le ha dejado puesto un crítico. Marcador de posición del
   * módulo de estados: aquí solo hace falta para ver el EMPALME, que un crítico
   * termine entregando algo en vez de acabar en sí mismo (§4.5).
   */
  state: string | null;
  /**
   * Si ya ha andado este turno.
   *
   * ANDADO y no "agotada", y la precisión importa porque decide el aspecto: el
   * §5 dice que una ficha "mueve hasta 👢 Movimiento hexágonos **y** hace su
   * ataque, en cualquier orden", así que haber andado no la deja fuera del turno
   * —todavía puede pegar—. Por eso se apaga a medias y no del todo: una ficha
   * que parece muerta deja de contarse, y esta cuenta. Cuando exista el modelo de
   * turno esto se parte en dos marcas, o pasa a ser "agotada" de verdad.
   */
  moved: boolean;
};

/** El glifo que deja un crítico. 💫 Aturdimiento, del catálogo de control. */
const CRIT_STATE = "💫";

/**
 * El sitio de una carta en la mano: abanico, no montón.
 *
 * Tres cartas en el mismo punto se tapan y no se puede coger la de abajo, pero
 * la razón de fondo es otra: una mano de cartas se lee de un vistazo porque
 * está abierta, y ese gesto —el abanico ligeramente girado— es la mitad de lo
 * que hace que un juego de cartas parezca un juego de cartas.
 */
function handSlot(l: PatchLayout, index: number, count: number, cardScale: number) {
  const step = Math.min(l.size * 1.9 * cardScale * 0.5, (l.size * 5) / Math.max(count, 1));
  const offset = (index - (count - 1) / 2) * step;
  const center = { x: l.box.w / 2, y: l.box.h - HAND_BOTTOM };
  return {
    x: center.x + offset,
    // Las de los lados caen un poco: el abanico es un arco, no una fila.
    y: center.y + Math.abs(offset) * 0.06,
    rotate: count > 1 ? offset * 0.055 : 0,
  };
}

const INITIAL: readonly Omit<Piece, "hex" | "state" | "moved">[] = [
  { id: "enemigo-1", damage: "cuerpo-a-cuerpo", side: "enemigo" },
  { id: "propio-1", damage: "cuerpo-a-cuerpo", side: "propio" },
  { id: "propio-2", damage: "magico", side: "propio" },
  { id: "propio-3", damage: "a-distancia", side: "propio" },
];

/**
 * El banco recién puesto: el muñeco de pruebas en el campo y tres cartas en la
 * mano, una de cada tipo de daño.
 *
 * Los tres tipos están a propósito y no por variedad: 👢 Movimiento va por tipo
 * (🗡️ 3 · ✨ 2 · 🏹 1), así que una vez puestas las tres, arrastrarlas una detrás
 * de otra enseña tres ofertas distintas sobre el mismo tablero. Con tres fichas
 * iguales, el terreno que se ofrece parecería una propiedad del tablero.
 */
function initialPieces(dummy: HexCoord | null): Piece[] {
  return INITIAL.map((p) => ({
    ...p,
    hex: p.side === "enemigo" ? dummy : null,
    state: null,
    moved: false,
  }));
}

/** Dónde se planta el muñeco: a la derecha, en la fila de en medio. */
const DUMMY_HEX = Hex.offsetToAxial({ col: PATCH.cols - 1, row: 1 });

type Props = {
  timings: Timings;
  /**
   * Los dos umbrales del §4.1 con los que juega el botón de tanda. No son
   * diales de sensación sino REGLA, y por eso llegan aparte de los tiempos: lo
   * que decide el desenlace es combat.ts, aquí solo se dibuja.
   */
  odds: { precision: number; luck: number };
  /** Se avisa de lo que pasa para poder leerlo debajo del escenario. */
  onNote?: (note: string) => void;
  className?: string;
};

export default function AnimationBench({ timings, odds, onNote, className = "" }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const elements = useRef(new Map<string, HTMLDivElement>());

  const [pieces, setPieces] = useState<readonly Piece[]>(() => initialPieces(DUMMY_HEX));
  const [busy, setBusy] = useState(false);

  /**
   * El terreno que se ofrece: destino → pasos desde el origen. Los pasos no son
   * de adorno, son lo que ordena la onda — el hexágono de al lado se levanta
   * antes que el de tres más allá, y eso es lo que hace que la oferta parezca
   * salir de la ficha en vez de encenderse toda de golpe.
   *
   * Es de las poquísimas cosas del arrastre que sí van por estado de React: la
   * oferta se calcula UNA vez al coger la ficha y no cambia mientras la llevas.
   * Lo que sí cambia sesenta veces por segundo —cuál es el hexágono candidato—
   * se escribe directamente en el DOM, por lo mismo que la posición de la carta.
   */
  const [offer, setOffer] = useState<ReadonlyMap<HexKey, number> | null>(null);
  const cellNodes = useRef(new Map<HexKey, SVGPolygonElement>());
  const candidate = useRef<HexKey | null>(null);

  /** El coro: quién respira ahora mismo. La secuencia está en motion/idle.ts. */
  const idles = useRef(new IdleChorus());

  // Los tiempos y la geometría se leen desde dentro de secuencias asíncronas que
  // empezaron hace medio segundo: con la prop a secas, mover un slider a mitad
  // de una caída usaría el valor viejo en el tramo que falta. Las referencias
  // apuntan siempre al último.
  //
  // Se sincronizan en un EFECTO y no en el cuerpo del componente —escribir una
  // `ref` durante el render es de las cosas que React pide no hacer— y llega de
  // sobra: un efecto corre tras el pintado, o sea mucho antes de que nadie pueda
  // pulsar ni arrastrar nada. El efecto va declarado aquí arriba a propósito,
  // porque los efectos corren en orden de declaración y `settle()` lee la
  // geometría desde el suyo.
  const t = useRef(timings);
  const layoutRef = useRef<PatchLayout | null>(null);

  // `odds` NO lleva referencia, al contrario que los tiempos, y la diferencia
  // es intencionada: un tiempo movido a mitad de una caída tiene que afectar al
  // tramo que falta —para eso es un dial en vivo—, pero una tanda que cambiara
  // de umbrales a la sexta tirada dejaría de medir una distribución. La tanda
  // se queda con los que tenía al empezar, que es lo que hace comparable una
  // tanda con la siguiente.

  const busyRef = useRef(false);
  const note = useCallback((text: string) => onNote?.(text), [onNote]);

  // Una tanda son doce secuencias encadenadas: si la pantalla se va a mitad,
  // el bucle tiene que enterarse. `run()` ya sobrevive al desmontaje —la
  // animación se cancela y devuelve—, pero sin esto el bucle seguiría pidiendo
  // once más contra elementos que ya no existen.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // --- Medida, geometría y polvo --------------------------------------------
  //
  // Las tres, en tres líneas. La cuenta de encajar quince hexágonos en la caja
  // medida está en lib/v3/patch.ts (`fitPatch`) desde el 11 de septiembre de
  // 2026, donde se puede comprobar sin pintar un píxel; estaba escrita aquí y
  // otra vez en BarajaModule.tsx, con dos márgenes distintos.

  const { box, layout } = usePatchLayout(stageRef, PATCH, FIT);

  useEffect(() => {
    layoutRef.current = layout;
    t.current = timings;
  }, [layout, timings]);

  const dustRef = useDustField(canvasRef, box);

  /** Lo que las secuencias necesitan saber del tablero: polvo, temblor y radio. */
  const groundOf = useCallback(
    (l: PatchLayout): Ground => ({
      scene: sceneRef.current,
      dust: dustRef.current,
      size: l.size,
    }),
    [dustRef],
  );

  // --- Dónde va cada ficha --------------------------------------------------

  /**
   * Coloca cada ficha donde le toca, sin animación: las puestas en su hexágono
   * y las de la mano en su hueco del abanico.
   *
   * Todo lo que se anima acaba exactamente en estas mismas cadenas: una
   * secuencia que termine en otra cosa deja la ficha corrida un píxel para
   * siempre, y eso se acumula.
   */
  const settle = useCallback(() => {
    const l = layoutRef.current;
    if (!l) return;
    const hand = pieces.filter((p) => !p.hex);
    for (const piece of pieces) {
      const el = elements.current.get(piece.id);
      if (!el) continue;
      const shadow = shadowOf(el);

      // Las dos caras conviven en el mismo elemento, así que en reposo hay que
      // decir cuál se ve: en la mano, la carta; en el campo, la peana. Se
      // escribe A MANO y no con una regla de CSS porque el cruce del vuelo
      // termina fijando la opacidad en línea (commitStyles), y una regla no le
      // ganaría a eso al volver la ficha a la mano.
      const token = el.querySelector<HTMLElement>(".anim__token");
      if (token) {
        token.style.opacity = piece.hex ? "1" : "0";
        // Y su postura: hundida si ya ha andado, recta si no. Va aquí y no en
        // una regla de CSS porque el aliento y el acuclillarse escriben esta
        // misma propiedad con `commitStyles`, y una regla no le ganaría a un
        // estilo en línea. Mientras el aliento corre, su animación gana a esto y
        // esto es solo el valor de debajo — que es exactamente lo que hace falta
        // para que al pararla la ficha se quede donde tiene que quedarse.
        const rest = tokenRest(piece.moved, l.size, t.current, TOKEN_BASE);
        token.style.transform = rest.transform;
        token.style.filter = rest.filter;
      }

      if (piece.hex) {
        const c = l.centers.get(Hex.key(piece.hex));
        if (!c) continue;
        el.style.transform = transform(c.x, c.y, 0, 1);
        if (shadow) {
          shadow.style.transform = `translate(${c.x}px, ${c.y}px) scale(1)`;
          shadow.style.opacity = "0.55";
        }
      } else {
        const slot = handSlot(l, hand.indexOf(piece), hand.length, t.current.cardScale);
        el.style.transform = transform(slot.x, slot.y, 0, t.current.cardScale, undefined, slot.rotate);
        if (shadow) {
          shadow.style.transform = `translate(${slot.x}px, ${slot.y}px) scale(1.6)`;
          shadow.style.opacity = "0.18";
        }
      }
    }
  }, [pieces]);

  // Al medir de nuevo (o al aparecer una ficha) todo vuelve a su sitio. Durante
  // una secuencia no: recolocar a mitad de una caída la teletransportaría.
  //
  // `layout` va en las dependencias aunque `settle` lo lea de una referencia, y
  // no es de adorno: en el primer pintado la caja mide 0 y no hay geometría, así
  // que si el efecto solo escuchara a `settle` —que cambia con las fichas— nadie
  // volvería a colocarlas cuando el escenario por fin se mide, y todas se
  // quedarían apiladas en la esquina. Es exactamente lo que pasaba.
  useEffect(() => {
    if (!busyRef.current) settle();
  }, [settle, layout]);

  // El glifo de estado tiene que APARECER, no simplemente estar en el siguiente
  // pintado: lo que hay que poder ver es el relevo —que el crítico entrega algo
  // en vez de acabar en sí mismo— y un icono que se materializa sin gesto se lee
  // como parte del decorado. Se apunta a quién ya se le animó para no repetirlo
  // en cada repintado de `pieces`, que son muchos.
  const popped = useRef(new Set<string>());
  useEffect(() => {
    for (const piece of pieces) {
      if (!piece.state) {
        popped.current.delete(piece.id);
        continue;
      }
      if (popped.current.has(piece.id)) continue;
      popped.current.add(piece.id);
      const glyph = elements.current.get(piece.id)?.querySelector<HTMLElement>(".anim__state");
      glyph?.animate(
        [
          { transform: "translate(-50%, -50%) scale(0) rotate(-40deg)", opacity: 0 },
          { transform: "translate(-50%, -50%) scale(1.5) rotate(10deg)", opacity: 1, offset: 0.45 },
          { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: 1 },
        ],
        { duration: 420, easing: cubic(EASE_BACK) },
      );
    }
  }, [pieces]);

  const setElement = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (node) elements.current.set(id, node);
      else elements.current.delete(id);
    },
    [],
  );

  const setCellNode = useCallback(
    (key: HexKey) => (node: SVGPolygonElement | null) => {
      if (node) cellNodes.current.set(key, node);
      else cellNodes.current.delete(key);
    },
    [],
  );

  // --- El aliento -----------------------------------------------------------
  //
  // La secuencia ya no está aquí: es motion/idle.ts, y la comparte con
  // /dev/baraja desde el 11 de septiembre de 2026. Estaba escrita dos veces y
  // las dos copias YA HABÍAN DIVERGIDO —una animaba el disco con su centrado y
  // la otra el grupo sin él—, que es el argumento entero para haberla sacado.
  //
  // Lo que queda aquí es QUIÉN respira, que sí es de esta pantalla: una ficha
  // respira si está en el campo y no ha andado. Las secuencias paran el aliento
  // de quien se mueve —dos movimientos sumados en el mismo cuerpo se leen como
  // un temblor— y lo vuelven a arrancar al terminar.

  /** El disco de una ficha, que es lo que respira (nunca la ficha entera). */
  const tokenOf = useCallback(
    (id: string) => elements.current.get(id)?.querySelector<HTMLElement>(".anim__token") ?? null,
    [],
  );

  const startIdle = useCallback(
    (piece: Piece) => {
      const l = layoutRef.current;
      if (!l || !piece.hex || piece.moved) return;
      const el = elements.current.get(piece.id);
      idles.current.start(
        piece.id,
        {
          el: tokenOf(piece.id),
          blot: el ? shadowOf(el)?.querySelector<HTMLElement>(".patch__blot") : null,
          // El disco está centrado por CSS y ese `translate` tiene que seguir en
          // la cadena, o el aliento lo tiraría a la esquina del hexágono.
          prefix: TOKEN_BASE,
        },
        t.current,
        l.size,
      );
    },
    [tokenOf],
  );

  const stopIdle = useCallback((id: string) => idles.current.stop(id), []);

  // Los que YA respiran no se tocan, y por eso el reinicio va aparte: una
  // animación infinita relanzada vuelve al mismo punto de su ciclo (la fase es
  // fija por ficha), así que rearrancarla a mitad de una inspiración da un
  // tirón. Rearrancar solo cuando cambia el dial es a la vez lo correcto y lo
  // que hace que el slider se vea funcionar — sin esto, mover la amplitud no
  // cambiaría nada hasta la siguiente jugada, que es la peor forma de que un
  // mando esté roto.
  const idleKey = idleKeyOf(timings, layout?.size ?? 0);
  const idleKeyRef = useRef(idleKey);
  useEffect(() => {
    if (idleKeyRef.current !== idleKey) {
      idleKeyRef.current = idleKey;
      idles.current.stopAll();
    }
    for (const piece of pieces) {
      if (piece.hex && !piece.moved) startIdle(piece);
      else stopIdle(piece.id);
    }
    idles.current.keepOnly(pieces.map((p) => p.id));
  }, [pieces, idleKey, startIdle, stopIdle]);

  useEffect(() => {
    const chorus = idles.current;
    return () => chorus.stopAll();
  }, []);

  // --- Coger algo: la carta que se despliega y la ficha que anda -------------
  //
  // Son dos gestos con la misma entrada y no se comportan igual, y la diferencia
  // no es un capricho:
  //
  //   · LA CARTA SIGUE AL PUNTERO. Está en tu mano, así que la llevas.
  //   · LA FICHA NO SE MUEVE: se levanta en su sitio, como quien la coge por
  //     encima sin sacarla del tablero. Lo que sigue al puntero es el HEXÁGONO
  //     CANDIDATO. Y no es un atajo, es lo correcto: una ficha que persigue el
  //     cursor y luego tiene que volver a su casilla para andar el camino da un
  //     tirón hacia atrás en el momento de soltar, justo cuando la vista está
  //     puesta en el destino. Dejándola quieta, el camino empieza donde el
  //     jugador la vio por última vez.
  //
  // El "cogido" se pone a la altura del SALTITO (`stepHop`), y de ahí sale una
  // propiedad gratis: la postura de estar cogida es exactamente el punto más
  // alto de un paso, así que al soltar no hay que recomponer nada — la ficha ya
  // está en el aire y el primer tramo del camino es su aterrizaje.

  const drag = useRef<{
    id: string;
    /** Su hexágono si ya estaba en el campo; null si viene de la mano. */
    from: HexCoord | null;
    lastX: number;
    vx: number;
    /** El levantarse, para poder cerrarlo antes de empezar a andar. */
    lift: Animation[];
  } | null>(null);

  /** Los hexágonos ocupados, menos el de quien se está yendo del suyo (§5). */
  const occupiedExcept = useCallback(
    (id: string) =>
      new Set(
        pieces
          .filter((p): p is Piece & { hex: HexCoord } => !!p.hex && p.id !== id)
          .map((p) => Hex.key(p.hex)),
      ),
    [pieces],
  );

  /**
   * Qué terreno se ofrece por coger esto, y a cuántos pasos está cada hexágono.
   *
   * Las dos mitades son la misma pregunta con distinta regla, y ninguna de las
   * dos se contesta aquí: una ficha en el campo llega hasta donde diga
   * `reachable`, que rodea los cuerpos y por eso puede devolver bastante menos
   * que el círculo de su 👢; una carta va a cualquier hexágono libre, que es el
   * despliegue del §3.
   *
   * Los pasos importan porque son lo que ordena la onda. Para la ficha los da el
   * propio recorrido en anchura —gratis, y contando el rodeo—; para la carta se
   * miden desde el borde por el que entra la mano, así el terreno se abre hacia
   * el fondo, en la dirección en la que va el gesto.
   */
  const offerFor = useCallback(
    (piece: Piece): Map<HexKey, number> => {
      const taken = occupiedExcept(piece.id);
      if (piece.hex) {
        return reachable(ARENA_PATCH, piece.hex, MOVEMENT_BAND[piece.damage], taken);
      }
      const out = new Map<HexKey, number>();
      for (const hex of ARENA_PATCH.hexes) {
        const k = Hex.key(hex);
        if (!taken.has(k)) out.set(k, Hex.distance(hex, HAND_ENTRY));
      }
      return out;
    },
    [occupiedExcept],
  );

  /**
   * El hexágono bajo el puntero. Se escribe en el DOM y no en el estado por lo
   * mismo que la posición de la carta: cambia sesenta veces por segundo, y
   * repintar React a esa cadencia con quince polígonos es tirar fotogramas para
   * cambiar un atributo.
   */
  const markCandidate = useCallback((key: HexKey | null) => {
    if (candidate.current === key) return;
    if (candidate.current) {
      cellNodes.current.get(candidate.current)?.removeAttribute("data-candidate");
    }
    candidate.current = key;
    if (key) cellNodes.current.get(key)?.setAttribute("data-candidate", "true");
  }, []);

  const onPointerDown = (piece: Piece) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (busyRef.current) return;
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    if (!l || !el) return;

    // Y aquí es donde lo gastado deja de ser cosmética. La negativa se explica,
    // como todas las de este proyecto (ARCHITECTURE.md §5), y se explica
    // señalando lo que ya se veía: no respiraba.
    if (piece.hex && piece.moved) {
      note(
        "Esta ficha ya ha andado este turno (§5), y por eso no respira ni tiene color. Todavía puede atacar; para volver a moverla hace falta un turno nuevo.",
      );
      return;
    }

    event.preventDefault();
    el.setPointerCapture(event.pointerId);
    el.dataset.dragging = "true";
    setOffer(offerFor(piece));

    const c = t.current;
    const { x, y } = toStage(event, stageRef.current);

    if (piece.hex) {
      stopIdle(piece.id);
      const at = l.centers.get(Hex.key(piece.hex));
      drag.current = { id: piece.id, from: piece.hex, lastX: event.clientX, vx: 0, lift: [] };
      if (at) drag.current.lift = pickUp(el, shadowOf(el), at, c.stepHop);
      markCandidate(null);
      return;
    }

    drag.current = { id: piece.id, from: null, lastX: event.clientX, vx: 0, lift: [] };
    el.style.transform = transform(x, y, c.hover, c.cardScale);
    moveShadow(shadowOf(el), x, y, c.hover);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const l = layoutRef.current;
    if (!state || !l) return;
    const el = elements.current.get(state.id);
    if (!el) return;

    const { x, y } = toStage(event, stageRef.current);
    const cell = cellAt(l, x, y);
    markCandidate(cell && offer?.has(cell.key) ? cell.key : null);

    // La ficha ya puesta no se mueve: lo único que la sigue es el candidato.
    if (state.from) return;

    // La carta se inclina con la velocidad del gesto. Es el detalle más barato
    // de todo el banco y el que hace que arrastrar deje de parecer mover un
    // icono: un naipe que se mueve rápido se ladea porque lo llevas cogido de
    // una esquina. Se suaviza contra el valor anterior para que no tiemble.
    const dx = event.clientX - state.lastX;
    state.vx = state.vx * 0.72 + dx * 0.28;
    state.lastX = event.clientX;
    const tiltDeg = Math.max(-14, Math.min(14, state.vx * 1.6));

    el.style.transform = transform(x, y, t.current.hover, t.current.cardScale, undefined, tiltDeg);
    moveShadow(shadowOf(el), x, y, t.current.hover);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const l = layoutRef.current;
    if (!state || !l) return;
    drag.current = null;
    setOffer(null);
    markCandidate(null);

    const el = elements.current.get(state.id);
    const piece = pieces.find((p) => p.id === state.id);
    if (!el || !piece) return;
    delete el.dataset.dragging;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);

    const from = toStage(event, stageRef.current);
    const cell = cellAt(l, from.x, from.y);

    // --- Una ficha que ya estaba en el campo: andar ---
    if (state.from) {
      const origin = state.from;
      settleAnimations(state.lift);

      if (!cell || Hex.equals(cell.hex, origin)) {
        note("Se queda donde estaba. Andar es opcional: el §5 dice «hasta» 👢 Movimiento.");
        void rest(piece, el, l, origin);
        return;
      }

      const boots = MOVEMENT_BAND[piece.damage];
      const taken = occupiedExcept(piece.id);
      // El motivo lo da el motor, no el banco. Y da DOS motivos distintos —está
      // lejos, o hay alguien en medio— que en el tablero se parecen y como regla
      // no se parecen en nada: es la diferencia entre una pared y un peaje (§5).
      const problem = moveProblem(ARENA_PATCH, origin, cell.hex, boots, taken, (hex) =>
        nameAt(pieces, hex),
      );
      const path = problem ? null : pathTo(ARENA_PATCH, origin, cell.hex, boots, taken);
      if (!path) {
        note(problem ?? "No hay camino hasta ahí.");
        void rest(piece, el, l, origin);
        return;
      }
      void walk(piece, path);
      return;
    }

    // --- Una carta: desplegar ---
    if (!cell) {
      note("Soltada fuera del tablero: la carta vuelve a la mano.");
      void returnToHand(piece, el, l, from);
      return;
    }
    if (pieces.some((p) => p.hex && Hex.equals(p.hex, cell.hex))) {
      note("Ahí ya hay una ficha, y ese hexágono no estaba ofrecido: dos fichas nunca comparten casilla (§5).");
      void returnToHand(piece, el, l, from);
      return;
    }
    void deploy(piece, cell.hex, from);
  };

  // --- Las tres secuencias --------------------------------------------------

  /**
   * DESPLIEGUE. La secuencia la ejecuta `flyAndLand` y es la MISMA que corre
   * /dev/baraja: lo que queda aquí es lo que solo sabe el banco —quién vuela,
   * dónde cae y qué se escribe debajo—.
   *
   * La ficha se queda a escala 1 porque en este retal la ficha ES el tamaño de
   * referencia y la carta se dibuja a `cardScale` de ella. En la baraja son la
   * carta y la ficha de verdad, y las dos escalas salen de sus anchos: son los
   * dos únicos números que cambian de un tablero al otro.
   */
  async function deploy(piece: Piece, hex: HexCoord, from: { x: number; y: number }) {
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    const target = l?.centers.get(Hex.key(hex));
    if (!l || !el || !target) return;

    busyRef.current = true;
    setBusy(true);
    const c = t.current;

    await flyAndLand(
      {
        el,
        face: el.querySelector<HTMLElement>(".anim__face"),
        token: el.querySelector<HTMLElement>(".anim__token"),
        shadow: shadowOf(el),
      },
      groundOf(l),
      from,
      target,
      { scale: c.cardScale, lift: c.hover, rested: 1 },
      c,
    );

    setPieces((prev) => prev.map((p) => (p.id === piece.id ? { ...p, hex } : p)));
    busyRef.current = false;
    setBusy(false);
    note(
      `Desplegada en ${c.flight + c.fall + c.squash} ms: ${c.flight} de vuelo, ${c.fall} de caída (${CURVES[c.fallCurve].label.toLowerCase()}) y ${c.squash} de aplastado.`,
    );
  }

  /** La carta vuelve a su hueco de la mano: sin peso, porque no cae — la recoges. */
  async function returnToHand(piece: Piece, el: HTMLElement, l: PatchLayout, from: { x: number; y: number }) {
    const hand = pieces.filter((p) => !p.hex);
    const slot = handSlot(l, hand.indexOf(piece), hand.length, t.current.cardScale);
    await returnHome(
      { el, face: null, token: null, shadow: shadowOf(el) },
      from,
      { x: slot.x, y: slot.y, scale: t.current.cardScale, rotate: slot.rotate },
      { scale: t.current.cardScale, lift: t.current.hover },
    );
  }

  /** La ficha cogida que se vuelve a posar en su casilla, y respira otra vez. */
  async function rest(piece: Piece, el: HTMLElement, l: PatchLayout, hex: HexCoord) {
    const at = l.centers.get(Hex.key(hex));
    if (!at) return;
    await putDown({ el, shadow: shadowOf(el) }, at);
    startIdle(piece);
  }

  /**
   * ANDAR. La secuencia es motion/step.ts; lo que queda aquí es lo que solo sabe
   * el banco: quién anda, por dónde y qué se escribe debajo.
   *
   * El camino lo da movement.ts `pathTo` y puede tener más pasos que la
   * distancia en línea recta, porque no se atraviesa a nadie (§5). Eso es
   * exactamente lo que la animación tiene que enseñar: el rodeo se ve andando, y
   * es lo que convierte «no llegas» en «llegas, pero te cuesta».
   */
  async function walk(piece: Piece, path: readonly HexCoord[]) {
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    if (!l || !el || path.length < 2) return;
    const way: { x: number; y: number }[] = [];
    for (const hex of path) {
      const at = l.centers.get(Hex.key(hex));
      if (!at) return;
      way.push(at);
    }

    busyRef.current = true;
    setBusy(true);
    stopIdle(piece.id);

    const c = t.current;
    const total = await walkPath({ el, shadow: shadowOf(el) }, way, groundOf(l), c);

    await slumpPieces([piece.id], true);
    const to = path[path.length - 1];
    setPieces((prev) => prev.map((p) => (p.id === piece.id ? { ...p, hex: to, moved: true } : p)));
    busyRef.current = false;
    setBusy(false);

    const steps = way.length - 1;
    const straight = Hex.distance(path[0], to);
    note(
      `${steps} paso${steps === 1 ? "" : "s"} × ${c.step} ms = ${total} ms` +
        (steps > straight ? ` — en línea recta eran ${straight}, pero hubo que rodear (§5)` : "") +
        `. 👢 ${MOVEMENT_BAND[piece.damage]} por ser ${DAMAGE_TYPES[piece.damage].label.toLowerCase()}. Ya ha andado: deja de respirar.`,
    );
  }

  /**
   * Quiénes se agachan porque ya han andado, o se enderezan porque hay turno
   * nuevo. La animación es motion/idle.ts: aquí solo se eligen los discos.
   */
  async function slumpPieces(ids: readonly string[], moved: boolean, stagger = 0): Promise<void> {
    const l = layoutRef.current;
    if (!l) return;
    await slump(ids.map(tokenOf), moved, t.current, l.size, TOKEN_BASE, stagger);
  }

  /**
   * TURNO NUEVO: todas las que habían andado se levantan, escalonadas.
   *
   * El escalón es lo único que hay aquí, y es más de lo que parece: es la misma
   * forma que va a tener el tic de estados al empezar el turno, que son diez
   * fichas por tres estados y en fila india resulta eterno. Aquí, con cuatro
   * fichas, ya se ve la diferencia entre una cascada y un repintado.
   */
  async function newTurn() {
    if (busyRef.current) return;
    const asleep = pieces.filter((p) => p.hex && p.moved);
    if (asleep.length === 0) {
      note("Nadie ha andado todavía. Arrastra una ficha del campo a otro hexágono y vuelve aquí.");
      return;
    }
    busyRef.current = true;
    setBusy(true);
    await slumpPieces(
      asleep.map((p) => p.id),
      false,
      t.current.wakeStagger,
    );
    setPieces((prev) => prev.map((p) => (p.moved ? { ...p, moved: false } : p)));
    busyRef.current = false;
    setBusy(false);
    note(
      `Turno nuevo: ${asleep.length === 1 ? "una ficha vuelve" : `${asleep.length} fichas vuelven`} a respirar, con ${t.current.wakeStagger} ms de escalón. Ponlo a 0 y repítelo: de golpe parece un fallo de pintado.`,
    );
  }

  /**
   * ATAQUE: embestida, contacto y vuelta, en sus TRES desenlaces.
   *
   * LA IDA ES LA MISMA EN LOS TRES, y no es una simplificación sino la regla
   * que gobierna esta función. V3 no enseña dados (§4.1): la animación es el
   * único sitio donde el jugador se entera del resultado. Si el fallo se notara
   * en la embestida —más corta, más torcida, más lo que sea—, se aprendería a
   * leer el desenlace en el gesto y la tirada oculta dejaría de tener suspense.
   * Todo lo que separa fallar de golpear empieza en el fotograma del contacto y
   * ni un milisegundo antes. Las duraciones salen de `attackPhases`, que está en
   * lib/v3/anim.ts justamente para poder comprobar esa propiedad sin pantalla.
   *
   * El congelado (hit-stop) se hace parando el polvo y RETRASANDO la vuelta, no
   * pausando animaciones a mano: en el fotograma del contacto el atacante ya
   * está quieto —acaba de terminar la ida y todavía no ha empezado la vuelta—,
   * así que esperar ahí es literalmente congelar la escena. Cuando haya más
   * cosas moviéndose a la vez habrá que pausarlas de verdad
   * (`document.getAnimations()`), y este es el sitio.
   */
  async function attackSequence(attacker: Piece, target: Piece, result: AttackResult) {
    const l = layoutRef.current;
    const el = elements.current.get(attacker.id);
    const victim = elements.current.get(target.id);
    if (!l || !el || !victim || !attacker.hex || !target.hex) return;
    const a = l.centers.get(Hex.key(attacker.hex));
    const b = l.centers.get(Hex.key(target.hex));
    if (!a || !b) return;

    // El aliento se para durante la embestida y vuelve al final: sumado al
    // gesto, lo que se ve no es una ficha viva embistiendo, es un temblor.
    stopIdle(attacker.id);

    const p = await attackMotion(
      { el, shadow: shadowOf(el) },
      { el: victim, shadow: shadowOf(victim) },
      a,
      b,
      groundOf(l),
      result,
      t.current,
      // La cifra es marcador de posición hasta que exista el motor (§4.2). Lo
      // que NO es de mentira es la RELACIÓN entre ella y la del crítico, que la
      // dobla: un crítico que enseñara un número parecido al normal no se
      // leería como tal por muchas chispas que llevara.
      { damage: 4 + Math.floor(Math.random() * 8) },
    );

    // El relevo: en V3 los estados de control los aplica el crítico (§4.5), así
    // que un crítico no termina en sí mismo — deja algo puesto.
    if (result === "critico") {
      setPieces((prev) => prev.map((x) => (x.id === target.id ? { ...x, state: CRIT_STATE } : x)));
    }

    startIdle(attacker);
    return p;
  }

  /** Un ataque suelto, con su desenlace elegido a mano desde la barra. */
  async function attack(attacker: Piece, target: Piece, result: AttackResult) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const p = await attackSequence(attacker, target, result);
    busyRef.current = false;
    setBusy(false);
    if (!p) return;
    note(
      result === "fallo"
        ? `Fallo en ${p.total} ms. La ida es la misma que la del golpe —${p.lunge} ms— y no hay congelado: lo que cambia empieza en el contacto.`
        : result === "critico"
          ? `Crítico en ${p.total} ms, de los cuales ${p.stop} son congelado (×${t.current.critStop.toFixed(1)}). Compáralo con el golpe normal: es el congelado, no las chispas.`
          : `Golpe en ${p.total} ms, de los cuales ${p.stop} son congelado. Bájalo a 0 y vuelve a mirarlo.`,
    );
  }

  /**
   * UNA TANDA, que es donde esto se juzga de verdad.
   *
   * Los tres desenlaces sueltos se miran de uno en uno y los tres parecen bien.
   * Lo que no se puede ver de uno en uno es el RITMO: si una racha de fallos se
   * siente acelerada, si un crítico frena la ronda, y si con la banda de acierto
   * real (65–95) el fallo aparece lo bastante como para que haga falta que se
   * lea tan claro. Por eso la tirada es la de verdad —combat.ts, §4.1— y no una
   * secuencia inventada de tres.
   */
  async function volley(attacker: Piece, target: Piece, count = 12) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);

    const tally: Record<AttackResult, number> = { fallo: 0, impacto: 0, critico: 0 };
    let elapsed = 0;
    for (let i = 0; i < count; i++) {
      const { roll, result } = resolveAttack(odds.precision, odds.luck);
      tally[result]++;
      note(
        `Tanda ${i + 1}/${count} · tirada ${roll} contra 🎯 ${odds.precision} → ${result.toUpperCase()}`,
      );
      const p = await attackSequence(attacker, target, result);
      if (!p || !mountedRef.current) break;
      elapsed += p.total;
      if (i < count - 1) {
        await wait(QUEUE_GAP);
        elapsed += QUEUE_GAP;
      }
    }

    busyRef.current = false;
    setBusy(false);
    note(
      `Tanda de ${count}: ${tally.impacto} golpes, ${tally.fallo} fallos y ${tally.critico} críticos en ${(elapsed / 1000).toFixed(1)} s. ` +
        `Lo que hay que mirar no es cada uno, es si el conjunto lleva un ritmo o va a trompicones.`,
    );
  }

  /**
   * MUERTE. La secuencia es motion/attack.ts `vanish`: fogonazo, la ficha crece,
   * y se deshace hacia abajo dejando polvo. Lo que NO puede ser es un fundido —
   * una ficha que se desvanece se lee como un fallo de la pantalla, no como una
   * baja.
   */
  async function kill(piece: Piece) {
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    if (!l || !el || !piece.hex) return;
    const at = l.centers.get(Hex.key(piece.hex));
    if (!at) return;

    busyRef.current = true;
    setBusy(true);
    stopIdle(piece.id);
    const cfg = t.current;

    await vanish({ el, shadow: shadowOf(el) }, at, groundOf(l), cfg);

    setPieces((prev) => prev.filter((p) => p.id !== piece.id));
    busyRef.current = false;
    setBusy(false);
    note(`Baja en ${cfg.death} ms. Lo que queda en el campo es el polvo, no la ficha.`);
  }

  // --- Mandos del banco -----------------------------------------------------

  const onBoard = pieces.filter((p) => p.hex);
  const mine = onBoard.filter((p) => p.side === "propio");
  const foes = onBoard.filter((p) => p.side === "enemigo");
  const inHand = pieces.filter((p) => !p.hex);
  const walked = onBoard.filter((p) => p.moved);

  const canAttack = mine.length > 0 && foes.length > 0;

  const reset = () => {
    if (busyRef.current) return;
    dustRef.current?.clear();
    setPieces(initialPieces(DUMMY_HEX));
    note("Banco reiniciado. Arrastra una carta a un hexágono.");
  };

  return (
    <div className={`anim ${className}`}>
      <div className="anim__stage" ref={stageRef}>
        {/* La única duración que sale de aquí hacia el CSS, porque la
            transición del terreno sí es declarativa y no una secuencia. El
            retraso de cada hexágono va en su propio estilo; esto es lo que
            tarda uno solo en levantarse. */}
        <div
          className="anim__scene"
          ref={sceneRef}
          style={{ ["--offer-rise-ms" as string]: `${OFFER_RISE_MS}ms` }}
        >
          {/* EL SUELO, sus tres capas y el lienzo del polvo: los pinta
              HexPatch, y son exactamente los mismos que los de /dev/baraja. El
              lienzo va SIEMPRE montado y nunca dentro del `layout &&` — de él
              cuelga el campo de partículas, y si no existe en el primer pintado
              el efecto se queda sin lienzo y no vuelve a intentarlo. */}
          {layout && (
            <PatchGround
              layout={layout}
              offered={offer}
              timings={timings}
              cellRef={setCellNode}
            />
          )}

          <PatchDust canvasRef={canvasRef} />

          {/* Las manchas, TODAS juntas y por debajo de cualquier ficha: si cada
              ficha llevara la suya al lado, una ficha alta proyectaría su sombra
              encima de la ficha de al lado. */}
          {layout && (
            <div className="patch__shadows">
              {pieces.map((p) => (
                <PatchShadow key={`s-${p.id}`} layout={layout} dataFor={p.id} />
              ))}
            </div>
          )}

          {layout &&
            pieces.map((p) => {
              const type = DAMAGE_TYPES[p.damage];
              const w = layout.size * 1.2;
              return (
                <div
                  key={p.id}
                  ref={setElement(p.id)}
                  className="anim__piece"
                  data-piece-id={p.id}
                  data-side={p.side}
                  data-placed={p.hex ? "true" : "false"}
                  data-moved={p.moved ? "true" : "false"}
                  onPointerDown={onPointerDown(p)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <div
                    className="anim__token"
                    style={{ width: `${w}px`, height: `${w * layout.tilt}px`, fontSize: `${layout.size * 0.6}px` }}
                  >
                    {type.icon}
                  </div>
                  {p.hex && p.state && (
                    <span className="anim__state" aria-hidden>
                      {p.state}
                    </span>
                  )}
                  {!p.hex && (
                    // La carta se dibuja a su tamaño de verdad y se encoge por
                    // el inverso de `cardScale`, para que al multiplicarla el
                    // padre quede exactamente a 1. Si se dibujara pequeña y se
                    // agrandara, el texto se rasterizaría al tamaño chico y
                    // saldría emborronado durante todo el vuelo.
                    <div
                      className="anim__face"
                      style={{ ["--counter" as string]: 1 / timings.cardScale }}
                    >
                      <span className="anim__face-icon">{type.icon}</span>
                      <span className="anim__face-name">{type.label}</span>
                      <span className="anim__face-range">alcance {type.range}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <p className="anim__hint">
          {inHand.length > 0 ? (
            <>
              Arrastra la carta a un hexágono
              {inHand.length > 1 && <> · quedan {inHand.length} en la mano</>}
            </>
          ) : (
            <>Coge una ficha del campo para ver hasta dónde llega</>
          )}
        </p>
      </div>

      <div className="anim__toolbar">
        {/* Los tres desenlaces del §4.1, a mano y uno al lado del otro: la
            comparación es el experimento. Sueltos parecen bien los tres; lo
            que hay que juzgar es si se distinguen ENTRE SÍ sin leer el texto. */}
        <span className="anim__group">Atacar</span>
        <button
          className={buttonClass()}
          disabled={busy || !canAttack}
          onClick={() => void attack(mine[mine.length - 1], foes[0], "impacto")}
          title="El desenlace normal: embestida, contacto, congelado y vuelta."
        >
          <i className="pi pi-bolt mr-1" />
          Golpear
        </button>
        <button
          className={buttonClass()}
          disabled={busy || !canAttack}
          onClick={() => void attack(mine[mine.length - 1], foes[0], "fallo")}
          title="La misma ida, exactamente. Sin destello, sin polvo, sin temblor y sin congelado: el objetivo se aparta y el atacante se pasa de largo."
        >
          Fallar
        </button>
        <button
          className={buttonClass()}
          disabled={busy || !canAttack}
          onClick={() => void attack(mine[mine.length - 1], foes[0], "critico")}
          title="Congelado doble, chispas en vez de tierra, y deja un estado puesto: en V3 el control lo aplica el crítico."
        >
          Crítico
        </button>
        <button
          className={buttonClass()}
          disabled={busy || !canAttack}
          onClick={() => void volley(mine[mine.length - 1], foes[0])}
          title="Doce ataques seguidos con la tirada de verdad (§4.1) contra los umbrales de abajo. Es donde se juzga el ritmo, que es lo que no se ve de uno en uno."
        >
          <i className="pi pi-forward mr-1" />
          Tanda de 12
        </button>
        <button
          className={buttonClass()}
          disabled={busy || foes.length === 0}
          onClick={() => void kill(foes[0])}
          title="Fogonazo, rotura y polvo. Se lleva al enemigo por delante."
        >
          <i className="pi pi-times-circle mr-1" />
          Destruir enemigo
        </button>
        <button
          className={buttonClass()}
          disabled={busy || mine.length === 0}
          onClick={() => void kill(mine[mine.length - 1])}
          title="La misma secuencia sobre una ficha tuya."
        >
          Destruir la mía
        </button>
        <span className="anim__group">Turno</span>
        <button
          className={buttonClass()}
          disabled={busy || walked.length === 0}
          onClick={() => void newTurn()}
          title="Las que ya habían andado se levantan y vuelven a respirar, escalonadas. Es la misma forma que va a tener el tic de estados al empezar el turno."
        >
          <i className="pi pi-refresh mr-1" />
          Nuevo turno
        </button>
        <button className={buttonClass()} disabled={busy} onClick={reset} title="Todo a la mano.">
          <i className="pi pi-replay mr-1" />
          Reiniciar
        </button>
        <span className="anim__count">
          {inHand.length === 0 && <>Mano vacía · </>}
          {onBoard.length} en el campo
          {walked.length > 0 && <> · {walked.length} ya ha{walked.length === 1 ? "" : "n"} andado</>}
        </span>
      </div>
    </div>
  );
}

// --- Ayudas sin estado -------------------------------------------------------
//
// Las que no son de aquí —`transform`, `run`, `settleAnimations`, `wait`,
// `pickUp`, `moveShadow` y `shake`— viven en components/dev/motion/core.ts,
// porque /dev/baraja tiene que hacer lo mismo con ellas.

/**
 * El centrado del disco sobre el punto de la ficha. Va aquí como cadena y no en
 * el CSS a secas porque el aliento y el hundimiento escriben `transform` sobre
 * el mismo elemento, y todas las cadenas que compitan tienen que llevar LA MISMA
 * LISTA DE FUNCIONES en el mismo orden: si una dice `translate scale` y otra
 * `translate translateY scale`, el navegador no las interpola, las cambia de
 * golpe y la ficha pega un salto.
 */
const TOKEN_BASE = "translate(-50%, -50%)";

/** Cómo se nombra a quien ocupa un hexágono, para que el motor pueda explicarse. */
function nameAt(pieces: readonly Piece[], hex: HexCoord): string | null {
  const piece = pieces.find((p) => p.hex && Hex.equals(p.hex, hex));
  if (!piece) return null;
  return `la ficha ${DAMAGE_TYPES[piece.damage].icon} ${piece.side === "propio" ? "tuya" : "enemiga"}`;
}

/**
 * La sombra de una ficha vive en la capa de sombras, emparejada por `data-for`.
 *
 * Se busca desde el PADRE de la ficha —la escena— y no desde la capa de manchas:
 * la capa es hija de la escena igual que las fichas, así que `querySelector`
 * llega a ella sin que este código tenga que saber que existe.
 */
function shadowOf(el: HTMLElement): HTMLElement | null {
  const id = el.parentElement?.querySelector<HTMLElement>(`.patch__shadow[data-for="${cssId(el)}"]`);
  return id ?? null;
}

function cssId(el: HTMLElement): string {
  return el.dataset.pieceId ?? "";
}

/** El punto del puntero en coordenadas del escenario. */
function toStage(
  event: React.PointerEvent,
  stage: HTMLElement | null,
): { x: number; y: number } {
  if (!stage) return { x: 0, y: 0 };
  const rect = stage.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
