"use client";

// =========================================================================
// Módulo «Tableros» de /dev — la arena de batalla de V3
//
// El primer trozo de V3 que existe en código, y hoy cubre lo que battle.md deja
// escrito sin necesitar una sola Habilidad:
//   · la GEOMETRÍA del §1 —hexágonos, las dos bandas, las distancias—,
//   · el FORMATO del §2 —de uno a tres jugadores, cinco fichas cada uno—,
//   · el DESPLIEGUE del §3 —colocación libre en la banda del bando—,
//   · y el RITMO DE LA APROXIMACIÓN del §1.1, que es la pregunta que el diseño
//     dejó apoyada en esta geometría.
//
// Falta la iniciativa (§4) y el ataque (§4 de game-design.md): eso sí necesita
// los valores de las 8 Habilidades, que siguen pendientes (docs/v3/status.md §2).
//
// LO QUE ESTA PANTALLA ESTÁ MIDIENDO, porque es su único trabajo de verdad, y
// cambió el 27 de agosto de 2026 con el tablero:
//
//   · Cuánto dura la aproximación. Ya NO se comprueba si sale la tabla vieja del
//     §1.1 —el 🏹 abriendo en la ronda 1 sobre 7×5—: con frentes a 11 la
//     aproximación larga es la intención, así que se enseña lo que dura y en qué
//     orden entra cada tipo de daño, sin aprobado.
//   · Si el que corre alcanza al que dispara (§1.2). Esta sí tiene suspenso: con
//     👢 Movimiento igual para todos, el 🏹 dispara y retrocede para siempre y en
//     un tablero grande no hay borde que lo acorrale. Por eso 👢 Movimiento se
//     reparte por tipo de daño y por eso el mando son tres y no uno.
//   · Si la banda da para el bando. Con tres jugadores son quince fichas en
//     veinticuatro hexágonos, y eso se ve colocándolas.
//
// Todo son distancias, así que se puede medir sin fichas de verdad: lo hace
// ArenaTempo con lib/v3/tempo.ts, y el resultado se lee en pantalla en vez de
// quedarse en un comentario.
//
// El aspecto sale de la dirección de arte (public/concepts/oldenEra/3.png) y
// vive en ArenaBoard; aquí solo se elige qué se le pide.
//
// Ninguna regla de juego vive aquí (ARCHITECTURE.md §6): lo que se decide se
// decide en lib/v3/, y este componente solo tiene estado de interfaz.
// =========================================================================

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { SelectButton } from "primereact/selectbutton";
import { InputSwitch } from "primereact/inputswitch";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import * as Hex from "@/lib/v3/hex";
import type { HexCoord } from "@/lib/v3/hex";
import {
  ARENA,
  ARENA_SIZES,
  FIGURES_PER_PLAYER,
  PLAYERS_MAX,
  buildArena,
  contains,
  frontColumn,
  sideOf,
  sizeLabel,
  specProblem,
  within,
  type ArenaSpec,
} from "@/lib/v3/arena";
import { DAMAGE_TYPES, DAMAGE_TYPE_IDS, type DamageTypeId } from "@/lib/v3/damage";
import {
  autoDeploy,
  buildRoster,
  clear,
  figureName,
  hexOf,
  mirror,
  place,
  placementProblem,
  type Deployment,
  type Roster,
} from "@/lib/v3/deployment";
import { LAB_MOVEMENT, firstAttackRound, type MovementByType } from "@/lib/v3/tempo";
import ArenaBoard, { type ArenaPiece, type ArenaRegion } from "./ArenaBoard";
import ArenaRoster from "./ArenaRoster";
import ArenaTempo from "./ArenaTempo";
import { buttonClass } from "@/components/ui/Button";

type LabelMode = "ninguno" | "columna" | "axial" | "distancia";

// Sin `readonly`: el <SelectButton> de PrimeReact pide un array mutable
// (SelectItem[]), así que marcarlo no compila.
const LABEL_MODES: { value: LabelMode; label: string }[] = [
  { value: "ninguno", label: "Ninguno" },
  { value: "columna", label: "Col · fila" },
  { value: "axial", label: "Axial" },
  { value: "distancia", label: "Distancia" },
];

type GridMode = "completa" | "regiones" | "ninguna";

const GRID_MODES: { value: GridMode; label: string }[] = [
  { value: "completa", label: "Completa" },
  { value: "regiones", label: "Solo regiones" },
  { value: "ninguna", label: "Ninguna" },
];

