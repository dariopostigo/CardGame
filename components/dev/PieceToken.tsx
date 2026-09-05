"use client";

// =========================================================================
// La ficha dibujada (presentacional)
//
// Un `<g>` de SVG que se apoya en el centro de una casilla. Lo usan tres sitios a
// propósito: la escena de la arena —a tamaño de partida—, la hoja de calibre
// donde se ve una sola y grande, y la tira de tiers. Es el mismo componente con
// otro radio, así que lo que se juzga ampliado es exactamente lo que se pinta
// pequeño.
//
// ES UN HEXÁGONO TUMBADO, con el giro y el aplastado de la casilla (decisión de
// Dario del 1 de septiembre de 2026; el porqué y su precio están en la cabecera
// de lib/v3/piece.ts). Aquí eso se traduce en una regla de dibujo: NADA es
// redondo. Lo único redondo son las gemas de cifra, que van en los vértices.
//
// Y ES PLANA *(3 de septiembre de 2026: «quita el disco y el grosor ya»)*. El
// canto, el bisel y la sombra de contacto del intento anterior se fueron con él:
// la ficha es un POLÍGONO apoyado en su casilla, y se dibuja en cuatro pasos.
//
//   0. LA CASILLA ILUMINADA, un hexágono translúcido del tamaño de la casilla, y
//      es DE QUIÉN ES LA FICHA en tres tonos: azul la mía, verde la de un aliado,
//      rojo la del enemigo *(Dario, 3 de septiembre de 2026)*. No es adorno y no
//      es de la ficha —es su casilla—, pero se pinta aquí porque VIAJA CON ELLA:
//      cuando la ficha se mueve, la luz se mueve con ella, y así sale igual en la
//      arena, en el calibre y en la tira sin que cada hoja se lo dibuje aparte.
//   1. EL CARTÓN, el hexágono de fuera, con el color DEL TIER en su contorno
//      —el mismo raíl de Rareza con el que se imprime su carta—, que es la otra
//      decisión del mismo día. De quién es la ficha ya no vive aquí.
//   2. LA CARA, el retrato recortado dentro, a ras del marco y sin trazo propio.
//   3. Lo que se lee: cifras en las esquinas y estados sobre la punta. La barra
//      de ❤️ Vida NO va aquí: es interfaz y se pinta en una capa por encima de
//      todas las fichas (ver `PieceLifeBar`, al final de este archivo).
//
// Ninguna decisión vive aquí: las medidas vienen de `pieceGeometry`, los colores
// de SCSS (styles/components/_ficha.scss) y qué datos suben a la ficha lo dice
// el módulo (ARCHITECTURE.md §6).
// =========================================================================

import { useId } from "react";
import * as Hex from "@/lib/v3/hex";
import {
  FIELD_BY_ID,
  FRAMING_BY_ID,
  gemFontRatio,
  lifeWidth,
  portraitRect,
  type FieldId,
  type FramingId,
  type PieceGeometry,
  type PieceSideId,
} from "@/lib/v3/piece";
import { DAMAGE_TYPES, type DamageTypeId } from "@/lib/v3/damage";

/** Lo que hay que saber de un personaje para pintar su ficha, y nada más. */
export type PieceView = {
  readonly id: string;
  readonly name: string;
  readonly side: PieceSideId;
  readonly role: "heroe" | "unidad";
  readonly tier?: number;
  /**
   * EL COLOR DE LA FICHA, y es el del tier *(Dario, 3 de septiembre de 2026)*.
   * Va como clave de `$rarity` (styles/settings/_colors.scss) y no como color,
   * porque los colores viven en SCSS: es el raíl que `rarityForTier()` le da a su
   * tier —o el raíl propio del héroe, que no tiene tier—, o sea exactamente el
   * mismo con el que se imprime su carta.
   */
  readonly rarity: string;
  /** Emoji del sujeto: hace de retrato cuando no hay ilustración. */
  readonly icon: string;
  /** Ruta de la ilustración de su carta, si su raza ya está dibujada. */
  readonly art?: string;
  readonly damage: DamageTypeId;
  readonly vida: number;
  readonly vidaMax: number;
  readonly ataque: number;
  readonly movimiento: number;
  /** Los estados que lleva encima, ya en el orden en que se pintan. */
  readonly states: readonly { readonly id: string; readonly icon: string }[];
  readonly selected?: boolean;
};

export type PieceTokenProps = {
  piece: PieceView;
  /** Centro de su casilla, en píxeles del viewBox. */
  cx: number;
  cy: number;
  geometry: PieceGeometry;
  framing: FramingId;
  /** Qué datos suben a la ficha, en el orden en que los eligió el módulo. */
  fields: readonly FieldId[];
};

