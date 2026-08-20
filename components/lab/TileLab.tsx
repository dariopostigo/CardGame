"use client";

// =========================================================================
// Laboratorio de LOSETAS — /lab/tiles
//
// Aquí se maqueta la pieza; en /lab/board se prueba cómo encajan. Son dos
// problemas distintos y por eso son dos laboratorios: cambiar la forma de una
// loseta no es lo mismo que cambiar cuántas se colocan.
//
// Todo hexágono de una loseta lleva TERRENO, obligatorio: aquí no hay «al
// sorteo». Lo que se dibuja es lo que sale en la partida.
//
// La biblioteca tiene dos niveles (lib/v2/rules/tiles.ts):
//   · TIPO     — un sitio del mundo, definido por UN terreno, con su peso en la
//     bolsa. Es lo que se sortea al construir el tablero.
//   · VARIANTE — una loseta concreta de ese tipo: su forma, el terreno de cada
//     hexágono y sus anclas. Varios peñascos distintos son variantes del mismo
//     tipo, y al tablero le da igual cuál le toque.
//
// Y este laboratorio ESCRIBE en data/tile-library.json (por la ruta de
// app/api/lab/tile-library, que solo existe en desarrollo). Antes la salida era
// un literal para copiar y pegar a mano, y ahí es donde se colaban los errores:
// dibujas veinte hexágonos bien y te equivocas al trasladarlos. Cada acción
// —crear, guardar, eliminar— valida la biblioteca entera con la misma función
// que la valida al arrancar, y si no pasa, el fichero se queda como estaba.
// =========================================================================

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectButton } from "primereact/selectbutton";
import * as Hex from "@/lib/v2/rules/hex";
import type { HexCoord } from "@/lib/v2/rules/hex";
import { TERRAINS, TERRAIN_IDS, targetShare, type TerrainId } from "@/lib/v2/rules/terrain";
import { STORED_LIBRARY } from "@/lib/v2/rules/tile-library";
import {
  ORIGIN,
  TILE_SIZES,
  allVariants,
  distinctRotations,
  instantiate,
  parseLibrary,
  roadsOf,
  sizeOf,
  terrainCounts,
  toStoredVariant,
  typeHexes,
  typeNotes,
  validateTileLibrary,
  type StoredLibrary,
  type TileDef,
  type TileType,
} from "@/lib/v2/rules/tiles";
import { formatJson } from "@/lib/tile-library-format";
import TileCanvas, { type CanvasCell } from "@/components/lab/TileCanvas";
import { buttonClass } from "@/components/ui/Button";
import {
  addType,
  freeId,
  putVariant,
  removeType,
  removeVariant,
  saveLibrary,
  updateType,
  variantIds,
} from "@/components/lab/tile-library-store";
import {
  copyOfDef,
  fillToCapacity,
  fromDef,
  hasHex,
  initialSketch,
  paintAll,
  paintTerrain,
  setSizeLevel,
  sizeOfSketch,
  sketchGrid,
  terrainAt,
  toDef,
  toggleAnchor,
  toggleHex,
  type Sketch,
} from "@/components/lab/tile-sketch";

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
    help: "Elige un terreno y pinta los hexágonos. Todos llevan terreno: no hay hexágono sin pintar, así que en el modo Forma el que añades nace con el del pincel.",
  },
  {
    id: "anclas",
    label: "Anclas",
    help: "Clic en un lado del contorno para poner o quitar un ancla. Solo el contorno: por dentro no hay nada que unir.",
  },
];

/** La paleta del editor: los terrenos, y nada más. Todo hexágono lleva uno. */
const PALETTE: ReadonlyArray<{ id: TerrainId; label: string }> = TERRAIN_IDS.map((id) => ({
  id,
  label: TERRAINS[id].label,
}));

const WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8];

/** El boceto en curso y qué variante va a sustituir cuando se guarde. */
type Draft = { readonly sketch: Sketch; readonly replaces: string | null };

/**
 * Un boceto en blanco, listo para dibujar. El papel cuadriculado está SIEMPRE
 * abierto al entrar: es la mitad del laboratorio, y esconderlo hasta que se
 * abriera una variante del catálogo dejaba la página sin sitio donde dibujar una
 * loseta nueva. El tipo se elige luego, con los botones del propio boceto.
 */
function blankDraft(typeId: string, terrain: TerrainId): Draft {
  return {
    sketch: { ...initialSketch(typeId, terrain), id: "loseta-nueva", label: "Loseta nueva" },
    replaces: null,
  };
}

