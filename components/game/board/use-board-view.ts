"use client";

// =========================================================================
// Navegación del tablero: acercar, alejar y arrastrar
//
// El encuadre del tablero (HexBoard) es una VENTANA: el `viewBox` encaja el
// mapa entero en el marco, y esto es lo que deja moverse por dentro cuando el
// mapa ya no cabe de un vistazo. Desde que el tablero mínimo son 12 losetas
// (~103 hexágonos) y el mayor 18 (~155), "verlo entero" y "ver un hexágono"
// dejaron de ser la misma vista.
//
// Vive en un hook y no dentro del componente por dos motivos:
//   - el TSX del tablero ya es largo y esto es un asunto aparte: no toca
//     geometría de hexágonos, solo la cámara;
//   - la pantalla de juego va a necesitar la misma navegación, y así no se
//     reimplementa (ni divergen dos versiones del mismo arrastre).
//
// La cámara se aplica como `transform` de un grupo SVG y NO tocando el
// `viewBox`: así el encaje del mapa en el marco lo sigue calculando la
// geometría una sola vez —el `viewBox` es la vista "encajada", el estado
// neutro— y el zoom es un desvío medido contra ella. También es lo que hace
// que «Encajar» sea volver al origen y no recalcular nada.
//
// Todo se mide en UNIDADES DEL viewBox, no en píxeles de pantalla: así el
// arrastre recorre lo mismo en un monitor grande que en uno pequeño, y el
// recorte no depende del tamaño del navegador. La conversión de píxeles a
// unidades se hace en un solo sitio (`visibleRect`), que también tiene en
// cuenta las bandas que deja `preserveAspectRatio` cuando el marco y el mapa
// no tienen la misma proporción.
// =========================================================================

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/** El rectángulo del `viewBox` del SVG: la vista encajada, en sus unidades. */
export type ViewBox = { minX: number; minY: number; width: number; height: number };

/** La cámara: escala y desplazamiento del contenido, en unidades del viewBox. */
type View = { k: number; tx: number; ty: number };

/** Tablero encajado en el marco, sin desvío: el estado al que vuelve «Encajar». */
const FIT: View = { k: 1, tx: 0, ty: 0 };

/**
 * Mismo encaje, aunque sea otro objeto. `HexBoard` recalcula el `viewBox` cada
 * vez que cambia `board` —también cuando lo único distinto es la niebla
 * revelada, que no toca ni una coordenada—, así que comparar por referencia
 * resetea la cámara en cada movimiento. Por valor, solo se resetea cuando el
 * encaje de verdad cambia (otra semilla, otro tamaño de tablero).
 */
function sameBox(a: ViewBox, b: ViewBox): boolean {
  return a.minX === b.minX && a.minY === b.minY && a.width === b.width && a.height === b.height;
}

/**
 * Cuánto se puede alejar y acercar. El mínimo baja de 1 —del tablero encajado—
 * porque el marco tiene alto fijo: un tablero alargado deja bandas a los lados
 * y alejarlo un poco más es lo que lo separa del borde. El máximo son 6 veces:
 * a partir de ahí el hexágono ocupa la pantalla y ya no se ve de qué loseta es.
 */
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;

/** Paso por muesca de rueda y por clic en los botones. */
const WHEEL_STEP = 1.15;
const BUTTON_STEP = 1.4;

/**
 * Píxeles que se le perdonan al puntero antes de contar como arrastre. Sin este
 * margen, un clic para seleccionar un hexágono movería el tablero un pelo y el
 * clic se perdería: el ratón nunca está quieto del todo.
 */
const DRAG_SLOP = 3;

/** Lo que recorre una flecha del teclado, en fracción del marco visible. */
const KEY_PAN = 0.12;

/** El trozo de mapa que se ve, en unidades del viewBox, y la escala a píxeles. */
type VisibleRect = ViewBox & { scale: number };

/**
 * Qué se ve por el marco, en unidades del viewBox.
 *
 * El SVG encaja su viewBox con `preserveAspectRatio` por defecto (xMidYMid
 * meet): si el marco y el mapa no tienen la misma proporción, el mapa se centra
 * y sobran bandas a los lados o arriba y abajo. Esas bandas son mapa visible
 * también, así que el rectángulo de verdad es más grande que el viewBox y hay
 * que contarlo, o el arrastre se frenaría antes de llegar al borde.
 */
function visibleRect(rect: DOMRect, box: ViewBox): VisibleRect {
  const scale = Math.min(rect.width / box.width, rect.height / box.height) || 1;
  const width = rect.width / scale;
  const height = rect.height / scale;
  return {
    minX: box.minX - (width - box.width) / 2,
    minY: box.minY - (height - box.height) / 2,
    width,
    height,
    scale,
  };
}

