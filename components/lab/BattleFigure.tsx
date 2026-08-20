"use client";

// =========================================================================
// Envoltorio React de la figura 3D del tablero de batalla
//
// Mismo reparto de siempre en esta casa: el motor (battle-figure-scene.ts) es
// imperativo y vive fuera de React —monta, devuelve un mando, se destruye— y
// esto solo traduce props a llamadas de ese mando. React no repinta un
// fotograma: si el árbol de componentes tuviera que enterarse de cada frame,
// una batalla costaría 60 renders por segundo.
//
// Se monta como `overlay` de HexBoard, así que recibe la proyección del
// tablero ya resuelta y no tiene que saber nada de zoom ni de arrastre.
// =========================================================================

import { useEffect, useRef } from "react";
import * as Hex from "@/lib/v2/rules/hex";
import type { HexCoord } from "@/lib/v2/rules/hex";
import type { BoardProjection } from "@/components/game/board/HexBoard";
import {
  mountBattleFigure,
  type BattleFigureHandle,
  type FigureInfo,
  type FigurePose,
} from "./battle-figure-scene";

/**
 * Una pose pedida por el combate. Lleva `nonce` porque el mismo evento puede
 * repetirse —dos ataques seguidos son dos veces `attack`— y sin un contador
 * React no vería ningún cambio de props y la segunda animación no saldría.
 */
export type FigureEvent = {
  readonly pose: FigurePose;
  readonly nonce: number;
  /** Hacia dónde mirar al hacerlo (el objetivo del ataque, normalmente). */
  readonly facing?: HexCoord | null;
};

type Props = {
  projection: BoardProjection;
  /** El .glb a cargar. */
  url: string;
  /** Dónde está. `null` = todavía no está en el tablero (no se pinta). */
  coord: HexCoord | null;
  /** Altura en radios de hexágono. */
  height: number;
  event: FigureEvent | null;
  onInfo?: (info: FigureInfo) => void;
  onError?: (message: string) => void;
};

export default function BattleFigure({ projection, url, coord, height, event, onInfo, onError }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const figureRef = useRef<BattleFigureHandle | null>(null);
  /** Si ya se colocó una vez: la primera aparición es un salto, no un paseo. */
  const placedRef = useRef(false);

  // Los callbacks en una ref para que el efecto de carga no dependa de su
  // identidad: si dependiera, un padre que los recree en cada render
  // recargaría el .glb entero a cada pintado.
  //
  // Se refresca en un efecto y no durante el render (que sería escribir en una
  // ref mientras React pinta), y va DECLARADO EL PRIMERO a propósito: los
  // efectos corren en orden de declaración, así que cuando el de carga de más
  // abajo se dispare, la ref ya tiene los callbacks de este render.
  const callbacksRef = useRef({ onInfo, onError });
  useEffect(() => {
    callbacksRef.current = { onInfo, onError };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const figure = mountBattleFigure(host);
    figureRef.current = figure;
    return () => {
      figure.destroy();
      figureRef.current = null;
      placedRef.current = false;
    };
  }, []);

  // La proyección se empuja en cada render del tablero (zoom, arrastre,
  // redimensión). Es una asignación de números al frustum, no un remontaje.
  useEffect(() => {
    figureRef.current?.setProjection(projection);
  }, [projection]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    let cancelled = false;
    placedRef.current = false;
    figure
      .load(url)
      .then((info) => {
        if (!cancelled) callbacksRef.current.onInfo?.(info);
      })
      .catch((error: unknown) => {
        if (!cancelled) callbacksRef.current.onError?.(String(error));
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    figureRef.current?.setHeight(height);
  }, [height]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    figure.setVisible(coord !== null);
    if (!coord) {
      placedRef.current = false;
      return;
    }
    const { x, y } = Hex.toPixel(coord, projection.hexSize, projection.tilt);
    if (placedRef.current) {
      // Ya estaba en el tablero: esto es un movimiento, así que va andando.
      void figure.walkTo(x, y);
    } else {
      figure.placeAt(x, y);
      placedRef.current = true;
    }
    // La proyección entra en la conversión de hexágono a píxeles, pero NO debe
    // disparar este efecto: al hacer zoom la figura no se ha movido de casilla
    // y volver a entrar aquí la haría "andar" hasta su propio sitio. La
    // proyección solo cambia hexSize/tilt si cambia el tablero entero, y
    // entonces se remonta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure || !event) return;
    if (event.facing) {
      const { x, y } = Hex.toPixel(event.facing, projection.hexSize, projection.tilt);
      figure.facePoint(x, y);
    }
    figure.play(event.pose);
    // Igual que arriba: lo que dispara la pose es el evento, no la cámara.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return <div ref={hostRef} className="board__overlay-host" />;
}
