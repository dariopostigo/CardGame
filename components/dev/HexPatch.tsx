"use client";

// =========================================================================
// El retal en pantalla — el suelo que comparten /dev/animacion y /dev/baraja
//
// Aquí vive lo que las dos pantallas PINTAN igual: la lámina de suelo, el
// terreno que se ofrece, la rejilla, el lienzo del polvo y las manchas de
// sombra. La cuenta de dónde cae cada hexágono no está aquí —es geometría y
// vive en lib/v3/patch.ts, que se puede comprobar sin pantalla—; esto es el
// SVG y los hooks que lo atan a una caja que cambia de tamaño.
//
// POR QUÉ EXISTE: estaba escrito dos veces, y no en espíritu sino literalmente.
// El mismo `<svg>` con las mismas tres capas, los mismos degradados, las mismas
// manchas, y unas 145 líneas de SCSS casi idénticas entre _animation-lab.scss y
// _baraja-lab.scss cuya única diferencia real era el z-index. Cada copia tenía
// además su propio prefijo de clase (`anim__` y `baraja-lab__`), así que
// arreglar el color del suelo eran dos sitios y acordarse.
//
// LO QUE NO ENTRA, y es lo que permite que sirva a las dos: nada que sepa qué se
// pone encima. Aquí no hay fichas, ni cartas, ni Mazo, ni barra de mandos. Las
// fichas del banco son DOM y las de la baraja son SVG dentro de su propio
// lienzo, y esa diferencia es real —una es un disco con un glifo y la otra la
// ficha de verdad de /dev/pieza—, así que cada pantalla monta sus capas encima
// de estas y decide su apilado en su propio parcial.
//
// EL ORDEN DE LAS TRES CAPAS DEL SUELO NO ES LIBRE: la oferta va ENTRE el suelo
// y la rejilla. Es el terreno encendiéndose, no una chapa por encima, así que
// las líneas de la rejilla tienen que seguir viéndose sobre ella.
//
// Ninguna regla de juego vive aquí (ARCHITECTURE.md §6).
// =========================================================================

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  PATCH,
  fitPatch,
  type FitOptions,
  type PatchLayout,
  type PatchSpec,
} from "@/lib/v3/patch";
import type { HexKey } from "@/lib/v3/hex";
import { offerCell } from "./motion/offer";
import type { Timings } from "@/lib/v3/anim";
import { DustField } from "./dust";

export type Box = { readonly w: number; readonly h: number };

/**
 * La caja del escenario, medida en vivo.
 *
 * Se redondea a enteros a propósito: el `ResizeObserver` entrega fracciones y
 * sin redondear, un cambio de 0,4 px repintaría el retal entero volviendo a
 * calcular quince polígonos y su malla.
 */
export function usePatchBox(ref: RefObject<HTMLElement | null>): Box {
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: Math.round(width), h: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return box;
}

/**
 * La caja y el retal ya medido dentro de ella.
 *
 * Devuelve las dos cosas porque las dos hacen falta: el `viewBox` del SVG y el
 * tamaño del lienzo del polvo son de la CAJA, y todo lo demás es del retal.
 *
 * `options` se lee por su contenido y no por identidad: escrito en línea en el
 * cuerpo de un componente —que es como se escribe— sería un objeto nuevo en cada
 * repintado y volvería a medir siempre.
 */
export function usePatchLayout(
  ref: RefObject<HTMLElement | null>,
  spec: PatchSpec = PATCH,
  options: FitOptions = {},
): { box: Box; layout: PatchLayout | null } {
  const box = usePatchBox(ref);
  const key = JSON.stringify([spec, options]);
  const layout = useMemo(
    () => fitPatch(spec, box, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [box.w, box.h, key],
  );
  return { box, layout };
}

/**
 * El campo de polvo atado a un lienzo.
 *
 * El lienzo tiene que EXISTIR al montar, así que va siempre pintado y nunca
 * dentro de un `layout && …`: metido en la condición, en el primer pintado no
 * hay medida, el nodo no existe, el efecto se queda sin lienzo y no vuelve a
 * intentarlo — y no se ve el polvo nunca más.
 */
export function useDustField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  box: Box,
): RefObject<DustField | null> {
  const field = useRef<DustField | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const made = new DustField(canvas);
    field.current = made;
    return () => {
      made.destroy();
      field.current = null;
    };
  }, [canvasRef]);
  useEffect(() => {
    if (box.w > 0 && box.h > 0) field.current?.resize(box.w, box.h);
  }, [box.w, box.h]);
  return field;
}

type GroundProps = {
  layout: PatchLayout;
  /** Destino → a cuántos pasos está del origen. Los pasos son los que ordenan la onda. */
  offered?: ReadonlyMap<HexKey, number> | null;
  timings: Timings;
  /** Para poder marcar el candidato en el DOM sin repintar React sesenta veces por segundo. */
  cellRef?: (key: HexKey) => (node: SVGPolygonElement | null) => void;
};

