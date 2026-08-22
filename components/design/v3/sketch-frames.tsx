// =========================================================================
// Marcos vectoriales de los bocetos de V3
//
// Los de los bocetos D y E, que es lo único que un gradiente CSS no sabe
// dibujar —una banda de metal con las cantoneras remachadas encima—. Los
// bocetos A, B y C no tienen marco vectorial a propósito: su filete es un
// borde de 3px y eso lo hace el SCSS.
//
// D y E comparten herrajes y aleación y se diferencian SOLO en el corte del
// filete: en D es una banda maciza de metal, en E son dos raíles finos con una
// veta encendida entre medias. Por eso las cantoneras, el gradiente y el
// recorte viven aquí arriba, compartidos, y lo único propio de cada uno es su
// tabla de anillos.
//
// Reparto con el SCSS, el mismo de todo el proyecto: AQUÍ va lo que NO depende
// del contenido (el filete y las cuatro cantoneras, que siempre caen en los
// bordes de la carta); en styles/components/card-sketch/_blindada.scss va todo
// lo que tiene que seguir al pie, que crece o encoge según cuántas
// Características traiga el sujeto — la placa, el medallón y sus roblones.
//
// POR QUÉ NO SE IMPORTA card-frames.tsx. El tema `armored` de v2 dibuja este
// mismo lenguaje, pero sobre un viewBox de 260×364 y alrededor de una VENTANA
// de arte que V3 no tiene (los tres conceptos de knowledge/v3/card-concept/
// coinciden en el arte a sangre). Traer aquel trazado obligaría a escalarlo y
// a arrastrar la ventana; se reescribe, que es lo que manda AGENTS.md cuando
// algo de v2 sirve para V3.
//
// Los <defs> van por carta y no en una hoja común de la página: el metal es un
// gradiente de paradas var(--m-*), y esas variables solo valen lo que valen
// DENTRO de la carta que las declara. Compartido en un <defs> global se
// resolvería una sola vez, y las seis cartas saldrían del mismo color.
// =========================================================================

import { useId } from "react";

// Espejo de $sketch-width / $sketch-height / $sketch-radius
// (styles/settings/_card.scss). El viewBox es 1:1 con el tamaño real, así que
// una unidad de aquí es un píxel de la carta y las cotas se pueden comparar
// con las del SCSS sin traducir nada.
const W = 300;
const H = 420;
const R = 14;

// --------------------------------------------------------- El filete
// Cuatro anillos concéntricos, cada uno pintado como el trazo de un rect y
// guardado como [desde, hasta] respecto al borde. El último cierra en 15, que
// es $sketch-band: por dentro de esa línea empieza lo que se lee.
const BAND = {
  rim: [2.5, 5.5], // filo exterior, el más brillante
  groove: [5.5, 7.5], // ranura oscura que separa filo y banda
  main: [7.5, 13.5], // banda de metal
  lip: [13.5, 15], // hairline oscuro contra el arte
} as const;

// ------------------------------------------------------ Las cantoneras
// Escuadra achaflanada con bocel grabado y tres roblones. Va anclada en el
// (0,0) de su esquina —no metida hacia dentro— para que se funda con el
// filete en vez de flotar sobre el arte; lo que sobresale del redondeo lo
// recorta el clipPath de la carta.
const BRACKET = "M0,0 L56,0 L45,11 L28,11 L11,28 L11,45 L0,56 Z";

// Bocel y filo de luz, paralelos al borde interior. Cortados por dentro del
// chaflán: si se salen, asoman al arte como un arañazo.
const BRACKET_GROOVE = "M41,7.5 L23,7.5 L7.5,23 L7.5,41";
const BRACKET_BEVEL = "M39,9.5 L24,9.5 L9.5,24 L9.5,39";

// El codo y los dos extremos.
const RIVETS: readonly [number, number, number][] = [
  [12, 12, 3.4],
  [42, 4, 2.2],
  [4, 42, 2.2],
];

// [x, y, signo-x, signo-y]: la escuadra se dibuja una vez en la esquina
// superior izquierda y las otras tres son reflejos.
const CORNERS: readonly [number, number, number, number][] = [
  [0, 0, 1, 1],
  [W, 0, -1, 1],
  [0, H, 1, -1],
  [W, H, -1, -1],
];

const place = (x: number, y: number, sx: number, sy: number) =>
  `translate(${x},${y}) scale(${sx},${sy})`;

// Un anillo del filete a partir de su par [desde, hasta]. Se pinta como trazo,
// así que hay que centrarlo en la banda y encoger el radio al ritmo del inset
// o las esquinas se abren. El color va por `style` y no por el atributo
// `stroke` porque tiene que admitir un var() —el atributo de presentación no
// lo resolvería—.
function Band({
  from,
  to,
  fill,
  opacity,
}: {
  from: number;
  to: number;
  fill: string;
  opacity?: number;
}) {
  const mid = (from + to) / 2;
  return (
    <rect
      x={mid}
      y={mid}
      width={W - mid * 2}
      height={H - mid * 2}
      rx={Math.max(R - mid, 1.5)}
      fill="none"
      style={{ stroke: fill }}
      strokeWidth={to - from}
      opacity={opacity}
    />
  );
}

