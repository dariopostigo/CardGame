"use client";

// =========================================================================
// La tira de fichas por tier (presentacional)
//
// TODAS las fichas de una raza, una detrás de otra en su orden de progresión
// *(Dario, 2 de septiembre de 2026)*. Y no es un catálogo por gusto: es lo que
// contesta las tres preguntas que una ficha suelta no puede contestar, porque
// las tres son comparaciones.
//
//   1. ¿EL ENCUADRE VALE PARA LAS DOCE? El encuadre es uno para toda la ficha
//      —un 55% del alto del archivo—, pero las ilustraciones no están encuadradas
//      igual entre ellas: los pies caen entre el 77% y el 91% del alto según el
//      archivo (public/assets/v3/README.md). Con una ficha delante se ve si esa
//      cae bien; con doce se ve si el encuadre es una decisión o una lotería.
//   2. ¿SE DISTINGUEN ENTRE SÍ? Doce fichas del mismo bando y de la misma raza,
//      donde lo único distinto es el retrato. Es el caso que battle.md §8 tiene
//      pendiente, mirado por el lado del sujeto y no por el del bando.
//   3. ¿AGUANTA EL TIER 8? La ❤️ Vida llega a tres cifras al final de la
//      progresión y empieza con dos, así que el peor caso de las gemas no está
//      en la ficha que se elija: está siempre en la última de la tira.
//
// Se pinta con el mismo `pieceGeometry` y el mismo `PieceToken` que la arena, y
// cada ficha sobre su propia casilla dibujada, por lo mismo que el calibre: si se
// juzgara con otro dibujo no se estaría juzgando la ficha.
// =========================================================================

import * as Hex from "@/lib/v3/hex";
import {
  pieceGeometry,
  stageViewBox,
  type FieldId,
  type FramingId,
  type PieceDials,
} from "@/lib/v3/piece";
import PieceToken, { PieceLifeBar, type PieceView } from "./PieceToken";

export type TierCell = {
  readonly view: PieceView;
  /** Lo que va debajo: el tier, o «Héroe» para los que no tienen. */
  readonly rank: string;
};

export type TierGroup = {
  readonly id: string;
  readonly label: string;
  readonly cells: readonly TierCell[];
};

export type PieceTierStripProps = {
  groups: readonly TierGroup[];
  /** Radio del hexágono de la tira, en píxeles. La arena usa 34. */
  hexSize: number;
  tilt: number;
  dials: PieceDials;
  framing: FramingId;
  fields: readonly FieldId[];
  lifeBar: boolean;
  /** Cuál está en el calibre ahora mismo, para marcarla. */
  pickedId?: string | null;
  onPick?: (id: string) => void;
};

export default function PieceTierStrip({
  groups,
  hexSize,
  tilt,
  dials,
  framing,
  fields,
  lifeBar,
  pickedId = null,
  onPick,
}: PieceTierStripProps) {
  const g = pieceGeometry(hexSize, tilt, dials);
  // Una casilla sola, centrada en el origen: todas las celdas son la misma
  // escena, así que el encuadre se calcula una vez.
  const centre = Hex.toPixel({ q: 0, r: 0 }, hexSize, tilt);
  const viewBox = stageViewBox(g, [centre]);
  const hex = Hex.polygonPoints(centre.x, centre.y, hexSize, tilt);

  return (
    <div className="grid gap-3">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.cells.map(({ view, rank }) => (
              <button
                key={view.id}
                className="w-[5.25rem] shrink-0 text-left"
                title={`${view.name} · ${rank} · ❤️ ${view.vida} de ${view.vidaMax}`}
                onClick={onPick ? () => onPick(view.id) : undefined}
              >
                <svg
                  className="ficha-calibre"
                  viewBox={viewBox}
                  role="img"
                  aria-label={`Ficha de ${view.name}`}
                >
                  <polygon className="ficha-calibre__hex" points={hex} />
                  <PieceToken
                    piece={{ ...view, selected: view.id === pickedId }}
                    cx={centre.x}
                    cy={centre.y}
                    geometry={g}
                    framing={framing}
                    fields={fields}
                  />
                  {lifeBar && (
                    <PieceLifeBar piece={view} cx={centre.x} cy={centre.y} geometry={g} />
                  )}
                </svg>
                <span className="mt-0.5 block truncate text-[0.7rem] leading-tight text-[var(--wiki-text)]">
                  {view.name}
                </span>
                <span className="block text-[0.65rem] leading-tight text-[var(--wiki-muted)]">
                  {rank}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
