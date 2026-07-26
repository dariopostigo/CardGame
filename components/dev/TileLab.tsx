"use client";

// =========================================================================
// Laboratorio de LOSETAS — /dev/losetas
//
// Aquí se maqueta la pieza; en /dev/tablero se prueba cómo encajan. Son dos
// problemas distintos y por eso son dos laboratorios: cambiar la forma de una
// loseta no es lo mismo que cambiar cuántas se colocan.
//
// Una loseta fija tres cosas (lib/rules/tiles.ts):
//   · su FORMA    — hexágonos conexos con el (0,0) dentro, hasta el tope de su
//     TAMAÑO (5 niveles, de 4 a 64 hexágonos)
//   · su TERRENO  — el de cada hexágono, o "al sorteo" para dejar que el
//     tablero lo decida al colocarla
//   · sus ANCLAS  — los bordes exteriores por los que se une a otra loseta
//
// Dos mitades:
//   1. el catálogo, que es la biblioteca real girando en vivo
//   2. el editor, que es papel cuadriculado: dibuja un boceto, lo valida con
//      la misma función que el script de verificación y escupe el literal
//      para pegar en lib/rules/tiles.ts. No escribe en disco a propósito —
//      la biblioteca se revisa a mano y entra por commit, no por formulario.
// =========================================================================

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import * as Hex from "@/lib/rules/hex";
import type { HexCoord } from "@/lib/rules/hex";
import { TERRAINS, TERRAIN_IDS, type TerrainId } from "@/lib/rules/terrain";
import {
  ORIGIN,
  TILES,
  TILE_SIZES,
  bagWeight,
  distinctRotations,
  freeCount,
  instantiate,
  roadsOf,
  sizeOf,
  validateTileLibrary,
  type TileDef,
} from "@/lib/rules/tiles";
import TileCanvas, { type CanvasCell } from "@/components/dev/TileCanvas";
import {
  initialSketch,
  copyOfDef,
  fillToCapacity,
  fromDef,
  hasHex,
  paintAllFree,
  paintTerrain,
  setSizeLevel,
  sizeOfSketch,
  sketchGrid,
  terrainAt,
  toDef,
  toSource,
  toggleAnchor,
  toggleHex,
  type Sketch,
} from "@/components/dev/tile-sketch";

type EditorMode = "forma" | "terreno" | "anclas";

const MODES: ReadonlyArray<{ id: EditorMode; label: string; help: string }> = [
  {
    id: "forma",
    label: "Forma",
    help: "Clic en un hueco para añadirlo; clic en un hexágono para quitarlo. El (0,0) no se puede quitar.",
  },
  {
    id: "terreno",
    label: "Terreno",
    help: "Elige un terreno y pinta los hexágonos. «Al sorteo» los devuelve a la tabla A: los decide el tablero al colocar la loseta.",
  },
  {
    id: "anclas",
    label: "Anclas",
    help: "Clic en un lado del contorno para poner o quitar un ancla. Solo el contorno: por dentro no hay nada que unir.",
  },
];

/** La paleta del editor: los 5 terrenos, más «al sorteo», que no es un terreno. */
const PALETTE: ReadonlyArray<{ id: TerrainId | null; label: string }> = [
  { id: null, label: "Al sorteo" },
  ...TERRAIN_IDS.map((id) => ({ id, label: TERRAINS[id].label })),
];

