"use client";

// =========================================================================
// Laboratorio de PERSONAJE 3D — /lab/character
//
// La alternativa a la lámina de sprites de /lab/sprite: en vez de hornear
// fotogramas, se carga un .glb que ya trae malla + esqueleto + clips y el
// navegador reproduce el que toque. Toda la escena vive en
// character-scene.ts, sin React de por medio; este componente solo monta el
// lienzo, ofrece los mandos y enseña las cifras que devuelve el motor.
//
// Lo que se decide aquí NO es "qué personaje", es si el pipeline sale a
// cuenta: generar el modelo en una IA 3D (Meshy y similares), auto-riggearlo,
// pegarle animaciones de biblioteca y soltar el .glb. La pregunta que hace
// que ese pipeline sea viable es que animar no escala con el número de
// personajes —los clips van sobre un esqueleto, no sobre un personaje—, así
// que el nº 12 cuesta generarlo, no animarlo.
//
// Los dos modelos cargados son PRESTADOS y de licencia libre (créditos en
// public/assets/v2/models/README.md): están para medir el pipeline antes de
// generar los héroes de verdad. El zorro no es decoración: cubre el caso
// cuadrúpedo de characters/enemies.md, que es justo donde los auto-rig de IA
// empiezan a fallar.
//
// Deliberadamente NO toca el tablero. La ficha del hexágono sigue siendo el
// disco cenital de board-map.md §4c; dónde acaba viviendo un personaje
// animado —¿ficha? ¿pantalla de batalla de board/battle.md?— es la misma
// decisión abierta que ya declara SpriteLab.tsx, y este lab no la cierra.
// =========================================================================

