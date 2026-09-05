"use client";

// =========================================================================
// Módulo «Ficha de personaje» de /dev — la pieza del tablero
//
// Lo que se diseña aquí es LA FICHA: lo que se pone en el hexágono y anda por él
// (battle.md §5), no la hoja de datos —eso es el módulo 1, «Estadísticas de
// personaje»—. Dos decisiones de Dario la definen: el retrato de la carta dentro
// de la ficha viene de HEARTHSTONE, y la FORMA es un HEXÁGONO TUMBADO como la
// casilla (1 de septiembre de 2026), PLANO —el grosor se probó el día 2 y se
// quitó el día 3: «quita el disco y el grosor ya»—. Esta pantalla es la base
// desde la que se va mejorando.
//
// LA PANTALLA CONTESTA CUATRO COSAS, y ninguna se contesta leyendo:
//
//   1. ¿QUÉ BANDA DEL RETRATO cabe en la ventana? Las 24 ilustraciones que
//      existen son verticales y ponen la figura del 6% al 91% del alto
//      (public/assets/v3/README.md), y un hexágono tumbado es más ancho que
//      alto: el techo son el 55% del archivo, así que la figura entera NO cabe.
//      Tres candidatos: cabeza, busto o medio cuerpo —el que se abre—.
//   2. ¿CUÁNTAS CIFRAS aguanta? Hearthstone lleva dos. V3 tiene ocho Habilidades
//      y solo dos cambian durante la batalla. Van en los vértices del hexágono,
//      que son seis, y la ❤️ Vida sale además como BARRA por debajo. LA PANTALLA
//      ABRE CON CERO *(Dario, 3 de septiembre de 2026: «los datos de la ficha por
//      defecto quitados todos»)*: primero se juzga la pieza desnuda —que es lo
//      que está en obras— y encima de eso se van poniendo las cifras. Están todas
//      a un botón, y los dos de Hearthstone a uno solo.
//   3. ¿CÓMO SE DICE DE QUIÉN ES, con hasta tres jugadores y un enemigo en
//      espejo (§2)? CONTESTADA el 3 de septiembre de 2026, y por eso ya no hay
//      mando para ella: no lo dice el color de la ficha —ese es el del tier—
//      sino su CASILLA ILUMINADA, en TRES tonos *(Dario: «para mí azul, para mis
//      enemigos rojo y para mis aliados verde»)*. La cifra del jugador que se
//      probó ese mismo día sobra con el verde puesto. Lo que el color no dice es
//      cuál de los dos aliados, y eso es la decisión: la pregunta que un jugador
//      hace mirando el tablero es qué puede mover.
//   4. ¿VALE EL MISMO ENCUADRE PARA LAS DOCE FICHAS DE UNA RAZA? Eso lo contesta
//      la tira de tiers, y no una ficha suelta: el encuadre es uno y las
//      ilustraciones no están encuadradas igual entre ellas.
//
// SE PINTA SOBRE LA ARENA DE VERDAD, no sobre un retal: el tablero existe
// (módulo 4) y expone un hueco para que la ficha se inyecte —`renderPiece`—, así
// que aquí no hay ni un hexágono copiado a mano.
//
// PERO ES UNA ESCENA, NO UNA PARTIDA *(2 de septiembre de 2026)*: un retal de
// seis por cuatro con las fichas en CONTACTO, no el 14×12 con los dos bandos
// pegados a sus bordes. El tablero entero enseñaba dos manchas lejanas de fichas
// diminutas, que es exactamente lo que no hay que juzgar aquí —el despliegue ya
// se mide en /dev/tablero—. Lo que hace falta ver es qué pasa cuando se tocan:
// dos fichas de jugadores distintos pegadas, una enemiga enfrente, y las de la
// fila de delante tapando a las de detrás.
//
// EL SUJETO ES PRESTADO Y ESO ES DEUDA DECLARADA. Los sujetos de las dos razas
// dibujadas —con su arte y sus cifras— salen de `components/design/v3/` —el
// laboratorio del marco de carta—, donde las 8 Habilidades están escritas otra
// vez y los números son inventados. Es el mismo sustituto que el marco tiene
// apuntado en el registro: cuando exista el módulo «Catálogo de cartas», los dos
// cambian de fuente. Para lo que esta pantalla mide da igual el valor y no da
// igual la FORMA —tres dígitos de ❤️ Vida no caben donde caben dos—, y eso sí es
// real.
//
// Ninguna regla vive aquí: la geometría es de lib/v3/piece.ts y el catálogo de
// estados se lee de effects.md (ARCHITECTURE.md §6).
// =========================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord } from "@/lib/v3/hex";
import { buildArena, type ArenaSpec, type Side } from "@/lib/v3/arena";
import {
  DEFAULT_DIALS,
  DEFAULT_FIELDS,
  DEFAULT_FRAMING,
  FIELDS,
  FRAMINGS,
  FRAMING_BY_ID,
  HEARTHSTONE_FIELDS,
  PIECE_SIDES,
  pieceChecks,
  pieceGeometry,
  type FieldId,
  type FramingId,
  type PieceDials,
  type PieceSideId,
} from "@/lib/v3/piece";
import type { Effect } from "@/lib/v3/effects";
import { DECK_RACES, type DeckRace } from "@/components/design/v3/races";
import type { Subject } from "@/components/design/v3/sample";
import ArenaBoard, { ARENA_TILT, type ArenaPiece } from "./ArenaBoard";
import PieceToken, { PieceLifeBar, type PieceView } from "./PieceToken";
import PieceCalibre from "./PieceCalibre";
import PieceTierStrip, { type TierGroup } from "./PieceTierStrip";
import Button, { buttonClass } from "@/components/ui/Button";

