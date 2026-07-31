"use client";

// =========================================================================
// Laboratorio de Mazo y Oteo — /dev/baraja
//
// Banco de pruebas de lib/rules/deck.ts: elige un héroe y comprueba el Mazo
// (20 cartas fijas), el tope fijo de "en juego" (5) y el Oteo turno a turno
// (docs/game-design.md §4). No es la pantalla de juego —no hay recurso de
// acción ni turnos de verdad, solo el ciclo Otear → tomar/rechazar → jugar—,
// es la herramienta para probar la mecánica del motor antes de construir
// encima.
//
// La mesa es una metáfora física: mazo boca abajo en la esquina, el Oteo
// reparte al centro, "en juego" asoma por abajo. Las dos "vuelan" (repartir y
// tomar del Oteo) se animan a mano escribiendo transform por ref antes del
// primer paint y limpiándolo un frame después —el mismo truco que ya usa
// GameCard.tsx para el tilt—, porque una carta que cambia de zona (Oteo →
// bandeja) cambia también de contenedor en el DOM y React no conserva su nodo
// entre uno y otro: sin este cálculo manual (FLIP) el cambio se vería como un
// corte seco, no como un vuelo.
//
// El tamaño de mazo por encima de las 4 cartas de clase (3 Básicas + 1
// Especial) se rellena repitiendo esas mismas cartas: ver la nota de
// lib/rules/deck.ts sobre por qué no usa items reales todavía.
// =========================================================================

import { useLayoutEffect, useRef, useState } from "react";
import { cardFontVars } from "@/components/design/card-fonts";
import { CardBack, CardFrameDefs, DEFAULT_CARD_THEME } from "@/components/design/card-frames";
import GameCard from "@/components/design/GameCard";
import { buttonClass } from "@/components/ui/Button";
import type { CatalogCard } from "@/lib/card-catalog";
import {
  buildDeck,
  DECK_MAX,
  drawOteo,
  IN_PLAY_MAX,
  isInPlayFull,
  playCard,
  takeOteo,
  type DeckCard,
  type DeckState,
  type OteoDraw,
} from "@/lib/rules/deck";

const HEROES = ["Guerrero", "Mago", "Pícaro", "Clérigo"] as const;

// Rect de origen de un vuelo Oteo → bandeja: se toma de la carta oteada (o de
// su vista ampliada, si el vuelo llega desde una sustitución) en el instante
// del clic, antes de que React la desmonte de esa zona.
type Flight = { instanceId: string; card: DeckCard; from: DOMRect };

// Vuelo de la carta ampliada: "open" sube desde su hueco de la bandeja hasta
// el centro; "close" es el mismo viaje al revés, al des-seleccionarla. A
// diferencia de Flight (que solo se traslada dentro de su tamaño natural),
// aquí el destino es MÁS GRANDE que el origen, así que el clon escala de
// verdad en vez de solo recortar una ventana — ver la nota junto al efecto.
type ExpandFlight = { instanceId: string; card: DeckCard; from: DOMRect; mode: "open" | "close" };

// Vuelo de vuelta al Mazo: siempre sale de la carta ampliada (from = su rect
// grande en ese instante), nunca del hueco pequeño de la bandeja.
type PlayFlight = { instanceId: string; card: DeckCard; from: DOMRect };

// Vuelo de caída: primer tramo de "jugar", entre la carta ampliada y el
// tablero simulado del centro de la mesa. Igual que PlayFlight, siempre sale
// de la carta ampliada — nunca de la bandeja.
type DropFlight = { instanceId: string; card: DeckCard; from: DOMRect };

// Todo el mazo arranca sin preparar: a diferencia de la partida real (§1b,
// paso 4: 2 de las 3 Básicas empiezan ya "en juego"), aquí interesa ver el
// Oteo construir el "en juego" desde cero, turno a turno.
function emptyDeckState(hero: (typeof HEROES)[number], classCards: CatalogCard[]): DeckState {
  return { deck: buildDeck(hero, classCards), inPlay: [] };
}