/** El punto del mapa que hay debajo del puntero, en unidades del viewBox. */
function toBoard(rect: DOMRect, vis: VisibleRect, clientX: number, clientY: number) {
  return {
    x: vis.minX + (clientX - rect.left) / vis.scale,
    y: vis.minY + (clientY - rect.top) / vis.scale,
  };
}

/**
 * Deja la cámara dentro de lo razonable: el tablero no se puede perder de vista.
 *
 * La regla es la de cualquier mapa: si el tablero es más grande que el marco, el
 * marco tiene que quedar dentro del tablero (no se ve vacío por un lado); si es
 * más pequeño —alejado del todo—, el tablero tiene que quedar dentro del marco.
 * Las dos son el mismo intervalo con los extremos cambiados de orden, así que
 * sale un `min`/`max` y no un `if`.
 */
function clampView(view: View, box: ViewBox, vis: VisibleRect): View {
  const axis = (t: number, min: number, span: number, visMin: number, visSpan: number) => {
    const flush = visMin - view.k * min; // borde inicial del tablero contra el del marco
    const end = visMin + visSpan - view.k * (min + span); // y los bordes finales
    return Math.min(Math.max(t, Math.min(flush, end)), Math.max(flush, end));
  };
  return {
    k: view.k,
    tx: axis(view.tx, box.minX, box.width, vis.minX, vis.width),
    ty: axis(view.ty, box.minY, box.height, vis.minY, vis.height),
  };
}

/** Acerca o aleja dejando quieto el punto del mapa que se toma como ancla. */
function zoomAt(view: View, factor: number, anchor: { x: number; y: number }): View {
  const k = Math.min(Math.max(view.k * factor, MIN_ZOOM), MAX_ZOOM);
  const applied = k / view.k;
  return {
    k,
    tx: anchor.x - applied * (anchor.x - view.tx),
    ty: anchor.y - applied * (anchor.y - view.ty),
  };
}

export type BoardView = {
  /** `transform` del grupo que envuelve al tablero; `undefined` si está encajado. */
  transform: string | undefined;
  /** Escala actual. 1 es el tablero encajado en el marco. */
  zoom: number;
  /** Ya no se puede acercar / alejar más. */
  atMax: boolean;
  atMin: boolean;
  /** La vista está encajada y sin mover: no hay nada que restablecer. */
  isFit: boolean;
  /** Hay un arrastre en marcha (para el cursor). */
  panning: boolean;
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  /**
   * El último puntero fue un arrastre, así que el clic que viene detrás NO es
   * una selección. Se pregunta desde el `onClick` del hexágono.
   */
  wasDrag: () => boolean;
  /** Lo que hay que poner en el div del marco. */
  frameProps: {
    ref: (node: HTMLDivElement | null) => void;
    tabIndex: number;
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    "data-panning"?: "true";
  };
};

/**
 * La cámara del tablero: zoom con la rueda, arrastre con el ratón y flechas del
 * teclado.
 *
 * @param viewBox El viewBox del SVG, que es la vista encajada.
 */