export default function PieceToken({
  piece,
  cx,
  cy,
  geometry: g,
  framing,
  fields,
}: PieceTokenProps) {
  // Los <defs> se piden POR INSTANCIA y no por ficha, y esto no es manía: la
  // misma ficha se pinta dos veces en la misma página —pequeña en la escena y
  // grande en la hoja de calibre—, así que un id sacado de `piece.id` saldría
  // duplicado. Con dos <clipPath> del mismo nombre en un documento gana el
  // primero, y la cara grande salía recortada con la ventana de la pequeña:
  // negra y vacía. Es el mismo fallo del que se guarda ArenaBoard con su `uid`.
  const uid = useId().replace(/[^\w-]/g, "");
  const clipId = `ficha-clip-${uid}`;

  // El hexágono de la CASILLA —el de la rejilla, no el de la ficha—: es lo que se
  // ilumina para decir de quién es la pieza.
  const cellPoints = Hex.polygonPoints(cx, cy, g.size, g.tilt);
  const tilePoints = Hex.polygonPoints(cx, cy, g.tileR, g.tilt);
  const facePoints = Hex.polygonPoints(cx, cy, g.faceR, g.tilt);

  const rect = portraitRect(g, FRAMING_BY_ID[framing]);
  const life = Math.max(0, Math.min(1, piece.vidaMax === 0 ? 0 : piece.vida / piece.vidaMax));

  return (
    <g
      className="ficha"
      data-side={piece.side}
      data-role={piece.role}
      data-rarity={piece.rarity}
      data-selected={piece.selected ? "true" : undefined}
      data-hurt={life < 1 ? "true" : undefined}
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={facePoints} />
        </clipPath>
      </defs>

      {/* --- 0. La casilla iluminada: DE QUIÉN ES LA FICHA ----------------
          Azul la mía, verde la de un aliado, rojo la del enemigo *(Dario, 3 de
          septiembre de 2026)*. Va debajo de todo y con opacidad, así que la
          rejilla y el suelo siguen viéndose a través: enciende la casilla, no la
          tapa. Va siempre puesta —el mando que la apagaba se fue con la cifra del
          jugador— porque es lo único que dice de quién es la pieza. */}
      <polygon className="ficha__casilla" points={cellPoints} />

      {/* --- 0-bis. El halo del marco -------------------------------------
          El mismo hexágono, un pelo más gordo y en el negro del cuerpo de la
          ficha, debajo del trazo de color. No es un borde más: es contra lo que
          se lee el color del tier, porque el del bando es EL MISMO TONO en tres
          pares y lo único que hoy los separaba era la transparencia de la
          casilla sobre un suelo que es provisional *(5 de septiembre de 2026;
          las medidas están en lib/v3/piece.ts, «El halo del marco»)*. */}
      <polygon className="ficha__halo" points={tilePoints} />

      {/* --- 1. El cartón: el hexágono de fuera, Y EL ÚNICO MARCO ---------
          Un solo trazo de color y no tres *(Dario, 3 de septiembre de 2026:
          «parece que tiene como 3 bordes del mismo color… solo un marco»)*.
          Antes había un aro de más para el héroe y otro alrededor del retrato,
          los tres del mismo color: a tamaño de partida eso no se lee como un
          marco, se lee como ruido. Y lo que ese trazo dice es el TIER, no el
          bando: el bando lo dice la casilla de debajo, y el héroe su raíl propio
          —ni aro, ni grosor doble: TODAS las fichas se dibujan igual—. */}
      <polygon className="ficha__carton" points={tilePoints} />

      {/* --- 2. La cara: el retrato, dentro del marco --------------------- */}
      <g className="ficha__cara">
        <polygon className="ficha__fondo" points={facePoints} />

        {piece.art ? (
          <image
            href={piece.art}
            x={cx + rect.dx}
            y={cy + rect.dy}
            width={rect.w}
            height={rect.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />
        ) : (
          <text className="ficha__emoji" x={cx} y={cy} fontSize={(g.faceH * 0.62).toFixed(1)}>
            {piece.icon}
          </text>
        )}

      </g>

      {/* (Aquí iba la cifra del jugador —un 1, 2 o 3 en la punta de abajo—, que
          vivió medio día: en cuanto los aliados pasaron a tener casilla VERDE
          propia dejó de decir nada nuevo. El porqué está en lib/v3/piece.ts.) */}

      {/* --- 3a. Los datos, cada uno en su esquina ------------------------ */}
      {fields.map((id) => (
        <Gem key={id} field={id} piece={piece} cx={cx} cy={cy} geometry={g} />
      ))}

      {/* --- 3b. Los estados, en fila sobre la punta de arriba ------------ */}
      {piece.states.length > 0 && (
        <g className="ficha__estados">
          {piece.states.map((s, i) => {
            const chipR = g.gemR * 0.92;
            const step = chipR * 2.1;
            const x = cx + (i - (piece.states.length - 1) / 2) * step;
            // Las chapas y el nombre se pelean por el mismo sitio —encima de la
            // punta— porque en una ficha tumbada no hay otro. Si el nombre está
            // puesto, las chapas suben; el apretujón es parte de lo que hay que
            // ver antes de decidir que el nombre entra.
            const y =
              cy - g.tileH / 2 - chipR * 0.55 - (fields.includes("nombre") ? g.gemR * 1.7 : 0);
            return (
              <g key={s.id}>
                <circle className="ficha__chapa" cx={x} cy={y} r={chipR} />
                <text
                  className="ficha__chapa-icono"
                  x={x}
                  y={y}
                  fontSize={(chipR * 1.3).toFixed(1)}
                >
                  {s.icon}
                </text>
              </g>
            );
          })}
        </g>
      )}

    </g>
  );
}

/**
 * LA BARRA DE ❤️ VIDA, flotando por debajo de la ficha.
 *
 * Va en un componente aparte y no dentro de `PieceToken` porque no se pinta en el
 * mismo sitio: es INTERFAZ, así que va en una capa POR ENCIMA de todas las
 * fichas. Si fuera parte de la pieza, las dos casillas de delante —que en una
 * rejilla hexagonal caen medio hexágono a cada lado— se comerían las dos puntas y
 * dejarían el 31% del centro (la cuenta está en `pieceGeometry`). Es lo mismo que
 * hace cualquier videojuego con las suyas, y es lo que quiere decir «flotante».
 */
export function PieceLifeBar({
  piece,
  cx,
  cy,
  geometry: g,
}: {
  piece: PieceView;
  cx: number;
  cy: number;
  geometry: PieceGeometry;
}) {
  const life = Math.max(0, Math.min(1, piece.vidaMax === 0 ? 0 : piece.vida / piece.vidaMax));
  return (
    <g className="ficha__vida" data-side={piece.side}>
      <rect
        className="ficha__vida-carril"
        x={cx + g.bar.dx}
        y={cy + g.bar.dy}
        width={g.bar.w}
        height={g.bar.h}
        rx={g.bar.r}
      />
      {life > 0 && (
        <rect
          className="ficha__vida-lleno"
          x={cx + g.bar.dx}
          y={cy + g.bar.dy}
          width={lifeWidth(g, life)}
          height={g.bar.h}
          rx={g.bar.r}
        />
      )}
    </g>
  );
}

/** Una cifra en su esquina: la gema y lo que dice. */
function Gem({
  field,
  piece,
  cx,
  cy,
  geometry: g,
}: {
  field: FieldId;
  piece: PieceView;
  cx: number;
  cy: number;
  geometry: PieceGeometry;
}) {
  const { dx, dy } = g.slotAt(FIELD_BY_ID[field].slot);
  const x = cx + dx;
  const y = cy + dy;

  // El nombre no es una gema: es una tira, porque una palabra no cabe en un
  // círculo. Se pinta para poder verlo fallar, que es para lo que está.
  if (field === "nombre") {
    return (
      <text
        className="ficha__nombre"
        x={cx}
        y={cy - g.tileH / 2 - g.gemR * 0.7}
        fontSize={(g.gemR * 1.05).toFixed(1)}
      >
        {piece.name}
      </text>
    );
  }

  const text = gemText(field, piece);
  return (
    <g className="ficha__gema" data-field={field}>
      <circle className="ficha__gema-cuerpo" cx={x} cy={y} r={g.gemR} />
      {/* El tamaño lo pide el DATO y no la cadena: si mirara `text.length` una
          ❤️ de 100 encogería y al bajar a 99 volvería a crecer, o sea la cifra
          cambiaría de tamaño al recibir daño. Ver `gemFontRatio()`. */}
      <text x={x} y={y} fontSize={(g.gemR * gemFontRatio(FIELD_BY_ID[field].maxDigits)).toFixed(1)}>
        {text}
      </text>
    </g>
  );
}

function gemText(field: FieldId, piece: PieceView): string {
  switch (field) {
    case "ataque":
      return String(piece.ataque);
    case "vida":
      return String(piece.vida);
    case "movimiento":
      return String(piece.movimiento);
    case "tipo-dano":
      return DAMAGE_TYPES[piece.damage].icon;
    case "tier":
      return piece.tier === undefined ? "—" : String(piece.tier);
    default:
      return "";
  }
}