export default function DeckLab({ classCards }: { classCards: CatalogCard[] }) {
  const [hero, setHero] = useState<(typeof HEROES)[number]>(HEROES[0]);
  const [state, setState] = useState<DeckState>(() => emptyDeckState(hero, classCards));
  const [oteo, setOteo] = useState<OteoDraw>([]);
  const [pending, setPending] = useState<DeckCard | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandFlight, setExpandFlight] = useState<ExpandFlight | null>(null);
  const [dropFlight, setDropFlight] = useState<DropFlight | null>(null);
  const [playFlight, setPlayFlight] = useState<PlayFlight | null>(null);

  const pileRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const pendingPreviewRef = useRef<HTMLDivElement>(null);
  const oteoRefs = useRef(new Map<string, HTMLDivElement>());
  const trayRefs = useRef(new Map<string, HTMLDivElement>());
  const flyerRef = useRef<HTMLDivElement>(null);
  const expandCardRef = useRef<HTMLDivElement>(null);
  const expandFlyerRef = useRef<HTMLDivElement>(null);
  const expandFlyerCardRef = useRef<HTMLDivElement>(null);
  const dropFlyerRef = useRef<HTMLDivElement>(null);
  const dropHoldTimer = useRef<number | null>(null);
  const playFlyerRef = useRef<HTMLDivElement>(null);

  const btn = (active: boolean) => buttonClass({ active });
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  function reset(nextHero: (typeof HEROES)[number] = hero) {
    if (dropHoldTimer.current) window.clearTimeout(dropHoldTimer.current);
    setState(emptyDeckState(nextHero, classCards));
    setOteo([]);
    setPending(null);
    setFlight(null);
    setExpandedId(null);
    setExpandFlight(null);
    setDropFlight(null);
    setPlayFlight(null);
  }

  function handleOtear() {
    if (state.deck.length === 0) return;
    setOteo(drawOteo(state));
    setPending(null);
  }

  // Coger una carta oteada: si "en juego" tiene hueco, entra directa y vuela
  // desde su posición en el Oteo hasta la bandeja. Si está lleno, no se toca
  // el estado todavía: hace falta decidir a qué carta sustituye primero.
  function handlePick(card: DeckCard) {
    if (isInPlayFull(state)) {
      setPending(card);
      return;
    }
    const from = oteoRefs.current.get(card.instanceId)?.getBoundingClientRect() ?? null;
    setState((prev) => takeOteo(prev, card));
    setOteo([]);
    if (from) setFlight({ instanceId: card.instanceId, card, from });
  }

  function handleSwap(swapOutId: string) {
    if (!pending) return;
    const from = pendingPreviewRef.current?.getBoundingClientRect() ?? null;
    const chosen = pending;
    setState((prev) => takeOteo(prev, chosen, swapOutId));
    setOteo([]);
    setPending(null);
    if (from) setFlight({ instanceId: chosen.instanceId, card: chosen, from });
  }

  function handleNone() {
    setOteo([]);
    setPending(null);
  }

  // Clic en una carta de la bandeja: en modo sustitución decide el swap; si
  // no, la lleva al centro ampliada (un segundo clic ahí la juega). El vuelo
  // sale del hueco real de la bandeja, capturado antes de que se oculte.
  function handleTrayClick(card: DeckCard) {
    if (pending) {
      handleSwap(card.instanceId);
      return;
    }
    if (playFlight || expandedId) return;
    const from = trayRefs.current.get(card.instanceId)?.getBoundingClientRect() ?? null;
    setExpandedId(card.instanceId);
    if (from) setExpandFlight({ instanceId: card.instanceId, card, from, mode: "open" });
  }

  // Clic fuera de la carta ampliada: la des-selecciona volviendo a bajar a su
  // hueco de la bandeja (el viaje de handleTrayClick, al revés).
  function handleCollapse(card: DeckCard) {
    if (playFlight || dropFlight) return;
    const from = expandCardRef.current?.getBoundingClientRect() ?? null;
    if (from) {
      setExpandFlight({ instanceId: card.instanceId, card, from, mode: "close" });
    } else {
      setExpandedId(null);
    }
  }

  // Jugar una carta: regla madre, siempre vuelve al Mazo, pero en dos tramos
  // visuales — primero cae sobre el tablero simulado del centro de la mesa
  // (dropFlight, ver su useLayoutEffect y handleDropFlightEnd más abajo), y
  // solo desde ahí sale volando de vuelta al Mazo (playFlight, sin cambios).
  // Los dos tramos salen de la carta AMPLIADA (el clic que juega solo existe
  // ahí, nunca desde la bandeja directamente) — antes el vuelo al Mazo salía
  // del hueco pequeño de la bandeja, y el corte entre "carta grande en
  // pantalla" y "carta chica ya encogiendo en la bandeja" era justo el efecto
  // de dos cartas duplicadas que se veía raro. expandedId se queda activo
  // (así el hueco real de la bandeja sigue oculto) hasta que el SEGUNDO tramo
  // termina y playCard se compromete de verdad — ver handlePlayFlightEnd.
  function handlePlayRequest(card: DeckCard) {
    const from = expandCardRef.current?.getBoundingClientRect() ?? null;
    if (from) {
      setDropFlight({ instanceId: card.instanceId, card, from });
    } else {
      setState((prev) => playCard(prev, card));
      setExpandedId(null);
    }
  }

  // Fin del primer tramo (caída sobre el tablero): el clon ya está aterrizado
  // y quieto, así que se mide SU rect, no el de .deck-lab__board — el tablero
  // es más pequeño que la carta a 0.9× y el origen del segundo tramo tiene
  // que ser "donde se ve la carta", no "el hueco que pisa". dropFlight se
  // deja vivo durante la pausa de impacto ($deck-fall-hold, 160ms, en
  // styles/settings/_motion.scss) para que el clon no desaparezca mientras
  // playFlight todavía no existe — sin ese solape habría un frame sin carta
  // visible entre los dos tramos.
  function handleDropFlightEnd() {
    if (!dropFlight) return;
    const dropped = dropFlight;
    dropHoldTimer.current = window.setTimeout(() => {
      const from = dropFlyerRef.current?.getBoundingClientRect() ?? null;
      setDropFlight(null);
      if (from) {
        setPlayFlight({ instanceId: dropped.instanceId, card: dropped.card, from });
      } else {
        setState((prev) => playCard(prev, dropped.card));
        setExpandedId(null);
      }
    }, 160);
  }

  function handlePlayFlightEnd() {
    if (!playFlight) return;
    setState((prev) => playCard(prev, playFlight.card));
    setExpandedId(null);
    setPlayFlight(null);
  }

  // --- Vuelo Oteo → bandeja: mide el hueco de destino una vez la carta real
  // ya está montada en la bandeja (oculta), y anima el clon hacia allí. El
  // clon es una VENTANA que se traslada y encoge de alto — la carta de dentro
  // no se escala nunca, o se vería aplastada en vez de hundirse tras el borde
  // inferior del hueco (mismo recorte que ya hace .deck-lab__tray-slot en
  // reposo). Todo en un único efecto que solo escribe en el DOM (nunca en
  // estado de React): medir y animar por ref es justo lo que hace un layout
  // effect, no hay cascada de renders que evitar aquí. -----------------------
  useLayoutEffect(() => {
    const el = flyerRef.current;
    if (!el || !flight) return;
    const node = trayRefs.current.get(flight.instanceId);
    if (!node) return;
    const to = node.getBoundingClientRect();
    const { from } = flight;
    el.style.left = `${from.left}px`;
    el.style.top = `${from.top}px`;
    el.style.width = `${from.width}px`;
    el.style.height = `${from.height}px`;
    el.style.transition = "none";
    el.style.transform = "translate(0, 0)";
    // Fuerza el reflow: sin leer el layout aquí, el navegador fundiría el
    // "sin transición" y el transform final en un solo frame y no habría vuelo.
    void el.getBoundingClientRect();
    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const raf = requestAnimationFrame(() => {
      el.style.transition = "";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.width = `${to.width}px`;
      el.style.height = `${to.height}px`;
    });
    return () => cancelAnimationFrame(raf);
  }, [flight, state.inPlay]);

  function handleFlightEnd() {
    setFlight(null);
  }

  // --- Vuelo bandeja ↔ centro: la carta ampliada (§2 del pedido del usuario).
  // El hueco de la bandeja EN REPOSO no es "la carta entera pero pequeña": es
  // una VENTANA recortada al 32% de alto (misma idea que el vuelo de arriba),
  // mientras que la carta ampliada sí es la carta entera a 1.5×. Origen y
  // destino no comparten proporción, así que un único transform: scale() no
  // vale (el primer intento hacía justo eso, y de ahí el "salto" raro al
  // bajar: el clon terminaba con el alto NATURAL de la carta, no con el 32%
  // recortado de la bandeja, y al entregarle el turno a la carta real
  // encogía de golpe). La solución combina las dos piezas que ya existían
  // por separado: una VENTANA exterior (izquierda/arriba/ancho/alto, recorta
  // con overflow) que se mueve y redimensiona hacia el rect real de destino
  // —tenga la proporción que tenga—, más un escalado UNIFORME de la carta de
  // dentro (ancho actual ÷ ancho nativo) para que crezca de verdad al pasar
  // de "en la bandeja" a "ampliada". Al compartir exactamente la misma
  // duración/curva que el ancho de la ventana, ese escalado queda sincronizado
  // con ella fotograma a fotograma (no solo al principio y al final), así que
  // el recorte crece o encoge con la misma sensación de "detrás de la línea"
  // que ya tiene el hueco de la bandeja en reposo.
  useLayoutEffect(() => {
    const el = expandFlyerRef.current;
    const inner = expandFlyerCardRef.current;
    if (!el || !inner || !expandFlight) return;
    const to =
      expandFlight.mode === "open"
        ? expandCardRef.current?.getBoundingClientRect()
        : trayRefs.current.get(expandFlight.instanceId)?.getBoundingClientRect();
    if (!to) return;
    const { from } = expandFlight;
    // El ancho de la bandeja nunca cambia con el hover (solo su alto), así
    // que el lado que corresponde a la bandeja siempre lleva el ancho NATIVO
    // de la carta — es la referencia para deducir la escala del otro lado.
    const nativeWidth = expandFlight.mode === "open" ? from.width : to.width;

    el.style.left = `${from.left}px`;
    el.style.top = `${from.top}px`;
    el.style.width = `${from.width}px`;
    el.style.height = `${from.height}px`;
    el.style.transition = "none";
    el.style.transform = "translate(0, 0)";
    inner.style.transition = "none";
    inner.style.transform = `scale(${from.width / nativeWidth})`;
    // Fuerza el reflow: sin leer el layout aquí, el navegador fundiría el
    // "sin transición" y el transform final en un solo frame y no habría vuelo.
    void el.getBoundingClientRect();
    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const raf = requestAnimationFrame(() => {
      el.style.transition = "";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.width = `${to.width}px`;
      el.style.height = `${to.height}px`;
      inner.style.transition = "";
      inner.style.transform = `scale(${to.width / nativeWidth})`;
    });
    return () => cancelAnimationFrame(raf);
  }, [expandFlight]);

  function handleExpandFlightEnd() {
    if (expandFlight?.mode === "close") setExpandedId(null);
    setExpandFlight(null);
  }

  // --- Vuelo carta ampliada → tablero: caída. Primer tramo de "jugar" (ver
  // handlePlayRequest): nace donde estaba la carta ampliada —igual que hace
  // playFlight más abajo— y cae sobre .deck-lab__board con $deck-fall-ease,
  // la única curva del lab con overshoot: rebota al llegar en vez de solo
  // soltar o recoger. La sombra pasa de $shadow-expand ("todavía en el aire")
  // a $shadow-pile ("ya en la mesa") en la misma transición, aplicando la
  // clase --landed en el mismo rAF que fija el transform final, para no
  // tener que escribir un valor de sombra a medio camino a mano aquí. No se
  // desvanece: tiene que seguir viéndose sobre el tablero durante la pausa de
  // impacto antes de que el segundo tramo se la lleve — ver
  // handleDropFlightEnd.
  useLayoutEffect(() => {
    const el = dropFlyerRef.current;
    const board = boardRef.current;
    if (!el || !dropFlight || !board) return;
    el.classList.remove("deck-lab__drop-flyer--landed");
    el.style.transition = "none";
    el.style.transform = "none";
    const native = el.getBoundingClientRect();
    const { from } = dropFlight;
    const fromCenterX = from.left + from.width / 2;
    const fromCenterY = from.top + from.height / 2;
    const bigScale = from.width / native.width;
    el.style.left = `${fromCenterX - native.width / 2}px`;
    el.style.top = `${fromCenterY - native.height / 2}px`;
    el.style.transform = `scale(${bigScale})`;
    // Fuerza el reflow, mismo motivo que en los otros vuelos.
    void el.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const dx = boardRect.left + boardRect.width / 2 - fromCenterX;
    const dy = boardRect.top + boardRect.height / 2 - fromCenterY;
    const raf = requestAnimationFrame(() => {
      el.style.transition = "";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.9) rotate(-6deg)`;
      el.classList.add("deck-lab__drop-flyer--landed");
    });
    return () => cancelAnimationFrame(raf);
  }, [dropFlight]);

  // --- Vuelo carta ampliada → Mazo: jugar. No hay ventana que recortar aquí
  // (a diferencia de los dos de arriba) — vuelve al mazo encogiéndose a un
  // 22% y girando, el mismo gesto de siempre, solo que ahora arrancando
  // desde el tamaño GRANDE en vez del hueco pequeño de la bandeja. El tamaño
  // "natural" de la carta (para saber cuánto agrandarla al principio) se mide
  // en el propio clon antes de tocarle nada: como GameCard se dimensiona sola
  // por --card-w/--card-h, un div fixed sin ancho propio se ajusta exacto a
  // ese tamaño. Ahora arranca desde donde cayó sobre el tablero, no desde la
  // carta ampliada — ver dropFlight arriba.
  //
  // Doble rAF (no uno, como en los otros vuelos): esta vez el estado que lo
  // dispara (setPlayFlight en handleDropFlightEnd) nace en un setTimeout, no
  // en el clic de un usuario, y con un solo rAF el navegador podía pintar el
  // tamaño GRANDE y el translate/scale final en el mismo fotograma —la carta
  // se encogía de golpe en vez de volar— exactamente el problema que ya
  // describe el comentario del reparto Mazo→Oteo más abajo, aquí disparado
  // por el mismo tipo de origen (un timer, no un evento de clic).
  useLayoutEffect(() => {
    const el = playFlyerRef.current;
    const pile = pileRef.current;
    if (!el || !playFlight || !pile) return;
    el.style.transition = "none";
    el.style.transform = "none";
    const native = el.getBoundingClientRect();
    const { from } = playFlight;
    const fromCenterX = from.left + from.width / 2;
    const fromCenterY = from.top + from.height / 2;
    const bigScale = from.width / native.width;
    el.style.left = `${fromCenterX - native.width / 2}px`;
    el.style.top = `${fromCenterY - native.height / 2}px`;
    el.style.opacity = "1";
    el.style.transform = `scale(${bigScale})`;
    // Fuerza el reflow, mismo motivo que en los otros dos vuelos.
    void el.getBoundingClientRect();
    const pileRect = pile.getBoundingClientRect();
    const dx = pileRect.left + pileRect.width / 2 - fromCenterX;
    const dy = pileRect.top + pileRect.height / 2 - fromCenterY;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.style.transition = "";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0.22) rotate(-14deg)`;
        el.style.opacity = "0";
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [playFlight]);

  // --- Reparto Mazo → Oteo: cada carta oteada nace ya en su hueco del grid
  // (para que el layout no salte), pero se pinta el primer frame en la
  // posición del mazo y se suelta un instante después para que la transición
  // de deck-lab__oteo-card la lleve "volando" hasta su sitio real. El
  // stagger (90ms, $deck-deal-stagger en styles/settings/_motion.scss) es lo
  // que hace que se note que son 2 cartas y no una sola parpadeando.
  //
  // El doble rAF antes de soltar es imprescindible: con un solo
  // setTimeout(0), el navegador podía procesar ese temporizador antes de
  // haber PINTADO siquiera la posición de partida (junto al mazo), así que la
  // primera carta soltada aparecía de golpe en su sitio final —sin volar— en
  // vez de recorrer el camino; la segunda, con más margen (90ms), sí llegaba
  // a pintarse antes de soltarse y por eso volaba bien. Con el doble rAF, las
  // dos garantizan un pintado de la posición de partida antes de soltarse.
  useLayoutEffect(() => {
    const pile = pileRef.current;
    if (!pile || oteo.length === 0) return undefined;
    const pileRect = pile.getBoundingClientRect();
    const els = oteo.map((d, i) => {
      const el = oteoRefs.current.get(d.instanceId);
      if (!el) return null;
      const to = el.getBoundingClientRect();
      const dx = pileRect.left + pileRect.width / 2 - (to.left + to.width / 2);
      const dy = pileRect.top + pileRect.height / 2 - (to.top + to.height / 2);
      const rot = i % 2 === 0 ? -10 : 10;
      el.style.transition = "none";
      el.style.opacity = "0";
      // !important: sin esto, si el navegador ya considera la carta "en
      // hover" en el instante en que aparece (puede pasar sin que el ratón
      // se haya movido — el hit-test de :hover no siempre se recalcula al
      // insertar el nodo), la regla ":hover { transform: ... !important }"
      // pisaba este transform desde el primer frame y la carta no llegaba a
      // volar: aparecía ya en su sitio final, solo con el fundido de opacidad.
      el.style.setProperty(
        "transform",
        `translate(${dx}px, ${dy}px) scale(0.3) rotate(${rot}deg)`,
        "important",
      );
      return el;
    });

    const timers: number[] = [];
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        els.forEach((el, i) => {
          if (!el) return;
          timers.push(
            window.setTimeout(() => {
              el.style.transition = "";
              el.style.opacity = "";
              el.style.removeProperty("transform");
            }, i * 90),
          );
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [oteo]);

  const pendingCard = state.inPlay.find((d) => d.instanceId === expandedId) ?? null;

  return (
    <div className={`card-lab deck-lab ${cardFontVars}`} data-theme={DEFAULT_CARD_THEME}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Baraja y Oteo</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Tu mazo personal tiene dos zonas: el <b>Mazo</b> (20 cartas fijas, boca abajo en la
        esquina) y <b>en juego</b> (5 huecos fijos, asomando abajo). Al empezar el turno{" "}
        <b>oteas</b>: se reparten 2 cartas al azar del Mazo y eliges 1 o ninguna; con &ldquo;en
        juego&rdquo; lleno, tomar una nueva exige sustituir una que ya tengas preparada.{" "}
        <b>Jugar</b> una carta la devuelve siempre al Mazo — nada se pierde, pero nada es
        permanente.
      </p>

      {/* Controles */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Héroe</span>
          <div className="flex items-center gap-2">
            {HEROES.map((h) => (
              <button
                key={h}
                className={btn(hero === h)}
                onClick={() => {
                  setHero(h);
                  reset(h);
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>&nbsp;</span>
          <button className={btn(false)} onClick={() => reset()}>
            Reiniciar
          </button>
        </div>

        <div className="flex flex-col gap-1 text-sm text-[var(--wiki-text)]">
          <span className={label}>&nbsp;</span>
          <span>
            <b>Mazo:</b> {state.deck.length}/{DECK_MAX} · <b>En juego:</b> {state.inPlay.length}/
            {IN_PLAY_MAX}
          </span>
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-[var(--wiki-text)]">Zona de juego</h2>
      <div className="card-lab__stage deck-lab__stage">
        <CardFrameDefs />

        {/* Mazo boca abajo */}
        <div className="deck-lab__pile" ref={pileRef} data-empty={state.deck.length === 0}>
          <div className="deck-lab__pile-stack">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="deck-lab__pile-back">
                <CardBack />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="deck-lab__pile-trigger"
            disabled={state.deck.length === 0 || oteo.length > 0 || !!pending}
            onClick={handleOtear}
            aria-label="Otear: revelar 2 cartas del Mazo"
          >
            <span className="deck-lab__pile-count">{state.deck.length}</span>
          </button>
          <span className="deck-lab__pile-label">
            {state.deck.length === 0 ? "Mazo vacío" : "Otear"}
          </span>
        </div>

        {/* Centro de la mesa: el tablero es una simulación —este lab prueba
            lib/rules/deck.ts, no hay tablero real todavía— solo para que
            "jugar" tenga un sitio físico donde caer. El Oteo y la
            sustitución se resuelven en el modal de abajo. */}
        <div className="deck-lab__center">
          <div className="deck-lab__board" ref={boardRef} aria-hidden="true">
            <span className="deck-lab__board-label">Tablero</span>
          </div>
          {oteo.length === 0 && !pending && state.deck.length === 0 && (
            <p className="deck-lab__hint">Sin Oteo: el Mazo está vacío.</p>
          )}
        </div>

        {/* En juego: bandeja inferior, asomando, dentro del mismo recuadro */}
        <div className="deck-lab__tray-label">
          En juego ({state.inPlay.length}/{IN_PLAY_MAX})
        </div>
        <div className="deck-lab__tray">
          {state.inPlay.map((d) => (
            <div
              key={d.instanceId}
              ref={(el) => {
                if (el) trayRefs.current.set(d.instanceId, el);
                else trayRefs.current.delete(d.instanceId);
              }}
              className={[
                "deck-lab__tray-slot",
                pending && "deck-lab__tray-slot--pending",
                (flight?.instanceId === d.instanceId || expandedId === d.instanceId) &&
                  "deck-lab__tray-card--hidden",
              ]
                .filter(Boolean)
                .join(" ")}
              tabIndex={0}
              role="button"
              aria-label={pending ? `Sustituir por ${d.card.name}` : `Ver ${d.card.name}`}
              onClick={() => handleTrayClick(d)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleTrayClick(d);
              }}
            >
              <GameCard card={d.card} theme={DEFAULT_CARD_THEME} />
            </div>
          ))}
          {state.inPlay.length === 0 && (
            <p className="pb-2 text-sm text-[var(--wiki-muted)]">
              Ninguna carta preparada todavía.
            </p>
          )}
        </div>

        {/* Oteo y sustitución: modal sobre toda la Zona de juego, como al
            ampliar una carta — la revelación es una decisión, no algo que
            conviva con el resto de la mesa. La sustitución es la excepción:
            decide haciendo clic en una carta de la BANDEJA, así que su fondo
            solo sombrea (pointer-events: none) y dispara clics a la bandeja
            de debajo; el contenido centrado (la carta pendiente, el texto,
            "Cancelar") recupera el clic con deck-lab__backdrop--soft. */}
        {(oteo.length > 0 || pending) && (
          <div className={pending ? "deck-lab__backdrop deck-lab__backdrop--soft" : "deck-lab__backdrop"}>
            {oteo.length > 0 && !pending && (
              <div>
                <div className="deck-lab__oteo">
                  {oteo.map((d) => (
                    <div
                      key={d.instanceId}
                      ref={(el) => {
                        if (el) oteoRefs.current.set(d.instanceId, el);
                        else oteoRefs.current.delete(d.instanceId);
                      }}
                      className="deck-lab__oteo-card"
                      tabIndex={0}
                      role="button"
                      aria-label={`Seleccionar ${d.card.name}`}
                      onClick={() => handlePick(d)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handlePick(d);
                      }}
                    >
                      <GameCard card={d.card} theme={DEFAULT_CARD_THEME} />
                      <span className="deck-lab__pick-hint">Seleccionar</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <button className={btn(false)} onClick={handleNone}>
                    Ninguna
                  </button>
                </div>
              </div>
            )}

            {pending && (
              <div className="flex flex-col items-center">
                <div ref={pendingPreviewRef}>
                  <GameCard card={pending.card} theme={DEFAULT_CARD_THEME} />
                </div>
                <p className="mt-3 max-w-sm text-center text-sm text-[var(--wiki-muted)]">
                  &ldquo;En juego&rdquo; está lleno: haz clic en una carta de la bandeja para
                  sustituirla por <b>{pending.card.name}</b>, o cancela y no tomes ninguna.
                </p>
                <button className={btn(false) + " mt-3"} onClick={() => setPending(null)}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Carta ampliada al centro: un clic más la juega. Mientras dura
            cualquiera de los dos vuelos que salen de aquí (expandFlight al
            cerrar, playFlight al jugar), esta copia estática se oculta y el
            clon correspondiente es lo único visible — así no hay dos cartas
            superpuestas durante la transición. */}
        {pendingCard && (
          <div
            className={
              "deck-lab__backdrop" +
              (expandFlight?.mode === "close" || dropFlight || playFlight
                ? " deck-lab__backdrop--closing"
                : "")
            }
            onClick={() => handleCollapse(pendingCard)}
          >
            <div
              ref={expandCardRef}
              className={
                "deck-lab__expand-card" +
                (expandFlight || dropFlight || playFlight ? " deck-lab__expand-card--hidden" : "")
              }
              onClick={(e) => {
                e.stopPropagation();
                handlePlayRequest(pendingCard);
              }}
            >
              <GameCard card={pendingCard.card} theme={DEFAULT_CARD_THEME} />
            </div>
            <p className="deck-lab__expand-hint">Clic para jugarla · clic fuera para cerrar</p>
          </div>
        )}
      </div>

      {/* Clon volante: bandeja ↔ centro (carta ampliada) */}
      {expandFlight && (
        <div
          ref={expandFlyerRef}
          className="deck-lab__expand-flyer"
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") handleExpandFlightEnd();
          }}
        >
          <div ref={expandFlyerCardRef} className="deck-lab__expand-flyer-card">
            <GameCard card={expandFlight.card.card} theme={DEFAULT_CARD_THEME} />
          </div>
        </div>
      )}

      {/* Clon volante: carta ampliada → tablero (caída al jugar) */}
      {dropFlight && (
        <div
          ref={dropFlyerRef}
          className="deck-lab__drop-flyer"
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") handleDropFlightEnd();
          }}
        >
          <GameCard card={dropFlight.card.card} theme={DEFAULT_CARD_THEME} />
        </div>
      )}

      {/* Clon volante: carta ampliada → Mazo (jugar) */}
      {playFlight && (
        <div
          ref={playFlyerRef}
          className="deck-lab__play-flyer"
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") handlePlayFlightEnd();
          }}
        >
          <GameCard card={playFlight.card.card} theme={DEFAULT_CARD_THEME} />
        </div>
      )}

      {/* Clon volante: Oteo → bandeja */}
      {flight && (
        <div
          ref={flyerRef}
          className="deck-lab__flyer"
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") handleFlightEnd();
          }}
        >
          <div className="deck-lab__flyer-card">
            <GameCard card={flight.card.card} theme={DEFAULT_CARD_THEME} />
          </div>
        </div>
      )}

      {/* Mazo completo: siempre consultable (§4) */}
      <details className="mt-6 text-sm text-[var(--wiki-muted)]">
        <summary className="cursor-pointer text-[var(--wiki-text)]">
          Cartas sin preparar en el Mazo ({state.deck.length})
        </summary>
        <ul className="mt-2 grid gap-0.5">
          {countBy(state.deck.map((d) => d.card.name)).map(([name, n]) => (
            <li key={name}>
              {name} × {n}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function countBy(items: readonly string[]): Array<[string, number]> {
  const tally = new Map<string, number>();
  for (const item of items) tally.set(item, (tally.get(item) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