export function useBoardView(viewBox: ViewBox): BoardView {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  // `dragging` es "el botón está apretado" y `panning` es "y además se ha movido
  // lo bastante para ser un arrastre". Son dos cosas: el primero enciende los
  // oyentes de la ventana, el segundo el cursor de mano cerrada.
  const [dragging, setDragging] = useState(false);
  const [panning, setPanning] = useState(false);

  // La cámara se guarda JUNTO al encuadre para el que se calculó, y la vista sale
  // de comparar los dos. Cuando llega otro tablero —otra semilla, otro tamaño— el
  // desvío anterior apuntaba a un mapa que ya no existe, así que la vista vuelve
  // sola a encajada. Derivarlo aquí en vez de restablecerlo desde un efecto
  // ahorra el segundo pintado que costaría cada tablero nuevo.
  const [camera, setCamera] = useState<{ box: ViewBox; view: View }>({ box: viewBox, view: FIT });
  const view = sameBox(camera.box, viewBox) ? camera.view : FIT;

  // El arrastre en curso y si ya ha pasado de DRAG_SLOP. En refs porque los lee
  // el manejador del puntero siguiente y el `onClick` del hexágono, no el
  // pintado: un render por píxel movido sería un render de más.
  const drag = useRef<{ x: number; y: number; from: View; scale: number } | null>(null);
  const dragged = useRef(false);

  /**
   * Mueve la cámara: mide el marco, deja que `change` decida el desvío y lo
   * recorta para que el tablero no se pierda de vista. Pasan por aquí la rueda,
   * el arrastre, las flechas y los botones, y es lo que garantiza que ninguna vía
   * se salte el recorte.
   */
  const move = useCallback(
    (change: (v: View, vis: VisibleRect, rect: DOMRect) => View) => {
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const vis = visibleRect(rect, viewBox);
      setCamera((c) => ({
        box: viewBox,
        view: clampView(change(sameBox(c.box, viewBox) ? c.view : FIT, vis, rect), viewBox, vis),
      }));
    },
    [frame, viewBox],
  );

  const fit = useCallback(() => setCamera({ box: viewBox, view: FIT }), [viewBox]);

  const zoomStep = useCallback(
    (factor: number) =>
      move((v, vis) =>
        zoomAt(v, factor, { x: vis.minX + vis.width / 2, y: vis.minY + vis.height / 2 }),
      ),
    [move],
  );

  // La rueda se suscribe a mano porque React la registra como oyente pasivo, y
  // uno pasivo no puede llamar a preventDefault(): sin eso, acercar el tablero
  // haría scroll de la página al mismo tiempo.
  useEffect(() => {
    if (!frame) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Rueda horizontal (o shift + rueda): no es un zoom, es scroll lateral.
      if (e.deltaY === 0) return;
      const factor = e.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP;
      // El ancla es el punto del mapa que hay bajo el puntero: acercar tiene que
      // agrandar lo que se está mirando, no el centro del marco.
      move((v, vis, rect) => zoomAt(v, factor, toBoard(rect, vis, e.clientX, e.clientY)));
    };
    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [frame, move]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Solo el botón principal y el central: el secundario abre el menú.
    if (!frame || (e.button !== 0 && e.button !== 1)) return;
    const vis = visibleRect(frame.getBoundingClientRect(), viewBox);
    dragged.current = false;
    drag.current = { x: e.clientX, y: e.clientY, from: view, scale: vis.scale };
    setDragging(true);
  };

  // Mientras hay arrastre, el ratón se sigue por la VENTANA y no por el marco: si
  // no, sacar el puntero por el borde dejaría el tablero pegado al ratón, y el
  // botón se podría soltar fuera sin que nos enteráramos.
  //
  // Y se sigue con oyentes propios en vez de con setPointerCapture() a propósito:
  // capturar el puntero reapunta también los eventos de ratón compatibles, así
  // que el `click` acabaría en el elemento que captura —el marco— en vez de en el
  // hexágono, y seleccionar una casilla dejaría de funcionar. Aquí el clic sigue
  // siendo el nativo del polígono; lo único que hace falta es descartarlo cuando
  // ha sido un arrastre (wasDrag).
  useEffect(() => {
    if (!dragging || !frame) return;

    const onMove = (e: globalThis.PointerEvent) => {
      const from = drag.current;
      if (!from) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      if (!dragged.current) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return; // todavía es un clic
        dragged.current = true;
        setPanning(true);
      }
      // El desvío se mide contra la vista de cuando empezó el arrastre, no contra
      // la anterior: así el tablero sigue al ratón sin acumular el error del
      // recorte cuando se llega al borde y se vuelve.
      move(() => ({
        k: from.from.k,
        tx: from.from.tx + dx / from.scale,
        ty: from.from.ty + dy / from.scale,
      }));
    };

    const onUp = () => {
      drag.current = null;
      setDragging(false);
      setPanning(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, frame, move]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        move((v, vis) => ({ ...v, tx: v.tx + vis.width * KEY_PAN }));
        break;
      case "ArrowRight":
        move((v, vis) => ({ ...v, tx: v.tx - vis.width * KEY_PAN }));
        break;
      case "ArrowUp":
        move((v, vis) => ({ ...v, ty: v.ty + vis.height * KEY_PAN }));
        break;
      case "ArrowDown":
        move((v, vis) => ({ ...v, ty: v.ty - vis.height * KEY_PAN }));
        break;
      case "+":
      case "=":
        zoomStep(BUTTON_STEP);
        break;
      case "-":
      case "_":
        zoomStep(1 / BUTTON_STEP);
        break;
      case "0":
        fit();
        break;
      default:
        return; // cualquier otra tecla sigue su camino
    }
    e.preventDefault();
  };

  const isFit = view.k === 1 && view.tx === 0 && view.ty === 0;

  return {
    transform: isFit
      ? undefined
      : `translate(${view.tx.toFixed(2)} ${view.ty.toFixed(2)}) scale(${view.k.toFixed(4)})`,
    zoom: view.k,
    atMax: view.k >= MAX_ZOOM,
    atMin: view.k <= MIN_ZOOM,
    isFit,
    panning,
    fit,
    zoomIn: () => zoomStep(BUTTON_STEP),
    zoomOut: () => zoomStep(1 / BUTTON_STEP),
    wasDrag: () => dragged.current,
    frameProps: {
      ref: setFrame,
      // Enfocable para que las flechas y el +/− funcionen sin ratón: el mapa es
      // el contenido de la pantalla, no un adorno.
      tabIndex: 0,
      onPointerDown,
      onKeyDown,
      ...(panning ? ({ "data-panning": "true" } as const) : {}),
    },
  };
}