/** Cuántos estados puede llevar una ficha a la vez en esta pantalla. */
const MAX_STATES = 3;

/** El radio del hexágono de la hoja de calibre: la arena usa 34. */
const CALIBRE_HEX = 108;

/** Y el de la tira de tiers, donde caben doce fichas seguidas. */
const STRIP_HEX = 46;

/**
 * EL RETAL DE LA ESCENA: siete columnas por cinco filas, con la misma geometría
 * y la misma cámara que la arena de verdad. Es un trozo del 14×12, no otro
 * tablero: lo construye el mismo `buildArena`, así que si la arena cambia de
 * forma esto cambia con ella.
 */
const SCENE: ArenaSpec = { cols: 6, rows: 4, bandDepth: 2 };

/**
 * Dónde se pone cada ficha, en columnas y filas de la escena.
 *
 * Están escritas a mano y eso es lo que se quiere: el despliegue de verdad
 * (lib/v3/deployment.ts) coloca cada bando en su banda, o sea a once hexágonos
 * del otro, y aquí lo que hay que mirar es el CONTACTO. Cada grupo se lleva dos
 * casillas seguidas de la lista, así que con tres jugadores la columna del frente
 * —la 2— tiene tres fichas de tres jugadores distintos en filas contiguas: el
 * caso peor de «cuáles son mías» y del solape, los dos a la vez. Y la columna 2
 * toca la 3, que es el frente enemigo.
 */
const ALLY_SLOTS: readonly { readonly col: number; readonly row: number }[] = [
  { col: 2, row: 1 },
  { col: 1, row: 0 },
  { col: 2, row: 2 },
  { col: 1, row: 2 },
  { col: 2, row: 0 },
  { col: 1, row: 1 },
];

const FOE_SLOTS: readonly { readonly col: number; readonly row: number }[] = [
  { col: 3, row: 1 },
  { col: 3, row: 0 },
  { col: 3, row: 2 },
  { col: 4, row: 0 },
  { col: 4, row: 2 },
  { col: 4, row: 1 },
];

/**
 * Qué unidad trae cada grupo, por su posición en la progresión de ocho tiers.
 * Salteadas a propósito —tier 8, 5 y 2— para que en la escena convivan una ficha
 * con ❤️ Vida de tres cifras y otra de dos, que es lo que mide la gema.
 */
const UNIT_BY_GROUP: readonly number[] = [7, 4, 1];

/**
 * La ❤️ Vida que le queda a cada ficha, en porcentaje y por orden de llegada. No
 * es azar: hace falta ver las cuatro barras —entera, tocada, a la mitad y
 * agonizando— a la vez y en la misma pantalla, porque lo que se juzga es si la
 * barra se distingue de su carril.
 */
const LIFE_PATTERN: readonly number[] = [100, 74, 41, 100, 88, 62, 19, 100, 55, 33];

/** Una ficha de la escena: quién es, de quién es y en qué casilla está. */
type SceneFicha = {
  readonly id: string;
  readonly side: PieceSideId;
  readonly boardSide: Side;
  readonly role: "heroe" | "unidad";
  readonly hex: HexCoord;
  readonly subject: Subject;
  readonly lifePct: number;
};