import { useEffect, useRef, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import { buttonClass } from "@/components/ui/Button";
import {
  CHARACTER_MODELS,
  MODELS_BY_ID,
  formatBytes,
  type CharacterModel,
} from "./character-models";
import {
  mountCharacterScene,
  type CameraView,
  type CharacterInfo,
  type CharacterSceneHandle,
  type LoopMode,
} from "./character-scene";

const VIEW_OPTIONS: { label: string; value: CameraView }[] = [
  { label: "Tablero", value: "tablero" },
  { label: "Retrato", value: "retrato" },
];

const LOOP_OPTIONS: { label: string; value: LoopMode }[] = [
  { label: "En bucle", value: "bucle" },
  { label: "Una vez", value: "una-vez" },
];

/** Velocidad en porcentaje: el slider trabaja en enteros y el motor en
 *  multiplicador, así que se divide entre 100 al pasarlo. */
const MIN_SPEED = 25;
const MAX_SPEED = 200;

const labelClass = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

export default function CharacterLab() {
  const [modelId, setModelId] = useState<string>(CHARACTER_MODELS[0].id);
  const [info, setInfo] = useState<CharacterInfo | null>(null);
  const [clip, setClip] = useState<string | null>(null);
  const [speed, setSpeed] = useState(100);
  const [loopMode, setLoopMode] = useState<LoopMode>("bucle");
  const [view, setView] = useState<CameraView>("tablero");
  const [tokenSize, setTokenSize] = useState(false);
  const [stats, setStats] = useState<{ fps: number; calls: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<CharacterSceneHandle | null>(null);

  const model: CharacterModel = MODELS_BY_ID[modelId];

  // El motor se monta una sola vez y vive fuera de React: los efectos de
  // abajo lo mutan por su handle, nunca lo reconstruyen. Recrear la escena en
  // cada cambio de estado tiraría el contexto WebGL a cada clic.
  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;

    const handle = mountCharacterScene(container, { onStats: setStats });
    sceneRef.current = handle;

    return () => {
      handle.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Cargar modelo. El .glb viaja por red, así que la respuesta puede llegar
  // después de que el usuario haya cambiado de modelo: `cancelled` descarta
  // la tardía por el lado de React, y el motor tiene su propio testigo.
  useEffect(() => {
    const handle = sceneRef.current;
    if (!handle) return;
    let cancelled = false;

    setInfo(null);
    setClip(null);
    setError(null);

    handle
      .load(model.url)
      .then((loaded) => {
        if (cancelled) return;
        setInfo(loaded);
        const first = loaded.clips.includes(model.defaultClip)
          ? model.defaultClip
          : loaded.clips[0];
        if (first) {
          setClip(first);
          handle.playClip(first);
        }
      })
      .catch(() => {
        if (!cancelled) setError(`No se ha podido cargar ${model.url}`);
      });

    return () => {
      cancelled = true;
    };
  }, [model]);

  useEffect(() => {
    sceneRef.current?.setSpeed(speed / 100);
  }, [speed]);

  useEffect(() => {
    sceneRef.current?.setLoopMode(loopMode);
  }, [loopMode]);

  useEffect(() => {
    sceneRef.current?.setView(view);
  }, [view]);

  function handleClip(name: string) {
    setClip(name);
    sceneRef.current?.playClip(name);
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Personaje 3D</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La otra vía para animar un personaje, frente a la lámina de sprites de{" "}
        <a className="underline" href="/lab/sprite">
          Animación de personaje
        </a>
        : un archivo <code>.glb</code> que ya trae dentro la malla, el esqueleto y los clips, y un{" "}
        <code>AnimationMixer</code> que reproduce el que toque. No se hornea ningún fotograma, así
        que el personaje se puede mirar desde cualquier ángulo y cambiar de animación con un
        fundido en vez de con un corte.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Lo que se está midiendo no es el modelo —estos dos son prestados, de licencia libre— sino
        si el pipeline sale a cuenta: <strong>animar no escala con el número de personajes</strong>
        , porque los clips se aplican a un esqueleto y no a un personaje. Un auto-rig más una
        biblioteca de animaciones dan el mismo repertorio a todos, y lo que cuesta por personaje es
        generarlo, no animarlo. Las cifras de abajo son la contrapartida: esto se descarga y se
        dibuja cada frame, cosa que un PNG no hace.
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Modelo</span>
          <SelectButton
            value={modelId}
            onChange={(e) => e.value && setModelId(e.value)}
            options={CHARACTER_MODELS.map((m) => ({ label: m.label, value: m.id }))}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Vista</span>
          <SelectButton
            value={view}
            onChange={(e) => e.value && setView(e.value)}
            options={VIEW_OPTIONS}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Repetición</span>
          <SelectButton
            value={loopMode}
            onChange={(e) => e.value && setLoopMode(e.value)}
            options={LOOP_OPTIONS}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <button
          className={buttonClass({ variant: "primary" })}
          onClick={() => sceneRef.current?.replay()}
          disabled={!clip}
        >
          Repetir
        </button>

        <div className="flex flex-col gap-1">
          <span className={labelClass}>Velocidad · {speed}%</span>
          <Slider
            className="w-48"
            value={speed}
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={5}
            onChange={(e: SliderChangeEvent) => setSpeed(e.value as number)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--wiki-muted)]">
          <InputSwitch checked={tokenSize} onChange={(e) => setTokenSize(e.value ?? false)} />
          Tamaño ficha
        </label>
      </div>

      {/* Los clips salen del archivo, no de una lista escrita a mano: es
          justo lo que se quiere comprobar de una biblioteca de animaciones. */}
      <div className="mb-4">
        <span className={`${labelClass} mb-1 block`}>
          Animación {info ? `· ${info.clips.length} clips en el archivo` : ""}
        </span>
        <div className="flex flex-wrap gap-2">
          {info?.clips.map((name) => (
            <button
              key={name}
              className={buttonClass({ size: "sm", active: name === clip })}
              onClick={() => handleClip(name)}
            >
              {name}
            </button>
          ))}
          {!info && !error && (
            <span className="text-sm text-[var(--wiki-muted)]">Cargando modelo…</span>
          )}
          {error && <span className="text-sm text-[var(--wiki-danger)]">{error}</span>}
        </div>
      </div>

      <div className="character-lab">
        <div
          ref={stageRef}
          className={`character-lab__stage ${tokenSize ? "character-lab__stage--token" : ""}`}
        />

        <dl className="character-lab__stats">
          <div>
            <dt>Peso</dt>
            <dd>{formatBytes(model.bytes)}</dd>
          </div>
          <div>
            <dt>Triángulos</dt>
            <dd>{info ? info.triangles.toLocaleString("es-ES") : "—"}</dd>
          </div>
          <div>
            <dt>Huesos</dt>
            <dd>{info ? info.bones : "—"}</dd>
          </div>
          <div>
            <dt>Materiales</dt>
            <dd>{info ? info.materials : "—"}</dd>
          </div>
          <div>
            <dt>Llamadas de dibujo</dt>
            <dd>{stats ? stats.calls : "—"}</dd>
          </div>
          <div>
            <dt>FPS</dt>
            <dd>{stats ? stats.fps : "—"}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 max-w-3xl text-xs text-[var(--wiki-muted)]">
        Arrastra para orbitar y usa la rueda para acercarte. «Tamaño ficha» encoge el lienzo a lo
        que ocuparía sobre un hexágono: es la prueba de verdad, porque a ese tamaño una malla
        mediocre se ve perfectamente bien y detalle que no se lee no hay que pagarlo.{" "}
        <strong>{model.label}</strong> — rig {model.rig}, {model.credit}.
      </p>
    </div>
  );
}
