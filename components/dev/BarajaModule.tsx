"use client";

// =========================================================================
// Módulo «Baraja y Oteo» de /dev — el sistema de Oteo en sí, no su contenido
//
// Dario quiere ver la MECÁNICA (barajar, otear, la mano, ampliar una carta,
// arrastrarla al tablero) y ha dicho explícitamente que el contenido no
// importa para esta vuelta: "puedes repetir 10 veces la carta Miliciano si
// quieres". Las cartas de clase reales siguen en StandBy
// (memoria: feedback-cartas-en-standby), así que este banco usa las 16
// cartas de unidad ya construidas de Humanos y Enanos como relleno,
// repetidas cíclicamente (lib/v3/deck.ts `buildDeck`).
//
// EL ESCENARIO ES EL DEL BANCO DE ANIMACIÓN *(Dario, 9 de septiembre de
// 2026)*: un retal de quince hexágonos sobre la mesa, la mano en abanico
// abajo y el Mazo abajo a la izquierda. No es la arena de verdad y no
// pretende serlo — es el mismo retal que AnimationBench, con la misma
// geometría (lib/v3/hex.ts) y la misma compresión, porque para probar el
// Oteo hace falta un sitio donde soltar la carta, no un tablero de partida.
// Que los dos retales estén escritos dos veces es deuda declarada y Dario ya
// la nombró: "después lógicamente los dos UNIFICADOS en el contenido del
// tablero". Está apuntada como `standIn` en lib/dev-registry.ts.
//
// TODAS LAS CARTAS VIVEN EN UNA SOLA CAPA, y esa es la decisión que sostiene
// el resto del archivo. El lab de v2 (components/lab/DeckLab.tsx) tenía que
// animar con FLIP —medir un rect, montar un clon `position: fixed`, forzar
// reflow, animar el clon y entregarle el turno a la carta real— porque allí
// una carta CAMBIA DE CONTENEDOR al pasar del Oteo a la bandeja, y React no
// conserva su nodo entre uno y otro. Aquí no: cada carta es un `<div>`
// absoluto dentro del escenario durante toda su vida, y dónde está es un
// `transform` que escribe el componente. Así el reparto del Oteo, el vuelo a
// la mano, el abanico recolocándose, ampliar, cerrar y volver al Mazo son LA
// MISMA transición de CSS sobre el mismo nodo, y no cinco animaciones
// escritas a mano que había que mantener sincronizadas entre sí. Cuatro
// clones y sus cuatro efectos de medida desaparecieron con esto.
//
// LO QUE SE ESCRIBE EN EL DOM Y NO EN EL ESTADO, por lo mismo que en
// AnimationBench: la posición de la carta que se arrastra y el hexágono
// candidato cambian sesenta veces por segundo, y repintar cinco cartas de
// React a esa cadencia es tirar fotogramas para mover un `transform`. Lo que
// sí es estado es el terreno ofrecido, que se calcula UNA vez al coger la
// carta y no cambia mientras la llevas.
//
// "JUGAR" SIEMPRE DEVUELVE LA CARTA AL MAZO: como el contenido es de unidad
// y no de clase, no hay Tipo (Acción/Pasiva/Turnos, game-design.md §6.5) que
// decida otra cosa — es la misma "regla madre" que ya usa el lab de v2, y
// aquí se ve: al soltar, la ficha aparece en el hexágono y la carta se va
// volando al Mazo.
//
// No decide ninguna regla de juego que no esté ya escrita (ARCHITECTURE.md
// §6): el Mazo/Oteo/"en juego" ya están en game-design.md §6, y lo único que
// esta pantalla añade es la mecánica de arrastrar, que es interacción.
// =========================================================================

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import SketchCard from "@/components/design/v3/sketch-cards";
import { sketchFontVars } from "@/components/design/v3/sketch-fonts";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { DAMAGE, SKILLS, type Subject } from "@/components/design/v3/sample";
import type { Character } from "@/lib/v3/character";
import type { UnitCard } from "@/lib/v3/cards";
import { DAMAGE_TYPES, type DamageTypeId } from "@/lib/v3/damage";
import {
  buildDeck,
  drawOteo,
  isInPlayFull,
  playCard,
  takeOteo,
  DECK_MAX,
  IN_PLAY_MAX,
  type DeckCard,
  type DeckState,
  type OteoDraw,
} from "@/lib/v3/deck";
import { rarityForTier } from "@/lib/v3/rarity";
import { splitGlyph } from "@/lib/v3/races";
import type { Trait } from "@/lib/v3/traits";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord, HexKey } from "@/lib/v3/hex";
import PieceToken, { type PieceView } from "./PieceToken";
import { pieceGeometry, DEFAULT_FRAMING, type FieldId } from "@/lib/v3/piece";
import { buttonClass } from "@/components/ui/Button";

// --- Medidas del escenario ------------------------------------------------
// El retal y su compresión son los mismos que los de AnimationBench, que a su
// vez copia los de ArenaBoard (ARENA_TILT). Se repiten aquí y no se importan
// de allí porque el banco de animación no exporta su geometría: es la deuda
// que Dario nombró al pedir esta pantalla, y unificar los dos retales es un
// trabajo del módulo «tablero», no de este.
const COLS = 5;
const ROWS = 3;
const TILT = 0.67;
const SQRT3 = Math.sqrt(3);

/** Qué parte del alto se lleva el suelo; el resto es para el Mazo y la mano. */
const GROUND_SHARE = 0.5;
const TOP_PAD = 22;
const HAND_BOTTOM = 104;
const PILE_LEFT = 78;
const PILE_BOTTOM = 112;
/**
 * Lo que se le reserva al pie del velo (el texto y el botón del Oteo).
 *
 * De aquí sale a cuánto se puede ampliar una carta, y no de un número elegido:
 * con el alto mínimo del escenario, una carta a 1× se comía el botón de
 * «Ninguna». La banda de lectura es lo que queda entre el aire de arriba y
 * esto, y tanto el Oteo como la carta ampliada se miden contra ella.
 */
const FOOT_SPACE = 100;
/** El aire entre el Mazo y la primera carta del abanico. */
const HAND_GUTTER = 24;

/** Espejo de $sketch-width/$sketch-height (styles/settings/_card.scss). */
const SKETCH_W = 300;
const SKETCH_H = 420;

/** A cuánto se ve la carta en cada sitio. La ampliada la calcula el escenario. */
const HAND_SCALE = 0.34;
const PILE_SCALE = 0.26;
/** Cogida se ve MÁS GRANDE que en la mano: se acerca a ti al levantarla. */
const DRAG_SCALE = 0.42;