/** Los topes de los mandos. El mínimo es el tamaño mínimo, no menos. */
const COLS_MIN = ARENA_SIZES[0].cols;
const ROWS_MIN = ARENA_SIZES[0].rows;
const COLS_MAX = ARENA_SIZES[ARENA_SIZES.length - 1].cols + 2;
const ROWS_MAX = ARENA_SIZES[ARENA_SIZES.length - 1].rows + 2;

export default function ArenaModule() {
  const [spec, setSpec] = useState<ArenaSpec>(ARENA);
  const [tilted, setTilted] = useState(true);
  const [labelMode, setLabelMode] = useState<LabelMode>("distancia");
  const [gridMode, setGridMode] = useState<GridMode>("completa");
  const [showBands, setShowBands] = useState(true);
  const [showEnemy, setShowEnemy] = useState(true);
  const [reachType, setReachType] = useState<DamageTypeId | null>("a-distancia");
  const [pinned, setPinned] = useState<HexCoord | null>(null);

  // 👢 Movimiento por tipo de daño (battle.md §1.1). Tres valores y no uno: el
  // reparto está decidido, los números son diales de laboratorio.
  const [movement, setMovement] = useState<MovementByType>(LAB_MOVEMENT);

  // --- El bando y su despliegue --------------------------------------------
  // El roster es estado por dos motivos: el tipo de daño de cada ficha se puede
  // cambiar aquí —es lo único decidido de una ficha, y es lo que hace que
  // colocarla sea una decisión (§3)— y el NÚMERO DE JUGADORES se elige, así que
  // el bando entero se reconstruye al cambiarlo (`buildRoster`). Nada más de la
  // ficha existe todavía.
  const [roster, setRoster] = useState<Roster>(() => buildRoster(1));
  const [stored, setStored] = useState<Deployment>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);

  const players = useMemo(() => new Set(roster.map((f) => f.owner)).size, [roster]);

  // La banda tiene que dar para el bando entero, así que el problema de medidas
  // depende de cuántas fichas hay: con tres jugadores son quince.
  const problem = specProblem(spec, roster.length);
  const arena = useMemo(() => (problem ? null : buildArena(spec)), [spec, problem]);

  // Se DERIVA en vez de restablecerse desde un efecto, igual que el origen: al
  // achicar el tablero una ficha puede quedarse fuera de la banda, y entonces
  // deja de estar desplegada sin más. Si el tablero vuelve a crecer, vuelve —lo
  // que se guarda es la intención, y esto solo enseña lo que hoy es legal—. Al
  // bajar de jugadores pasa lo mismo con las fichas que ya no existen.
  const deployment = useMemo<Deployment>(
    () =>
      arena
        ? stored.filter(
            (p) =>
              contains(arena, p.hex) &&
              sideOf(spec, p.hex) === "propio" &&
              roster.some((f) => f.id === p.figureId),
          )
        : [],
    [arena, spec, stored, roster],
  );

  const selected = selectedId ? (roster.find((f) => f.id === selectedId) ?? null) : null;
  const selectedHex = selectedId ? hexOf(deployment, selectedId) : null;

  // El origen por defecto: el frente de tu propia banda, en la fila de en medio.
  // Es desde donde el §1.1 mide los tres alcances, así que el módulo abre
  // enseñando la afirmación del documento en vez de un tablero mudo.
  const defaultOrigin = useMemo(
    () =>
      Hex.offsetToAxial({
        col: frontColumn(spec, "propio"),
        row: Math.floor(spec.rows / 2),
      }),
    [spec],
  );

  // Con una ficha elegida y puesta, se mide DESDE ELLA: lo que interesa
  // entonces es qué amenaza esa criatura, no una casilla cualquiera.
  const origin =
    selectedHex ?? (pinned && arena && contains(arena, pinned) ? pinned : defaultOrigin);

  // Y el alcance que se dibuja es el suyo, no el del mando.
  const shownReach = selected ? selected.damage : reachType;

  const reachHexes = useMemo(
    () => (arena && shownReach ? within(arena, origin, DAMAGE_TYPES[shownReach].range) : []),
    [arena, shownReach, origin],
  );

  // La columna del frente enemigo, fila a fila: es contra ella contra la que se
  // mide el ritmo, porque es donde el rival puede estar esperando (§1.1).
  const enemyFront = useMemo(
    () =>
      Array.from({ length: spec.rows }, (_, row) =>
        Hex.offsetToAxial({ col: frontColumn(spec, "enemigo"), row }),
      ),
    [spec],
  );

  const roundOf = useCallback(
    (figureId: string): number | null => {
      const hex = hexOf(deployment, figureId);
      const figure = roster.find((f) => f.id === figureId);
      if (!hex || !figure) return null;
      const distance = Math.min(...enemyFront.map((h) => Hex.distance(hex, h)));
      return firstAttackRound(
        distance,
        DAMAGE_TYPES[figure.damage].range,
        movement[figure.damage],
      );
    },
    [deployment, roster, enemyFront, movement],
  );

  const pieces = useMemo<ArenaPiece[]>(() => {
    if (!arena) return [];
    const describe = (id: string) => {
      const f = roster.find((x) => x.id === id);
      if (!f) return null;
      const t = DAMAGE_TYPES[f.damage];
      // Con más de un jugador el nombre solo se distingue por el dueño: hay tres
      // fichas que se llaman «Héroe».
      const name = players > 1 ? figureName(f) : f.label;
      return { figure: f, icon: t.icon, text: `${name} · ${t.icon} ${t.label} ${t.range}` };
    };

    const own: ArenaPiece[] = [];
    for (const p of deployment) {
      const d = describe(p.figureId);
      if (!d) continue;
      own.push({
        id: `propio-${p.figureId}`,
        hex: p.hex,
        side: "propio",
        role: d.figure.role,
        icon: d.icon,
        label: d.text,
        selected: selectedId === p.figureId,
      });
    }
    if (!showEnemy) return own;

    // Enfrente, el mismo bando reflejado: es con lo que se mide, y es la
    // situación con la que el §1.1 calculó los alcances (dos frentes mirándose).
    const foes: ArenaPiece[] = [];
    for (const p of mirror(arena, deployment)) {
      const d = describe(p.figureId);
      if (!d) continue;
      foes.push({
        id: `enemigo-${p.figureId}`,
        hex: p.hex,
        side: "enemigo",
        role: d.figure.role,
        icon: d.icon,
        label: `Enfrente · ${d.text}`,
      });
    }
    return [...own, ...foes];
  }, [arena, deployment, roster, players, selectedId, showEnemy]);

  const regions = useMemo<ArenaRegion[]>(() => {
    if (!arena) return [];
    const out: ArenaRegion[] = [];
    if (showBands) {
      out.push({ id: "banda-propia", kind: "propio", hexes: arena.bands.propio });
      out.push({ id: "banda-enemiga", kind: "enemigo", hexes: arena.bands.enemigo });
    }
    if (reachHexes.length) out.push({ id: "alcance", kind: "alcance", hexes: reachHexes });
    return out;
  }, [arena, showBands, reachHexes]);

  const distances = useMemo(
    () => (arena ? new Map(arena.hexes.map((h) => [Hex.key(h), Hex.distance(origin, h)])) : null),
    [arena, origin],
  );

  // Un clic significa dos cosas distintas, y la ficha elegida es lo que decide
  // cuál: con ficha, colocar; sin ficha, medir. Así no hace falta un mando de
  // «modo» —la selección ya lo dice— y la herramienta de medir no desaparece.
  const handleHexClick = (hex: HexCoord) => {
    if (!arena) return;
    if (!selectedId) {
      setPinned(hex);
      setRefusal(null);
      return;
    }
    const why = placementProblem(arena, "propio", roster, deployment, selectedId, hex);
    if (why) {
      setRefusal(why);
      return;
    }
    const next = place(deployment, selectedId, hex);
    setStored(next);
    setRefusal(null);
    // Y se pasa sola a la siguiente sin colocar: desplegar son cinco clics, no
    // cinco parejas de clics.
    const pending = roster.find((f) => !next.some((p) => p.figureId === f.id));
    setSelectedId(pending?.id ?? null);
  };

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  const hexLabel = (hex: HexCoord): string | null => {
    switch (labelMode) {
      case "ninguno":
        return null;
      case "columna": {
        const { col, row } = Hex.axialToOffset(hex);
        return `${col},${row}`;
      }
      case "axial":
        return `${hex.q},${hex.r}`;
      case "distancia":
        return String(distances?.get(Hex.key(hex)) ?? "");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Tablero de batalla</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La arena de{" "}
        <Link href="/docs/v3/board/battle" className="text-[var(--wiki-accent)] hover:underline">
          battle.md
        </Link>{" "}
        en código: la rejilla y las bandas del §1, el formato de bando del §2, el despliegue libre
        del §3 y el ritmo de la aproximación del §1.1. El juego es{" "}
        <b className="text-[var(--wiki-text)]">co-op de uno a tres jugadores</b>, cada uno con su
        héroe y hasta cuatro unidades, y el tablero{" "}
        <b className="text-[var(--wiki-text)]">no se ata al formato</b>: se juega igual de grande
        con uno que con tres. Se juega además{" "}
        <b className="text-[var(--wiki-text)]">a campo abierto</b> —sin terreno ni obstáculos— por
        decisión del §7, así que aquí no hay coste de movimiento ni casillas bloqueadas.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El aspecto sigue la dirección de arte de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          concepts/oldenEra/3.png
        </code>
        : el suelo es una <b className="text-[var(--wiki-text)]">lámina continua</b> —el hueco donde
        entrará la ilustración— y los hexágonos son trazo por encima, con las áreas marcadas por su
        contorno y no por un relleno. El bando va en el contorno y en el aro de cada ficha, porque
        un suelo ilustrado no puede llevar color de bando.
      </p>

      {/* --- Mandos --- */}
      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div
          className="flex flex-col gap-1"
          title="El juego es co-op de uno a tres jugadores, cada uno con su héroe y hasta 4 unidades (battle.md §2). Jugar solo es el mismo juego con un jugador. El tablero NO se ata al formato: se juega igual de grande con uno que con tres."
        >
          <span className={label}>Jugadores</span>
          <div className="flex items-center gap-2">
            {Array.from({ length: PLAYERS_MAX }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={buttonClass({ active: players === n })}
                title={`${n} ${n === 1 ? "jugador" : "jugadores"} · ${n * FIGURES_PER_PLAYER} fichas por bando`}
                onClick={() => {
                  setRoster(buildRoster(n));
                  setSelectedId(null);
                  setRefusal(null);
                }}
              >
                {n}
                <span className="ml-1 opacity-60">{n * FIGURES_PER_PLAYER} fichas</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Tamaño</span>
          <div className="flex flex-wrap items-center gap-2">
            {ARENA_SIZES.map((s, i) => (
              <button
                key={sizeLabel(s)}
                className={buttonClass({
                  active:
                    spec.cols === s.cols && spec.rows === s.rows && spec.bandDepth === s.bandDepth,
                })}
                title={
                  (i === 0 ? "El mínimo. " : "") +
                  `${s.cols * s.rows} hexágonos, frentes a ${buildArena(s).frontDistance}.`
                }
                onClick={() => setSpec(s)}
              >
                {sizeLabel(s)}
                {i === 0 && <span className="ml-1 opacity-60">mín</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-44 flex-col gap-1">
          <span className={label}>Columnas · {spec.cols}</span>
          <Slider
            value={spec.cols}
            min={COLS_MIN}
            max={COLS_MAX}
            onChange={(e: SliderChangeEvent) =>
              typeof e.value === "number" && setSpec((s) => ({ ...s, cols: e.value as number }))
            }
          />
        </div>

        <div className="flex w-44 flex-col gap-1">
          <span className={label}>Filas · {spec.rows}</span>
          <Slider
            value={spec.rows}
            min={ROWS_MIN}
            max={ROWS_MAX}
            onChange={(e: SliderChangeEvent) =>
              typeof e.value === "number" && setSpec((s) => ({ ...s, rows: e.value as number }))
            }
          />
        </div>

        <div
          className="flex flex-col gap-1"
          title="Cuántas columnas ocupa cada banda de despliegue. El documento dice 2."
        >
          <span className={label}>Banda</span>
          <SelectButton
            value={spec.bandDepth}
            onChange={(e) =>
              typeof e.value === "number" && setSpec((s) => ({ ...s, bandDepth: e.value }))
            }
            options={[1, 2, 3]}
            allowEmpty={false}
          />
        </div>

        <div
          className="flex flex-col gap-1"
          title="Los tres alcances fijos por tipo de daño (game-design.md §4.3). Con una ficha elegida se enseña el suyo; sin ninguna, el de este mando, medido desde el hexágono de origen."
        >
          <span className={label}>Alcance</span>
          <SelectButton
            value={shownReach}
            disabled={Boolean(selected)}
            onChange={(e) => setReachType((e.value ?? null) as DamageTypeId | null)}
            options={DAMAGE_TYPE_IDS.map((id) => ({
              value: id,
              label: `${DAMAGE_TYPES[id].icon} ${DAMAGE_TYPES[id].range}`,
            }))}
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div
          className="flex flex-col gap-1"
          title="En la referencia la rejilla NO está siempre: aparece solo sobre el área que la ficha activa puede pisar, y el resto del campo es ilustración limpia. «Completa» es la vista de trabajo."
        >
          <span className={label}>Rejilla</span>
          <SelectButton
            value={gridMode}
            onChange={(e) => e.value && setGridMode(e.value as GridMode)}
            options={GRID_MODES}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Rótulo</span>
          <SelectButton
            value={labelMode}
            onChange={(e) => e.value && setLabelMode(e.value as LabelMode)}
            options={LABEL_MODES}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-[var(--wiki-text)]">
            <InputSwitch checked={showBands} onChange={(e) => setShowBands(Boolean(e.value))} />
            Bandas
          </label>
          <label
            className="flex items-center gap-2 text-sm text-[var(--wiki-text)]"
            title="Pone enfrente tu mismo bando reflejado, para tener contra qué medir. No es un enemigo de verdad: el bando enemigo se compone aparte (§2)."
          >
            <InputSwitch checked={showEnemy} onChange={(e) => setShowEnemy(Boolean(e.value))} />
            Bando enemigo
          </label>
          <label
            className="flex items-center gap-2 text-sm text-[var(--wiki-text)]"
            title="La compresión vertical de la cámara. 0,67 es el valor medido sobre la referencia; apagarlo pone el tablero a plomo, que va mejor para contar casillas."
          >
            <InputSwitch checked={tilted} onChange={(e) => setTilted(Boolean(e.value))} />
            Inclinado
          </label>
        </div>
      </div>

      {/* --- Lecturas --- */}
      {problem && (
        <div className="mb-4 rounded-lg border border-[var(--wiki-danger)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
          <i className="pi pi-exclamation-triangle mr-2 text-[var(--wiki-danger)]" />
          {problem}
        </div>
      )}

      {arena && (
        <>
          <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--wiki-text)]">
            <span>
              <b>{arena.hexes.length}</b> hexágonos
            </span>
            <span
              title={`${FIGURES_PER_PLAYER} fichas por jugador —su héroe y cuatro unidades— y la banda es del bando, no del jugador (battle.md §2 y §3).`}
            >
              <b>{arena.bands.propio.length}</b> por banda, para <b>{roster.length}</b> fichas
              {roster.length > arena.bands.propio.length / 2 && (
                <span className="ml-1 opacity-70">· la banda se llena</span>
              )}
            </span>
            <span title="De la última columna de tu banda a la primera de la enemiga, dentro de la misma fila. Es la distancia que mide la aproximación (§1.1).">
              frentes a <b>{arena.frontDistance}</b> hexágonos
            </span>
            <span>
              campo de en medio:{" "}
              <b>{arena.hexes.length - arena.bands.propio.length - arena.bands.enemigo.length}</b>
            </span>
          </div>

          {/* Lo que el diseño da por hecho, medido de verdad sobre estas
              medidas. Va en su propia caja porque no es una descripción del
              tablero: es una comprobación, y con los mandos se puede ver
              rompiéndose. */}
          <ArenaTempo
            arena={arena}
            movement={movement}
            onMovementChange={(id, value) => setMovement((m) => ({ ...m, [id]: value }))}
            className={`${card} mb-4`}
          />

          {/* --- El bando --- */}
          <ArenaRoster
            roster={roster}
            deployment={deployment}
            selectedId={selectedId}
            roundOf={roundOf}
            refusal={refusal}
            className={`${card} mb-4`}
            onSelect={(id) => {
              setSelectedId(id);
              setRefusal(null);
            }}
            onDamage={(id, damage) =>
              setRoster((r) => r.map((f) => (f.id === id ? { ...f, damage } : f)))
            }
            onLift={(id) => {
              setStored((d) => clear(d, id));
              setRefusal(null);
            }}
            onAuto={() => {
              setStored(autoDeploy(arena, roster, "propio"));
              setSelectedId(null);
              setRefusal(null);
            }}
            onEmpty={() => {
              setStored([]);
              setRefusal(null);
            }}
          />

          {/* --- El tablero --- */}
          <div className={`arena ${card}`}>
            <ArenaBoard
              arena={arena}
              tilt={tilted ? undefined : 1}
              regions={regions}
              pieces={pieces}
              grid={gridMode}
              origin={origin}
              label={hexLabel}
              onHexClick={handleHexClick}
            />

            <div className="arena__legend">
              <span className="arena__legend-item">
                <span className="arena__swatch" data-kind="suelo" />
                Suelo (hueco de la ilustración)
              </span>
              <span className="arena__legend-item">
                <span className="arena__swatch" />
                Rejilla
              </span>
              {showBands && (
                <>
                  <span className="arena__legend-item">
                    <span className="arena__swatch" data-kind="propio" />
                    Banda propia ({arena.bands.propio.length} hex)
                  </span>
                  <span className="arena__legend-item">
                    <span className="arena__swatch" data-kind="enemigo" />
                    Banda enemiga ({arena.bands.enemigo.length} hex)
                  </span>
                </>
              )}
              {deployment.length > 0 && (
                <span className="arena__legend-item">
                  <span className="arena__swatch" data-kind="ficha-propia" />
                  El bando ({deployment.length}) · ★ {players > 1 ? "los héroes" : "el héroe"}
                </span>
              )}
              {showEnemy && deployment.length > 0 && (
                <span className="arena__legend-item">
                  <span className="arena__swatch" data-kind="ficha-enemiga" />
                  Enfrente, reflejadas
                </span>
              )}
              {shownReach && (
                <span className="arena__legend-item">
                  <span className="arena__swatch" data-kind="alcance" />
                  Alcance {DAMAGE_TYPES[shownReach].icon} {DAMAGE_TYPES[shownReach].range} (
                  {reachHexes.length} hex)
                </span>
              )}
              <span className="arena__legend-item">
                <span className="arena__swatch" data-kind="origen" />
                Desde aquí se mide
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[var(--wiki-muted)]">
            {selected ? (
              <>
                <b className="text-[var(--wiki-text)]">{selected.label}</b> elegida: pulsa un
                hexágono de tu banda para {selectedHex ? "moverla" : "colocarla"}. Vuelve a pulsar
                su fila para soltarla y seguir midiendo.
              </>
            ) : (
              <>Pulsa cualquier hexágono para medir desde él, o elige una ficha para colocarla.</>
            )}{" "}
            Rueda para acercar, arrastre para moverse —solo por encima del 100 %—, flechas si no hay
            ratón.
          </p>
        </>
      )}

      {/* --- Lo que falta, dicho en la propia pantalla --- */}
      <div className={`${card} mt-8 text-sm`}>
        <div className="mb-2 font-semibold text-[var(--wiki-text)]">Lo siguiente</div>
        <ul className="grid gap-1 text-[var(--wiki-muted)]">
          <li>
            <b className="text-[var(--wiki-text)]">La ilustración del campo</b>: entra por{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">groundImage</code>
            , una lámina con la silueta del tablero entero. Con ella llegan los obstáculos, que en
            la referencia van pintados en el suelo (rocas, charcos, matojos) — y eso reabre el §7,
            hoy aplazado.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">El movimiento</b>: falta{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
              lib/v3/movement.ts
            </code>{" "}
            —qué hexágonos alcanza una ficha, sin atravesar a nadie (§5)—. Es lo único del tablero
            que está especificado al 100 % y no espera ningún dato: coste 1 por casilla, porque no
            hay terreno.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">El bando enemigo de verdad</b>: hoy enfrente hay
            un reflejo del tuyo, que sirve para medir y para nada más. El §2 le da dos formas
            —héroe enemigo con sus unidades, o criaturas sin héroe— con dos condiciones de victoria
            distintas, pero antes hace falta una decisión que no está tomada:{" "}
            <b className="text-[var(--wiki-text)]">cuántas fichas trae la máquina</b> contra uno,
            dos o tres jugadores, y cuántos héroes enemigos (§2 y §8).
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">Iniciativa y turno</b>: hasta 30 fichas en una
            sola lista, mover hasta 👢 Movimiento y atacar en cualquier orden (§4 y §5). Esto sí
            necesita fichas con valores: los tres mandos de 👢 Movimiento de arriba son diales de
            laboratorio, no datos — lo decidido es el reparto (🗡️ alto, 🏹 bajo), no los números.
          </li>
        </ul>
      </div>
    </div>
  );
}
