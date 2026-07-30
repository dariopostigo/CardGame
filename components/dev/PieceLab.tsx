"use client";

// =========================================================================
// Laboratorio de DISEÑO DE FICHAS — /dev/pieces
//
// Banco de pruebas de components/game/board/BoardPiece.tsx y del dibujo de
// components/game/board/piece-art.tsx. Aquí no hay motor: una ficha no es una
// regla, es una pieza, así que lo único que se decide en esta pantalla es si se
// LEE —sobre los siete terrenos y con el tablero inclinado— y si se distingue de
// sus siete hermanas.
//
// Las dos preguntas que existe para contestar:
//   1. ¿se lee sobre Bosque y sobre Camino, que son los dos extremos de tono?
//      (la matriz de legibilidad)
//   2. ¿se distinguen las ocho de un vistazo, sin leer el rótulo?
//
// Entra en «Grande» a propósito: el sitio para juzgar el DIBUJO es el tamaño en
// el que se ve, y el tamaño al que se JUEGA se comprueba con el mando, que trae
// «De partida» al lado.
//
// Vive en components/dev/ porque es instrumental: las fichas que pinta sí son
// del juego (components/game/board/), este panel de mandos no.
// =========================================================================

import { useState, type ReactNode } from "react";
import Link from "next/link";
import * as Hex from "@/lib/rules/hex";
import { TERRAINS, TERRAIN_IDS, type TerrainId } from "@/lib/rules/terrain";
import BoardPiece, {
  PieceIcon,
  type PieceSpec,
  type PieceState,
} from "@/components/game/board/BoardPiece";
import { BOARD_TILT } from "@/components/game/board/HexBoard";
import {
  PAWN_ART,
  PAWN_IDS,
  TOKEN_ART,
  TOKEN_IDS,
  type PawnId,
} from "@/components/game/board/piece-art";
import { buttonClass } from "@/components/ui/Button";

// «De partida» es el radio que usa el tablero de verdad (HexBoard, 30) y es el
// que manda para decidir si una ficha se lee jugando; los otros dos están para
// mirar el dibujo de cerca y para el caso peor.
const HEX_SIZES: Array<{ label: string; size: number }> = [
  { label: "Pequeño", size: 22 },
  { label: "De partida", size: 30 },
  { label: "Grande", size: 44 },
];

/** El laboratorio abre en Grande: aquí se juzga el dibujo, no el encaje. */
const INITIAL_HEX_SIZE = 44;

/** Los dos extremos de tono del tablero, que son los que dictan la paleta. */
const CONTRAST_TERRAINS: readonly TerrainId[] = ["bosque", "camino"];

/** Nombre legible de cada ficha de personaje, para tarjeta y tabla. */
const PAWN_NAMES: Readonly<Record<PawnId, string>> = {
  heroe: "Héroe",
  "enemigo-activo": "Enemigo activo",
  jefe: "Jefe",
};