// --- La física del arrastre ------------------------------------------------
//
// Calcada del gesto de Hearthstone que Dario pidió (Jack Rugile, codepen
// zqJdXM, "Hearthstone Card CSS 3D Click/Drag"). LA IDEA ENTERA es que la
// carta NO va pegada al puntero: lo persigue, y lo que le falta por recorrer
// es lo que la inclina. Su autor lo describe como que «parece que la carta
// reacciona a la resistencia del aire», y sale de tres cosas encadenadas:
//
//   1. La posición se acerca a la del puntero un tanto por ciento por
//      fotograma, así que siempre va un poco por detrás y frena sola.
//   2. El giro en 3D persigue a la VELOCIDAD de la carta, con su propia
//      constante. No hay rebote: son dos retardos de primer orden encadenados,
//      así que el giro nunca cruza el cero (comprobado simulando el bucle). Lo
//      que sí hay, y es lo que se siente, es una ESTELA: al frenar en seco la
//      carta sigue ladeada un momento y se endereza sola —de 34° a 6° en diez
//      fotogramas, y a cero poco después—. Sin ese rezago no hay peso, hay un
//      icono girado.
//   3. Nada de esto se puede escribir como una `transition` de CSS: una
//      transición va de A a B en un tiempo dado, y esto no tiene B —el destino
//      se mueve—. Por eso hay un bucle de `requestAnimationFrame` mientras
//      dure el gesto, y por eso la carta sigue asentándose cuando el puntero ya
//      se ha parado.
//
// Lo que NO se copia del pen: allí la carta es lo único de la pantalla y el
// ratón es su único mando. Aquí hay un tablero debajo, así que el hexágono
// candidato se calcula con la posición del PUNTERO y no con la de la carta —
// se apunta con el cursor, no con el naipe que va rezagado.

/**
 * Cuánto del camino que le falta recorre la carta en cada fotograma.
 *
 * Con 0,24 alcanza al cursor en unos 25 fotogramas (0,4 s) y en marcha se queda
 * unos 40 px por detrás a velocidad normal, 104 px arrastrando deprisa. Subirlo
 * la pega al puntero y se pierde el gesto; bajarlo la deja a rastras.
 */
const DRAG_EASE = 0.24;
/** Lo mismo para el giro y para la escala. */
const TILT_EASE = 0.3;
const SCALE_EASE = 0.22;
/**
 * Grados de inclinación por píxel de velocidad, y su tope.
 *
 * Con 1,1 sale: 5° arrastrando despacio, 14° a velocidad normal y el tope
 * arrastrando deprisa. El tope existe para el latigazo —un golpe de muñeca pide
 * casi 80°— y ahí es lo único que separa una carta con peso de un molinillo.
 */
const TILT_PER_PX = 1.1;
const TILT_MAX = 34;
/**
 * Cuánto se cuelga la carta por encima del puntero.
 *
 * Sale de su propio alto para que el puntero quede justo por debajo del canto
 * de abajo: si la carta se centrara en él taparía justo el hexágono al que
 * apuntas, que es lo único que hay que mirar mientras arrastras.
 */
const DRAG_LIFT = SKETCH_H * DRAG_SCALE * 0.62;

/** Espejo de $deck-deal-stagger (styles/settings/_motion.scss). */
const DEAL_STAGGER = 90;

/** Cuánto hay que mover el puntero para que un clic pase a ser un arrastre. */
const DRAG_THRESHOLD = 6;

/** Lo que tarda una carta en irse al Mazo, por si su transición no avisa. */
const PLAY_FALLBACK_MS = 900;

const PIECE_FIELDS: readonly FieldId[] = ["ataque", "vida"];

// --- Adaptadores Character → lo que pide cada pieza reutilizada -----------
//
// Mecánicos, no deciden nada de diseño: cruzan los mismos datos que ya arma
// /dev/razas con el vocabulario que ya pide cada componente.
//
// LO QUE TIENEN QUE PRODUCIR ES UN `Subject` IDÉNTICO a los que están escritos
// a mano en components/design/v3/races.ts, que son los que se miran en la wiki
// (/docs/v3/cards/design). Ese es el listón, y el 9 de septiembre de 2026 no se
// cumplía: `Character` guarda «⛏️ Minero» y «⛏️ Enanos» —con su glifo, tal y
// como vienen de razas.md— y esto las pasaba enteras, así que la carta escribía
// el pico en el rótulo del nombre Y otra vez en la línea de raza, cuando el
// diseño lo quiere una sola vez y en el estandarte. Peor todavía: con la raza
// llamándose «⛏️ Enanos» en vez de «Enanos», `raceArtFor()` y `raceBannerFor()`
// (sample.ts) no encontraban archivo y la carta caía al emoji de respaldo, así
// que ni el emblema dibujado ni el estandarte llegaban a verse. Lo vio Dario.
//
// El sujeto de la wiki lo dice sin lugar a dudas y es la referencia de esta
// tabla — «⛏️ Minero» se reparte en `name: "Minero"` + `icon: "⛏️"`, y
// «⛏️ Enanos» en `race: "Enanos"` + `raceIcon: "⛏️"`:
//
//   { id: "enanos-minero", name: "Minero", race: "Enanos", raceIcon: "⛏️",
//     icon: "⛏️", tier: 1, … }

const DAMAGE_KEY_OF: Record<DamageTypeId, keyof typeof DAMAGE> = {
  "cuerpo-a-cuerpo": "cuerpo",
  "a-distancia": "distancia",
  magico: "magico",
};

/** Sample.ts llama "resistencia" a lo que character.ts llama "resistencia-magica"; el resto coincide. */
const SKILL_ABILITY_OF: Record<(typeof SKILLS)[number]["key"], keyof Character["abilities"]> = {
  vida: "vida",
  ataque: "ataque",
  defensa: "defensa",
  resistencia: "resistencia-magica",
  precision: "precision",
  suerte: "suerte",
  iniciativa: "iniciativa",
  movimiento: "movimiento",
};

/**
 * El glifo del sujeto: el que encabeza su nombre en razas.md («🗡️ Miliciano»).
 *
 * Es exactamente lo que los sujetos de la wiki llevan en `icon`, así que no se
 * inventa nada. `character.icon` gana si algún día existe; el tipo de daño es el
 * último recurso, para una ficha cuyo nombre viniera sin glifo.
 */
function iconOf(character: Character): string {
  return (
    character.icon ?? (splitGlyph(character.name).icon || DAMAGE_TYPES[character.damage].icon)
  );
}

function characterToSubject(
  character: Character,
  illustration: string,
  catalog: readonly Trait[],
): Subject {
  if (character.tier === undefined) {
    throw new Error(`«${character.name}» no tiene tier: este lab solo reparte cartas de unidad.`);
  }
  const traitById = new Map(catalog.map((t) => [t.id, t]));
  const skills = {} as Record<(typeof SKILLS)[number]["key"], number>;
  for (const key of Object.keys(SKILL_ABILITY_OF) as (typeof SKILLS)[number]["key"][]) {
    skills[key] = character.abilities[SKILL_ABILITY_OF[key]];
  }
  // Las dos cadenas se parten en sus dos mitades: el glifo va a su hueco del
  // marco y la etiqueta al texto. Ver la nota de arriba y `splitGlyph`.
  const race = character.race ? splitGlyph(character.race) : null;
  return {
    id: character.id,
    name: splitGlyph(character.name).label,
    kind: "unidad",
    // Sin glifo: es la CLAVE con la que sample.ts busca el emblema y el
    // estandarte dibujados (RACE_ART / RACE_BANNERS), y además es el texto que
    // la carta imprime en su pie.
    race: race?.label ?? "",
    raceIcon: race?.icon || "❔",
    tier: character.tier,
    rarity: rarityForTier(character.tier),
    icon: iconOf(character),
    art: illustration,
    skills,
    damage: DAMAGE_KEY_OF[character.damage],
    traits: character.traits
      .map((id) => traitById.get(id))
      .filter((t): t is Trait => t !== undefined)
      .map((t) => ({ icon: t.icon, label: t.label })),
  };
}