// --------------------------------------------------------- Piezas comunes

/** Aleación y recorte, iguales en los dos marcos. `gid` los hace únicos. */
function FrameDefs({ gid, children }: { gid: string; children?: React.ReactNode }) {
  return (
    <defs>
      <linearGradient id={`${gid}-metal`} x1="0" y1="0" x2={W} y2={H} gradientUnits="userSpaceOnUse">
        <stop offset="0%" style={{ stopColor: "var(--m-lo)" }} />
        <stop offset="24%" style={{ stopColor: "var(--m-hi)" }} />
        <stop offset="50%" style={{ stopColor: "var(--m)" }} />
        <stop offset="76%" style={{ stopColor: "var(--m-hi)" }} />
        <stop offset="100%" style={{ stopColor: "var(--m-lo)" }} />
      </linearGradient>

      {/* Destello: blanco cálido que se apaga rápido, para pegarlo con
          opacidad sobre el filete. Es la mitad de lo que hace que no parezca
          papel pintado. */}
      <radialGradient id={`${gid}-glint`}>
        <stop offset="0%" style={{ stopColor: "var(--m-glint)" }} />
        <stop offset="55%" style={{ stopColor: "var(--m-glint)" }} stopOpacity="0.3" />
        <stop offset="100%" style={{ stopColor: "var(--m-glint)" }} stopOpacity="0" />
      </radialGradient>

      <clipPath id={`${gid}-card`}>
        <rect x="0" y="0" width={W} height={H} rx={R} />
      </clipPath>

      {children}
    </defs>
  );
}

/**
 * Las cuatro cantoneras, con su sombra. Van SIEMPRE encima del filete: son
 * placas atornilladas sobre él. (En v2 el orden es el contrario, porque allí
 * los herrajes cierran la ventana del arte y no el borde de la carta.)
 */
function Brackets({ metal }: { metal: string }) {
  return (
    <>
      {/* El desplazamiento de la sombra se aplica ANTES del reflejo para que
          las cuatro proyecten hacia el mismo lado. */}
      <g opacity="0.45" fill="var(--m-edge)">
        {CORNERS.map(([x, y, sx, sy]) => (
          <path key={`sh-${x}-${y}`} d={BRACKET} transform={`translate(1.5,1.8) ${place(x, y, sx, sy)}`} />
        ))}
      </g>

      {CORNERS.map(([x, y, sx, sy]) => (
        <g key={`co-${x}-${y}`} transform={place(x, y, sx, sy)}>
          <path d={BRACKET} fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1.4" />
          <path d={BRACKET_BEVEL} fill="none" style={{ stroke: "var(--m-hi)" }} strokeWidth="1.4" opacity="0.5" />
          <path d={BRACKET_GROOVE} fill="none" style={{ stroke: "var(--m-edge)" }} strokeWidth="1.3" opacity="0.5" />
          {RIVETS.map(([rx, ry, r]) => (
            <g key={`${rx}-${ry}`} transform={`translate(${rx},${ry})`}>
              <circle r={r} fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1" />
              <circle cx={-r * 0.28} cy={-r * 0.28} r={r * 0.34} style={{ fill: "var(--m-hi)" }} opacity="0.7" />
            </g>
          ))}
        </g>
      ))}
    </>
  );
}

/** Brillos repartidos, descolocados a propósito: en cuanto van con orden
    dejan de parecer luz y parecen un estampado. */
function Glints({ gid }: { gid: string }) {
  return (
    <g fill={`url(#${gid}-glint)`}>
      <ellipse cx="92" cy="7" rx="32" ry="4" />
      <ellipse cx="226" cy="11" rx="18" ry="3" />
      <ellipse cx="7" cy="120" rx="3.5" ry="28" />
      <ellipse cx="293" cy="268" rx="3.5" ry="34" />
      <ellipse cx="188" cy="413" rx="26" ry="4" />
    </g>
  );
}

/** El <svg> del marco: encima de todo (z("frame")) y sin capturar el puntero. */
function FrameSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="sketch__frame"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Marco del boceto D · Blindada.
 *
 * No pinta ni fondo ni ventana: solo el filete y los herrajes. El color entero
 * sale de las variables --m/--m-hi/--m-lo/--m-edge que el parcial emite por
 * [data-rarity], que es lo que convierte al marco en el portador de la Rareza.
 */
export function BlindadaFrame() {
  const gid = useId();
  const metal = `url(#${gid}-metal)`;

  return (
    <FrameSvg>
      <FrameDefs gid={gid} />
      <g clipPath={`url(#${gid}-card)`}>
        <Band from={0} to={BAND.rim[1]} fill={metal} />
        <Band from={BAND.groove[0]} to={BAND.groove[1]} fill="var(--m-edge)" />
        <Band from={BAND.main[0]} to={BAND.main[1]} fill={metal} />
        <Band from={BAND.lip[0]} to={BAND.lip[1]} fill="var(--m-edge)" opacity={0.85} />
        <Band from={BAND.main[1] - 1.2} to={BAND.main[1]} fill="var(--m-hi)" opacity={0.5} />
        <Band from={BAND.main[0]} to={BAND.main[0] + 1} fill="var(--m-lo)" opacity={0.5} />

        <Brackets metal={metal} />
        <Glints gid={gid} />
      </g>
    </FrameSvg>
  );
}