export default function TileLab() {
  // --- Catálogo -----------------------------------------------------------
  const [rotation, setRotation] = useState(0);
  const [showCoords, setShowCoords] = useState(false);

  // --- Editor -------------------------------------------------------------
  const [mode, setMode] = useState<EditorMode>("forma");
  const [brush, setBrush] = useState<TerrainId | null>("camino");
  const [sketch, setSketch] = useState<Sketch>(() => initialSketch());
  const [copied, setCopied] = useState(false);
  // El catálogo es largo: al mandar una loseta al editor hay que llevar también
  // la vista, o el clic parece no haber hecho nada.
  const editorRef = useRef<HTMLHeadingElement>(null);

  const bag = useMemo(() => bagWeight(), []);
  const stats = useMemo(() => bagStats(), []);
  const span = useMemo(() => catalogSpan(TILES), []);

  const draft = useMemo(() => toDef(sketch), [sketch]);
  const draftInstance = useMemo(() => instantiate(draft, 0, ORIGIN), [draft]);
  const problems = useMemo(() => validateTileLibrary([draft]), [draft]);
  const snippet = useMemo(() => toSource(draft), [draft]);
  const grid = useMemo(() => sketchGrid(sketch.sizeLevel), [sketch.sizeLevel]);

  const size = sizeOfSketch(sketch);
  const roadHexes = roadsOf(draft).length;

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  // --- Interacción del editor --------------------------------------------

  // Cada modo es una transición distinta sobre el mismo boceto; las cascadas
  // (quitar o añadir un hexágono arrastra anclas) viven en tile-sketch.ts.
  const clickHex = (coord: HexCoord) => {
    setSketch((s) => (mode === "terreno" ? paintTerrain(s, coord, brush) : toggleHex(s, coord)));
  };

  const clickEdge = (hex: HexCoord, dir: number) => {
    setSketch((s) => toggleAnchor(s, hex, dir));
  };

  // Editar es trabajar sobre la loseta de la biblioteca (mismo id: el literal
  // que salga la sustituye); copiar es sacar una variante nueva a partir de ella.
  const loadIntoEditor = (def: TileDef, asCopy: boolean) => {
    setSketch(asCopy ? copyOfDef(def) : fromDef(def));
    setMode("forma");
    setCopied(false);
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copySnippet = () => {
    void navigator.clipboard?.writeText(snippet).then(() => setCopied(true));
  };

  // Celdas del editor: la loseta con su terreno, y el resto de la rejilla como
  // huecos que se pueden añadir.
  const editorCells: CanvasCell[] = grid.map((coord) =>
    hasHex(sketch, coord)
      ? { coord, kind: "hex", terrain: terrainAt(sketch, coord) }
      : { coord, kind: "candidate" },
  );

  // Una rejilla de radio 5 o 6 no cabe en media pantalla y volvería los
  // hexágonos inclicables: a partir de Grande el lienzo va a todo el ancho.
  const wide = sketch.sizeLevel >= 4;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Losetas</h1>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Una <b>loseta</b> es la pieza con la que se construye el tablero (
        <Link href="/docs/board/board-map" className="text-[var(--wiki-accent)] hover:underline">
          Tablero y mapa §2
        </Link>
        ). Fija tres cosas: su <b>forma</b>, el <b>terreno</b> de cada hexágono y sus{" "}
        <b>anclas</b>. Un hexágono puede quedarse <b>al sorteo</b>: entonces su terreno lo decide el
        tablero al colocar la loseta, con los pesos de la tabla A, y cambia en cada partida.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las <b>anclas</b> son las flechitas que apuntan a un lado del hexágono: el único punto por
        el que una loseta se une a otra. Solo existen en el contorno —un hexágono rodeado por los
        suyos no tiene lado que ofrecer—, y el encaje es ancla contra ancla: el resto del borde es
        pared y no se pega a nada. Se ve funcionando en{" "}
        <Link href="/dev/tablero" className="text-[var(--wiki-accent)] hover:underline">
          generación de tablero
        </Link>
        .
      </p>
      <p className="mb-6 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Hay cinco <b>tamaños</b>, y cada uno dobla al anterior:{" "}
        {TILE_SIZES.map((s, i) => (
          <span key={s.level}>
            {i > 0 && " · "}
            {s.label} <b>{s.capacity}</b>
          </span>
        ))}{" "}
        hexágonos.
      </p>

      {/* --- La bolsa: qué hay en la biblioteca hoy ------------------------ */}
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
        <span>
          <b>Biblioteca:</b> {TILES.length} losetas
        </span>
        <span>
          <b>Tamaño medio:</b> {stats.meanHexes.toFixed(1)} hexágonos
        </span>
        <span>
          <b>Con sendero:</b> {stats.withRoad} de {TILES.length} ({percent(stats.roadTileShare)})
        </span>
        <span title="Media ponderada por peso de la bolsa. En el tablero sale por debajo, porque una loseta con sendero solo entra donde encuentra un ancla libre que le sirva.">
          <b>Camino en la bolsa:</b> {percent(stats.expectedRoadShare)}
        </span>
        <span title="Hexágonos cuyo terreno no fija la loseta: los sortea el tablero con la tabla A.">
          <b>Al sorteo:</b> {percent(stats.freeShare)}
        </span>
        <span>
          <b>Anclas por loseta:</b> {stats.meanAnchors.toFixed(1)}
        </span>
        <span>
          <b>Peso de la bolsa:</b> {bag}
        </span>
      </div>

      {/* --- Catálogo ----------------------------------------------------- */}
      <div className="mb-3 flex flex-wrap items-end gap-x-6 gap-y-3">
        <h2 className="text-lg font-semibold text-[var(--wiki-text)]">Catálogo</h2>

        <div className="flex flex-col gap-1">
          <span className={label}>Giro</span>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                className={btn(rotation === step)}
                onClick={() => setRotation(step)}
              >
                {step * 60}°
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Vista</span>
          <button className={btn(showCoords)} onClick={() => setShowCoords((v) => !v)}>
            Coordenadas
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]">
        <span>Tamaños en la biblioteca:</span>
        {TILE_SIZES.map((s) => (
          <span key={s.level}>
            {s.label} · {stats.bySize[s.level] ?? 0}
          </span>
        ))}
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((def) => (
          <TileCard
            key={def.id}
            def={def}
            rotation={rotation}
            showCoords={showCoords}
            bag={bag}
            span={span}
            onEdit={() => loadIntoEditor(def, false)}
            onCopy={() => loadIntoEditor(def, true)}
          />
        ))}
      </div>

      {/* --- Editor ------------------------------------------------------- */}
      <h2 ref={editorRef} className="mb-1 scroll-mt-4 text-lg font-semibold text-[var(--wiki-text)]">
        Boceto
      </h2>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Papel cuadriculado para dibujar una loseta nueva o una variante de otra —los botones{" "}
        <b>Editar</b> y <b>Copiar</b> de cada tarjeta la traen aquí—. Se valida con la misma función
        que el script de verificación, y lo que sale es la loseta dibujada, en el mismo formato que
        el resto de la biblioteca, para pegarla en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          lib/rules/tiles.ts
        </code>
        : la biblioteca entra por commit revisado, no por formulario.
      </p>

      {/* Tamaño: cambia el tope de hexágonos y el papel donde se dibuja */}
      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Tamaño del boceto</span>
          <div className="flex flex-wrap items-center gap-2">
            {TILE_SIZES.map((s) => (
              <button
                key={s.level}
                className={btn(sketch.sizeLevel === s.level)}
                onClick={() => setSketch((current) => setSizeLevel(current, s.level))}
                title={`Hasta ${s.capacity} hexágonos`}
              >
                {s.label} · {s.capacity}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Atajos</span>
          <div className="flex items-center gap-2">
            <button
              className={btn(false)}
              onClick={() => setSketch((s) => fillToCapacity(s))}
              title="Crecer desde el (0,0) hasta el tope del tamaño"
            >
              Rellenar
            </button>
            <button
              className={btn(false)}
              onClick={() => setSketch((s) => paintAllFree(s, brush))}
              title="Pintar con el terreno elegido todos los hexágonos que están al sorteo"
            >
              Pintar el resto
            </button>
            <button
              className={btn(false)}
              onClick={() => setSketch((s) => initialSketch(s.sizeLevel))}
            >
              Empezar de cero
            </button>
          </div>
        </div>
      </div>

      <div className={wide ? "grid gap-4" : "grid gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]"}>
        {/* Lienzo */}
        <div className="rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {MODES.map((m) => (
              <button key={m.id} className={btn(mode === m.id)} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Paleta de terreno: se enseña siempre, porque también es la leyenda
              de los colores del lienzo, pero solo pinta en el modo Terreno —y
              por eso se apaga cuando no toca. */}
          <div
            className={`mb-3 flex flex-wrap items-center gap-2 ${
              mode === "terreno" ? "" : "opacity-60"
            }`}
          >
            {PALETTE.map((p) => (
              <button
                key={p.id ?? "libre"}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
                  brush === p.id
                    ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
                    : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
                }`}
                onClick={() => {
                  setBrush(p.id);
                  setMode("terreno");
                }}
              >
                <span className="tile-swatch" data-terrain={p.id ?? "libre"} />
                {p.label}
              </button>
            ))}
          </div>

          <TileCanvas
            cells={editorCells}
            edges={draftInstance.edges}
            frame={grid}
            hexSize={30}
            showCoords={showCoords}
            onCellClick={mode === "anclas" ? undefined : clickHex}
            onEdgeClick={mode === "anclas" ? clickEdge : undefined}
            ariaLabel="Boceto de loseta"
          />

          <p className="mt-2 text-xs text-[var(--wiki-muted)]">
            {MODES.find((m) => m.id === mode)!.help}
          </p>
        </div>

        {/* Datos, validación y salida */}
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <span className={label}>Id</span>
              <InputText
                value={sketch.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSketch((s) => ({ ...s, id: e.target.value }))
                }
                className="w-44"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={label}>Etiqueta</span>
              <InputText
                value={sketch.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSketch((s) => ({ ...s, label: e.target.value }))
                }
                className="w-52"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={label}>Peso</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((w) => (
                  <button
                    key={w}
                    className={btn(sketch.weight === w)}
                    onClick={() => setSketch((s) => ({ ...s, weight: w }))}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-[var(--wiki-muted)]">
            {size.label}: {sketch.cells.length} de {size.capacity} hexágonos · {roadHexes} de
            sendero · {freeCount(draft)} al sorteo · {sketch.anchors.length} anclas ·{" "}
            {problems.length === 0 ? `${distinctRotations(draft).length} giros distintos` : "—"}
          </div>

          {/* Validación: la misma que impide que una loseta rota llegue al juego */}
          {problems.length === 0 ? (
            <p className="rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
              <i className="pi pi-check mr-2 text-[var(--wiki-accent)]" />
              Loseta válida: se puede pegar en la biblioteca.
            </p>
          ) : (
            <ul className="grid gap-1 rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
              {problems.map((p) => (
                <li key={p}>
                  <i className="pi pi-exclamation-triangle mr-2 text-[var(--wiki-muted)]" />
                  {p.replace(`${draft.id}: `, "")}
                </li>
              ))}
            </ul>
          )}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={label}>Para pegar en la biblioteca</span>
              <button className={btn(false)} onClick={copySnippet}>
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-code-bg)] p-3 text-xs text-[var(--wiki-text)]">
              {snippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tarjeta del catálogo --------------------------------------------------

function TileCard({
  def,
  rotation,
  showCoords,
  bag,
  span,
  onEdit,
  onCopy,
}: {
  def: TileDef;
  rotation: number;
  showCoords: boolean;
  bag: number;
  span: number;
  onEdit: () => void;
  onCopy: () => void;
}) {
  const instance = useMemo(() => instantiate(def, rotation, ORIGIN), [def, rotation]);

  const cells: CanvasCell[] = instance.cells.map((cell) => ({
    coord: cell.hex,
    kind: "hex",
    terrain: cell.terrain,
  }));

  const size = sizeOf(def);
  const roads = roadsOf(def).length;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
      {/* Etiqueta y peso en una línea, el id debajo: si van los tres juntos, los
          nombres largos parten la línea y las tarjetas dejan de estar alineadas. */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[var(--wiki-text)]">{def.label}</span>
          <span className="ml-auto whitespace-nowrap text-xs text-[var(--wiki-muted)]">
            peso {def.weight} · {percent(def.weight / bag)}
          </span>
        </div>
        <code className="text-[0.7rem] text-[var(--wiki-muted)]">{def.id}</code>
      </div>

      <TileCanvas
        cells={cells}
        edges={instance.edges}
        hexSize={22}
        // Lado fijo y el mismo para todas: sin esto el SVG se estira al ancho
        // disponible y una loseta de 3 hexágonos se ve más grande que una de 5,
        // que es lo contrario de lo que hace falta para compararlas.
        frameSpan={span}
        showCoords={showCoords}
        ariaLabel={`Loseta ${def.label}`}
      />

      <ul className="grid gap-0.5 text-xs text-[var(--wiki-muted)]">
        <li>
          {size.label} · {def.cells.length} de {size.capacity} hexágonos
        </li>
        <li>
          {roads} de sendero · {freeCount(def)} al sorteo
        </li>
        <li>
          Anclas:{" "}
          {instance.anchors.length === 0
            ? "ninguna"
            : instance.anchors.map((a) => Hex.DIR_LABELS[a.dir]).join(", ")}
        </li>
        <li>{distinctRotations(def).length} giros distintos de 6</li>
      </ul>

      <div className="mt-auto flex items-center gap-2">
        <button
          className="rounded-md border border-[var(--wiki-border)] px-2.5 py-1 text-xs text-[var(--wiki-text)] transition-colors hover:bg-[var(--wiki-surface-2)]"
          onClick={onEdit}
          title="Llevar esta loseta al boceto con su mismo id: lo que salga la sustituye en la biblioteca"
        >
          Editar
        </button>
        <button
          className="rounded-md border border-[var(--wiki-border)] px-2.5 py-1 text-xs text-[var(--wiki-text)] transition-colors hover:bg-[var(--wiki-surface-2)]"
          onClick={onCopy}
          title="Empezar una loseta nueva a partir de esta: lo que salga se añade a la biblioteca"
        >
          Copiar
        </button>
      </div>
    </div>
  );
}

// --- Helpers --------------------------------------------------------------

type BagStats = {
  meanHexes: number;
  withRoad: number;
  /** Parte de la bolsa, POR PESO, que trae sendero. */
  roadTileShare: number;
  /** Fracción de hexágonos de Camino de la bolsa, ponderada por peso. */
  expectedRoadShare: number;
  /** Fracción de hexágonos que la bolsa deja al sorteo de la tabla A. */
  freeShare: number;
  meanAnchors: number;
  /** Cuántas losetas hay de cada nivel de tamaño. */
  bySize: Record<number, number>;
};

/**
 * Lo que dice la bolsa antes de generar nada. `expectedRoadShare` es el número
 * que importa: es el % de Camino que trae la biblioteca, y el que hay que mover
 * para acercarse al 20 % de la tabla A (board-map.md §2c). En el tablero real
 * sale por debajo, porque el encaje no reparte las losetas de forma uniforme:
 * una con sendero necesita un ancla libre que le sirva donde caer.
 */
function bagStats(): BagStats {
  let weightedHexes = 0;
  let weightedRoads = 0;
  let roadWeight = 0;
  let withRoad = 0;
  let hexes = 0;
  let free = 0;
  let anchors = 0;
  const bySize: Record<number, number> = {};

  for (const def of TILES) {
    const roads = roadsOf(def).length;
    weightedHexes += def.weight * def.cells.length;
    weightedRoads += def.weight * roads;
    hexes += def.cells.length;
    free += freeCount(def);
    anchors += def.anchors.length;
    bySize[sizeOf(def).level] = (bySize[sizeOf(def).level] ?? 0) + 1;
    if (roads > 0) {
      withRoad++;
      roadWeight += def.weight;
    }
  }

  return {
    meanHexes: hexes / TILES.length,
    withRoad,
    roadTileShare: roadWeight / bagWeight(),
    expectedRoadShare: weightedRoads / weightedHexes,
    freeShare: free / hexes,
    meanAnchors: anchors / TILES.length,
    bySize,
  };
}

/**
 * Lado del encuadre del catálogo, en radios de hexágono: el que necesita la
 * loseta más grande de la biblioteca en su giro más incómodo. Se calcula en vez
 * de fijarse a mano para que al maquetar losetas de tamaño Grande o Enorme el
 * catálogo siga entrando entero y a la misma escala.
 *
 * @returns {number} El lado, con un margen para el trazo del contorno.
 */
function catalogSpan(defs: readonly TileDef[]): number {
  const { width: hexWidth, height: hexHeight } = Hex.hexSize(1);
  let span = 4;

  for (const def of defs) {
    for (let rot = 0; rot < 6; rot++) {
      const points = instantiate(def, rot, ORIGIN).hexes.map((hex) => Hex.toPixel(hex, 1));
      const width =
        Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x)) + hexWidth;
      const height =
        Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y)) + hexHeight;
      span = Math.max(span, width, height);
    }
  }
  return span + 0.4;
}

function percent(fraction: number): string {
  return `${Math.round(fraction * 100)} %`;
}
