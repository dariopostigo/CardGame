// =========================================================================
// El marco vectorial de V3
//
// Queda UNO, y desde el 1 de septiembre de 2026: el de la J · Orla. Hubo dos
// —el de la E · Forja, un rectángulo con cantoneras remachadas, y el de la
// G · Estandarte, el octógono que la H y la I usaban tal cual— y se fueron con
// sus bocetos. Lo que aprendió cada uno sigue en
// knowledge/v3/card-concept/README.md, que es donde vive el razonamiento.
//
// Y el otro boceto que queda NO pasa por aquí, que es toda su apuesta: la
// K · Moldura trae su marco como PNG y se lo cuelga el SCSS
// (styles/components/card-sketch/_moldura.scss). Si algún día gana ella, este
// archivo se queda sin trabajo.
//
// LO QUE DIBUJA es lo que un gradiente de CSS no sabe: un aro de metal de ocho
// lados con un canal de luz corriendo por dentro. El metal sale de --m-*
// —constante, es material de carta— y la luz de --seam/--seam-hi, que es lo
// ÚNICO que cambia de una carta a otra: la carta no está teñida, está
// encendida.
//
// Reparto con el SCSS, el mismo de todo el proyecto: AQUÍ va lo que NO depende
// del contenido —el filete, que siempre cae en el canto—; en
// styles/components/card-sketch/ va todo lo que tiene que seguir al pie, que
// crece o encoge según cuántas Características traiga el sujeto.
//
// POR QUÉ NO SE IMPORTA card-frames.tsx. El tema `armored` de v2 dibuja este
// mismo lenguaje, pero sobre un viewBox de 260×364 y alrededor de una VENTANA
// de arte que este marco no tiene: el suyo rodea el canto de la carta, no un
// hueco interior. Traer aquel trazado obligaría a escalarlo y a arrastrar la
// ventana; se reescribe, que es lo que manda AGENTS.md cuando algo de v2 sirve
// para V3.
//
// Los <defs> van por carta y no en una hoja común de la página: el metal es un
// gradiente de paradas var(--m-*), y esas variables solo valen lo que valen
// DENTRO de la carta que las declara. Compartido en un <defs> global se
// resolvería una sola vez, y todas las cartas saldrían del mismo color.
// =========================================================================

import { useId } from "react";

// Espejo de $sketch-width / $sketch-height (styles/settings/_card.scss). El
// viewBox es 1:1 con el tamaño real, así que una unidad de aquí es un píxel de
// la carta y las cotas se pueden comparar con las del SCSS sin traducir nada.
const W = 300;
const H = 420;

// Espejo de $sketch-chamfer (styles/settings/_card.scss). El CSS recorta el
// arte y el pie con este mismo corte, así que las dos medidas se mueven juntas
// o el filete se despega de la silueta.
const C = 18;

/**
 * El contorno de la carta, encogido `d` píxeles hacia dentro.
 *
 * El chaflán NO es constante al encoger: los dos bordes rectos se desplazan `d`
 * y el corte de 45° también, así que su cateto pasa de C a C − d(2 − √2). Sin
 * esa corrección los cuatro cortes se van abriendo anillo a anillo y el marco
 * deja de ser paralelo a la silueta — se nota enseguida, porque el error crece
 * con `d` y el anillo de dentro es el que más encoge.
 */
function octagon(d: number) {
  const x0 = d;
  const y0 = d;
  const x1 = W - d;
  const y1 = H - d;
  const c = Math.max(C - d * (2 - Math.SQRT2), 1);

  return [
    `M${x0 + c},${y0}`,
    `L${x1 - c},${y0}`,
    `L${x1},${y0 + c}`,
    `L${x1},${y1 - c}`,
    `L${x1 - c},${y1}`,
    `L${x0 + c},${y1}`,
    `L${x0},${y1 - c}`,
    `L${x0},${y0 + c}`,
    "Z",
  ].join(" ");
}

/**
 * Un anillo del filete a partir de su par [desde, hasta].
 *
 * Se pinta como TRAZO, así que hay que centrarlo en la banda y encoger el
 * octógono al ritmo del inset o las esquinas se abren. El color va por `style`
 * y no por el atributo `stroke` porque tiene que admitir un var() — el atributo
 * de presentación no lo resolvería.
 */
function Ring({
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
    <path
      d={octagon(mid)}
      fill="none"
      style={{ stroke: fill }}
      strokeWidth={to - from}
      strokeLinejoin="miter"
      opacity={opacity}
    />
  );
}