function characterToPieceView(character: Character, illustration: string): PieceView {
  if (character.tier === undefined) {
    throw new Error(`«${character.name}» no tiene tier: este lab solo coloca fichas de unidad.`);
  }
  return {
    id: character.id,
    // Sin glifo, por lo mismo que en la carta: la ficha lo pinta aparte.
    name: splitGlyph(character.name).label,
    side: "j1",
    role: "unidad",
    tier: character.tier,
    rarity: rarityForTier(character.tier),
    icon: iconOf(character),
    art: illustration,
    damage: character.damage,
    vida: character.abilities.vida,
    vidaMax: character.abilities.vida,
    ataque: character.abilities.ataque,
    movimiento: character.abilities.movimiento,
    states: [],
  };
}

// --- El escenario ----------------------------------------------------------

type Box = { readonly w: number; readonly h: number };

type Cell = {
  readonly hex: HexCoord;
  readonly key: HexKey;
  readonly x: number;
  readonly y: number;
  readonly points: string;
};

type Layout = {
  readonly size: number;
  readonly cells: readonly Cell[];
  readonly centers: ReadonlyMap<HexKey, { x: number; y: number }>;
  readonly mesh: readonly { x1: number; y1: number; x2: number; y2: number }[];
  /** Origen del retal: lo que hay que restar a un punto para deshacer `toPixel`. */
  readonly originX: number;
  readonly originY: number;
  /** El Mazo, abajo a la izquierda; la mano, en lo que queda a su derecha. */
  readonly pile: { x: number; y: number };
  readonly hand: { x: number; y: number };
  /** El ancho del que dispone el abanico sin pisar el Mazo ni el borde. */
  readonly handSpan: number;
  /** Donde se revela el Oteo y donde se lee una carta ampliada. */
  readonly center: { x: number; y: number };
  readonly oteoScale: number;
  readonly expandScale: number;
};

/**
 * El retal medido contra la caja de la que dispone.
 *
 * El tamaño de hexágono sale de encajarlo, no de un número elegido: la mesa
 * tiene que verse igual de cerca en una pantalla ancha que en una estrecha. Se
 * mide con radio 1 y se escala, igual que en AnimationBench.
 */
function measure(box: Box): Layout | null {
  if (box.w < 320 || box.h < 320) return null;

  const hexes: HexCoord[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) hexes.push(Hex.offsetToAxial({ col, row }));
  }

  const unit = hexes.map((h) => Hex.toPixel(h, 1, TILT));
  const minX = Math.min(...unit.map((p) => p.x));
  const maxX = Math.max(...unit.map((p) => p.x));
  const minY = Math.min(...unit.map((p) => p.y));
  const maxY = Math.max(...unit.map((p) => p.y));
  const spanX = maxX - minX + SQRT3;
  const spanY = maxY - minY + 2 * TILT;
  const size = Math.max(
    18,
    Math.min((box.w - 96) / spanX, (box.h * GROUND_SHARE - TOP_PAD) / spanY),
  );

  const originX = (box.w - spanX * size) / 2 + (SQRT3 / 2) * size - minX * size;
  const originY = TOP_PAD + TILT * size - minY * size;

  const cells = hexes.map((hex, i) => {
    const x = unit[i].x * size + originX;
    const y = unit[i].y * size + originY;
    return { hex, key: Hex.key(hex), x, y, points: Hex.polygonPoints(x, y, size, TILT) };
  });

  const centers = new Map(cells.map((c) => [c.key, { x: c.x, y: c.y }]));

  // Cada arista una sola vez: el lado que comparten dos hexágonos se pintaría
  // dos veces y saldría al doble de opacidad (misma razón que en ArenaBoard).
  const mesh = Hex.uniqueEdges(hexes).map((edge) => {
    const { x, y } = centers.get(Hex.key(edge.hex)) ?? { x: 0, y: 0 };
    const [a, b] = Hex.edgeEndpoints(x, y, size, edge.dir, TILT);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });

  // La mano se reparte lo que el Mazo le deja, no el escenario entero: en una
  // ventana estrecha, un abanico centrado en la mitad se monta encima del Mazo.
  const pileRight = PILE_LEFT + (SKETCH_W * PILE_SCALE) / 2;
  const handLeft = pileRight + HAND_GUTTER;
  const handRight = box.w - HAND_GUTTER;

  // La banda de lectura: lo que queda entre el aire de arriba y el pie del
  // velo. Es contra ESTO y no contra el alto del escenario contra lo que se
  // mide una carta ampliada, o con el escenario en su alto mínimo se comería
  // el botón de abajo.
  const readTop = TOP_PAD;
  const readBottom = box.h - FOOT_SPACE;
  const readHeight = readBottom - readTop;

  return {
    size,
    cells,
    centers,
    mesh,
    originX,
    originY,
    pile: { x: PILE_LEFT, y: box.h - PILE_BOTTOM },
    hand: { x: (handLeft + handRight) / 2, y: box.h - HAND_BOTTOM },
    handSpan: handRight - handLeft,
    center: { x: box.w / 2, y: (readTop + readBottom) / 2 },
    // Dos cartas del Oteo, una al lado de la otra, dentro de la banda.
    oteoScale: Math.min(
      0.95,
      (box.w - 140) / (2 * SKETCH_W + 56),
      (readHeight - 16) / SKETCH_H,
    ),
    expandScale: Math.min(1.05, (readHeight - 16) / SKETCH_H, (box.w - 96) / SKETCH_W),
  };
}

/**
 * El hexágono bajo un punto del escenario, o null si el punto cae fuera.
 *
 * `Hex.fromPixel` deshace la fórmula de `toPixel` y redondea al hexágono más
 * cercano, así que SIEMPRE devuelve uno: quien dice que el punto está fuera es
 * la comprobación de que ese hexágono pertenece al retal, más un radio de
 * tolerancia para que soltar dos píxeles por debajo del borde no cuente como
 * haber acertado en la última fila.
 */
function hexAt(l: Layout, x: number, y: number): HexCoord | null {
  const hex = Hex.fromPixel(x - l.originX, y - l.originY, l.size, TILT);
  const center = l.centers.get(Hex.key(hex));
  if (!center) return null;
  const dx = x - center.x;
  // El alto va comprimido por el tablero: sin deshacerlo, la tolerancia sería
  // una elipse y la fila de abajo aceptaría clics de mucho más lejos.
  const dy = (y - center.y) / TILT;
  return dx * dx + dy * dy <= (l.size * 1.05) ** 2 ? hex : null;
}

// --- Dónde está cada carta -------------------------------------------------

type PoseKind = "hand" | "oteo" | "center" | "pile";

/** El sitio de una carta: su `transform`, su opacidad y su capa. */
type Pose = {
  readonly kind: PoseKind;
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotate: number;
  readonly opacity: number;
  readonly z: number;
};

/**
 * El sitio de una carta en la mano: abanico, no montón.
 *
 * Copiado en espíritu de `handSlot` de AnimationBench, y por su mismo motivo:
 * cinco cartas en el mismo punto se tapan y no se puede coger la de abajo,
 * pero lo de fondo es que una mano se lee de un vistazo porque está ABIERTA, y
 * ese gesto —el abanico ligeramente girado— es la mitad de lo que hace que un
 * juego de cartas parezca un juego de cartas.
 */