// ----------------------------------------------------- El filete del E
// La banda maciza del D, abierta por la mitad: dos raíles finos y un canal
// entre ellos. Ocupa lo mismo que la del D (14.5 ≈ $sketch-band) a propósito,
// para que los dos bocetos dejen el mismo hueco al contenido y la comparación
// sea solo de aspecto y no de sitio.
//
//   outer    raíl exterior, 2.5px de metal
//   channel  el hueco: 7px de veta encendida
//   inner    raíl interior, 2.5px de metal
//   lip      hairline oscuro contra el arte
const SEAM = {
  outer: [1.5, 4],
  channel: [4, 11],
  inner: [11, 13.5],
  lip: [13.5, 14.5],
} as const;

/**
 * Marco del boceto E · Forja.
 *
 * El mismo herraje que el D, pero el filete se parte en dos raíles y por el
 * canal que dejan corre luz. La luz NO es un borde teñido: es un anillo
 * desenfocado (feGaussianBlur) con un anillo nítido encima y un núcleo más
 * claro dentro, que es lo que hace que se lea como algo encendido y no como
 * una tercera línea de color.
 *
 * Y no lee las mismas variables que el metal: el metal sale de --m-* y en este
 * boceto es constante —el mismo color de carta en todas—, mientras que la luz
 * sale de --seam/--seam-hi y es lo ÚNICO que cambia de una carta a otra.
 *
 * Las cantoneras siguen yendo encima, así que tapan el canal en las cuatro
 * esquinas: la veta se ve como cuatro tramos entre placas, no como un aro.
 * Es a propósito — un aro continuo parecía un neón pegado, y así parece
 * metal recién forjado entre chapas.
 */
export function ForjaFrame() {
  const gid = useId();
  const metal = `url(#${gid}-metal)`;

  return (
    <FrameSvg>
      <FrameDefs gid={gid}>
        <filter id={`${gid}-bloom`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </FrameDefs>

      <g clipPath={`url(#${gid}-card)`}>
        {/* El canal es un rebaje: primero el fondo oscuro de todo el filete,
            para que la luz salga de dentro y no flote sobre el arte. */}
        <Band from={SEAM.outer[0]} to={SEAM.lip[1]} fill="var(--m-edge)" />

        {/* Los dos raíles, y sus filos: el oscuro por fuera para recortar la
            carta contra el escenario, y el de luz por el lado del canal, que
            es donde daría la luz de verdad. */}
        <Band from={0.4} to={SEAM.outer[0]} fill="var(--m-edge)" />
        <Band from={SEAM.outer[0]} to={SEAM.outer[1]} fill={metal} />
        <Band from={SEAM.inner[0]} to={SEAM.inner[1]} fill={metal} />
        <Band from={SEAM.lip[0]} to={SEAM.lip[1]} fill="var(--m-edge)" opacity={0.9} />
        <Band from={SEAM.outer[1] - 0.8} to={SEAM.outer[1]} fill="var(--m-hi)" opacity={0.6} />
        <Band from={SEAM.inner[0]} to={SEAM.inner[0] + 0.8} fill="var(--m-hi)" opacity={0.6} />

        {/* Y ahora la luz, DESPUÉS del metal. El orden no es un detalle: es la
            diferencia entre una luz y una raya de color. El halo tiene que
            caer SOBRE los raíles —un metal iluminado es metal con luz encima—;
            dibujado antes, los raíles lo tapaban y el canal quedaba como una
            barra plana entre dos cantos duros, o sea un borde pintado.
            Pero solo un poco: pasado cierto punto el peltre deja de ser peltre
            y la carta entera se tiñe, que es lo que hace el boceto D.
            0.35 sobre un desborde de 1px por lado es donde se queda el metal
            sin dejar de recibir luz.

            Y el canal no lleva UNA banda sino cuatro concéntricas, de fuera
            hacia dentro y de menos a más: es la sección de una luz metida en
            una ranura —apagada contra las paredes, encendida en el centro—.
            Con una sola banda plana, por bien que esté el halo, el canal
            vuelve a leerse como color liso. */}
        <g filter={`url(#${gid}-bloom)`} opacity={0.35}>
          <Band from={SEAM.channel[0] - 1} to={SEAM.channel[1] + 1} fill="var(--seam)" />
        </g>
        <Band from={SEAM.channel[0]} to={SEAM.channel[1]} fill="var(--seam)" opacity={0.5} />
        <Band from={5.4} to={9.6} fill="var(--seam)" opacity={0.85} />
        <Band from={6.4} to={8.6} fill="var(--seam-hi)" opacity={0.75} />

        <Brackets metal={metal} />
        <Glints gid={gid} />
      </g>
    </FrameSvg>
  );
}