/** La aleación y el destello. `gid` los hace únicos por carta. */
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

      {children}
    </defs>
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

// ------------------------------------------------------ El filete del J · Orla
// Espejo de $orla-ring (styles/components/card-sketch/_orla.scss): un anillo de
// ~7,6px, la mitad del filete de 15px con el que están medidas las piezas del
// cuerpo (card-sketch/_cuerpo.scss), y SIN herrajes — ni cantoneras ni
// roblones.
//
// No es una versión encogida del filete que tenían la G y la H, es un filete
// pensado para otro sitio. Sus cantoneras y sus roblones decían «esto es una
// pieza de blindaje atornillada al canto de la carta» — un mensaje que tiene
// sentido mientras el octógono ES el canto. En la J el octógono ya no es el
// canto: vive dentro de un borde negro (ver _orla.scss), y una ficha remachada
// montada sobre otro borde deja de leerse como blindaje y pasa a leerse como
// ruido. Lo único que la J se quedó no fue el herraje, fue la IDEA: un canal de
// luz entre dos raíles de metal que dice la Rareza sin escribirla.
//
// La J probó el 25 de agosto de 2026, de madrugada, a cambiar también el
// chaflán del anillo por una esquina redondeada —dos rectángulos concéntricos
// en vez de un octógono dentro de un rectángulo—, y se revirtió el mismo día:
// no gustó vista en el lab. Queda apuntado por si vuelve a probarse: la versión
// redondeada dibujaba con rect+rx y un clip rectangular en vez de
// Ring()/octagon(). Este marco se queda con el octógono y con su propio
// clipPath.
const ORLA_RING = {
  outer: [0.4, 1.6],
  channel: [1.6, 5.6],
  inner: [5.6, 6.8],
  lip: [6.8, 7.6],
} as const;

/**
 * Marco del boceto J · Orla.
 *
 * La receta de la luz viene del filete de la E · Forja, borrado con su boceto,
 * y va con dos bandas de bloom en vez de las cuatro que tenía: a 4px de canal
 * —contra los 7px de aquel— las cuatro concéntricas se pisan entre sí y el
 * canal vuelve a leerse como color liso, que es justo lo que la receta original
 * evita. Con menos banda hacen falta menos capas, no la misma receta encogida.
 *
 * Y el ORDEN importa, que es lo que aquel filete dejó escrito: la luz va
 * DESPUÉS del metal. Un metal iluminado es metal con luz encima; dibujada
 * antes, los raíles la tapan y el canal queda como una barra plana entre dos
 * cantos duros, o sea un borde pintado.
 */
export function OrlaFrame() {
  const gid = useId();
  const metal = `url(#${gid}-metal)`;

  return (
    <FrameSvg>
      <FrameDefs gid={gid}>
        <filter id={`${gid}-bloom`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.1" />
        </filter>
        <clipPath id={`${gid}-oct`}>
          <path d={octagon(0)} />
        </clipPath>
      </FrameDefs>

      <g clipPath={`url(#${gid}-oct)`}>
        {/* El rebaje oscuro de todo el filete: la luz sale de dentro y no flota
            sobre el arte. */}
        <Ring from={ORLA_RING.outer[0]} to={ORLA_RING.lip[1]} fill="var(--m-edge)" />

        <Ring from={0.4} to={ORLA_RING.outer[0]} fill="var(--m-edge)" />
        <Ring from={ORLA_RING.outer[0]} to={ORLA_RING.outer[1]} fill={metal} />
        <Ring from={ORLA_RING.inner[0]} to={ORLA_RING.inner[1]} fill={metal} />
        <Ring from={ORLA_RING.lip[0]} to={ORLA_RING.lip[1]} fill="var(--m-edge)" opacity={0.9} />

        <g filter={`url(#${gid}-bloom)`} opacity={0.4}>
          <Ring from={ORLA_RING.channel[0] - 0.6} to={ORLA_RING.channel[1] + 0.6} fill="var(--seam)" />
        </g>
        <Ring from={ORLA_RING.channel[0]} to={ORLA_RING.channel[1]} fill="var(--seam)" opacity={0.55} />
        <Ring from={2.6} to={4.6} fill="var(--seam-hi)" opacity={0.8} />

        <Glints gid={gid} />
      </g>
    </FrameSvg>
  );
}