function handPose(l: Layout, index: number, count: number): Pose {
  const cardW = SKETCH_W * HAND_SCALE;
  // El paso de siempre, salvo que no quepa: entonces las cartas se solapan más
  // en vez de salirse por los lados. El ancho disponible ya descuenta el Mazo.
  const step = Math.min(cardW * 0.66, (l.handSpan - cardW) / Math.max(count - 1, 1));
  const offset = (index - (count - 1) / 2) * step;
  return {
    kind: "hand",
    x: l.hand.x + offset,
    // Las de los lados caen un poco: el abanico es un arco, no una fila.
    y: l.hand.y + Math.abs(offset) * 0.055,
    scale: HAND_SCALE,
    rotate: count > 1 ? offset * 0.05 : 0,
    opacity: 1,
    z: 10 + index,
  };
}

function oteoPose(l: Layout, index: number, count: number): Pose {
  const step = SKETCH_W * l.oteoScale + 44;
  const offset = (index - (count - 1) / 2) * step;
  return {
    kind: "oteo",
    x: l.center.x + offset,
    y: l.center.y,
    scale: l.oteoScale,
    rotate: offset === 0 ? 0 : Math.sign(offset) * 2.5,
    opacity: 1,
    z: 46,
  };
}

/** El Mazo: de donde nace una carta y a donde vuelve siempre. */
function pilePose(l: Layout, z: number): Pose {
  return { kind: "pile", x: l.pile.x, y: l.pile.y, scale: PILE_SCALE, rotate: -8, opacity: 0, z };
}