/**
 * EL SUELO, con sus tres capas.
 *
 * La lámina es una sola pintura para los quince hexágonos y no un color por
 * casilla: el degradado va en coordenadas de usuario, así que la unión se lee
 * como una superficie sola. Es la misma decisión que toma ArenaBoard desde la
 * dirección de arte, y aquí hace falta por lo mismo — sin ella el polvo cae
 * sobre un mosaico.
 *
 * El id del degradado sale de `useId` y no es una cadena fija: en el catálogo de
 * animaciones hay ocho retales en la misma página, y ocho `<linearGradient
 * id="soil">` en un documento son un id repetido — todos los SVG se pintarían
 * con el primero que encontrase el navegador.
 */
export function PatchGround({ layout, offered, timings, cellRef }: GroundProps) {
  const uid = useId().replace(/[^\w-]/g, "");
  const soilId = `patch-soil-${uid}`;
  const { w, h } = layout.box;

  // El degradado va del canto de arriba del retal al de abajo, MEDIDO sobre las
  // celdas y no sobre la caja: el retal ocupa la parte alta del escenario y lo
  // que queda debajo es para la mano, así que un degradado repartido por el alto
  // entero se quedaría a medio camino justo donde el suelo termina.
  const top = Math.min(...layout.cells.map((c) => c.y)) - layout.size * layout.tilt;
  const bottom = Math.max(...layout.cells.map((c) => c.y)) + layout.size * layout.tilt;

  return (
    <svg
      className="patch__ground"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={soilId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={top}
          x2="0"
          y2={bottom}
        >
          <stop offset="0" className="patch__soil-far" />
          <stop offset="0.55" className="patch__soil-mid" />
          <stop offset="1" className="patch__soil-near" />
        </linearGradient>
      </defs>

      <g className="patch__soil" fill={`url(#${soilId})`}>
        {layout.cells.map((c) => (
          <polygon key={c.key} points={c.points} />
        ))}
      </g>

      {/* EL TERRENO QUE SE OFRECE. Los polígonos están SIEMPRE puestos y lo que
          cambia es un atributo, no la lista: un elemento que acaba de nacer no
          puede hacer una transición —React lo monta ya en su estado final—, así
          que montarlos y desmontarlos daría un encendido seco y ninguna onda. */}
      <g className="patch__offer">
        {layout.cells.map((c) => {
          const steps = offered?.get(c.key);
          return (
            <polygon
              key={c.key}
              ref={cellRef?.(c.key)}
              points={c.points}
              data-offered={steps !== undefined ? "true" : "false"}
              style={offerCell(steps, timings)}
            />
          );
        })}
      </g>

      <g className="patch__mesh">
        {layout.mesh.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>
    </svg>
  );
}

/** El lienzo del polvo. Va por encima del suelo y por debajo de las fichas. */
export function PatchDust({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  return <canvas className="patch__dust" ref={canvasRef} aria-hidden />;
}

/**
 * El tamaño de una mancha de suelo, derivado del hexágono.
 *
 * Una mancha más ancha que alta porque el suelo va comprimido por la cámara: una
 * sombra circular sobre un tablero inclinado se lee como un agujero.
 */
export function blotSize(layout: PatchLayout): { width: string; height: string } {
  const w = layout.size * 1.5;
  return { width: `${w}px`, height: `${w * layout.tilt * 0.62}px` };
}

/**
 * Una mancha de suelo: un punto sin tamaño que lleva el `translate`, y dentro la
 * mancha que sí se ve, centrada sobre él con su propio -50 %.
 *
 * Son dos elementos y no uno para que el tamaño de la mancha pueda depender del
 * hexágono sin que ninguna de las dos transformaciones tenga que saber de la
 * otra: si fueran el mismo nodo, el `translate` que escribe JS sesenta veces por
 * segundo tendría que arrastrar el centrado en la misma cadena.
 */
export function PatchShadow({
  layout,
  nodeRef,
  blotRef,
  dataFor,
  style,
}: {
  layout: PatchLayout;
  /** El punto que se mueve: lo escribe el gesto o la secuencia. */
  nodeRef?: (node: HTMLDivElement | null) => void;
  /** La mancha, si además tiene que respirar por su cuenta. */
  blotRef?: (node: HTMLDivElement | null) => void;
  /** A quién pertenece, para poder emparejarla desde el DOM sin un mapa más. */
  dataFor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="patch__shadow" ref={nodeRef} data-for={dataFor} style={style}>
      <div className="patch__blot" ref={blotRef} style={blotSize(layout)} />
    </div>
  );
}