export default function PieceLab() {
  const [hexSize, setHexSize] = useState(INITIAL_HEX_SIZE);
  const [terrain, setTerrain] = useState<TerrainId>("llanura");

  const btn = (active: boolean) => buttonClass({ active });
  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
  const heading = "mb-1 mt-8 text-lg font-semibold text-[var(--wiki-text)]";
  const note = "mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]";
  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  // La inclinación no es un mando: es la cámara del juego (HexBoard.BOARD_TILT),
  // y la ficha se juzga con la que se va a ver.
  const sample = { hexSize, tilt: BOARD_TILT };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de fichas</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las <b>6 fichas</b> que se siembran en el tablero y las <b>3 fichas de personaje</b> (
        <Link href="/docs/board/board-map" className="text-[var(--wiki-accent)] hover:underline">
          Tablero y mapa §4
        </Link>
        ). Lo que se prueba aquí no es qué hace cada una —eso ya está decidido— sino si se{" "}
        <b>lee</b>: con el tablero inclinado y sobre los siete terrenos.
      </p>
      <p className={note}>
        La regla de la que sale todo lo demás: <b>toda ficha va tumbada en la loseta, y todas son el
        mismo disco</b>, comprimido por la misma inclinación que el hexágono —un cartón que descansa
        sobre el tablero, con su sombra corta—. Lo que distingue una ficha de otra es su{" "}
        <b>dibujo y su color</b>, nunca su forma.
      </p>
      <p className={note}>
        <b>Eran tres familias y ahora son dos</b>, y ninguna de las dos cosas que sobraban era de
        verdad una forma distinta. Las <b>localizaciones</b> iban en una placa impresa en el suelo, y
        se han ido enteras: el Pueblo y la Mazmorra son <b>terreno</b> de la loseta (§3a), así que los
        pinta el mapa, y la Guarida se ha quedado como dato invisible del motor —lo que el jugador
        encuentra al llegar es la ficha de Enemigo del boss—. El <b>héroe y el enemigo activo</b> eran
        dos figuras de pie sobre una peana y ahora van en el mismo disco: de pie tapaban el hexágono
        de detrás, y una pieza que sobresale de su casilla obliga a ordenar el tablero por
        profundidad para nada.
      </p>
      <p className={note}>
        Tres de los glifos son <b>rutas</b>, que pintan con la tinta que les da su ficha. Las seis
        excepciones son <b>Tesoro, Exploración, Personaje, Héroe, Terreno y Jefe</b>, que van como{" "}
        <b>emoji</b>: traen sus propios colores, ignoran la tinta de la ficha y dependen de la fuente
        del sistema —el cofre es <code>U+1FA8E</code>, de Unicode 17, así que con una fuente vieja
        sale el rectángulo de carácter desconocido; el elfo y el mago son secuencias de cuatro puntos
        de código, y una fuente incompleta las parte en dos glifos—. Por eso <b>Tesoro va en oro
        claro y el Héroe en azul pálido</b>: cuando el dibujo trae sus propios tonos, la cara de la
        ficha tiene que hacerle de papel. Todo es arte provisional igualmente: la fase de arte está
        diferida.
      </p>

      {/* Controles */}
      <div className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className={label}>Tamaño del hexágono</span>
          <div className="flex items-center gap-2">
            {HEX_SIZES.map((s) => (
              <button key={s.size} className={btn(hexSize === s.size)} onClick={() => setHexSize(s.size)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={label}>Terreno del catálogo</span>
          <div className="flex items-center gap-2">
            {TERRAIN_IDS.map((id) => (
              <button key={id} className={btn(terrain === id)} onClick={() => setTerrain(id)}>
                {TERRAINS[id].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Las 6 fichas de contenido ------------------------------------ */}
      <h2 className={heading}>Las 6 fichas del tablero</h2>
      <p className={note}>
        En orden de frecuencia: Amenaza y Personaje son las dos que más se ven (~6,7 y ~5,3 por
        mapa), y Terreno la más rara (~1,8). Ninguna es verde a propósito: entre Llanura y Bosque, el
        verde es el 60 % del tablero. Amenaza y Enemigo comparten familia de rojo porque una Amenaza
        casi siempre resulta ser un enemigo —lo que las separa es la certeza, no la categoría—, y
        Exploración es la única de cara clara porque es el comodín: no tener color es su significado.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOKEN_IDS.map((id) => (
          <PieceCard
            key={id}
            className={card}
            name={capitalize(id)}
            description={TOKEN_ART[id].label}
            piece={{ family: "token", id }}
            terrain={terrain}
            {...sample}
          />
        ))}
      </div>

      {/* --- Fichas de personaje ----------------------------------------- */}
      <h2 className={heading}>Las 3 fichas de personaje</h2>
      <p className={note}>
        La pieza que faltaba para poder decidir la niebla por loseta: sin ver cómo se comporta el héroe
        sobre el tablero no se puede juzgar qué debería ver al entrar en una. Van en el{" "}
        <b>mismo disco</b> que las seis de contenido, así que lo que las separa del resto es el dibujo y
        el color —y ahí está lo que hay que mirar de cerca en esta pantalla, porque dos de las tres
        chocan con una hermana:
      </p>
      <p className={note}>
        El <b>Héroe</b> lleva el emoji del <b>mago</b> y la ficha de <b>Personaje</b> el del{" "}
        <b>elfo</b>: dos humanoides con capucha, y a tamaño de partida el glifo no los separa. Lo tiene
        que hacer la cara: azul <b>pálido</b> el héroe contra el azul medio del Personaje. Es la
        tercera cara clara del tablero, con Tesoro y Exploración.
      </p>
      <p className={note}>
        El <b>Enemigo activo</b> lleva la <b>misma calavera con cuernos</b> que el disco latente, y a
        propósito: es el mismo bicho, no hace falta un icono nuevo para decir que se ha despertado (
        <Link href="/docs/characters/enemies" className="text-[var(--wiki-accent)] hover:underline">
          Enemigos §2
        </Link>
        ). Solo cambia el color, y no podía ser un tercer rojo —entre el granate del latente y el
        ladrillo de la Amenaza no queda hueco que se lea—, así que va en <b>negro con la tinta al rojo
        vivo</b>: la única cara oscura del juego. Antes este paso se contaba levantando la ficha;
        ahora lo cuenta el color.
      </p>
      <p className={note}>
        La tercera es el <b>Jefe</b>: la corona (👑) que marca al Jefe de capítulo y al Jefe final de
        campaña (
        <Link href="/docs/characters/enemies" className="text-[var(--wiki-accent)] hover:underline">
          Enemigos §3
        </Link>
        ), ambos con la misma ficha —lo que importa es «es un jefe», no cuál de los dos—. No comparte la
        familia de rojo de Amenaza/Enemigo a propósito: va en <b>morado</b>, para que se lea de un
        vistazo que es otra categoría de peligro, no otro bicho más. Vive en <b>Modo Campaña</b>, que
        todavía no tiene motor: es la ficha por delante del sistema, para tenerla probada el día que
        haga falta colocarla de verdad.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAWN_IDS.map((id) => (
          <PieceCard
            key={id}
            className={card}
            name={PAWN_NAMES[id]}
            description={PAWN_ART[id].label}
            piece={{ family: "pawn", id }}
            terrain={terrain}
            {...sample}
          />
        ))}
        <div className={`${card} flex flex-col gap-2 text-sm`}>
          <span className="font-semibold text-[var(--wiki-text)]">Latente → activo</span>
          <div className="flex items-center gap-3">
            <PieceOnHex piece={{ family: "token", id: "enemigo" }} terrain={terrain} {...sample} />
            <i className="pi pi-arrow-right text-[var(--wiki-muted)]" />
            <PieceOnHex
              piece={{ family: "pawn", id: "enemigo-activo" }}
              terrain={terrain}
              {...sample}
            />
          </div>
          <span className="text-[var(--wiki-muted)]">
            El mismo enemigo y el mismo dibujo: lo que cambia es la cara.
          </span>
        </div>
        <div className={`${card} flex flex-col gap-2 text-sm`}>
          <span className="font-semibold text-[var(--wiki-text)]">Héroe contra Personaje</span>
          <div className="flex items-center gap-3">
            <PieceOnHex piece={{ family: "pawn", id: "heroe" }} terrain={terrain} {...sample} />
            <PieceOnHex piece={{ family: "token", id: "personaje" }} terrain={terrain} {...sample} />
          </div>
          <span className="text-[var(--wiki-muted)]">
            Mago y elfo, los dos emoji y los dos azules. Si a «De partida» no se distinguen, lo que
            hay que mover es la cara del héroe, no el glifo.
          </span>
        </div>
      </div>

      {/* --- Legibilidad sobre cada terreno ------------------------------ */}
      <h2 className={heading}>Legibilidad sobre cada terreno</h2>
      <p className={note}>
        La prueba de verdad, y <b>sin escalar</b>: estas fichas se dibujan a los píxeles exactos que
        marca el mando de tamaño, no al ancho de la ventana, así que la que decide es «De partida» —el
        radio con el que se juega—. Los dos terrenos que deciden son{" "}
        <b>Bosque</b> (el más oscuro con presencia real) y <b>Camino</b> (el más claro): una ficha que se
        lea en los dos se lee en todos. Es lo que obliga a los dos filetes del disco —el oscuro de fuera
        para el Bosque y la Mazmorra, el claro de la cara para el Camino y la Llanura—. El caso peor de
        toda la tabla es el <b>Enemigo activo sobre Mazmorra</b>: cara negra sobre el terreno más
        oscuro, y lo único que lo salva es el filete claro de la cara.
      </p>
      <div className={`${card} overflow-x-auto`}>
        <table className="text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                Ficha
              </th>
              {TERRAIN_IDS.map((id) => (
                <th
                  key={id}
                  className={`p-2 text-center text-xs font-semibold uppercase tracking-wide ${
                    CONTRAST_TERRAINS.includes(id)
                      ? "text-[var(--wiki-accent)]"
                      : "text-[var(--wiki-muted)]"
                  }`}
                >
                  {TERRAINS[id].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ...TOKEN_IDS.map((id) => ({ piece: { family: "token", id } as PieceSpec, name: capitalize(id) })),
              ...PAWN_IDS.map((id) => ({
                piece: { family: "pawn", id } as PieceSpec,
                name: PAWN_NAMES[id],
              })),
            ].map((row) => (
              <tr key={`${row.piece.family}-${row.piece.id}`}>
                <td className="whitespace-nowrap p-2 text-[var(--wiki-text)]">
                  <span className="inline-flex items-center gap-2">
                    <PieceIcon piece={row.piece} size={16} />
                    {row.name}
                  </span>
                </td>
                {TERRAIN_IDS.map((id) => (
                  <td key={id} className="p-1 text-center align-bottom">
                    <PieceOnHex piece={row.piece} terrain={id} {...sample} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Estados ------------------------------------------------------ */}
      <h2 className={heading}>Los estados de un hexágono con ficha</h2>
      <p className={note}>
        Los tres primeros son las <b>dos capas de niebla</b> del prototipo (
        <Link href="/docs/board/board-map" className="text-[var(--wiki-accent)] hover:underline">
          §2c
        </Link>
        ): fuera de todo no se ve nada; dentro de la <b>visión de terreno</b> se ve el terreno pero no lo
        que hay en él —y eso incluye no saber que hay ficha—; dentro de la <b>visión de detalle</b>
        aparece la ficha. El cuarto es el que faltaba por diseñar: al resolverla, la ficha{" "}
        <b>se retira</b> y deja su huella grabada en el suelo, sin relieve y sin sombra. No es una ficha
        apagada: es la marca de «aquí ya estuve», para no volver a caminar hasta un cofre vacío.
      </p>
      <div className={`${card} flex flex-wrap gap-6`}>
        <StateSample name="Sin explorar" description="Fuera de los dos radios">
          <FogHex hexSize={hexSize} tilt={BOARD_TILT} />
        </StateSample>
        <StateSample name="Terreno visible" description="Visión de terreno: no se sabe que hay ficha">
          <PieceOnHex piece={null} terrain="pantano" {...sample} />
        </StateSample>
        <StateSample name="Ficha revelada" description="Visión de detalle">
          <PieceOnHex piece={{ family: "token", id: "tesoro" }} terrain="pantano" {...sample} />
        </StateSample>
        <StateSample name="Resuelta" description="La ficha se retira y queda la huella">
          <PieceOnHex
            piece={{ family: "token", id: "tesoro" }}
            terrain="pantano"
            state="spent"
            {...sample}
          />
        </StateSample>
      </div>

      {/* --- Decisiones de este pase --------------------------------------- */}
      <h2 className={heading}>Decisiones de este pase (válidas para el prototipo)</h2>
      <ul className="mb-6 grid max-w-3xl gap-2 text-sm text-[var(--wiki-muted)]">
        <li>
          <b>La ficha de Terreno no es la «montaña verde»</b> que decía la tabla de diseño: sobre Bosque
          y Llanura desaparecía. Va en violeta, que es un color que el tablero no tiene. Mismo motivo por
          el que Personaje es azul y no blanco: había dos fichas blancas (con Exploración) y a tamaño de
          partida no se distinguían. Y el oro de Tesoro se aclaró al entrar el emoji del cofre, por lo
          mismo pero al revés: un dibujo con tonos propios necesita una cara que le haga de papel — lo
          mismo le pasa ahora a Terreno, que cambió su cresta a ruta por el emoji de montaña (⛰︎) al
          mejorar su mecánica.
        </li>
        <li>
          <b>El Héroe y el Personaje se pisan, y aguanta.</b> Mago y elfo son el mismo glifo de familia
          y las dos caras son azules; se separan por lo pálida que es la del héroe (contraste de
          luminancia 4,15:1 contra el azul medio del Personaje). Validado a «De partida»: no hace falta
          tocar el glifo del héroe.
        </li>
        <li>
          <b>El Enemigo activo es la única cara oscura</b>, y eso lo hace inconfundible en casi todo el
          tablero pero flojo sobre <b>Mazmorra</b>, que es el terreno más oscuro del mapa: el disco casi
          se funde con el terreno (1,59:1 de contraste). Ahí lo sostiene la tinta roja (4,13:1) y el
          filete claro del disco, y con eso basta para el prototipo. Subirle la tinta o darle un filete
          propio queda como posible retoque del arte definitivo, no del prototipo.
        </li>
        <li>
          <b>Tesoro, Exploración, Personaje, Héroe y Terreno desentonan</b> con las otras tres, y es el
          precio de usar emoji: tienen sombreado y media docena de colores propios, mientras que las
          otras tres son una silueta plana con la tinta de su ficha. Se queda así: unificar la baraja
          (rutas o emoji para las ocho) se pospone al pase de arte profesional, no es un bloqueante del
          prototipo.
        </li>
      </ul>
    </div>
  );
}

// --- Piezas de la propia pantalla -----------------------------------------

type SampleProps = {
  hexSize: number;
  tilt: number;
  terrain: TerrainId;
  /** `null` pinta el hexágono sin ficha, para el estado «terreno visible». */
  piece: PieceSpec | null;
  state?: PieceState;
};

/**
 * Un hexágono de tablero con su ficha encima, al tamaño EXACTO en píxeles con el
 * que se ve en el tablero: el <svg> lleva ancho y alto en píxeles y no se escala
 * al contenedor, que es lo único que hace válida la prueba de legibilidad.
 *
 * Reutiliza las capas del tablero de verdad —`.board__hex` y `.board__pieces`—
 * a propósito: así el terreno y la sombra son los mismos, y no una imitación que
 * pueda divergir.
 */
function PieceOnHex({ piece, terrain, hexSize, tilt, state }: SampleProps) {
  const { width, height } = Hex.hexSize(hexSize, tilt);
  // Aire por arriba. Ya no sobresale nada del hexágono —las figuras de pie se
  // fueron—, pero se conserva para que las celdas de la matriz midan todas igual
  // y la comparación entre fichas no baile de fila en fila.
  const headroom = hexSize * 0.6;
  const pad = 3;

  return (
    <svg
      className="piece-sample"
      viewBox={`${(-width / 2 - pad).toFixed(2)} ${(-height / 2 - headroom).toFixed(2)} ${(width + pad * 2).toFixed(2)} ${(height + headroom + pad).toFixed(2)}`}
      width={width + pad * 2}
      height={height + headroom + pad}
      role="img"
      aria-label={TERRAINS[terrain].label}
    >
      <polygon
        className="board__hex"
        data-terrain={terrain}
        points={Hex.polygonPoints(0, 0, hexSize, tilt)}
      />
      {piece && (
        <g className="board__pieces">
          <BoardPiece piece={piece} x={0} y={0} hexSize={hexSize} tilt={tilt} state={state} />
        </g>
      )}
    </svg>
  );
}

/** El hexágono en niebla total: ni terreno, ni ficha. */
function FogHex({ hexSize, tilt }: { hexSize: number; tilt: number }) {
  const { width, height } = Hex.hexSize(hexSize, tilt);
  const headroom = hexSize * 0.6;
  const pad = 3;
  return (
    <svg
      viewBox={`${(-width / 2 - pad).toFixed(2)} ${(-height / 2 - headroom).toFixed(2)} ${(width + pad * 2).toFixed(2)} ${(height + headroom + pad).toFixed(2)}`}
      width={width + pad * 2}
      height={height + headroom + pad}
      role="img"
      aria-label="Sin explorar"
    >
      <polygon className="board__hex" data-hidden="true" points={Hex.polygonPoints(0, 0, hexSize, tilt)} />
    </svg>
  );
}

/** Tarjeta del catálogo: la ficha sobre el terreno elegido, su nombre y qué es. */
function PieceCard({
  className,
  name,
  description,
  ...sample
}: SampleProps & { className: string; name: string; description: string }) {
  return (
    <div className={`${className} flex items-start gap-3`}>
      <PieceOnHex {...sample} />
      <span className="flex flex-col gap-0.5 text-sm">
        <span className="font-semibold text-[var(--wiki-text)]">{name}</span>
        <span className="text-[var(--wiki-muted)]">{description}</span>
      </span>
    </div>
  );
}

/** Una columna de la tira de estados. */
function StateSample({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-1 text-sm">
      {children}
      <span className="font-semibold text-[var(--wiki-text)]">{name}</span>
      <span className="max-w-[14rem] text-xs text-[var(--wiki-muted)]">{description}</span>
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