export type PieceModuleProps = {
  /** Los nueve estados de effects.md §5, leídos por el Server Component. */
  catalog: readonly Effect[];
};

export default function PieceModule({ catalog }: PieceModuleProps) {
  const [players, setPlayers] = useState(2);
  const [framing, setFraming] = useState<FramingId>(DEFAULT_FRAMING);
  const [fields, setFields] = useState<readonly FieldId[]>(DEFAULT_FIELDS);
  const [lifeBar, setLifeBar] = useState(true);
  const [states, setStates] = useState<readonly string[]>([]);
  const [dials, setDials] = useState<PieceDials>(DEFAULT_DIALS);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const arena = useMemo(() => buildArena(SCENE), []);
  const races = useMemo(() => drawnRaces(), []);
  const scene = useMemo(() => buildScene(players, races), [players, races]);

  const chosenStates = useMemo(
    () => catalog.filter((e) => states.includes(e.id)),
    [catalog, states],
  );

  // Las fichas, ya en forma de vista: el tablero pide su ArenaPiece y la ficha
  // pide su PieceView, y las dos salen de la misma escena.
  const views = useMemo(() => {
    const out = new Map<string, PieceView>();
    for (const f of scene) {
      out.set(
        f.id,
        toView(f.subject, {
          id: f.id,
          side: f.side,
          role: f.role,
          lifePct: f.lifePct,
          states: chosenStates,
        }),
      );
    }
    return out;
  }, [scene, chosenStates]);

  const pieces = useMemo<ArenaPiece[]>(
    () =>
      scene.map((f) => ({
        id: f.id,
        hex: f.hex,
        side: f.boardSide,
        role: f.role,
        icon: f.subject.icon,
        label: `${f.subject.name} · ${PIECE_SIDES.find((s) => s.id === f.side)?.label ?? ""}`,
      })),
    [scene],
  );

  const boardGeometry = useMemo(() => pieceGeometry(34, ARENA_TILT, dials), [dials]);
  const checks = useMemo(
    () => pieceChecks(boardGeometry, fields, FRAMING_BY_ID[framing]),
    [boardGeometry, fields, framing],
  );
  const failed = checks.filter((c) => !c.ok).length;

  // La tira de tiers: las doce fichas de cada raza dibujada, en su orden de
  // progresión. Van con el bando de su lado en la escena, así que la tira enseña
  // también los dos colores enfrentados.
  const tierGroups = useMemo<readonly TierGroup[]>(
    () => races.map((race, i) => tierGroupOf(race, i === 0 ? "j1" : "enemigo", chosenStates)),
    [races, chosenStates],
  );

  const allViews = useMemo(() => {
    const out = new Map(views);
    for (const group of tierGroups) for (const cell of group.cells) out.set(cell.view.id, cell.view);
    return out;
  }, [views, tierGroups]);

  // La ficha del calibre: la elegida, o el primer héroe de la escena.
  const picked = useMemo(() => {
    const list = [...views.values()];
    return (
      (pickedId ? allViews.get(pickedId) : undefined) ??
      list.find((v) => v.role === "heroe") ??
      list[0]
    );
  }, [views, allViews, pickedId]);

  // La de detrás en el calibre: otra del MISMO bando, que es el caso informativo
  // ahora que el solape está resuelto —dos fichas de la misma raza pegadas, con
  // lo único que las separa siendo el retrato— y no una enemiga, que se
  // distingue sola por el color.
  const behind = useMemo(() => {
    const list = [...views.values()];
    return (
      list.find((v) => v.id !== picked?.id && v.side === picked?.side) ??
      list.find((v) => v.id !== picked?.id)
    );
  }, [views, picked]);

  const toggleField = (id: FieldId) =>
    setFields((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const toggleState = (id: string) =>
    setStates((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= MAX_STATES) return s;
      return [...s, id];
    });

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Ficha de personaje</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La pieza que se pone en el hexágono y{" "}
        <b className="text-[var(--wiki-text)]">anda por él</b> (
        <Link
          href="/docs/v3/board/battle"
          className="text-[var(--wiki-accent)] hover:underline"
        >
          tablero de batalla §5
        </Link>
        ). No es la hoja de datos —eso es{" "}
        <Link href="/dev/personaje" className="text-[var(--wiki-accent)] hover:underline">
          Estadísticas de personaje
        </Link>
        —: es lo que de esa hoja se ve desde arriba y a tamaño de partida.
      </p>
      <p className="mb-3 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">La forma de la casilla, tumbada y plana.</b> La ficha
        es un hexágono con el giro y el aplastado de la arena, un poco más pequeño para que la
        rejilla se siga viendo por debajo. Lo que eso cuesta está medido y no es gratis: un hexágono
        aplastado por 0,67 es más ancho que alto, así que de la ilustración solo cabe el{" "}
        <b className="text-[var(--wiki-text)]">55% de su alto</b> y la figura entera no entra. Y si
        algún día sale la vía 3D de{" "}
        <Link href="/lab/character" className="text-[var(--wiki-accent)] hover:underline">
          /lab/character
        </Link>
        , la figura se pone de pie <i>sobre</i> esta ficha sin tocar su lectura.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">El marco lleva el tier; de quién es lo lleva la casilla</b>{" "}
        <i>(3 de septiembre de 2026)</i>. El color de la ficha es el{" "}
        <b className="text-[var(--wiki-text)]">raíl de Rareza de su tier</b> —el mismo con el que se
        imprime su carta, porque{" "}
        <Link
          href="/docs/v3/game-design"
          className="text-[var(--wiki-accent)] hover:underline"
        >
          la Rareza sale del tier
        </Link>
        —, así que son cinco colores para ocho tiers y los héroes van en su propio raíl. Y de quién
        es la ficha se dice <b className="text-[var(--wiki-text)]">iluminando su hexágono</b>, en
        tres tonos: <b className="text-[var(--wiki-text)]">azul la mía, verde la de un aliado, rojo
        la del enemigo</b>. Con el verde puesto sobra el número del jugador que se había probado —lo
        que hace falta saber de un vistazo es qué puedo mover—, y lo que el color no dice es{" "}
        <i>cuál</i> de los dos aliados: eso es la decisión, no un pendiente. Súbelo a 2 o 3
        jugadores para verlo.
      </p>
      <p className="mb-5 max-w-3xl rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-muted)]">
        <b className="text-[var(--wiki-text)]">Y el marco se apoya en un halo, no en la casilla</b>{" "}
        <i>(5 de septiembre de 2026)</i>. Tres raíles caen en la familia de una casilla —héroe
        sobre rojo, «raro» sobre azul, «poco común» sobre verde— y al medirlos no eran parecidos:
        son <b className="text-[var(--wiki-text)]">el mismo tono y la misma luminosidad</b>, y lo
        único que los separaba en pantalla era que la casilla va al 34% sobre el suelo. Eso se
        estrecha hacia el frente, donde el suelo se aclara (ΔE2000 de 26,7 al fondo a 19,5 delante),
        y el suelo es provisional: es el hueco de la ilustración del campo. Así que el trazo de color
        lleva por fuera un filo casi negro y compara contra él, igual que los rótulos de la arena se
        apoyan en su halo. Cuesta 1 px de casilla iluminada, y la comprobación{" "}
        <i>«Queda casilla que ver después del marco y su halo»</i> lo vigila.
      </p>

      {/* --- Mandos --------------------------------------------------------- */}
      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div
          className="flex flex-col gap-1"
          title="Cuántos grupos entran en la escena. El bando es de uno a tres jugadores (§2) y los tres son de la misma raza, así que con tres hay tres fichas de tres jugadores distintos pegadas en la columna del frente: una con casilla azul —la mía— y dos verdes. Es el caso que hay que mirar, y con un solo jugador no aparece."
        >
          <span className={label}>
            Jugadores · {players * 4} fichas · 👤 vs ⛏️
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={buttonClass({ size: "sm", active: players === n })}
                onClick={() => setPlayers(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col gap-1"
          title="Qué trozo de la ilustración entra en la ficha. Las 24 que hay ponen la figura del 6% al 91% del alto, y un disco tumbado es más ancho que alto, así que el encuadre de la carta no sirve tal cual."
        >
          <span className={label}>Encuadre del retrato</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {FRAMINGS.map((f) => (
              <button
                key={f.id}
                className={buttonClass({ size: "sm", active: framing === f.id })}
                title={f.why}
                onClick={() => setFraming(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* (Aquí estuvo el mando «De quién es la ficha», de tres posiciones:
            iluminar su casilla, el número del jugador, o las dos cosas. Duró
            medio día. Se lo llevó la decisión de darle VERDE a los aliados: con
            tres tonos el número no añade nada, y un mando con una sola posición
            útil no es un mando. Lo que se mira ahora se mira subiendo a 2 o 3
            jugadores, que es cuando aparece el verde.) */}

        <div
          className="flex flex-col gap-1"
          title="La ❤️ Vida como barra flotante debajo de la ficha, además de como cifra. La barra dice cuánto queda DE LO QUE HABÍA, que es la pregunta de un intercambio."
        >
          <span className={label}>Barra de ❤️ Vida</span>
          <div className="flex h-[38px] items-center">
            <InputSwitch checked={lifeBar} onChange={(e) => setLifeBar(!!e.value)} />
          </div>
        </div>

        <div className="ml-auto flex flex-col gap-1">
          <span className={label}>Estado</span>
          <span
            className={`rounded-full border px-3 py-1 text-sm ${
              failed === 0
                ? "border-[var(--wiki-border)] text-[var(--wiki-muted)]"
                : "border-[var(--wiki-danger)] text-[var(--wiki-danger)]"
            }`}
          >
            {failed === 0 ? (
              <>
                <i className="pi pi-check mr-1.5 text-[0.75rem]" />
                cabe todo
              </>
            ) : (
              <>
                <i className="pi pi-exclamation-triangle mr-1.5 text-[0.75rem]" />
                {failed} {failed === 1 ? "medida se pasa" : "medidas se pasan"}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Los datos que suben a la ficha. Se abre con la ficha DESNUDA (3 de
          septiembre de 2026), así que estos botones son los que la visten. */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-baseline gap-2">
          {/* `shrink-0`: al lado hay un párrafo, y sin esto el rótulo se parte
              en tres líneas para dejarle sitio. */}
          <span className={`${label} shrink-0`}>
            Datos en la ficha · {fields.length}
          </span>
          <span className="text-xs text-[var(--wiki-muted)]">
            Se abre <b className="text-[var(--wiki-text)]">sin ninguno</b>: primero la pieza, que es
            lo que está en obras, y encima las cifras. Hearthstone lleva{" "}
            {HEARTHSTONE_FIELDS.length}: ⚔️ Ataque y ❤️ Vida. De las 8 Habilidades solo ❤️ Vida y 👢
            Movimiento cambian durante la batalla.
          </span>
          {/* (Aquí estuvo «Como Hearthstone», un atajo que ponía de golpe ⚔️
              Ataque y ❤️ Vida. Se fue el 3 de septiembre de 2026, el mismo día
              que la ficha pasó a abrir desnuda *(Dario: «quita el apartado ese
              de Como Hearthstone, no tiene sentido ya»)*: era el botón para
              volver al punto de partida de antes, y ese punto de partida ya no
              existe. Los dos siguen a un botón cada uno, ahí abajo, y la
              referencia sigue viva donde importa —la comprobación «no lleva más
              datos que la ficha de Hearthstone»—.) */}
          <Button
            size="sm"
            className="ml-auto shrink-0"
            onClick={() => setFields([])}
            disabled={fields.length === 0}
          >
            Ninguno
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FIELDS.map((f) => (
            <button
              key={f.id}
              className={buttonClass({ size: "sm", active: fields.includes(f.id) })}
              title={`${f.why} — ranura: ${f.slot}`}
              onClick={() => toggleField(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Los estados, del catálogo leído del documento. */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-baseline gap-2">
          <span className={`${label} shrink-0`}>
            Estados encima · {states.length} de {MAX_STATES}
          </span>
          <span className="text-xs text-[var(--wiki-muted)]">
            Los {catalog.length} de{" "}
            <Link href="/docs/v3/effects" className="text-[var(--wiki-accent)] hover:underline">
              effects.md §5
            </Link>
            , leídos del documento. Se los pone a TODAS las fichas a la vez: el caso que hay que
            mirar es el peor.
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {catalog.map((e) => {
            const on = states.includes(e.id);
            return (
              <button
                key={e.id}
                className={buttonClass({ size: "sm", active: on })}
                title={`${e.what} · ${e.duration} turno${e.duration === 1 ? "" : "s"}${
                  e.damagePerTurn === null ? "" : ` · ${e.damagePerTurn}%/turno`
                }`}
                disabled={!on && states.length >= MAX_STATES}
                onClick={() => toggleState(e.id)}
              >
                <span className="mr-1">{e.icon}</span>
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- La escena y lo medido ------------------------------------------ */}
      {/* `items-start`: el tablero es una lámina con su proporción, así que no
          tiene que estirarse para igualar la altura de la columna de al lado. */}
      <div className="mb-4 grid items-start gap-4 lg:grid-cols-[1fr_20rem]">
        <div className={card}>
          <p className={label}>Un ejemplo en el tablero</p>
          <p className="mb-2 mt-1 text-xs text-[var(--wiki-muted)]">
            Un retal de la arena de verdad (6×4, misma geometría y misma cámara) con las fichas{" "}
            <b className="text-[var(--wiki-text)]">en contacto</b>: 👤 Humanos contra ⛏️ Enanos, que
            son las dos razas dibujadas enteras. Lo que hay que mirar es la columna del frente —dos
            fichas de jugadores distintos pegadas— y cuánto tapa la fila de delante a la de detrás.
            El tamaño de la ficha no se elige aquí: lo manda el hexágono.
          </p>
          <ArenaBoard
            arena={arena}
            className="arena__viewport--escena"
            pieces={pieces}
            grid="completa"
            renderPiece={(p, at) => {
              const view = views.get(p.id);
              if (!view) return null;
              return (
                <PieceToken
                  piece={{ ...view, selected: view.id === pickedId }}
                  cx={at.x}
                  cy={at.y}
                  geometry={boardGeometry}
                  framing={framing}
                  fields={fields}
                />
              );
            }}
            // La barra de ❤️ Vida va aparte y por encima de TODAS las fichas: es
            // interfaz, y dentro de su ficha las dos casillas de delante le
            // comerían las puntas (la cuenta está en lib/v3/piece.ts).
            renderPieceOverlay={
              lifeBar
                ? (p, at) => {
                    const view = views.get(p.id);
                    if (!view) return null;
                    return (
                      <PieceLifeBar
                        piece={view}
                        cx={at.x}
                        cy={at.y}
                        geometry={boardGeometry}
                      />
                    );
                  }
                : undefined
            }
            label={() => null}
            onHexClick={(hex) => {
              const found = pieces.find((p) => Hex.equals(p.hex, hex));
              setPickedId(found ? found.id : null);
            }}
          />
        </div>

        <div className={card}>
          {/* Los diales de la forma. */}
          <p className={label}>La forma</p>
          <div className="mt-2 grid gap-2.5">
            <Dial
              label="Ficha"
              value={dials.tile}
              min={0.55}
              max={1}
              step={0.02}
              unit="radios"
              onChange={(tile) => setDials((d) => ({ ...d, tile }))}
              hint="El hexágono de fuera. De partida va a 0,78 —bajó de 0,82 el 3 de septiembre de 2026— porque el aire que deja es por donde asoma la casilla iluminada, o sea lo que dice de quién es la ficha. A 1 llena la casilla y la rejilla desaparece debajo de las fichas: parecen losetas, no fichas encima de un tablero."
            />
            <Dial
              label="Retrato"
              value={dials.face}
              min={0.4}
              max={dials.tile}
              step={0.02}
              unit="radios"
              onChange={(face) => setDials((d) => ({ ...d, face }))}
              hint="La ventana de la ilustración. De partida va a ras del marco: si se mete hacia dentro, entre el retrato y el marco aparece una banda de cartón, que es la que se leía como un segundo borde."
            />
            <Button
              size="sm"
              onClick={() => setDials(DEFAULT_DIALS)}
              disabled={sameDials(dials, DEFAULT_DIALS)}
            >
              Volver a los de partida
            </Button>
          </div>

          {/* Las comprobaciones, pasen o no. */}
          <div className="mt-3 border-t border-[var(--wiki-border)] pt-3">
            <p className={label}>
              Lo medido · {checks.length - failed} de {checks.length}
            </p>
            <ul className="mt-1.5 grid gap-1">
              {checks.map((c) => (
                <li key={c.id} className="text-xs">
                  <div className="flex items-baseline gap-1.5">
                    <i
                      className={`pi ${c.ok ? "pi-check" : "pi-times"} text-[0.65rem] ${
                        c.ok ? "text-[var(--wiki-muted)]" : "text-[var(--wiki-danger)]"
                      }`}
                    />
                    <span
                      className={c.ok ? "text-[var(--wiki-muted)]" : "text-[var(--wiki-danger)]"}
                    >
                      {c.rule}
                    </span>
                    <span className="ml-auto shrink-0 tabular-nums text-[var(--wiki-muted)]">
                      {c.reading}
                    </span>
                  </div>
                  {!c.ok && c.message && (
                    <p className="mt-0.5 pl-4 leading-snug text-[var(--wiki-muted)]">{c.message}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Al calibre ----------------------------------------------------- */}
      <div className={card}>
        <div className="mb-2 flex items-baseline gap-2">
          <p className={`${label} shrink-0`}>Al calibre</p>
          <p className="text-xs text-[var(--wiki-muted)]">
            La misma ficha y el mismo componente, con otro radio de hexágono: al ×
            {(CALIBRE_HEX / 34).toFixed(1)} para mirarla de cerca, y al ×
            {(STRIP_HEX / 34).toFixed(1)} las veinticuatro seguidas para ver si el encuadre vale
            para todas.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
          <div>
            {picked && (
              <>
                <PieceCalibre
                  className="ficha-calibre"
                  piece={picked}
                  behind={behind}
                  hexSize={CALIBRE_HEX}
                  tilt={ARENA_TILT}
                  dials={dials}
                  framing={framing}
                  fields={fields}
                  lifeBar={lifeBar}
                />
                <p className="mt-1.5 text-sm text-[var(--wiki-text)]">
                  {picked.icon} {picked.name}
                  {picked.tier !== undefined && (
                    <span className="text-[var(--wiki-muted)]"> · tier {picked.tier}</span>
                  )}
                </p>
                <p className="text-xs text-[var(--wiki-muted)]">
                  {picked.art ? (
                    <>Con ilustración. {FRAMING_BY_ID[framing].why}</>
                  ) : (
                    <>
                      <b className="text-[var(--wiki-text)]">Sin ilustración</b>: su raza no está
                      dibujada, así que la ficha cae al emoji. Son 108 de 132.
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-[var(--wiki-muted)]">
                  Pincha una ficha —de la escena o de la tira— para traerla aquí. La de detrás está
                  en fantasma para ver cuánto la tapa.
                </p>
              </>
            )}
          </div>

          <div>
            <PieceTierStrip
              groups={tierGroups}
              hexSize={STRIP_HEX}
              tilt={ARENA_TILT}
              dials={dials}
              framing={framing}
              fields={fields}
              lifeBar={lifeBar}
              pickedId={picked?.id ?? null}
              onPick={setPickedId}
            />
            <p className="mt-2 text-xs text-[var(--wiki-muted)]">
              La progresión entera de las dos razas dibujadas, tier 1 → 8, y sus cuatro héroes —que
              no tienen tier—. Cuatro cosas se ven aquí y no en una ficha suelta: si el{" "}
              <b className="text-[var(--wiki-text)]">encuadre</b> cae bien en las doce o solo en la
              que se eligió, si las doce se{" "}
              <b className="text-[var(--wiki-text)]">distinguen entre sí</b>, cómo sube el{" "}
              <b className="text-[var(--wiki-text)]">color del tier</b> por la progresión —son cinco
              raíles para ocho tiers, así que hay tres parejas que comparten color, y los héroes van
              en el suyo—, y que la ❤️ Vida llega a{" "}
              <b className="text-[var(--wiki-text)]">tres cifras</b> al final de la progresión y
              empieza con dos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Un dial con su lectura y el porqué de su recorrido. */
function Dial({
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint: string;
  onChange: (v: number) => void;
}) {
  return (
    <div title={hint}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-[var(--wiki-text)]">{label}</span>
        <span className="tabular-nums text-[var(--wiki-muted)]">
          {value.toFixed(2).replace(".", ",")} {unit}
        </span>
      </div>
      <Slider
        className="mt-1"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => typeof e.value === "number" && onChange(e.value)}
      />
    </div>
  );
}

// --- El reparto -------------------------------------------------------------

/**
 * 👤 HUMANOS CONTRA ⛏️ ENANOS, y no es una elección de sabor *(Dario, 1 de
 * septiembre de 2026)*: son las dos únicas razas DIBUJADAS ENTERAS —doce
 * archivos cada una, public/assets/v3/README.md— y esta pantalla se mira, así
 * que una raza a emoji no enseña nada de lo que hay que juzgar. Las otras nueve
 * entran cuando tengan arte.
 */
function drawnRaces(): readonly DeckRace[] {
  const humanos = DECK_RACES.find((r) => r.name === "Humanos");
  const enanos = DECK_RACES.find((r) => r.name === "Enanos");
  if (!humanos || !enanos) {
    // Si a `races.ts` le cambian los nombres, mejor reventar aquí que pintar
    // fichas a emoji sin decir por qué (ARCHITECTURE.md §7: fallar alto).
    throw new Error(
      "PieceModule: faltan 👤 Humanos o ⛏️ Enanos en DECK_RACES, que son las dos razas dibujadas.",
    );
  }
  return [humanos, enanos];
}

/**
 * La escena: dos fichas por grupo y por bando —el héroe y una unidad—, colocadas
 * en contacto. Los tres grupos de un bando son de la misma raza, y eso es lo
 * bueno del reparto: lo único que separa las de uno de las de otro es la marca de
 * bando, que es exactamente el caso que battle.md §8 tiene pendiente.
 */
function buildScene(players: number, races: readonly DeckRace[]): readonly SceneFicha[] {
  const [allies, foes] = races;
  const out: SceneFicha[] = [];

  for (const boardSide of ["propio", "enemigo"] as const) {
    const race = boardSide === "propio" ? allies : foes;
    const slots = boardSide === "propio" ? ALLY_SLOTS : FOE_SLOTS;
    for (let group = 1; group <= players; group++) {
      const unit = race.units[UNIT_BY_GROUP[(group - 1) % UNIT_BY_GROUP.length]];
      const roles = [
        { role: "heroe" as const, subject: race.heroes[(group - 1) % race.heroes.length] },
        { role: "unidad" as const, subject: unit },
      ];
      roles.forEach(({ role, subject }, i) => {
        const slot = slots[(group - 1) * 2 + i];
        out.push({
          id: `${boardSide === "propio" ? "j" : "e"}${group}-${role}`,
          side: boardSide === "enemigo" ? "enemigo" : (`j${group}` as PieceSideId),
          boardSide,
          role,
          hex: Hex.offsetToAxial(slot),
          subject,
          lifePct: LIFE_PATTERN[out.length % LIFE_PATTERN.length],
        });
      });
    }
  }
  return out;
}

/** Las doce fichas de una raza en su orden de progresión, más sus héroes. */
function tierGroupOf(
  race: DeckRace,
  side: PieceSideId,
  states: readonly Effect[],
): TierGroup {
  const units = [...race.units].sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0));
  const cells = [...units, ...race.heroes].map((subject, i) => ({
    view: toView(subject, {
      id: `tira-${subject.id}`,
      side,
      role: subject.kind === "heroe" ? ("heroe" as const) : ("unidad" as const),
      lifePct: LIFE_PATTERN[i % LIFE_PATTERN.length],
      states,
    }),
    rank: subject.tier === undefined ? "Héroe" : `Tier ${subject.tier}`,
  }));
  return { id: race.name, label: `${race.icon} ${race.name}`, cells };
}

/** El sujeto en la vista que pinta PieceToken. */
function toView(
  subject: Subject,
  meta: {
    id: string;
    side: PieceSideId;
    role: "heroe" | "unidad";
    lifePct: number;
    states: readonly Effect[];
  },
): PieceView {
  const vidaMax = subject.skills.vida;
  return {
    id: meta.id,
    name: subject.name,
    side: meta.side,
    role: meta.role,
    tier: subject.tier,
    icon: subject.icon,
    art: subject.art,
    // El tipo de daño lo pone el SUJETO y no el reparto de la escena: aquí se
    // juzga la ficha de una unidad concreta, y su tipo de daño es un dato de
    // razas.md. El reparto de tipos por bando es cosa del §3, no de esta pieza.
    damage:
      subject.damage === "cuerpo"
        ? "cuerpo-a-cuerpo"
        : subject.damage === "distancia"
          ? "a-distancia"
          : "magico",
    // EL COLOR DE LA FICHA, y viene del sujeto ya resuelto: `races.ts` guarda en
    // cada uno el raíl de $rarity que le da `rarityForTier()` —o el del héroe, que
    // no tiene tier—, o sea el mismo con el que se imprime su carta. Aquí no se
    // vuelve a calcular a propósito: si la carta y la ficha sacaran el color de
    // dos sitios, podrían dejar de coincidir sin que nadie se enterara.
    rarity: subject.rarity,
    vida: Math.max(1, Math.round((vidaMax * meta.lifePct) / 100)),
    vidaMax,
    ataque: subject.skills.ataque,
    movimiento: subject.skills.movimiento,
    states: meta.states.map((e) => ({ id: e.id, icon: e.icon })),
  };
}

function sameDials(a: PieceDials, b: PieceDials): boolean {
  return a.tile === b.tile && a.face === b.face;
}
