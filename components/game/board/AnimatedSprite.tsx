"use client";

// =========================================================================
// Reproductor de fotogramas de un sprite (presentacional)
//
// Recibe una lámina y una lista de recortes, y pinta el que toca. No decide
// nada de diseño: el recorte de cada fotograma vive en sprite-frames.ts y el
// tamaño de fila lo decide quien lo monta (SpriteLab.tsx hoy). El recorte se
// hace con la técnica clásica de spritesheet en CSS —`background-position`
// sobre un lienzo de tamaño fijo—, así que no hace falta exportar un archivo
// por fotograma: la lámina entera sirve de fuente.
//
// El avance de fotograma va por estado de React (índice + `setInterval`), no
// por `@keyframes` CSS: los tres bloques de sprite-frames.ts tienen
// fotogramas de tamaño distinto entre sí (5/8/7 columnas repartidas en el
// mismo ancho), así que una animación CSS declarativa necesitaría variables
// por bloque sin ganar nada frente a un índice simple que lee una tabla no
// uniforme.
//
// Cambiar de bloque (Reposo → Andar → Ataque) siempre tiene que arrancar en
// el primer fotograma del bloque nuevo — pero eso NO se resuelve reseteando
// `frameIndex` desde un efecto (dispara un render en cascada, ver
// react-hooks/set-state-in-effect): quien monta este componente pasa una
// prop `key` distinta por bloque (SpriteLab.tsx), así que React remonta el
// componente entero y `frameIndex` nace en 0 solo, sin efecto que lo fuerce.
// =========================================================================

import { useEffect, useRef, useState } from "react";
import { SHEET_HEIGHT, SHEET_WIDTH, type FrameRect } from "./sprite-frames";

type Props = {
  sheetSrc: string;
  frames: readonly FrameRect[];
  /** "loop" para Reposo/Andar; "once" para Ataque, que vuelve solo a Reposo. */
  mode: "loop" | "once";
  /** Fotogramas por segundo: cuánto dura cada uno en pantalla. */
  fps: number;
  /** Solo se usa en mode="once": avisa cuándo se ha pintado el último fotograma. */
  onCycleComplete?: () => void;
  /** Se llama tras cada cambio de fotograma, con el propio recorte y su índice. */
  onFrameChange?: (frame: FrameRect, index: number) => void;
  /** Multiplicador sobre el tamaño real del recorte en la lámina. */
  scale?: number;
};

export default function AnimatedSprite({
  sheetSrc,
  frames,
  mode,
  fps,
  onCycleComplete,
  onFrameChange,
  scale = 1,
}: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  // Evita que un onCycleComplete de un ciclo "once" ya terminado se dispare
  // otra vez si fps/onCycleComplete cambian de identidad entre renders.
  const firedComplete = useRef(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval: ReturnType<typeof setInterval> | undefined;

    const sync = () => {
      if (interval) clearInterval(interval);
      // Reducir movimiento se queda en el fotograma actual, no en el primero:
      // si ya se había avanzado, no hay razón para saltar hacia atrás.
      if (calm.matches) return;

      interval = setInterval(() => {
        setFrameIndex((i) => {
          const next = i + 1;
          if (next < frames.length) return next;
          if (mode === "loop") return 0;
          // mode "once": se queda en el último fotograma y avisa una sola vez.
          if (interval) clearInterval(interval);
          if (!firedComplete.current) {
            firedComplete.current = true;
            onCycleComplete?.();
          }
          return i;
        });
      }, 1000 / fps);
    };

    sync();
    calm.addEventListener("change", sync);
    return () => {
      if (interval) clearInterval(interval);
      calm.removeEventListener("change", sync);
    };
    // frames entra por identidad (cambia de array al cambiar de bloque), no
    // por contenido: sprite-frames.ts exporta arrays const estables.
  }, [frames, mode, fps, onCycleComplete]);

  const frame = frames[Math.min(frameIndex, frames.length - 1)];

  useEffect(() => {
    onFrameChange?.(frame, frameIndex);
  }, [frame, frameIndex, onFrameChange]);

  return (
    <div
      className="sprite-frame"
      role="img"
      aria-label={frame.label ? `Sprite de referencia: ${frame.label}` : "Sprite de referencia"}
      style={{
        width: frame.w * scale,
        height: frame.h * scale,
        backgroundImage: `url(${sheetSrc})`,
        backgroundPosition: `${-frame.x * scale}px ${-frame.y * scale}px`,
        backgroundSize: `${SHEET_WIDTH * scale}px ${SHEET_HEIGHT * scale}px`,
      }}
    />
  );
}