function poseTransform(p: { x: number; y: number; rotate: number; scale: number }): string {
  return `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.rotate.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
}

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}

// --- El módulo -------------------------------------------------------------

export type BarajaModuleProps = {
  /** Las 16 cartas de unidad de las dos razas piloto — relleno, no catálogo real (ver cabecera). */
  cards: readonly UnitCard[];
  /** Las 41 Características, para que el adaptador resuelva los rasgos de cada carta. */
  catalog: readonly Trait[];
};

function initialState(cards: readonly UnitCard[]): DeckState {
  return { deck: buildDeck(cards), inPlay: [] };
}

export default function BarajaModule({ cards, catalog }: BarajaModuleProps) {
  const uid = useId().replace(/[^\w-]/g, "");
  const soilId = `baraja-soil-${uid}`;

  const [state, setState] = useState<DeckState>(() => initialState(cards));
  const [oteo, setOteo] = useState<OteoDraw>([]);
  const [pending, setPending] = useState<DeckCard | null>(null);
  /** Las que se están yendo al Mazo sin haberse jugado: las que rechazas al otear. */
  const [discarding, setDiscarding] = useState<readonly DeckCard[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  /** La que se está yendo al Mazo POR haberse jugado (la regla madre). */
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [offered, setOffered] = useState<ReadonlySet<HexKey> | null>(null);
  const [placed, setPlaced] = useState<ReadonlyMap<HexKey, DeckCard>>(new Map());
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [note, setNote] = useState("Otea para empezar: el Mazo reparte dos y te quedas con una.");

  const stageRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef(new Map<string, HTMLDivElement>());
  const cellNodes = useRef(new Map<HexKey, SVGPolygonElement>());
  const candidate = useRef<HexKey | null>(null);
  const posesRef = useRef<ReadonlyMap<string, Pose>>(new Map());
  const born = useRef(new Set<string>());
  const hovered = useRef<string | null>(null);

  /** El gesto en curso. Vive en una referencia porque cambia con cada movimiento del puntero. */
  const press = useRef<{
    id: string;
    card: DeckCard;
    pointerId: number;
    startX: number;
    startY: number;
    dragging: boolean;
  } | null>(null);

  /**
   * La carta en el aire y su física (ver «La física del arrastre», arriba).
   *
   * `tx`/`ty` es a dónde quiere ir —el puntero— y `x`/`y` dónde está de verdad;
   * la diferencia entre las dos es todo el efecto.
   */
  const fly = useRef<{
    el: HTMLDivElement;
    tilt: HTMLElement;
    tx: number;
    ty: number;
    x: number;
    y: number;
    roll: number;
    scale: number;
    rx: number;
    ry: number;
    raf: number;
  } | null>(null);

  /** Si el sistema pide que nada se mueva. Se respeta, y aquí se nota mucho. */
  const still = useRef(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    still.current = query.matches;
    const listener = (e: MediaQueryListEvent) => {
      still.current = e.matches;
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  // Función declarada y no `useCallback`: se llama a sí misma para encadenar el
  // siguiente fotograma, y una constante no puede referirse a sí misma antes de
  // estar inicializada. Solo toca referencias, así que da igual de qué render
  // sea la instancia que quedó dentro del `requestAnimationFrame`.
  function tick() {
    const f = fly.current;
    if (!f) return;

    // Con movimiento reducido no hay persecución ni cabeceo: la carta va pegada
    // al puntero y se acabó. Es la misma decisión que toma lib/v3/anim.ts al
    // aplanar los tiempos — se respeta la preferencia en el DATO, no tapando el
    // resultado con una regla de CSS.
    if (still.current) {
      f.x = f.tx;
      f.y = f.ty;
      f.roll = 0;
      f.scale = DRAG_SCALE;
      f.rx = 0;
      f.ry = 0;
      f.el.style.transform = poseTransform({ x: f.x, y: f.y, rotate: 0, scale: f.scale });
      f.tilt.style.transform = "";
      f.raf = requestAnimationFrame(tick);
      return;
    }

    const wasX = f.x;
    const wasY = f.y;
    f.x += (f.tx - f.x) * DRAG_EASE;
    f.y += (f.ty - f.y) * DRAG_EASE;
    // La velocidad de la carta, no la del puntero: es la que se para sola
    // cuando la carta alcanza la mano, y por eso la inclinación se deshace sin
    // que haya que ordenarlo en ningún sitio.
    const vx = f.x - wasX;
    const vy = f.y - wasY;
    f.scale += (DRAG_SCALE - f.scale) * SCALE_EASE;
    // El giro de la mano (el que traía del abanico) se deshace a la vez.
    f.roll += (0 - f.roll) * TILT_EASE;
    f.ry += (clamp(vx * TILT_PER_PX, TILT_MAX) - f.ry) * TILT_EASE;
    f.rx += (clamp(-vy * TILT_PER_PX, TILT_MAX) - f.rx) * TILT_EASE;
    f.el.style.transform = poseTransform({ x: f.x, y: f.y, rotate: f.roll, scale: f.scale });
    f.tilt.style.transform = `rotateX(${f.rx.toFixed(2)}deg) rotateY(${f.ry.toFixed(2)}deg)`;
    f.raf = requestAnimationFrame(tick);
  }

  /** Cierra el vuelo y devuelve la carta al mando de las transiciones de CSS. */
  const stopFlight = useCallback(() => {
    const f = fly.current;
    fly.current = null;
    if (!f) return;
    cancelAnimationFrame(f.raf);
    f.el.style.transition = "";
    f.tilt.style.transition = "";
    f.tilt.style.transform = "";
  }, []);

  useEffect(() => stopFlight, [stopFlight]);

  // --- Medida ---------------------------------------------------------------

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

  // El escenario medido. Los gestos lo leen del cierre de su render y no de una
  // referencia: durante un arrastre no hay repintados, así que el que había al
  // empezar el gesto es el bueno hasta que termine.
  const layout = useMemo(() => measure(box), [box]);

  const geometry = useMemo(() => (layout ? pieceGeometry(layout.size, TILT) : null), [layout]);

  // Un Subject por PERSONAJE y no por carta: el Mazo repite las mismas 16
  // unidades hasta veinte veces, y resolver sus rasgos contra el catálogo en
  // cada repintado sería hacer el mismo cruce veinte veces por fotograma.
  const subjects = useMemo(() => {
    const map = new Map<string, Subject>();
    for (const c of cards) {
      if (!map.has(c.character.id)) {
        map.set(c.character.id, characterToSubject(c.character, c.illustration, catalog));
      }
    }
    return map;
  }, [cards, catalog]);

  const subjectOf = useCallback(
    (d: DeckCard): Subject =>
      subjects.get(d.card.character.id) ??
      characterToSubject(d.card.character, d.card.illustration, catalog),
    [subjects, catalog],
  );

  // --- Dónde va cada carta --------------------------------------------------

  /** Las cartas que hoy están sobre la mesa, sin repetir. */
  const onTable = useMemo(() => {
    const seen = new Set<string>();
    const out: DeckCard[] = [];
    for (const d of [...state.inPlay, ...oteo, ...discarding]) {
      if (seen.has(d.instanceId)) continue;
      seen.add(d.instanceId);
      out.push(d);
    }
    return out;
  }, [state.inPlay, oteo, discarding]);

  const poses = useMemo(() => {
    const map = new Map<string, Pose>();
    const l = layout;
    if (!l) return map;

    // Las que se van al Mazo, PRIMERO: una carta rechazada sigue pintada medio
    // segundo mientras vuela, y en ese medio segundo se puede otear otra vez y
    // volver a sacarla. Si esto fuera lo último, esa carta recién repartida se
    // quedaría clavada en el Mazo.
    for (const d of discarding) map.set(d.instanceId, pilePose(l, 6));

    // La mano, en abanico. La que se está jugando ya no cuenta para el
    // reparto: el resto se cierra sobre su hueco mientras ella se va.
    const hand = state.inPlay.filter((d) => d.instanceId !== playingId);
    hand.forEach((d, i) => map.set(d.instanceId, handPose(l, i, hand.length)));

    // El Oteo. Con una carta pendiente de sustitución, la elegida se queda en
    // el centro y la otra se vuelve al Mazo: ya no hay nada que decidir sobre
    // ella y dejarla puesta haría creer que todavía se puede coger.
    if (pending) {
      map.set(pending.instanceId, {
        kind: "center",
        x: l.center.x,
        y: l.center.y,
        scale: l.oteoScale,
        rotate: 0,
        opacity: 1,
        z: 46,
      });
      for (const d of oteo) {
        if (d.instanceId !== pending.instanceId) map.set(d.instanceId, pilePose(l, 6));
      }
    } else {
      oteo.forEach((d, i) => map.set(d.instanceId, oteoPose(l, i, oteo.length)));
    }

    if (expandedId && map.has(expandedId)) {
      map.set(expandedId, {
        kind: "center",
        x: l.center.x,
        y: l.center.y,
        scale: l.expandScale,
        rotate: 0,
        opacity: 1,
        z: 50,
      });
    }

    if (playingId) map.set(playingId, pilePose(l, 45));

    return map;
  }, [layout, state.inPlay, oteo, pending, discarding, expandedId, playingId]);

  /**
   * Escribe en el DOM dónde está una carta.
   *
   * El realce del ratón se suma AQUÍ y no en una regla de CSS: el `transform`
   * lo lleva el componente, así que un `:hover { transform: … }` pelearía con
   * él y la carta saltaría a la esquina del escenario en cuanto pasaras por
   * encima. Sumarlo aquí también evita repintar cinco cartas de React por cada
   * entrada y salida del puntero.
   */
  const writeCard = useCallback((id: string) => {
    const el = cardEls.current.get(id);
    const pose = posesRef.current.get(id);
    if (!el || !pose) return;
    const lift =
      hovered.current === id && (pose.kind === "hand" || pose.kind === "oteo");
    const shown = lift
      ? {
          ...pose,
          y: pose.y - 22,
          scale: pose.scale * (pose.kind === "hand" ? 1.14 : 1.05),
          rotate: pose.rotate * 0.35,
          z: pose.kind === "hand" ? 30 : pose.z + 1,
        }
      : pose;
    el.style.transform = poseTransform(shown);
    el.style.opacity = String(shown.opacity);
    el.style.zIndex = String(shown.z);
  }, []);

  useLayoutEffect(() => {
    posesRef.current = poses;
    const l = layout;
    const fresh: { id: string; el: HTMLDivElement }[] = [];

    for (const id of poses.keys()) {
      const el = cardEls.current.get(id);
      if (!el) continue;
      // La que se arrastra la lleva el puntero: escribirle su sitio aquí la
      // devolvería a la mano a mitad del gesto.
      if (press.current?.dragging && press.current.id === id) continue;
      if (born.current.has(id)) {
        writeCard(id);
      } else {
        born.current.add(id);
        fresh.push({ id, el });
      }
    }
    for (const id of [...born.current]) if (!poses.has(id)) born.current.delete(id);

    if (fresh.length === 0 || !l) return;

    // El reparto: la carta se PINTA primero en el Mazo y se suelta un instante
    // después, para que la transición la lleve volando hasta su sitio en vez
    // de aparecer ya puesta. El doble rAF no es superstición: con uno solo, el
    // navegador puede fundir la posición de partida y la de destino en el
    // mismo fotograma y no hay vuelo (es el mismo hallazgo que anota
    // components/lab/DeckLab.tsx). El escalón entre las dos es lo que hace que
    // se lea que son DOS cartas y no una parpadeando.
    const start = pilePose(l, 46);
    for (const { el } of fresh) {
      el.style.transition = "none";
      el.style.transform = poseTransform({ ...start, scale: PILE_SCALE * 0.9 });
      el.style.opacity = "0";
      el.style.zIndex = String(start.z);
      void el.getBoundingClientRect();
    }

    const timers: number[] = [];
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        fresh.forEach(({ id, el }, i) => {
          timers.push(
            window.setTimeout(() => {
              el.style.transition = "";
              writeCard(id);
            }, i * DEAL_STAGGER),
          );
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      for (const t of timers) window.clearTimeout(t);
      // Si el reparto se interrumpe a mitad, las cartas no se quedan clavadas
      // en el Mazo sin transición: se les devuelve y el siguiente pase las
      // coloca donde toque.
      for (const { el } of fresh) el.style.transition = "";
    };
  }, [poses, layout, writeCard]);

  // --- Otear, tomar, rechazar -----------------------------------------------

  const forget = useCallback((ids: readonly string[]) => {
    window.setTimeout(() => {
      setDiscarding((prev) => prev.filter((d) => !ids.includes(d.instanceId)));
    }, 520);
  }, []);

  function handleOtear() {
    if (state.deck.length === 0 || oteo.length > 0 || pending) return;
    setExpandedId(null);
    setOteo(drawOteo(state));
    setNote(
      isInPlayFull(state)
        ? "La mano está llena: si tomas una, tendrás que decir a cuál sustituye."
        : "Dos cartas del Mazo. Toma una, o ninguna.",
    );
  }

  function handlePick(d: DeckCard) {
    if (isInPlayFull(state)) {
      setPending(d);
      setNote(`«En juego» está lleno: elige a qué carta de la mano sustituye ${d.card.character.name}.`);
      return;
    }
    const rest = oteo.filter((o) => o.instanceId !== d.instanceId);
    setState((prev) => takeOteo(prev, d));
    setOteo([]);
    setDiscarding((prev) => [...prev, ...rest]);
    forget(rest.map((o) => o.instanceId));
    setNote(`${d.card.character.name} entra en la mano. Arrástrala a un hexágono para desplegarla.`);
  }

  function handleSwap(swapOutId: string) {
    if (!pending) return;
    const chosen = pending;
    const dropped = state.inPlay.find((d) => d.instanceId === swapOutId);
    const rest = oteo.filter((o) => o.instanceId !== chosen.instanceId);
    setState((prev) => takeOteo(prev, chosen, swapOutId));
    setOteo([]);
    setPending(null);
    const gone = [...rest, ...(dropped ? [dropped] : [])];
    setDiscarding((prev) => [...prev, ...gone]);
    forget(gone.map((o) => o.instanceId));
    setNote(
      dropped
        ? `${dropped.card.character.name} vuelve al Mazo y entra ${chosen.card.character.name}.`
        : `${chosen.card.character.name} entra en la mano.`,
    );
  }

  function handleNone() {
    setDiscarding((prev) => [...prev, ...oteo]);
    forget(oteo.map((o) => o.instanceId));
    setOteo([]);
    setPending(null);
    setNote("Ninguna de las dos: las dos vuelven al Mazo. Otear es opcional.");
  }

  function handleCancelSwap() {
    if (!pending) return;
    setDiscarding((prev) => [...prev, ...oteo]);
    forget(oteo.map((o) => o.instanceId));
    setOteo([]);
    setPending(null);
    setNote("Sustitución cancelada: la mano se queda como estaba.");
  }

  function reset() {
    press.current = null;
    stopFlight();
    markCandidate(null);
    setState(initialState(cards));
    setOteo([]);
    setPending(null);
    setDiscarding([]);
    setExpandedId(null);
    setPlayingId(null);
    setDragId(null);
    setOffered(null);
    setPlaced(new Map());
    setNote("Otea para empezar: el Mazo reparte dos y te quedas con una.");
  }

  // --- El hexágono candidato -------------------------------------------------

  const markCandidate = useCallback((key: HexKey | null) => {
    if (candidate.current === key) return;
    if (candidate.current) {
      cellNodes.current.get(candidate.current)?.removeAttribute("data-candidate");
    }
    candidate.current = key;
    if (key) cellNodes.current.get(key)?.setAttribute("data-candidate", "true");
  }, []);

  // --- Coger una carta: un clic la amplía, un arrastre la despliega ----------
  //
  // Son el mismo gesto hasta que dejan de serlo, y por eso comparten el
  // `pointerdown`: lo que los separa es si el puntero se mueve. Partirlos en
  // dos mandos (un botón de "ver" y otro de "jugar") sería más fácil de
  // escribir y no se parecería en nada a coger una carta.

  function pointOf(e: { clientX: number; clientY: number }): { x: number; y: number } {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleCardPointerDown(e: React.PointerEvent<HTMLDivElement>, d: DeckCard) {
    // Con el Oteo abierto la mano no se toca, salvo para decidir la
    // sustitución: ahí el clic significa otra cosa y lo resuelve el `onClick`.
    if (oteo.length > 0 || pending || playingId) return;
    if (!state.inPlay.some((c) => c.instanceId === d.instanceId)) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    press.current = {
      id: d.instanceId,
      card: d,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
    };
  }

  /**
   * Levantar la carta: arranca el bucle y le da su punto de partida.
   *
   * La física NO empieza en el puntero sino DONDE ESTÁ LA CARTA —su hueco del
   * abanico, con el giro que traía—, así que lo primero que hace el bucle es
   * subirla desde la mano hasta el cursor persiguiéndolo. Arrancar en el
   * puntero la teletransportaría, que es justo lo que hacía antes.
   */
  function beginDrag(p: NonNullable<typeof press.current>, at: { x: number; y: number }): boolean {
    const el = cardEls.current.get(p.id);
    const tilt = el?.querySelector<HTMLElement>(".baraja-lab__card-tilt");
    const from = posesRef.current.get(p.id);
    // Sin sitio de partida o sin nodo no se empieza NADA: marcar el gesto como
    // arrastre sin poder pintarlo dejaría una carta quieta que aun así despliega
    // una ficha al soltar, o sea una jugada invisible.
    if (!el || !tilt || !from) return false;

    p.dragging = true;
    // Con el puntero capturado ya no llega el `pointerleave` de la carta, así
    // que el realce del ratón se apaga aquí o se quedaría puesto para siempre.
    hovered.current = null;

    el.style.transition = "none";
    el.style.opacity = "1";
    el.style.zIndex = "60";
    tilt.style.transition = "none";
    fly.current = {
      el,
      tilt,
      tx: at.x,
      ty: at.y - DRAG_LIFT,
      x: from.x,
      y: from.y,
      roll: from.rotate,
      scale: from.scale,
      rx: 0,
      ry: 0,
      raf: 0,
    };
    fly.current.raf = requestAnimationFrame(tick);

    setExpandedId(null);
    setDragId(p.id);
    const free = new Set<HexKey>();
    for (const cell of layout?.cells ?? []) {
      if (!placed.has(cell.key)) free.add(cell.key);
    }
    setOffered(free);
    setNote("Suelta sobre un hexágono libre. Fuera del retal, la carta vuelve a la mano.");
    return true;
  }

  function handleCardPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = press.current;
    const l = layout;
    if (!p || !l) return;

    const at = pointOf(e);

    if (!p.dragging) {
      const far = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
      if (far < DRAG_THRESHOLD) return;
      if (!beginDrag(p, at)) return;
    }

    // Se apunta con el CURSOR y no con la carta: la carta va rezagada a
    // propósito, y hacerle caso a ella pondría la ficha un hexágono por detrás
    // de donde el jugador está mirando.
    const hex = hexAt(l, at.x, at.y);
    markCandidate(hex && !placed.has(Hex.key(hex)) ? Hex.key(hex) : null);

    // Lo único que hace el puntero es mover el destino. De ahí a la pantalla ya
    // se encarga el bucle, que sigue corriendo aunque el ratón se pare.
    if (fly.current) {
      fly.current.tx = at.x;
      fly.current.ty = at.y - DRAG_LIFT;
    }
  }

  function endPress(e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) {
    const p = press.current;
    const l = layout;
    press.current = null;
    if (!p) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(p.pointerId)) el.releasePointerCapture(p.pointerId);

    if (!p.dragging) {
      // No se movió: es un clic, y un clic amplía la carta para leerla.
      if (!cancelled) {
        setExpandedId((prev) => (prev === p.id ? null : p.id));
        setNote(`${p.card.card.character.name}: arrástrala desde aquí o desde la mano.`);
      }
      return;
    }

    // Se para el bucle y las transiciones de CSS recuperan el mando: la carta
    // sale hacia su destino DESDE DONDE HAYA QUEDADO, no desde el puntero, y el
    // giro en 3D se deshace por su cuenta con la transición del elemento.
    stopFlight();
    markCandidate(null);
    setDragId(null);
    setOffered(null);

    const at = pointOf(e);
    const hex = l && !cancelled ? hexAt(l, at.x, at.y) : null;
    if (!hex || placed.has(Hex.key(hex))) {
      // Vuelve a la mano: el `writeCard` de abajo la lleva a su hueco del
      // abanico con la transición ya devuelta.
      writeCard(p.id);
      setNote(
        hex ? "Ahí ya hay una ficha: dos nunca comparten casilla." : "Fuera del retal: la carta vuelve a la mano.",
      );
      return;
    }

    // Desplegada. La ficha aparece YA —es lo que el gesto acaba de hacer— y la
    // carta sale volando al Mazo: la regla madre, hecha visible.
    setPlaced((prev) => new Map(prev).set(Hex.key(hex), p.card));
    setPlayingId(p.id);
    setNote(`${p.card.card.character.name} despliega en el tablero, y su carta vuelve al Mazo.`);
  }

  /**
   * La carta jugada ya ha llegado al Mazo: el estado se compromete.
   *
   * Es idempotente a propósito —si la carta ya no está en la mano, `setState`
   * devuelve el estado tal cual— porque le llegan DOS avisos: el fin de la
   * transición y un reloj de respaldo. El respaldo no sobra: una transición que
   * no llega a cambiar ni un píxel no avisa nunca, y con `playingId` puesto esa
   * carta se quedaría fuera de la mano y fuera del Mazo, o sea desaparecida.
   */
  const commitPlay = useCallback((id: string) => {
    setState((prev) => {
      const card = prev.inPlay.find((d) => d.instanceId === id);
      return card ? playCard(prev, card) : prev;
    });
    setPlayingId((current) => (current === id ? null : current));
  }, []);

  useEffect(() => {
    if (!playingId) return undefined;
    const id = playingId;
    const timer = window.setTimeout(() => commitPlay(id), PLAY_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [playingId, commitPlay]);

  // --- Lo que se pinta -------------------------------------------------------

  const overlay = oteo.length > 0 || !!pending || !!expandedId;
  const soft = !!pending;
  const handCount = state.inPlay.length;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Baraja y Oteo</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El <b className="text-[var(--wiki-text)]">sistema</b> de Oteo, no su contenido: Mazo de{" "}
        {DECK_MAX} cartas abajo a la izquierda, la mano en abanico con {IN_PLAY_MAX} huecos, y otear
        revela 2 para quedarte con 1 o con ninguna. Las 16 cartas son las de unidad ya construidas
        de Humanos y Enanos, repetidas para llenar el Mazo — las de clase reales siguen en pausa, y
        aquí no hace falta que el contenido tenga sentido de partida.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El suelo <b className="text-[var(--wiki-text)]">no es el tablero</b>: son los mismos quince
        hexágonos quietos del banco de animación, para tener dónde soltar una carta. Un{" "}
        <b className="text-[var(--wiki-text)]">clic</b> en una carta de la mano la amplía para leer
        sus cifras; <b className="text-[var(--wiki-text)]">arrastrarla</b> hasta un hexágono libre la
        despliega como ficha de verdad y devuelve la carta al Mazo.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button className={buttonClass()} onClick={reset}>
          <i className="pi pi-replay mr-1" />
          Reiniciar
        </button>
        <button
          className={buttonClass()}
          disabled={state.deck.length === 0 || oteo.length > 0 || !!pending}
          onClick={handleOtear}
        >
          <i className="pi pi-eye mr-1" />
          Otear
        </button>
        <span className="text-sm text-[var(--wiki-text)]">
          <b>Mazo:</b> {state.deck.length}/{DECK_MAX} · <b>En juego:</b> {handCount}/{IN_PLAY_MAX} ·{" "}
          <b>Desplegadas:</b> {placed.size}
        </span>
      </div>

      {/* `sketch-lab` y las dos clases de fuente NO son decoración: el raíl de
          Rareza de la carta (--rarity/--rarity-soft) y su tipografía se emiten
          desde ahí (styles/components/_card-sketch.scss), así que una
          SketchCard fuera de este contenedor sale sin color de tier y con la
          fuente del sistema. Es lo mismo que hace CardDesign.tsx en la wiki. */}
      <div className={`baraja-lab sketch-lab ${sketchFontVars} ${gameFontVars}`}>
        <div className="baraja-lab__stage" ref={stageRef} data-dragging={dragId ? "true" : undefined}>
          {layout && geometry && (
            <>
              {/* El suelo. Una LÁMINA y no un color por casilla: el degradado
                  va en coordenadas de usuario, así que los quince hexágonos
                  comparten una sola pintura y la unión se lee como una
                  superficie sola (misma decisión que ArenaBoard). */}
              <svg
                className="baraja-lab__ground"
                viewBox={`0 0 ${box.w} ${box.h}`}
                width={box.w}
                height={box.h}
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id={soilId}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={TOP_PAD}
                    x2="0"
                    y2={box.h * GROUND_SHARE}
                  >
                    <stop offset="0" className="baraja-lab__soil-far" />
                    <stop offset="0.55" className="baraja-lab__soil-mid" />
                    <stop offset="1" className="baraja-lab__soil-near" />
                  </linearGradient>
                </defs>
                <g className="baraja-lab__soil" fill={`url(#${soilId})`}>
                  {layout.cells.map((c) => (
                    <polygon key={c.key} points={c.points} />
                  ))}
                </g>
                {/* El terreno que se ofrece va ENTRE el suelo y la rejilla: es
                    el terreno encendiéndose, no una chapa por encima, así que
                    las líneas tienen que seguir viéndose sobre él. Los quince
                    polígonos están siempre puestos y lo que cambia es un
                    atributo — un elemento recién montado no puede hacer una
                    transición. */}
                <g className="baraja-lab__offer">
                  {layout.cells.map((c) => (
                    <polygon
                      key={c.key}
                      ref={(node) => {
                        if (node) cellNodes.current.set(c.key, node);
                        else cellNodes.current.delete(c.key);
                      }}
                      points={c.points}
                      data-offered={offered?.has(c.key) ? "true" : "false"}
                    />
                  ))}
                </g>
                <g className="baraja-lab__mesh">
                  {layout.mesh.map((s, i) => (
                    <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
                  ))}
                </g>
              </svg>

              {/* Las fichas desplegadas, en su propia capa: la del suelo lleva
                  una sombra de silueta que no tiene que caerles encima. */}
              <svg
                className="baraja-lab__pieces"
                viewBox={`0 0 ${box.w} ${box.h}`}
                width={box.w}
                height={box.h}
                aria-hidden
              >
                {[...placed.entries()].map(([key, d]) => {
                  const at = layout.centers.get(key);
                  if (!at) return null;
                  return (
                    <PieceToken
                      key={key}
                      piece={characterToPieceView(d.card.character, d.card.illustration)}
                      cx={at.x}
                      cy={at.y}
                      geometry={geometry}
                      framing={DEFAULT_FRAMING}
                      fields={PIECE_FIELDS}
                    />
                  );
                })}
              </svg>
            </>
          )}

          {/* El Mazo, abajo a la izquierda: de aquí sale el Oteo y aquí vuelve
              todo lo demás. */}
          {layout && (
            <div
              className="baraja-lab__pile"
              style={{
                left: layout.pile.x,
                top: layout.pile.y,
                width: SKETCH_W * PILE_SCALE,
                height: SKETCH_H * PILE_SCALE,
              }}
              data-empty={state.deck.length === 0}
            >
              <div className="baraja-lab__pile-stack" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="baraja-lab__pile-back" />
                ))}
              </div>
              <button
                type="button"
                className="baraja-lab__pile-trigger"
                disabled={state.deck.length === 0 || oteo.length > 0 || !!pending}
                onClick={handleOtear}
                aria-label="Otear: revelar 2 cartas del Mazo"
              />
              <span className="baraja-lab__pile-count">{state.deck.length}</span>
              <span className="baraja-lab__pile-label">
                {state.deck.length === 0 ? "Mazo vacío" : "Otear"}
              </span>
            </div>
          )}

          {/* El velo. Con una sustitución pendiente NO atrapa el puntero: la
              decisión se toma haciendo clic en una carta de la MANO, que está
              por debajo. */}
          {overlay && (
            <div
              className={`baraja-lab__veil${soft ? " baraja-lab__veil--soft" : ""}`}
              onClick={() => {
                if (expandedId) setExpandedId(null);
              }}
            />
          )}

          {/* Todas las cartas, en una sola capa y siempre en el mismo padre:
              es lo que permite que moverlas de zona sea una transición y no un
              clon volante (ver la cabecera). */}
          {onTable.map((d) => {
            const isHand = state.inPlay.some((c) => c.instanceId === d.instanceId);
            const picking = oteo.length > 0 && !pending;
            const swapping = !!pending && isHand;
            const grabbable = isHand && !overlay && !playingId;
            // Qué significa un clic sobre esta carta, ahora mismo. Si no
            // significa nada, tampoco se anuncia como botón ni se puede tabular
            // hasta ella: una carta del Mazo que está volando no es un mando.
            const action = picking ? "tomar" : swapping ? "sustituir" : grabbable ? "ampliar" : null;
            // El nombre SIN el glifo, igual que lo imprime la carta: lo que se
            // lee en voz alta tiene que ser lo que se ve, no «pico Minero».
            const name = splitGlyph(d.card.character.name).label;
            return (
              <div
                key={d.instanceId}
                ref={(el) => {
                  if (el) cardEls.current.set(d.instanceId, el);
                  else cardEls.current.delete(d.instanceId);
                }}
                className="baraja-lab__card"
                data-zone={poses.get(d.instanceId)?.kind ?? "pile"}
                data-grabbable={grabbable ? "true" : undefined}
                data-flying={dragId === d.instanceId ? "true" : undefined}
                role={action ? "button" : undefined}
                tabIndex={action ? 0 : undefined}
                aria-label={
                  action === "tomar"
                    ? `Tomar ${name}`
                    : action === "sustituir"
                      ? `Sustituir ${name}`
                      : action === "ampliar"
                        ? `Ver ${name} en grande`
                        : undefined
                }
                onPointerEnter={() => {
                  if (!grabbable && !picking) return;
                  hovered.current = d.instanceId;
                  writeCard(d.instanceId);
                }}
                onPointerLeave={() => {
                  if (hovered.current !== d.instanceId) return;
                  hovered.current = null;
                  writeCard(d.instanceId);
                }}
                onPointerDown={(e) => handleCardPointerDown(e, d)}
                onPointerMove={handleCardPointerMove}
                onPointerUp={(e) => endPress(e, false)}
                onPointerCancel={(e) => endPress(e, true)}
                onClick={() => {
                  if (picking) handlePick(d);
                  else if (swapping) handleSwap(d.instanceId);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  if (picking) handlePick(d);
                  else if (swapping) handleSwap(d.instanceId);
                  else if (grabbable) {
                    setExpandedId((prev) => (prev === d.instanceId ? null : d.instanceId));
                  }
                }}
                // `e.target === e.currentTarget`: la carta de dentro tiene sus
                // propias transiciones, y sin esto una suya con `transform`
                // burbujearía hasta aquí y daría la jugada por terminada antes
                // de que la carta haya llegado al Mazo.
                onTransitionEnd={(e) => {
                  if (
                    e.target === e.currentTarget &&
                    e.propertyName === "transform" &&
                    playingId === d.instanceId
                  ) {
                    commitPlay(d.instanceId);
                  }
                }}
              >
                {/* La capa que se inclina. Va aparte del contenedor que se
                    mueve porque son dos sistemas distintos: fuera vive el
                    TRASLADO (en píxeles del escenario) y dentro el GIRO EN 3D
                    (en grados, proyectado por el `perspective` del padre). En
                    un solo elemento, un `translate` grande dentro de la
                    perspectiva se deformaría al alejarse del centro. Es el
                    mismo reparto de dos capas del pen de Hearthstone. */}
                <div className="baraja-lab__card-tilt">
                  <SketchCard id="lamina" subject={subjectOf(d)} />
                </div>
                {swapping && <span className="baraja-lab__swap-hint">Sustituir</span>}
              </div>
            );
          })}

          {/* El pie del velo: lo que hay que decidir, escrito. Va aparte de las
              cartas porque no se mueve con ellas. */}
          {overlay && (
            <div className="baraja-lab__veil-foot">
              {oteo.length > 0 && !pending && (
                <>
                  <p className="baraja-lab__veil-text">
                    Dos cartas del Mazo: haz clic en la que te quedas.
                  </p>
                  <button className={buttonClass()} onClick={handleNone}>
                    Ninguna
                  </button>
                </>
              )}
              {pending && (
                <>
                  <p className="baraja-lab__veil-text">
                    «En juego» está lleno: haz clic en una carta de la mano para sustituirla por{" "}
                    <b>{pending.card.character.name}</b>.
                  </p>
                  <button className={buttonClass()} onClick={handleCancelSwap}>
                    Cancelar
                  </button>
                </>
              )}
              {expandedId && !pending && oteo.length === 0 && (
                <p className="baraja-lab__veil-text">
                  Arrástrala hasta un hexágono para desplegarla · clic fuera para devolverla a la
                  mano
                </p>
              )}
            </div>
          )}

          <p className="baraja-lab__hint">{note}</p>
          {layout && handCount > 0 && !overlay && (
            <p
              className="baraja-lab__hand-label"
              style={{ left: layout.hand.x, top: layout.hand.y + SKETCH_H * HAND_SCALE * 0.62 }}
            >
              En juego ({handCount}/{IN_PLAY_MAX})
            </p>
          )}
        </div>
      </div>

      <details className="mt-6 text-sm text-[var(--wiki-muted)]">
        <summary className="cursor-pointer text-[var(--wiki-text)]">
          Cartas sin preparar en el Mazo ({state.deck.length})
        </summary>
        <ul className="mt-2 grid gap-0.5">
          {countBy(state.deck.map((d) => d.card.character.name)).map(([name, n]) => (
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
