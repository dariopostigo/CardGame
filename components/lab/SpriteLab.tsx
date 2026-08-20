"use client";

// =========================================================================
// Laboratorio de ANIMACIÓN DE PERSONAJE — /lab/sprite
//
// Preview aislado, sin tablero: recorta la lámina de referencia
// (public/assets/v2/sprites/dwarf-warrior-reference.png) en sus 20 fotogramas
// y los reproduce como Reposo/Andar (bucle) y Ataque (una vez, y vuelve solo
// a Reposo). No monta HexBoard ni BoardPiece — la ficha del tablero hexagonal
// sigue siendo el disco cenital decidido en board-map.md §4c, y esta figura
// de pie choca con esa regla. Esto es deliberadamente solo la prueba de la
// animación en sí: dónde acaba viviendo de verdad (¿ficha de tablero? ¿una
// futura pantalla de batalla, board/battle.md?) es una decisión aparte,
// todavía sin tomar.
//
// El interruptor de calibración existe porque la lámina fuente es una
// referencia, no un spritesheet exportado con rejilla exacta: los recortes
// de sprite-frames.ts son un primer cálculo y se espera retocarlos a mano
// viendo el recorte actual contra la lámina completa.
// =========================================================================

import { useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import AnimatedSprite from "@/components/game/board/AnimatedSprite";
import {
  ATTACK_FRAMES,
  IDLE_FRAMES,
  SHEET_HEIGHT,
  SHEET_WIDTH,
  SPRITE_SHEET_SRC,
  WALK_FRAMES,
  type FrameRect,
} from "@/components/game/board/sprite-frames";
import Button from "@/components/ui/Button";

type LoopState = "idle" | "walk";

const LOOP_OPTIONS: { label: string; value: LoopState }[] = [
  { label: "Reposo", value: "idle" },
  { label: "Andar", value: "walk" },
];

/** Fotogramas por segundo de partida: ni tan lento que se lea como slideshow
 *  ni tan rápido que se pierda qué pose es cada fotograma. Ajustable en vivo
 *  con el slider de abajo — no hay "velocidad correcta" única que fijar aquí. */
const DEFAULT_FPS = 8;
const MIN_FPS = 2;
const MAX_FPS = 20;

/** Escala de la lámina completa en la vista de calibración: a tamaño real
 *  (1693×929) no cabría cómoda en la mayoría de pantallas. */
const CALIBRATION_SCALE = 0.5;

const labelClass = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

export default function SpriteLab() {
  const [loopState, setLoopState] = useState<LoopState>("idle");
  const [attacking, setAttacking] = useState(false);
  const [fps, setFps] = useState(DEFAULT_FPS);
  const [calibrating, setCalibrating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<FrameRect>(IDLE_FRAMES[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const frames = attacking ? ATTACK_FRAMES : loopState === "idle" ? IDLE_FRAMES : WALK_FRAMES;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Animación de personaje</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Preview aislado de un sprite animado: recorta{" "}
        <code>public/assets/v2/sprites/dwarf-warrior-reference.png</code> (lámina de referencia de
        Dario) en sus 20 fotogramas y los reproduce como <b>Reposo</b> y <b>Andar</b> en bucle, y{" "}
        <b>Ataque</b> una sola vez —vuelve solo a Reposo al terminar, como ya rotula la propia
        lámina—. No toca el tablero hexagonal: esa ficha sigue siendo el disco cenital de siempre
        (<code>board-map.md</code> §4c); esto es solo para validar que la animación en sí funciona
        y se siente bien.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La lámina es una referencia generada por bloques, no un spritesheet exportado con rejilla
        exacta: los recortes de <code>sprite-frames.ts</code> son un primer cálculo. Activa{" "}
        <b>Calibración</b> para ver el recorte actual contra la lámina completa y detectar
        cualquier fotograma desalineado.
      </p>

      <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1" title="Reposo y Andar son bucles continuos; Ataque es aparte, ver el botón.">
          <span className={labelClass}>Estado</span>
          <SelectButton
            value={loopState}
            onChange={(e) => e.value != null && setLoopState(e.value)}
            options={LOOP_OPTIONS}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1" title="Reproduce las 7 poses de ataque una vez y vuelve solo al estado de arriba.">
          <span className={labelClass}>Acción</span>
          <Button onClick={() => setAttacking(true)} disabled={attacking}>
            {attacking ? "Atacando…" : "¡Atacar!"}
          </Button>
        </div>

        <div className="flex flex-col gap-1" title="Cuánto dura cada fotograma en pantalla. No hay una cadencia 'correcta' única: se ajusta a ojo.">
          <span className={labelClass}>Velocidad · {fps} fps</span>
          <Slider
            value={fps}
            min={MIN_FPS}
            max={MAX_FPS}
            onChange={(e: SliderChangeEvent) => typeof e.value === "number" && setFps(e.value)}
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1" title="Superpone el recorte del fotograma actual sobre la lámina completa, para afinar sprite-frames.ts a ojo.">
          <span className={labelClass}>Calibración</span>
          <div className="flex items-center gap-2">
            <InputSwitch checked={calibrating} onChange={(e) => setCalibrating(Boolean(e.value))} />
          </div>
        </div>
      </div>

      <div className="sprite-lab__stage rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)]">
        {/* key por bloque: al cambiar Reposo/Andar/Ataque, React remonta
            AnimatedSprite entero en vez de reciclar la instancia — así nace
            en su propio fotograma 0 sin necesitar un efecto que lo resetee
            (ver el comentario de cabecera de AnimatedSprite.tsx). */}
        <AnimatedSprite
          key={attacking ? "attack" : loopState}
          sheetSrc={SPRITE_SHEET_SRC}
          frames={frames}
          mode={attacking ? "once" : "loop"}
          fps={fps}
          scale={1.4}
          onCycleComplete={() => setAttacking(false)}
          onFrameChange={(frame, index) => {
            setCurrentFrame(frame);
            setCurrentIndex(index);
          }}
        />
      </div>

      <p className="mt-2 text-sm text-[var(--wiki-muted)]">
        Fotograma {currentIndex + 1} de {frames.length}
        {currentFrame.label ? ` · ${currentFrame.label}` : ""}
      </p>

      {calibrating && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-[var(--wiki-muted)]">
            Recorte actual (rect rojo) sobre la lámina completa ({SHEET_WIDTH}×{SHEET_HEIGHT} px) —
            si el rect no encierra la pose limpiamente, ajusta ese fotograma en{" "}
            <code>components/game/board/sprite-frames.ts</code>.
          </p>
          <div
            className="sprite-lab__calibration"
            style={{ width: SHEET_WIDTH * CALIBRATION_SCALE, height: SHEET_HEIGHT * CALIBRATION_SCALE }}
          >
            {/* Lámina completa: imagen de depuración, no arte de partida — por
                eso <img> plano en vez de introducir next/image para un único uso. */}
            <img
              className="sprite-lab__calibration-sheet"
              src={SPRITE_SHEET_SRC}
              alt="Lámina de referencia completa, para calibrar los recortes"
              width={SHEET_WIDTH * CALIBRATION_SCALE}
              height={SHEET_HEIGHT * CALIBRATION_SCALE}
            />
            <div
              className="sprite-lab__calibration-box"
              style={{
                left: currentFrame.x * CALIBRATION_SCALE,
                top: currentFrame.y * CALIBRATION_SCALE,
                width: currentFrame.w * CALIBRATION_SCALE,
                height: currentFrame.h * CALIBRATION_SCALE,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
