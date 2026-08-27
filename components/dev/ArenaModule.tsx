"use client";

// =========================================================================
// Módulo «Tableros» de /dev — la arena de batalla de V3
//
// El primer trozo de V3 que existe en código, y hoy cubre lo que battle.md deja
// escrito sin necesitar una sola Habilidad:
//   · la GEOMETRÍA del §1 —hexágonos, las dos bandas, las distancias—,
//   · el DESPLIEGUE del §3 —cinco fichas colocadas libremente en tu banda—,
//   · y el RITMO del §1.1 recalculado, que es la pregunta que el diseño dejó
//     apoyada en esta geometría.
//
// Falta la iniciativa (§4) y el ataque (§4 de game-design.md): eso sí necesita
// los valores de las 8 Habilidades, que siguen pendientes (docs/v3/status.md §2).
//
// LO QUE ESTA PANTALLA ESTÁ MIDIENDO, porque es su único trabajo de verdad: el
// §1.1 declaró los tres alcances (🗡️ 1 · ✨ 2 · 🏹 4) validados sobre 7×5 con
// frentes a 4, y el tamaño mínimo pasó a ser 14×12, donde los frentes quedan a
// 11. Son distancias, así que se pueden medir sin fichas de verdad: lo hace
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
  DESIGNED_FRONT_DISTANCE,
  FIGURES_PER_SIDE,
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
  SAMPLE_ROSTER,
  autoDeploy,
  clear,
  hexOf,
  mirror,
  place,
  placementProblem,
  type Deployment,
  type Roster,
} from "@/lib/v3/deployment";
import { IMPLIED_MOVEMENT, firstAttackRound } from "@/lib/v3/tempo";
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
  const [movement, setMovement] = useState(IMPLIED_MOVEMENT);

  const problem = specProblem(spec);
  const arena = useMemo(() => (problem ? null : buildArena(spec)), [spec, problem]);

  // --- El bando y su despliegue --------------------------------------------
  // El roster es estado porque su tipo de daño se puede cambiar aquí: es lo
  // único decidido de una ficha, y es lo que hace que colocarla sea una
  // decisión (§3). Nada más de la ficha existe todavía.
  const [roster, setRoster] = useState<Roster>(SAMPLE_ROSTER);
  const [stored, setStored] = useState<Deployment>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);

  // Se DERIVA en vez de restablecerse desde un efecto, igual que el origen: al
  // achicar el tablero una ficha puede quedarse fuera de la banda, y entonces
  // deja de estar desplegada sin más. Si el tablero vuelve a crecer, vuelve —lo
  // que se guarda es la intención, y esto solo enseña lo que hoy es legal—.
  const deployment = useMemo<Deployment>(
    () =>
      arena
        ? stored.filter((p) => contains(arena, p.hex) && sideOf(spec, p.hex) === "propio")
        : [],
    [arena, spec, stored],
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
      return firstAttackRound(distance, DAMAGE_TYPES[figure.damage].range, movement);
    },
    [deployment, roster, enemyFront, movement],
  );

  const pieces = useMemo<ArenaPiece[]>(() => {
    if (!arena) return [];
    const describe = (id: string) => {
      const f = roster.find((x) => x.id === id);
      if (!f) return null;
      const t = DAMAGE_TYPES[f.damage];
      return { figure: f, icon: t.icon, text: `${f.label} · ${t.icon} ${t.label} ${t.range}` };
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
  }, [arena, deployment, roster, selectedId, showEnemy]);

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

  const frontOff = arena ? arena.frontDistance !== DESIGNED_FRONT_DISTANCE : false;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Tablero de batalla</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La arena de{" "}
        <Link href="/docs/v3/board/battle" className="text-[var(--wiki-accent)] hover:underline">
          battle.md
        </Link>{" "}
        en código: la rejilla y las bandas del §1, el despliegue libre del §3 y el ritmo de la ronda
        del §1.1 recalculado. Se juega{" "}
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
              title={`${FIGURES_PER_SIDE} fichas por bando: el héroe y cuatro unidades (battle.md §2).`}
            >
              <b>{arena.bands.propio.length}</b> por banda, para <b>{FIGURES_PER_SIDE}</b> fichas
            </span>
            <span
              title="De la última columna de tu banda a la primera de la enemiga, dentro de la misma fila. Es el número que valida los tres alcances (§1.1)."
              className={frontOff ? "text-[var(--wiki-danger)]" : undefined}
            >
              frentes a <b>{arena.frontDistance}</b> hexágonos
              {frontOff && <> (el diseño escribió {DESIGNED_FRONT_DISTANCE})</>}
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
            onMovementChange={setMovement}
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
                  Tus fichas ({deployment.length}) · ★ el héroe
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
            <b className="text-[var(--wiki-text)]">El bando enemigo de verdad</b>: hoy enfrente hay
            un reflejo del tuyo, que sirve para medir y para nada más. El §2 le da dos formas
            —héroe enemigo con hasta 4 unidades, o hasta 5 criaturas sin héroe— y con ellas vienen
            dos condiciones de victoria distintas.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">Iniciativa y turno</b>: las diez fichas en una
            sola lista, mover hasta 👢 Movimiento y atacar en cualquier orden (§4 y §5). Esto sí
            necesita fichas con valores: el mando de 👢 Movimiento de arriba es un dial de
            laboratorio, no un dato.
          </li>
        </ul>
      </div>
    </div>
  );
}
