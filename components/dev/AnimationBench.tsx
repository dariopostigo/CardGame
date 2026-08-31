"use client";

// =========================================================================
// El banco de animación — el escenario donde se miden las secuencias
//
// ESTO NO ES EL TABLERO, y la distinción importa: ArenaBoard es la arena de
// verdad —14×12, con cámara arrastrable, bandas, alcances y una lámina de
// suelo— y este banco son quince hexágonos quietos cuyo único trabajo es que
// se pueda mirar una caída de cerca y repetirla cien veces. Comparte la
// GEOMETRÍA (lib/v3/hex.ts) y la misma compresión de cámara medida, pero no
// comparte el componente a propósito: meter esto en ArenaBoard obligaría a
// darle un canvas, una capa de fichas en DOM y un modo "sin cámara", y todo eso
// para poder ver un aplastado de 110 ms. Cuando los números estén decididos, lo
// que se muda a ArenaBoard son las CIFRAS (lib/v3/anim.ts), no este archivo.
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
// props desde lib/v3/anim.ts, y lo único que este componente decide es el
// `transform` de cada fotograma.
// =========================================================================

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord, HexKey } from "@/lib/v3/hex";
import {
  CURVES,
  attackPhases,
  critDust,
  cubic,
  deathDust,
  hitDust,
  landingDust,
  type Timings,
} from "@/lib/v3/anim";
import { resolveAttack, type AttackResult } from "@/lib/v3/combat";
import { DAMAGE_TYPES, type DamageTypeId } from "@/lib/v3/damage";
import type { Side } from "@/lib/v3/arena";
import { DustField } from "./dust";
import { buttonClass } from "@/components/ui/Button";

/** La misma compresión medida en ArenaBoard sobre la referencia de arte. */
const TILT = 0.67;

/** El retal de tablero. Cinco por tres es lo justo para que quepa una embestida. */
const COLS = 5;
const ROWS = 3;

const SQRT3 = Math.sqrt(3);

/**
 * Qué parte del alto del escenario ocupa el suelo, y cuánto se le deja a la
 * mano por debajo. La mano necesita el alto de una carta ENTERA con su aire: si
 * se le da menos, las cartas se salen por abajo y el escenario las recorta.
 */
const GROUND_SHARE = 0.55;
const TOP_PAD = 18;
const HAND_BOTTOM = 100;

/**
 * El respiro entre dos sucesos de una tanda. Es el mismo `gap` por defecto de
 * `schedule()`, y aquí está a mano a propósito: la tanda tiene que sonar igual
 * que sonará la cola de verdad, o mediría otra cosa.
 */
const QUEUE_GAP = 60;

/** Curvas que no son diales porque no se discuten. */
const EASE_FLIGHT: readonly [number, number, number, number] = [0.3, 0.1, 0.2, 1];
const EASE_LUNGE: readonly [number, number, number, number] = [0.4, 0, 0.2, 1];
const EASE_BACK: readonly [number, number, number, number] = [0.3, 0, 0.3, 1];

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
};

/** El glifo que deja un crítico. 💫 Aturdimiento, del catálogo de control. */
const CRIT_STATE = "💫";

type Box = { readonly w: number; readonly h: number };

type Layout = {
  readonly size: number;
  readonly cells: readonly { hex: HexCoord; key: HexKey; x: number; y: number; points: string }[];
  readonly centers: ReadonlyMap<HexKey, { x: number; y: number }>;
  readonly mesh: readonly { x1: number; y1: number; x2: number; y2: number }[];
  /** El centro de la mano. Las cartas se abren en abanico alrededor. */
  readonly hand: { x: number; y: number };
};

/**
 * El sitio de una carta en la mano: abanico, no montón.
 *
 * Tres cartas en el mismo punto se tapan y no se puede coger la de abajo, pero
 * la razón de fondo es otra: una mano de cartas se lee de un vistazo porque
 * está abierta, y ese gesto —el abanico ligeramente girado— es la mitad de lo
 * que hace que un juego de cartas parezca un juego de cartas.
 */
function handSlot(l: Layout, index: number, count: number, cardScale: number) {
  const step = Math.min(l.size * 1.9 * cardScale * 0.5, (l.size * 5) / Math.max(count, 1));
  const offset = (index - (count - 1) / 2) * step;
  return {
    x: l.hand.x + offset,
    // Las de los lados caen un poco: el abanico es un arco, no una fila.
    y: l.hand.y + Math.abs(offset) * 0.06,
    rotate: count > 1 ? offset * 0.055 : 0,
  };
}