/** El formulario del tipo. `original` es su id antes de editarlo. */
type TypeForm = {
  readonly original: string;
  readonly id: string;
  readonly label: string;
  readonly terrain: TerrainId;
  readonly weight: number;
  readonly note: string;
};

type Status = { readonly tone: "ok" | "error" | "busy"; readonly text: string };

export default function TileLab() {
  // La biblioteca de trabajo. Arranca con la del disco y solo cambia cuando el
  // servidor confirma que ha escrito: así lo que se ve es siempre lo que hay
  // guardado, que en una herramienta importa más que ir rápido.
  const [library, setLibrary] = useState<StoredLibrary>(STORED_LIBRARY);
  const [status, setStatus] = useState<Status | null>(null);

  // --- Catálogo -----------------------------------------------------------
  const [rotation, setRotation] = useState(0);
  const [showCoords, setShowCoords] = useState(false);
  const [typeForm, setTypeForm] = useState<TypeForm | null>(null);

  // --- Editor -------------------------------------------------------------
  const [draft, setDraft] = useState<Draft | null>(() =>
    blankDraft(STORED_LIBRARY.types[0]?.id ?? "", STORED_LIBRARY.types[0]?.terrain ?? "llanura"),
  );
  const [mode, setMode] = useState<EditorMode>("forma");
  const [brush, setBrush] = useState<TerrainId>("llanura");
  // El catálogo es largo: al mandar una variante al editor hay que llevar
  // también la vista, o el clic parece no haber hecho nada.
  const editorRef = useRef<HTMLHeadingElement>(null);

  const parsed = useMemo(() => {
    try {
      return { types: parseLibrary(library), error: null as string | null };
    } catch (error) {
      return { types: [] as TileType[], error: error instanceof Error ? error.message : String(error) };
    }
  }, [library]);

  const types = parsed.types;
  const tiles = useMemo(() => allVariants(types), [types]);
  const bag = types.reduce((sum, type) => sum + type.weight, 0);
  const stats = useMemo(() => bagStats(types), [types]);
  const span = useMemo(() => catalogSpan(tiles), [tiles]);

  const sketch = draft?.sketch ?? null;
  const editing = useMemo(() => (sketch ? toDef(sketch) : null), [sketch]);
  const editingInstance = useMemo(
    () => (editing ? instantiate(editing, 0, ORIGIN) : null),
    [editing],
  );
  const grid = useMemo(() => sketchGrid(sketch?.sizeLevel ?? 1), [sketch?.sizeLevel]);

  // Los problemas del boceto: los de la loseta, más el id repetido, que no es
  // cosa de la loseta sino de la biblioteca donde va a entrar.
  const problems = useMemo(() => {
    if (!editing || !draft) return [];
    const own = validateTileLibrary([editing]).map((p) => p.replace(`${editing.id}: `, ""));
    if (variantIds(library).some((id) => id === editing.id && id !== draft.replaces)) {
      own.unshift(`el id "${editing.id}" ya lo usa otra variante`);
    }
    // Puede pasar si se elimina el tipo con el boceto abierto: sin tipo no hay
    // dónde guardarla, y guardar sin sitio la perdería sin decir nada.
    if (!types.some((type) => type.id === editing.typeId)) {
      own.unshift("elige el tipo al que pertenece");
    }
    return own;
  }, [editing, draft, library, types]);

  // Las clases salen de components/ui/Button.tsx: mismo botón que documenta
  // /repository-dev/buttons, para que retocarlo se vea aquí sin copiar nada.
  const btn = (active: boolean) => buttonClass({ active });

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

  // --- Guardar ------------------------------------------------------------

  /**
   * Mandar la biblioteca al disco. Si el servidor la rechaza, se queda la que
   * había: no hay estado a medias que luego no se sepa si está guardado.
   */
  const commit = async (next: StoredLibrary, done: string): Promise<boolean> => {
    setStatus({ tone: "busy", text: "Guardando…" });
    const result = await saveLibrary(next);
    if (!result.ok) {
      setStatus({ tone: "error", text: result.problems.join(" · ") });
      return false;
    }
    setLibrary(result.library);
    setStatus({ tone: "ok", text: done });
    return true;
  };

  // --- Acciones sobre los tipos -------------------------------------------

  const newType = async () => {
    const { library: next, type } = addType(library);
    if (await commit(next, `Tipo «${type.label}» creado`)) {
      setTypeForm({ ...type, original: type.id });
    }
  };

  const saveType = async () => {
    if (!typeForm) return;
    const next = updateType(library, typeForm.original, {
      id: typeForm.id.trim(),
      label: typeForm.label.trim(),
      terrain: typeForm.terrain,
      weight: typeForm.weight,
      note: typeForm.note.trim(),
    });
    if (await commit(next, `Tipo «${typeForm.label}» guardado`)) setTypeForm(null);
  };

  const deleteType = async (type: TileType) => {
    const what = `«${type.label}» y sus ${type.variants.length} variante${
      type.variants.length === 1 ? "" : "s"
    }`;
    if (!window.confirm(`¿Eliminar el tipo ${what}?`)) return;
    if (typeForm?.original === type.id) setTypeForm(null);
    if (draft?.sketch.typeId === type.id) setDraft(null);
    await commit(removeType(library, type.id), `Tipo «${type.label}» eliminado`);
  };

  // --- Acciones sobre las variantes ---------------------------------------

  const openDraft = (next: Sketch, replaces: string | null, terrain: TerrainId) => {
    setDraft({ sketch: next, replaces });
    setMode("forma");
    setBrush(terrain);
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Editar trabaja sobre la variante de la biblioteca (mismo id: al guardar la
  // sustituye); copiar saca otra variante del MISMO tipo a partir de ella.
  const editVariant = (type: TileType, def: TileDef) => openDraft(fromDef(def), def.id, type.terrain);

  const copyVariant = (type: TileType, def: TileDef) => {
    const copy = copyOfDef(def);
    openDraft({ ...copy, id: freeId(copy.id, variantIds(library)) }, null, type.terrain);
  };

  const addVariant = (type: TileType) => {
    const fresh = initialSketch(type.id, type.terrain);
    openDraft(
      {
        ...fresh,
        id: freeId(fresh.id, variantIds(library)),
        label: `${type.label} nuevo`,
        weight: type.weight / (type.variants.length + 1),
      },
      null,
      type.terrain,
    );
  };

  const deleteVariant = async (type: TileType, def: TileDef) => {
    if (type.variants.length === 1) {
      setStatus({
        tone: "error",
        text: `«${def.label}» es la única variante de ${type.label}: elimina el tipo entero o dibuja otra antes`,
      });
      return;
    }
    if (!window.confirm(`¿Eliminar la variante «${def.label}»?`)) return;
    if (draft?.replaces === def.id) setDraft(null);
    await commit(removeVariant(library, type.id, def.id), `Variante «${def.label}» eliminada`);
  };

  const saveDraft = async () => {
    if (!draft || !editing) return;
    const next = putVariant(
      library,
      draft.sketch.typeId,
      toStoredVariant(editing),
      draft.replaces ?? undefined,
    );
    if (await commit(next, `Variante «${editing.label}» guardada`)) {
      // Queda abierta, pero ya sustituyendo a la que se acaba de escribir: si se
      // sigue tocando y se guarda otra vez, no aparece una variante duplicada.
      setDraft({ sketch: draft.sketch, replaces: editing.id });
    }
  };

  // --- Interacción del editor --------------------------------------------

  // Cada modo es una transición distinta sobre el mismo boceto; las cascadas
  // (quitar o añadir un hexágono arrastra anclas) viven en tile-sketch.ts.
  const patch = (fn: (s: Sketch) => Sketch) =>
    setDraft((current) => (current ? { ...current, sketch: fn(current.sketch) } : current));

  const clickHex = (coord: HexCoord) =>
    patch((s) => (mode === "terreno" ? paintTerrain(s, coord, brush) : toggleHex(s, coord, brush)));

  const clickEdge = (hex: HexCoord, dir: number) => patch((s) => toggleAnchor(s, hex, dir));

  // Celdas del editor: la loseta con su terreno, y el resto de la rejilla como
  // huecos que se pueden añadir.
  const editorCells: CanvasCell[] = sketch
    ? grid.map((coord) =>
        hasHex(sketch, coord)
          ? { coord, kind: "hex", terrain: terrainAt(sketch, coord) }
          : { coord, kind: "candidate" },
      )
    : [];

  // Una rejilla de radio 5 o 6 no cabe en media pantalla y volvería los
  // hexágonos inclicables: a partir de Grande el lienzo va a todo el ancho.
  const wide = (sketch?.sizeLevel ?? 1) >= 4;
  const size = sketch ? sizeOfSketch(sketch) : TILE_SIZES[0];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Losetas</h1>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Una <b>loseta</b> es la pieza con la que se construye el tablero (
        <Link href="/docs/v2/board/board-map" className="text-[var(--wiki-accent)] hover:underline">
          Tablero y mapa §2
        </Link>
        ). Fija tres cosas: su <b>forma</b>, el <b>terreno</b> de cada hexágono y sus{" "}
        <b>anclas</b>. El terreno es <b>obligatorio en todos</b>: una loseta llega pintada entera,
        no hay hexágono que decida el tablero. Así lo que se ve aquí es exactamente lo que sale en
        la partida, y el reparto de terreno del mapa lo decide el maquetado —la tabla A pasa a ser
        el objetivo al que apuntar, no un sorteo—. La variedad entre partidas la dan las{" "}
        <b>variantes</b> de cada tipo y el giro.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La biblioteca tiene dos niveles. Un <b>tipo</b> es un sitio del mundo —un peñasco, una
        ciénaga, una posada—, lo define <b>un terreno</b> y es lo que se sortea al construir el
        tablero; sus <b>variantes</b> son las maneras de dibujar ese mismo sitio. El peso es del
        tipo y se reparte entre sus variantes: añadir un peñasco más no hace que salgan más
        peñascos, hace que se repitan menos. Que un tipo tenga terreno propio no impide las
        excepciones que el sitio pida —el camino que cruza el paso de montaña—; solo avisa de las
        que parecen un descuido.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las <b>anclas</b> son las flechitas que apuntan a un lado del hexágono: el único punto por
        el que una loseta se une a otra. Solo existen en el contorno —un hexágono rodeado por los
        suyos no tiene lado que ofrecer—, y el encaje es ancla contra ancla: el resto del borde es
        pared y no se pega a nada. Se ve funcionando en{" "}
        <Link href="/lab/board" className="text-[var(--wiki-accent)] hover:underline">
          generación de tablero
        </Link>
        .
      </p>
      <p className="mb-6 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Lo que se edita aquí <b>se guarda en disco</b> (
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          data/tile-library.json
        </code>
        ), y de ahí lo lee el juego. Cada cambio se valida con la misma función que valida la
        biblioteca al arrancar: si no pasa, no se escribe nada.
      </p>

      {/* --- La bolsa: qué hay en la biblioteca hoy ------------------------ */}
      <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
        <span>
          <b>Biblioteca:</b> {types.length} tipos · {tiles.length} variantes
        </span>
        <span>
          <b>Tamaño medio:</b> {stats.meanHexes.toFixed(1)} hexágonos
        </span>
        <span>
          <b>Con sendero:</b> {stats.withRoad} de {tiles.length} ({percent(stats.roadTileShare)})
        </span>
        <span>
          <b>Anclas por loseta:</b> {stats.meanAnchors.toFixed(1)}
        </span>
        <span>
          <b>Peso de la bolsa:</b> {bag}
        </span>
      </div>

      {/* El terreno que produce la bolsa contra el objetivo de la tabla A. Desde
          que no se sortea nada, ESTE es el reparto de terreno del tablero: si
          aquí sobra bosque, en la partida sobra bosque. */}
      <div
        className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]"
        title="Hexágonos de cada terreno que produce la bolsa, ponderados por peso, y entre paréntesis la cuota de la tabla A (§2c). Ya no se sortea terreno: lo que sale en la partida sale de aquí."
      >
        <span>Terreno de la bolsa:</span>
        {TERRAIN_IDS.map((id) => (
          <span key={id} className="flex items-center gap-1.5">
            <span className="tile-swatch" data-terrain={id} />
            {TERRAINS[id].label} <b>{percent(stats.hexShare[id] ?? 0)}</b>
            {targetShare(id) > 0 ? ` (objetivo ${percent(targetShare(id))})` : " (sin cuota)"}
          </span>
        ))}
      </div>

      {parsed.error !== null && (
        <p className="mb-6 rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
          <i className="pi pi-exclamation-triangle mr-2 text-[var(--wiki-muted)]" />
          La biblioteca no se puede leer: {parsed.error}
        </p>
      )}

      {/* --- Catálogo ----------------------------------------------------- */}
      <div className="mb-3 flex flex-wrap items-end gap-x-6 gap-y-3">
        <h2 className="text-lg font-semibold text-[var(--wiki-text)]">Catálogo</h2>

        <div className="flex flex-col gap-1">
          <span className={label}>Giro</span>
          <SelectButton
            value={rotation}
            onChange={(e) => setRotation(Number(e.value))}
            options={[0, 1, 2, 3, 4, 5]}
            itemTemplate={(step: number) => `${step * 60}°`}
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Vista</span>
          <div className="flex items-center gap-2">
            <InputSwitch
              inputId="tiles-show-coords"
              checked={showCoords}
              onChange={(e) => setShowCoords(Boolean(e.value))}
            />
            <label htmlFor="tiles-show-coords" className="cursor-pointer text-sm text-[var(--wiki-text)]">
              Coordenadas
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Dibujar</span>
          <div className="flex items-center gap-2">
            <button
              className={btn(false)}
              onClick={() => {
                const first = types[0];
                const terrain = first?.terrain ?? "llanura";
                openDraft(blankDraft(first?.id ?? "", terrain).sketch, null, terrain);
              }}
              title="Papel en blanco: dibujar una loseta desde cero y elegir su tipo al guardarla"
            >
              Boceto en blanco
            </button>
            <button className={btn(false)} onClick={newType} title="Crear un tipo de loseta nuevo">
              Nuevo tipo
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--wiki-muted)]">
        <span>Variantes por tamaño:</span>
        {TILE_SIZES.map((s) => (
          <span key={s.level}>
            {s.label} · {stats.bySize[s.level] ?? 0}
          </span>
        ))}
        {status !== null && (
          <span
            className={`ml-auto ${
              status.tone === "error" ? "text-[var(--wiki-text)]" : "text-[var(--wiki-accent)]"
            }`}
          >
            <i
              className={`mr-1.5 pi ${
                status.tone === "error"
                  ? "pi-exclamation-triangle"
                  : status.tone === "busy"
                    ? "pi-spinner"
                    : "pi-check"
              }`}
            />
            {status.text}
          </span>
        )}
      </div>

      <div className="mb-10 grid gap-6">
        {types.map((type) => (
          <TypeSection
            key={type.id}
            type={type}
            bag={bag}
            rotation={rotation}
            showCoords={showCoords}
            span={span}
            form={typeForm?.original === type.id ? typeForm : null}
            btn={btn}
            labelClass={label}
            onForm={setTypeForm}
            onEditType={() =>
              setTypeForm({
                original: type.id,
                id: type.id,
                label: type.label,
                terrain: type.terrain,
                weight: type.weight,
                note: type.note,
              })
            }
            onSaveType={saveType}
            onCancelType={() => setTypeForm(null)}
            onDeleteType={() => deleteType(type)}
            onAddVariant={() => addVariant(type)}
            onEditVariant={(def) => editVariant(type, def)}
            onCopyVariant={(def) => copyVariant(type, def)}
            onDeleteVariant={(def) => deleteVariant(type, def)}
          />
        ))}
      </div>

      {/* --- Editor ------------------------------------------------------- */}
      <h2 ref={editorRef} className="mb-1 scroll-mt-4 text-lg font-semibold text-[var(--wiki-text)]">
        Boceto
      </h2>

      {sketch === null || editing === null || editingInstance === null ? (
        <p className="max-w-3xl text-sm text-[var(--wiki-muted)]">
          Papel cuadriculado para dibujar, ahora cerrado. Se abre con <b>Boceto en blanco</b>, ahí
          arriba, o desde cualquier tarjeta del catálogo: <b>Editar</b> trae una variante tal cual
          (al guardar la sustituye), <b>Copiar</b> saca otra variante del mismo tipo a partir de
          ella, y <b>Añadir variante</b> empieza de cero dentro de un tipo.
        </p>
      ) : (
        <>
          <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
            {draft?.replaces === null ? (
              <>
                Loseta <b>nueva</b>: dibújala, elige en <b>Tipo</b> qué sitio es y al guardar entra
                en la biblioteca como una variante más de ese tipo.
              </>
            ) : (
              <>
                Editando <b>{draft?.replaces}</b>: al guardar la sustituye.
              </>
            )}{" "}
            Se valida con la misma función que el script de verificación, y el peso no se toca aquí
            —lo pone el tipo y se reparte entre sus variantes—.
          </p>

          {/* Tamaño: cambia el tope de hexágonos y el papel donde se dibuja */}
          <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
            <div className="flex flex-col gap-1">
              <span className={label}>Tamaño del boceto</span>
              <SelectButton
                value={sketch.sizeLevel}
                onChange={(e) => patch((current) => setSizeLevel(current, Number(e.value)))}
                options={[...TILE_SIZES]}
                optionLabel="label"
                optionValue="level"
                itemTemplate={(s: (typeof TILE_SIZES)[number]) => `${s.label} · ${s.capacity}`}
                allowEmpty={false}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className={label}>Atajos</span>
              <div className="flex items-center gap-2">
                <button
                  className={btn(false)}
                  onClick={() => patch((s) => fillToCapacity(s, brush))}
                  title="Crecer desde el (0,0) hasta el tope del tamaño, con el terreno del pincel"
                >
                  Rellenar
                </button>
                <button
                  className={btn(false)}
                  onClick={() => patch((s) => paintAll(s, brush))}
                  title="Pintar la loseta entera con el terreno elegido"
                >
                  Pintar todo
                </button>
                <button
                  className={btn(false)}
                  onClick={() =>
                    patch((s) => ({
                      ...initialSketch(s.typeId, brush, s.sizeLevel),
                      id: s.id,
                      label: s.label,
                    }))
                  }
                >
                  Empezar de cero
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              wide ? "grid gap-4" : "grid gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]"
            }
          >
            {/* Lienzo */}
            <div className="rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
              <div className="mb-3">
                <SelectButton
                  value={mode}
                  onChange={(e) => setMode(e.value as EditorMode)}
                  options={[...MODES]}
                  optionLabel="label"
                  optionValue="id"
                  allowEmpty={false}
                />
              </div>

              {/* Paleta de terreno: se enseña siempre, porque también es la leyenda
                  de los colores del lienzo, pero solo pinta en el modo Terreno —y
                  por eso se apaga cuando no toca. */}
              <div className={`mb-3 ${mode === "terreno" ? "" : "opacity-60"}`}>
                <SelectButton
                  value={brush}
                  onChange={(e) => {
                    setBrush(e.value as TerrainId);
                    setMode("terreno");
                  }}
                  options={[...PALETTE]}
                  optionLabel="label"
                  optionValue="id"
                  itemTemplate={(p: (typeof PALETTE)[number]) => (
                    <>
                      <span className="tile-swatch" data-terrain={p.id} />
                      {p.label}
                    </>
                  )}
                  allowEmpty={false}
                />
              </div>

              <TileCanvas
                cells={editorCells}
                edges={editingInstance.edges}
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

            {/* Datos, validación y guardado */}
            <div className="grid content-start gap-4">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                <div className="flex flex-col gap-1">
                  <span className={label}>Id</span>
                  <InputText
                    value={sketch.id}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      patch((s) => ({ ...s, id: e.target.value }))
                    }
                    className="w-44"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={label}>Nombre</span>
                  <InputText
                    value={sketch.label}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      patch((s) => ({ ...s, label: e.target.value }))
                    }
                    className="w-52"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className={label}>Tipo</span>
                  <SelectButton
                    value={sketch.typeId}
                    onChange={(e) => patch((s) => ({ ...s, typeId: String(e.value) }))}
                    options={types}
                    optionLabel="label"
                    optionValue="id"
                    allowEmpty={false}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className={label}>Nota de maquetado</span>
                <InputTextarea
                  value={sketch.note}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    patch((s) => ({ ...s, note: e.target.value }))
                  }
                  rows={2}
                  className="w-full"
                  placeholder="Por qué está dibujada así: es lo único que no se deduce mirándola."
                />
              </div>

              <div className="text-sm text-[var(--wiki-muted)]">
                {size.label}: {sketch.cells.length} de {size.capacity} hexágonos ·{" "}
                {roadsOf(editing).length} de sendero · {sketch.anchors.length} anclas ·{" "}
                {problems.length === 0 ? `${distinctRotations(editing).length} giros distintos` : "—"}
              </div>

              {/* Validación: la misma que impide que una loseta rota llegue al juego */}
              {problems.length === 0 ? (
                <p className="rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
                  <i className="pi pi-check mr-2 text-[var(--wiki-accent)]" />
                  Loseta válida: se puede guardar.
                </p>
              ) : (
                <ul className="grid gap-1 rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
                  {problems.map((p) => (
                    <li key={p}>
                      <i className="pi pi-exclamation-triangle mr-2 text-[var(--wiki-muted)]" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={buttonClass({ active: problems.length === 0 })}
                  onClick={saveDraft}
                  disabled={problems.length > 0}
                >
                  Guardar en la biblioteca
                </button>
                <button className={btn(false)} onClick={() => setDraft(null)}>
                  Cerrar
                </button>
              </div>

              <div>
                <span className={label}>Así se guarda</span>
                <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-code-bg)] p-3 text-xs text-[var(--wiki-text)]">
                  {formatJson(toStoredVariant(editing))}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Un tipo, con sus variantes -------------------------------------------

function TypeSection({
  type,
  bag,
  rotation,
  showCoords,
  span,
  form,
  btn,
  labelClass,
  onForm,
  onEditType,
  onSaveType,
  onCancelType,
  onDeleteType,
  onAddVariant,
  onEditVariant,
  onCopyVariant,
  onDeleteVariant,
}: {
  type: TileType;
  bag: number;
  rotation: number;
  showCoords: boolean;
  span: number;
  form: TypeForm | null;
  btn: (active: boolean) => string;
  labelClass: string;
  onForm: (form: TypeForm) => void;
  onEditType: () => void;
  onSaveType: () => void;
  onCancelType: () => void;
  onDeleteType: () => void;
  onAddVariant: () => void;
  onEditVariant: (def: TileDef) => void;
  onCopyVariant: (def: TileDef) => void;
  onDeleteVariant: (def: TileDef) => void;
}) {
  const notes = typeNotes(type);
  const small = "rounded-md border border-[var(--wiki-border)] px-2.5 py-1 text-xs text-[var(--wiki-text)] transition-colors hover:bg-[var(--wiki-surface-2)]";

  return (
    <section className="rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3">
      {form === null ? (
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--wiki-text)]">
            <span className="tile-swatch" data-terrain={type.terrain} />
            {type.label}
          </span>
          <code className="text-[0.7rem] text-[var(--wiki-muted)]">{type.id}</code>
          <span className="text-xs text-[var(--wiki-muted)]">
            {TERRAINS[type.terrain].label} · peso {type.weight} · {percent(type.weight / bag)} de la
            bolsa · {type.variants.length} variante{type.variants.length === 1 ? "" : "s"} ·{" "}
            {typeHexes(type)} hexágonos dibujados
          </span>
          <span className="ml-auto flex items-center gap-2">
            <button className={small} onClick={onEditType} title="Cambiar nombre, terreno o peso">
              Editar tipo
            </button>
            <button className={small} onClick={onAddVariant} title="Dibujar otra variante de este tipo">
              Añadir variante
            </button>
            <button className={small} onClick={onDeleteType} title="Quitar el tipo y todas sus variantes">
              Eliminar
            </button>
          </span>
        </div>
      ) : (
        <div className="mb-3 grid gap-3 rounded-md border border-[var(--wiki-accent)] p-3">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Id</span>
              <InputText
                value={form.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onForm({ ...form, id: e.target.value })}
                className="w-44"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Nombre</span>
              <InputText
                value={form.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onForm({ ...form, label: e.target.value })
                }
                className="w-52"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Peso en la bolsa</span>
              <SelectButton
                value={form.weight}
                onChange={(e) => onForm({ ...form, weight: Number(e.value) })}
                options={WEIGHTS}
                allowEmpty={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className={labelClass}>Terreno que define el tipo</span>
            <SelectButton
              value={form.terrain}
              onChange={(e) => onForm({ ...form, terrain: e.value as TerrainId })}
              options={TERRAIN_IDS.map((id) => ({ id, label: TERRAINS[id].label }))}
              optionLabel="label"
              optionValue="id"
              itemTemplate={(t: { id: TerrainId; label: string }) => (
                <>
                  <span className="tile-swatch" data-terrain={t.id} />
                  {t.label}
                </>
              )}
              allowEmpty={false}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className={labelClass}>Qué sitio es</span>
            <InputTextarea
              value={form.note}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onForm({ ...form, note: e.target.value })}
              rows={2}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className={btn(true)} onClick={onSaveType}>
              Guardar tipo
            </button>
            <button className={btn(false)} onClick={onCancelType}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {type.note !== "" && form === null && (
        <p className="mb-3 max-w-3xl text-xs text-[var(--wiki-muted)]">{type.note}</p>
      )}

      {notes.length > 0 && (
        <ul className="mb-3 grid gap-1 text-xs text-[var(--wiki-muted)]">
          {notes.map((note) => (
            <li key={note}>
              <i className="pi pi-info-circle mr-1.5" />
              {note}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {type.variants.map((def) => (
          <VariantCard
            key={def.id}
            def={def}
            rotation={rotation}
            showCoords={showCoords}
            span={span}
            onEdit={() => onEditVariant(def)}
            onCopy={() => onCopyVariant(def)}
            onDelete={() => onDeleteVariant(def)}
          />
        ))}
      </div>
    </section>
  );
}

// --- Tarjeta de variante ---------------------------------------------------

function VariantCard({
  def,
  rotation,
  showCoords,
  span,
  onEdit,
  onCopy,
  onDelete,
}: {
  def: TileDef;
  rotation: number;
  showCoords: boolean;
  span: number;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const instance = useMemo(() => instantiate(def, rotation, ORIGIN), [def, rotation]);

  const cells: CanvasCell[] = instance.cells.map((cell) => ({
    coord: cell.hex,
    kind: "hex",
    terrain: cell.terrain,
  }));

  const size = sizeOf(def);
  const small =
    "rounded-md border border-[var(--wiki-border)] px-2.5 py-1 text-xs text-[var(--wiki-text)] transition-colors hover:bg-[var(--wiki-surface-2)]";

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-bg)] p-3">
      {/* Nombre y peso en una línea, el id debajo: si van los tres juntos, los
          nombres largos parten la línea y las tarjetas dejan de estar alineadas. */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[var(--wiki-text)]">{def.label}</span>
          <span
            className="ml-auto whitespace-nowrap text-xs text-[var(--wiki-muted)]"
            title="El peso del tipo repartido entre sus variantes"
          >
            peso {trim(def.weight)}
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
        <li>{terrainLine(def)}</li>
        <li>
          Anclas:{" "}
          {instance.anchors.length === 0
            ? "ninguna"
            : instance.anchors.map((a) => Hex.DIR_LABELS[a.dir]).join(", ")}
        </li>
        <li>{distinctRotations(def).length} giros distintos de 6</li>
      </ul>

      {def.note !== "" && <p className="text-xs text-[var(--wiki-muted)]">{def.note}</p>}

      <div className="mt-auto flex items-center gap-2">
        <button className={small} onClick={onEdit} title="Traerla al boceto: al guardar la sustituye">
          Editar
        </button>
        <button
          className={small}
          onClick={onCopy}
          title="Empezar otra variante del mismo tipo a partir de esta"
        >
          Copiar
        </button>
        <button className={small} onClick={onDelete} title="Quitarla de la biblioteca">
          Eliminar
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
  meanAnchors: number;
  /** Cuántas variantes hay de cada nivel de tamaño. */
  bySize: Record<number, number>;
  /** Fracción de hexágonos de cada terreno que produce la bolsa, por peso. */
  hexShare: Partial<Record<TerrainId, number>>;
};

/**
 * Lo que dice la bolsa antes de generar nada. `hexShare` es el número que
 * importa, y desde que todo hexágono lleva terreno lo es del todo: ya no se
 * sortea nada, así que el terreno del tablero SALE DE AQUÍ. Es lo que hay que
 * mover para acercarse a la tabla A (board-map.md §2c).
 *
 * En el tablero real cambia un poco, porque el encaje no reparte las losetas de
 * forma uniforme: una con sendero solo entra donde encuentra un ancla de camino
 * libre que le sirva.
 */
function bagStats(types: readonly TileType[]): BagStats {
  let weightedHexes = 0;
  let roadWeight = 0;
  let withRoad = 0;
  let hexes = 0;
  let anchors = 0;
  let count = 0;
  const bySize: Record<number, number> = {};
  const weighted: Partial<Record<TerrainId, number>> = {};

  for (const type of types) {
    for (const def of type.variants) {
      const roads = roadsOf(def).length;
      count++;
      weightedHexes += def.weight * def.cells.length;
      hexes += def.cells.length;
      anchors += def.anchors.length;
      bySize[sizeOf(def).level] = (bySize[sizeOf(def).level] ?? 0) + 1;
      for (const [terrain, n] of terrainCounts(def)) {
        weighted[terrain] = (weighted[terrain] ?? 0) + def.weight * n;
      }
      if (roads > 0) {
        withRoad++;
        roadWeight += def.weight;
      }
    }
  }

  const bag = types.reduce((sum, type) => sum + type.weight, 0) || 1;
  const hexShare: Partial<Record<TerrainId, number>> = {};
  for (const [terrain, n] of Object.entries(weighted) as Array<[TerrainId, number]>) {
    hexShare[terrain] = n / (weightedHexes || 1);
  }

  return {
    meanHexes: hexes / (count || 1),
    withRoad,
    roadTileShare: roadWeight / bag,
    meanAnchors: anchors / (count || 1),
    bySize,
    hexShare,
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

/** De qué está hecha una loseta, del terreno que más tiene al que menos. */
function terrainLine(def: TileDef): string {
  return [...terrainCounts(def)]
    .sort((a, b) => b[1] - a[1])
    .map(([terrain, n]) => `${n} ${TERRAINS[terrain].label}`)
    .join(" · ");
}

function percent(fraction: number): string {
  return `${Math.round(fraction * 100)} %`;
}

/** Un peso repartido: con decimales solo si los tiene (1,5 sí; 2,00 no). */
function trim(weight: number): string {
  return weight.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