const INITIAL: readonly Omit<Piece, "hex" | "state">[] = [
  { id: "enemigo-1", damage: "cuerpo-a-cuerpo", side: "enemigo" },
  { id: "propio-1", damage: "cuerpo-a-cuerpo", side: "propio" },
  { id: "propio-2", damage: "magico", side: "propio" },
  { id: "propio-3", damage: "a-distancia", side: "propio" },
];

/** El banco recién puesto: el muñeco de pruebas en el campo y tres cartas en la mano. */
function initialPieces(dummy: HexCoord | null): Piece[] {
  return INITIAL.map((p) => ({ ...p, hex: p.side === "enemigo" ? dummy : null, state: null }));
}

/** Dónde se planta el muñeco: a la derecha, en la fila de en medio. */
const DUMMY_HEX = Hex.offsetToAxial({ col: COLS - 1, row: 1 });

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
  const dustRef = useRef<DustField | null>(null);
  const elements = useRef(new Map<string, HTMLDivElement>());

  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [pieces, setPieces] = useState<readonly Piece[]>(() => initialPieces(DUMMY_HEX));
  const [busy, setBusy] = useState(false);

  // Los tiempos se leen desde dentro de secuencias asíncronas que empezaron
  // hace medio segundo: con la prop a secas, mover un slider a mitad de una
  // caída usaría el valor viejo en el tramo que falta. La referencia siempre
  // apunta al último.
  const t = useRef(timings);
  t.current = timings;

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

  // --- Medida y geometría ---------------------------------------------------

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: Math.round(width), h: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo<Layout | null>(() => {
    if (box.w < 80 || box.h < 80) return null;

    const hexes: HexCoord[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) hexes.push(Hex.offsetToAxial({ col, row }));
    }

    // El tamaño sale de encajar el retal en la caja, no de un número elegido:
    // el banco tiene que verse igual de cerca en una pantalla ancha que en una
    // estrecha. Se mide con radio 1 y luego se escala.
    const unit = hexes.map((h) => Hex.toPixel(h, 1, TILT));
    const minX = Math.min(...unit.map((p) => p.x));
    const maxX = Math.max(...unit.map((p) => p.x));
    const minY = Math.min(...unit.map((p) => p.y));
    const maxY = Math.max(...unit.map((p) => p.y));
    const spanX = maxX - minX + SQRT3;
    const spanY = maxY - minY + 2 * TILT;
    const size = Math.max(
      16,
      Math.min((box.w - 48) / spanX, (box.h * GROUND_SHARE - TOP_PAD) / spanY),
    );

    const offsetX = (box.w - spanX * size) / 2 + (SQRT3 / 2) * size - minX * size;
    const offsetY = TOP_PAD + TILT * size - minY * size;

    const cells = hexes.map((hex, i) => {
      const x = unit[i].x * size + offsetX;
      const y = unit[i].y * size + offsetY;
      return { hex, key: Hex.key(hex), x, y, points: Hex.polygonPoints(x, y, size, TILT) };
    });

    const centers = new Map(cells.map((c) => [c.key, { x: c.x, y: c.y }]));

    // Cada arista una sola vez: si no, el lado que comparten dos hexágonos se
    // pintaría dos veces y saldría al doble de opacidad (misma razón que en
    // ArenaBoard).
    const mesh = Hex.uniqueEdges(hexes).map((edge) => {
      const { x, y } = centers.get(Hex.key(edge.hex)) ?? { x: 0, y: 0 };
      const [a, b] = Hex.edgeEndpoints(x, y, size, edge.dir, TILT);
      return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });

    return { size, cells, centers, mesh, hand: { x: box.w / 2, y: box.h - HAND_BOTTOM } };
  }, [box]);

  const layoutRef = useRef<Layout | null>(null);
  layoutRef.current = layout;

  // --- El polvo -------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const field = new DustField(canvas);
    dustRef.current = field;
    return () => {
      field.destroy();
      dustRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (layout && dustRef.current) dustRef.current.resize(box.w, box.h);
  }, [layout, box]);

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
      if (token) token.style.opacity = piece.hex ? "1" : "0";

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

  // --- Arrastre de la carta -------------------------------------------------

  const drag = useRef<{ id: string; lastX: number; vx: number } | null>(null);

  const onPointerDown = (piece: Piece) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (busyRef.current || piece.hex) return;
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    if (!l || !el) return;

    event.preventDefault();
    el.setPointerCapture(event.pointerId);
    drag.current = { id: piece.id, lastX: event.clientX, vx: 0 };
    el.dataset.dragging = "true";

    const { x, y } = toStage(event, stageRef.current);
    el.style.transform = transform(x, y, t.current.hover, t.current.cardScale);
    moveShadow(el, l, x, y, t.current.hover);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const l = layoutRef.current;
    if (!state || !l) return;
    const el = elements.current.get(state.id);
    if (!el) return;

    const { x, y } = toStage(event, stageRef.current);
    // La carta se inclina con la velocidad del gesto. Es el detalle más barato
    // de todo el banco y el que hace que arrastrar deje de parecer mover un
    // icono: un naipe que se mueve rápido se ladea porque lo llevas cogido de
    // una esquina. Se suaviza contra el valor anterior para que no tiemble.
    const dx = event.clientX - state.lastX;
    state.vx = state.vx * 0.72 + dx * 0.28;
    state.lastX = event.clientX;
    const tiltDeg = Math.max(-14, Math.min(14, state.vx * 1.6));

    el.style.transform = transform(x, y, t.current.hover, t.current.cardScale, undefined, tiltDeg);
    moveShadow(el, l, x, y, t.current.hover);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const l = layoutRef.current;
    if (!state || !l) return;
    drag.current = null;

    const el = elements.current.get(state.id);
    const piece = pieces.find((p) => p.id === state.id);
    if (!el || !piece) return;
    delete el.dataset.dragging;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);

    const from = toStage(event, stageRef.current);
    const cell = nearestCell(l, from);
    const taken = cell ? pieces.some((p) => p.hex && Hex.equals(p.hex, cell.hex)) : false;

    if (!cell) {
      note("Soltada fuera del tablero: la carta vuelve a la mano.");
      void returnToHand(piece, el, l, from);
      return;
    }
    if (taken) {
      note("Ahí ya hay una ficha. En el juego esto sería una negativa del motor, con su motivo.");
      void returnToHand(piece, el, l, from);
      return;
    }
    void deploy(piece, cell.hex, from);
  };

  // --- Las tres secuencias --------------------------------------------------

  /**
   * DESPLIEGUE: la carta vuela, se convierte en ficha, cae y levanta polvo.
   *
   * Va en DOS animaciones y no en una: el vuelo y la caída son un solo
   * movimiento continuo —una sola animación con un fotograma clave en medio,
   * cada tramo con su curva— y el aplastado es otra que empieza cuando la
   * primera acaba. Partirlo así tiene un motivo concreto: entre dos animaciones
   * encadenadas puede colarse un fotograma de nada, y ese hueco se ve si cae en
   * mitad de un desplazamiento, pero no se ve cuando la ficha ya está parada en
   * el suelo. Justo en ese punto es donde se emite el polvo.
   */
  async function deploy(piece: Piece, hex: HexCoord, from: { x: number; y: number }) {
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    const target = l?.centers.get(Hex.key(hex));
    if (!l || !el || !target) return;

    busyRef.current = true;
    setBusy(true);
    const c = t.current;
    const face = el.querySelector<HTMLElement>(".anim__face");
    const token = el.querySelector<HTMLElement>(".anim__token");
    const shadow = shadowOf(el);

    const total = Math.max(1, c.flight + c.fall);
    const share = c.flight / total;
    const parallel: Animation[] = [];

    // La carta se cruza con la ficha durante el primer tercio del vuelo: si se
    // cruzan al final, lo que se ve es una carta que aterriza y luego cambia.
    if (face) {
      parallel.push(
        face.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: Math.max(1, c.flight * 0.55),
          easing: "ease-in",
          fill: "forwards",
        }),
      );
    }
    if (token) {
      parallel.push(
        token.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: Math.max(1, c.flight * 0.7),
          easing: "ease-out",
          fill: "forwards",
        }),
      );
    }

    // La sombra: arranca grande y casi invisible —la ficha está alta— y acaba
    // pequeña y marcada. Es lo único que dice que esto ha bajado.
    if (shadow) {
      parallel.push(
        shadow.animate(
          [
            {
              transform: `translate(${from.x}px, ${from.y}px) scale(${1.6 + c.hover / 90})`,
              opacity: 0.12,
            },
            {
              transform: `translate(${target.x}px, ${target.y}px) scale(${1 + c.hover / 140})`,
              opacity: 0.3,
              offset: share,
            },
            { transform: `translate(${target.x}px, ${target.y}px) scale(1)`, opacity: 0.55 },
          ],
          { duration: total, easing: "linear", fill: "forwards" },
        ),
      );
    }

    await run(el, [
      {
        transform: transform(from.x, from.y, c.hover, c.cardScale),
        easing: cubic(EASE_FLIGHT),
      },
      {
        transform: transform(target.x, target.y, c.hover, 1),
        offset: share,
        easing: cubic(CURVES[c.fallCurve].curve),
      },
      { transform: transform(target.x, target.y, 0, 1) },
    ], total);

    settleAnimations(parallel);

    // El suelo. Aquí es donde se levanta el polvo y donde tiembla la cámara —un
    // poco, que esto es dejar una ficha, no un meteorito.
    //
    // El reventón sale del BORDE DE ABAJO de la peana y no de su centro, y no es
    // un matiz: la peana es un disco opaco de su mismo tamaño, así que un
    // reventón centrado se queda entero detrás de ella y no se ve nada durante
    // los primeros cien milisegundos, que son justo los que importan. Abajo es
    // además donde la ficha toca el suelo, que es de donde se levanta el polvo.
    dustRef.current?.emit(target.x, target.y + l.size * 0.42, landingDust(c));
    shake(c.shake * 0.5, c.shakeTime * 0.6);

    if (c.squash > 0) {
      const s = c.squashAmount;
      await run(
        el,
        [
          { transform: transform(target.x, target.y, 0, 1 + s, 1 - s), easing: "ease-out" },
          { transform: transform(target.x, target.y, 0, 1 - s * 0.35, 1 + s * 0.35), offset: 0.55, easing: "ease-in-out" },
          { transform: transform(target.x, target.y, 0, 1, 1) },
        ],
        c.squash,
      );
    }

    setPieces((prev) => prev.map((p) => (p.id === piece.id ? { ...p, hex } : p)));
    busyRef.current = false;
    setBusy(false);
    note(
      `Desplegada en ${c.flight + c.fall + c.squash} ms: ${c.flight} de vuelo, ${c.fall} de caída (${CURVES[c.fallCurve].label.toLowerCase()}) y ${c.squash} de aplastado.`,
    );
  }

  /** La carta vuelve a su hueco de la mano: sin peso, porque no cae — la recoges. */
  async function returnToHand(piece: Piece, el: HTMLElement, l: Layout, from: { x: number; y: number }) {
    const hand = pieces.filter((p) => !p.hex);
    const slot = handSlot(l, hand.indexOf(piece), hand.length, t.current.cardScale);
    const shadow = shadowOf(el);
    const parallel = shadow
      ? [
          shadow.animate(
            [{ transform: `translate(${slot.x}px, ${slot.y}px) scale(1.6)`, opacity: 0.18 }],
            { duration: 240, easing: cubic(EASE_BACK), fill: "forwards" },
          ),
        ]
      : [];
    await run(
      el,
      [
        { transform: transform(from.x, from.y, t.current.hover, t.current.cardScale) },
        { transform: transform(slot.x, slot.y, 0, t.current.cardScale, undefined, slot.rotate) },
      ],
      240,
      cubic(EASE_BACK),
    );
    settleAnimations(parallel);
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

    const c = t.current;
    const p = attackPhases(result, c);
    const miss = result === "fallo";
    const crit = result === "critico";

    const dx = (b.x - a.x) * c.lungeDistance;
    const dy = (b.y - a.y) * c.lungeDistance;
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const shadow = shadowOf(el);

    // La sombra acompaña a la embestida. No es un detalle: una ficha que se
    // lanza hacia delante dejando su sombra clavada en la casilla de origen no
    // se lee como que embiste, se lee como que se ha despegado del tablero.
    const lungeShadow = (frames: Keyframe[], duration: number, easing: string) =>
      shadow ? [shadow.animate(frames, { duration, easing, fill: "forwards" })] : [];

    // Un salto de nada durante la ida: golpear es empujar hacia arriba y hacia
    // delante, no deslizarse.
    const out = lungeShadow(
      [
        { transform: `translate(${a.x}px, ${a.y}px) scale(1)`, opacity: 0.55 },
        {
          transform: `translate(${a.x + dx * 0.4}px, ${a.y + dy * 0.4}px) scale(1.12)`,
          opacity: 0.4,
          offset: 0.6,
        },
        { transform: `translate(${a.x + dx}px, ${a.y + dy}px) scale(1)`, opacity: 0.55 },
      ],
      Math.max(1, p.lunge),
      cubic(EASE_LUNGE),
    );

    await run(
      el,
      [
        { transform: transform(a.x, a.y, 0, 1) },
        { transform: transform(a.x + dx * 0.4, a.y + dy * 0.4, 10, 1.04), offset: 0.6 },
        { transform: transform(a.x + dx, a.y + dy, 0, 1.06, 0.96) },
      ],
      p.lunge,
      cubic(EASE_LUNGE),
    );
    settleAnimations(out);

    // --- El fotograma del contacto: aquí y solo aquí se separan los tres ---
    const hit = { x: a.x + (b.x - a.x) * 0.68, y: a.y + (b.y - a.y) * 0.68 };

    // El respingo del objetivo arranca EN el contacto, no antes. Un esquive que
    // empieza a mitad de la ida es un aviso: se ve venir el fallo con el
    // suficiente tiempo como para leerlo, y eso es exactamente lo que la ida
    // idéntica estaba evitando. Empezando aquí, lo que se lee es que el golpe
    // llegó y el objetivo ya no estaba, que es lo que pasa.
    const dodge = miss ? dodgeAside(victim, l, b, angle, c.missDodge, p) : [];

    if (miss) {
      // Ni destello, ni polvo, ni temblor. La ausencia de las tres ES la
      // información: lo que dice que no ha entrado es que no pasa nada de lo
      // que siempre pasa.
      floatText(hit.x, hit.y, "Fallo", "fallo");
    } else {
      dustRef.current?.emit(hit.x, hit.y, crit ? critDust(c, angle) : hitDust(c, angle));
      shake(c.shake * (crit ? c.critShake : 1), c.shakeTime);
      flash(victim, c.flash * (crit ? c.critFlash : 1), crit ? 7 : 4);
      // El crítico dobla el daño (§4.2). La cifra sigue siendo de mentira hasta
      // que exista el motor, pero la RELACIÓN entre las dos no lo es: un
      // crítico que enseñara un número parecido al normal no se leería como tal
      // por muchas chispas que llevara.
      const damage = 4 + Math.floor(Math.random() * 8);
      floatText(hit.x, hit.y, `−${crit ? damage * 2 : damage}`, crit ? "critico" : "impacto");
    }

    if (p.stop > 0) {
      dustRef.current?.pause();
      await wait(p.stop);
      dustRef.current?.resume();
    }

    // La vuelta. La del fallo lleva un tramo de más: el que se ha vaciado en un
    // golpe que no estaba se pasa de largo antes de recomponerse, y ese
    // sobrepaso va DESPUÉS del contacto —nunca en la ida, que sería el aviso.
    const end = { x: a.x + dx * c.missOvershoot, y: a.y + dy * c.missOvershoot };
    const back = lungeShadow(
      miss
        ? [
            { transform: `translate(${a.x + dx}px, ${a.y + dy}px) scale(1)`, opacity: 0.55 },
            {
              transform: `translate(${end.x}px, ${end.y}px) scale(1.06)`,
              opacity: 0.5,
              offset: 0.22,
            },
            { transform: `translate(${a.x}px, ${a.y}px) scale(1)`, opacity: 0.55 },
          ]
        : [
            { transform: `translate(${a.x + dx}px, ${a.y + dy}px) scale(1)`, opacity: 0.55 },
            { transform: `translate(${a.x}px, ${a.y}px) scale(1)`, opacity: 0.55 },
          ],
      Math.max(1, p.back),
      cubic(EASE_BACK),
    );

    await run(
      el,
      miss
        ? [
            { transform: transform(a.x + dx, a.y + dy, 0, 1.06, 0.96) },
            { transform: transform(end.x, end.y, 6, 1.04, 0.98, 9), offset: 0.22 },
            { transform: transform(a.x, a.y, 0, 1) },
          ]
        : [
            { transform: transform(a.x + dx, a.y + dy, 0, 1.06, 0.96) },
            { transform: transform(a.x, a.y, 0, 1) },
          ],
      p.back,
      cubic(EASE_BACK),
    );
    settleAnimations(back);
    settleAnimations(dodge);

    // El relevo: en V3 los estados de control los aplica el crítico (§4.5), así
    // que un crítico no termina en sí mismo — deja algo puesto.
    if (crit) setPieces((prev) => prev.map((x) => (x.id === target.id ? { ...x, state: CRIT_STATE } : x)));

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
   * El respingo del que esquiva: se aparta de lado y vuelve.
   *
   * De lado y no hacia atrás: retroceder por el eje del golpe se confunde con
   * el empuje de haberlo recibido, que es justo lo contrario de lo que hay que
   * decir. Y corto —una fracción de hexágono— porque medio hexágono deja a la
   * ficha pisando la casilla de al lado, y en un tablero de hexágonos esa
   * mentira se ve.
   */
  function dodgeAside(
    victim: HTMLElement,
    l: Layout,
    at: { x: number; y: number },
    angle: number,
    amount: number,
    p: { back: number },
  ): Animation[] {
    if (amount <= 0) return [];
    const d = l.size * SQRT3 * amount;
    const px = Math.cos(angle + Math.PI / 2) * d;
    const py = Math.sin(angle + Math.PI / 2) * d;
    const options: KeyframeAnimationOptions = {
      duration: Math.max(1, p.back * 0.85),
      easing: cubic(EASE_LUNGE),
      fill: "forwards",
    };
    const list = [
      victim.animate(
        [
          { transform: transform(at.x, at.y, 0, 1) },
          { transform: transform(at.x + px, at.y + py, 5, 1, 1, -8), offset: 0.3 },
          { transform: transform(at.x, at.y, 0, 1) },
        ],
        options,
      ),
    ];
    const shadow = shadowOf(victim);
    if (shadow) {
      list.push(
        shadow.animate(
          [
            { transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 0.55 },
            {
              transform: `translate(${at.x + px}px, ${at.y + py}px) scale(1.08)`,
              opacity: 0.45,
              offset: 0.3,
            },
            { transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 0.55 },
          ],
          options,
        ),
      );
    }
    return list;
  }

  /**
   * MUERTE: fogonazo, la ficha crece, y se deshace hacia abajo dejando polvo.
   *
   * Lo que NO puede ser es un fundido: una ficha que se desvanece se lee como
   * un fallo de la pantalla, no como una baja. Tiene que pasar algo violento
   * primero —el fogonazo— y tiene que quedar algo después —el polvo.
   */
  async function kill(piece: Piece) {
    const l = layoutRef.current;
    const el = elements.current.get(piece.id);
    if (!l || !el || !piece.hex) return;
    const c = l.centers.get(Hex.key(piece.hex));
    if (!c) return;

    busyRef.current = true;
    setBusy(true);
    const cfg = t.current;
    const shadow = shadowOf(el);

    const parallel = shadow
      ? [
          shadow.animate(
            [{ opacity: 0.55 }, { opacity: 0, transform: `translate(${c.x}px, ${c.y}px) scale(0.4)` }],
            { duration: cfg.death, easing: "ease-in", fill: "forwards" },
          ),
        ]
      : [];

    // El polvo sale cuando la ficha se rompe, no cuando empieza el fogonazo.
    window.setTimeout(() => {
      dustRef.current?.emit(c.x, c.y, deathDust(cfg));
      shake(cfg.shake * 0.7, cfg.shakeTime);
    }, cfg.death * 0.34);

    await run(
      el,
      [
        { transform: transform(c.x, c.y, 0, 1), filter: "brightness(1)", opacity: 1 },
        {
          transform: transform(c.x, c.y, 8, 1.18),
          filter: "brightness(3.2)",
          opacity: 1,
          offset: 0.24,
        },
        {
          transform: transform(c.x, c.y, 0, 1.05, 0.9),
          filter: "brightness(1.6)",
          opacity: 1,
          offset: 0.4,
        },
        {
          transform: transform(c.x, c.y, -4, 0.72, 0.3),
          filter: "brightness(0.5)",
          opacity: 0,
        },
      ],
      cfg.death,
      "ease-in",
    );

    settleAnimations(parallel);
    setPieces((prev) => prev.filter((p) => p.id !== piece.id));
    busyRef.current = false;
    setBusy(false);
    note(`Baja en ${cfg.death} ms. Lo que queda en el campo es el polvo, no la ficha.`);
  }

  // --- Efectos sueltos ------------------------------------------------------

  /** El temblor de cámara: una oscilación que se apaga. */
  function shake(amount: number, duration: number) {
    const scene = sceneRef.current;
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
   * El destello del que recibe: es lo que dice CUÁL de las dos se ha llevado el
   * golpe, y con movimiento reducido es lo ÚNICO que lo dice.
   */
  function flash(el: HTMLElement, duration: number, brightness = 4) {
    if (duration <= 0) return;
    el.animate(
      [
        { filter: "brightness(1)" },
        { filter: `brightness(${brightness})`, offset: 0.15 },
        { filter: "brightness(1)" },
      ],
      { duration, easing: "ease-out" },
    );
  }

  /**
   * El texto que sale flotando del contacto: la cifra, o la palabra del fallo.
   *
   * Las cifras son un marcador de posición —saldrán del motor cuando exista
   * (§4.2)— pero el MOVIMIENTO de cada una no lo es, y es donde está el trabajo:
   * el golpe sale disparado hacia arriba y frena, que es un impacto; el fallo no
   * sube, se escurre de lado y se apaga, que es algo que no llegó a pasar. Si
   * los tres subieran igual, el color sería lo único que los separa y el color
   * es lo primero que se pierde de reojo.
   */
  function floatText(x: number, y: number, text: string, kind: AttackResult) {
    const scene = sceneRef.current;
    if (!scene) return;
    const el = document.createElement("div");
    el.className = `anim__damage${kind === "impacto" ? "" : ` anim__damage--${kind}`}`;
    el.textContent = text;
    el.style.transform = `translate(${x}px, ${y}px)`;
    scene.append(el);

    const frames: Keyframe[] =
      kind === "fallo"
        ? [
            { transform: `translate(${x}px, ${y}px) scale(0.9)`, opacity: 0 },
            { transform: `translate(${x + 10}px, ${y - 6}px) scale(1)`, opacity: 0.85, offset: 0.2 },
            { transform: `translate(${x + 30}px, ${y - 16}px) scale(1)`, opacity: 0 },
          ]
        : [
            { transform: `translate(${x}px, ${y}px) scale(0.6)`, opacity: 0 },
            {
              transform: `translate(${x}px, ${y - (kind === "critico" ? 22 : 14)}px) scale(${kind === "critico" ? 1.35 : 1.15})`,
              opacity: 1,
              offset: 0.18,
            },
            { transform: `translate(${x}px, ${y - 52}px) scale(1)`, opacity: 0 },
          ];

    const anim = el.animate(frames, {
      duration: kind === "fallo" ? 620 : 720,
      easing: "ease-out",
    });
    anim.finished.finally(() => el.remove()).catch(() => el.remove());
  }

  // --- Mandos del banco -----------------------------------------------------

  const onBoard = pieces.filter((p) => p.hex);
  const mine = onBoard.filter((p) => p.side === "propio");
  const foes = onBoard.filter((p) => p.side === "enemigo");
  const inHand = pieces.filter((p) => !p.hex);

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
        <div className="anim__scene" ref={sceneRef}>
          {layout && (
            <svg
              className="anim__ground"
              viewBox={`0 0 ${box.w} ${box.h}`}
              width={box.w}
              height={box.h}
              aria-hidden
            >
              {/* El suelo es una LÁMINA y no un color por casilla: el degradado
                  va en coordenadas de usuario, así que los quince hexágonos
                  comparten una sola pintura y la unión se lee como una
                  superficie sola. Es la misma decisión que ArenaBoard toma
                  desde la dirección de arte, y aquí hace falta por lo mismo:
                  sin ella el polvo cae sobre un mosaico. */}
              <defs>
                <linearGradient
                  id="anim-soil"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1={TOP_PAD}
                  x2="0"
                  y2={box.h * GROUND_SHARE}
                >
                  <stop offset="0" className="anim__soil-far" />
                  <stop offset="0.55" className="anim__soil-mid" />
                  <stop offset="1" className="anim__soil-near" />
                </linearGradient>
              </defs>
              <g className="anim__soil" fill="url(#anim-soil)">
                {layout.cells.map((c) => (
                  <polygon key={c.key} points={c.points} />
                ))}
              </g>
              <g className="anim__mesh">
                {layout.mesh.map((s, i) => (
                  <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
                ))}
              </g>
            </svg>
          )}

          <canvas className="anim__dust" ref={canvasRef} aria-hidden />

          {/* Las sombras van en su propia capa, POR DEBAJO de todas las fichas:
              si cada ficha llevara la suya al lado, una ficha alta proyectaría
              su sombra encima de la ficha de al lado. */}
          {layout &&
            pieces.map((p) => (
              <div key={`s-${p.id}`} className="anim__shadow" data-for={p.id}>
                {/* El punto que se mueve y la mancha que se ve son dos
                    elementos: el de fuera lo lleva JS con un `translate` puro y
                    el de dentro se centra sobre él con su propio -50 %. Así el
                    tamaño de la mancha puede depender del hexágono sin que
                    ninguna de las dos transformaciones tenga que saber de la
                    otra. */}
                <div
                  className="anim__blot"
                  style={{
                    width: `${layout.size * 1.5}px`,
                    height: `${layout.size * 1.5 * TILT * 0.62}px`,
                  }}
                />
              </div>
            ))}

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
                  onPointerDown={onPointerDown(p)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <div
                    className="anim__token"
                    style={{ width: `${w}px`, height: `${w * TILT}px`, fontSize: `${layout.size * 0.6}px` }}
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

        {inHand.length > 0 && (
          <p className="anim__hint">
            Arrastra la carta a un hexágono
            {inHand.length > 1 && <> · quedan {inHand.length} en la mano</>}
          </p>
        )}
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
        <button className={buttonClass()} disabled={busy} onClick={reset} title="Todo a la mano.">
          <i className="pi pi-replay mr-1" />
          Reiniciar
        </button>
        <span className="anim__count">
          {inHand.length === 0 && <>Mano vacía · </>}
          {onBoard.length} en el campo
        </span>
      </div>
    </div>
  );
}

// --- Ayudas sin estado -------------------------------------------------------

/**
 * El `transform` de una ficha. La ALTURA se resta de la `y` porque en un
 * tablero inclinado subir es ir hacia arriba en pantalla; lo que dice que es
 * altura y no profundidad es la sombra, que se queda en el suelo.
 */
function transform(
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
 * el primero la ficha vuelve de un salto a donde estaba; sin el segundo, el
 * salto ocurre al cancelar; y sin el tercero cada animación se queda viva para
 * siempre y a las cien caídas el navegador está manteniendo cien.
 *
 * Además marca la ficha con `data-moving` mientras dura, y solo mientras dura:
 * es lo que le enciende el `will-change`. Dejarlo puesto en el CSS parecía
 * gratis y no lo era —la carta quieta salía emborronada—; el porqué está en
 * styles/components/_animation-lab.scss, junto a la regla.
 */
async function run(
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
 * gana al `style` en línea: `settle()` escribiría la posición nueva de la
 * sombra al cambiar el tamaño de la ventana y la sombra no se movería, clavada
 * por una animación que terminó hace diez minutos. Además se acumulan —tres por
 * despliegue— y el navegador las mantiene todas.
 */
function settleAnimations(list: readonly Animation[]): void {
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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** La sombra de una ficha vive en la capa de sombras, emparejada por `data-for`. */
function shadowOf(el: HTMLElement): HTMLElement | null {
  const id = el.parentElement?.querySelector<HTMLElement>(`.anim__shadow[data-for="${cssId(el)}"]`);
  return id ?? null;
}

function cssId(el: HTMLElement): string {
  return el.dataset.pieceId ?? "";
}

function moveShadow(el: HTMLElement, l: Layout, x: number, y: number, height: number) {
  const shadow = shadowOf(el);
  if (!shadow) return;
  shadow.style.transform = `translate(${x}px, ${y}px) scale(${1.4 + height / 120})`;
  shadow.style.opacity = "0.16";
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

/** El hexágono más cercano al punto, si el punto cae razonablemente dentro. */
function nearestCell(l: Layout, point: { x: number; y: number }) {
  let best: (typeof l.cells)[number] | null = null;
  let bestDistance = Infinity;
  for (const cell of l.cells) {
    const d = (cell.x - point.x) ** 2 + (cell.y - point.y) ** 2;
    if (d < bestDistance) {
      bestDistance = d;
      best = cell;
    }
  }
  // El radio de tolerancia: dentro del hexágono con holgura, pero no medio
  // tablero más allá. Se compara al cuadrado para no sacar raíces.
  return best && bestDistance <= (l.size * 1.05) ** 2 ? best : null;
}
