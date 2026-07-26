// =========================================================================
// Marcos vectoriales de los temas de carta
//
// Trazados propios (nada de bitmaps): filete, ventana del arte, cantoneras y
// montura del medallón. Escalan y se recolorean por rareza.
//
// Reparto de responsabilidades con el SCSS:
//   - AQUÍ va lo que NO depende del layout: filete, ventana y ornamentos. Se
//     dibuja en un viewBox fijo de 260×364 (la geometría de la carta,
//     settings/_card.scss).
//   - En el SCSS van las piezas que deben seguir al contenido (nombre, fichas,
//     panel): se hacen con clip-path/gradientes sobre el propio elemento HTML
//     para que se adapten a su alto real.
//
// Los <defs> se emiten UNA sola vez por página (<CardFrameDefs/>, en el
// escenario del lab) y las cartas los referencian por id: con 100 cartas en
// pantalla no tiene sentido duplicar gradientes. Los prefijos "vv-"/"vb-" son
// identificadores internos (heredados del sheet vector1.png que inspiró la
// vitela y el filete); no cuentan más que como nombres.
//
// AÑADIR UN TEMA NUEVO: crear su <Frame> aquí, sumarlo a CardTheme y a
// CARD_FRAMES (abajo), escribir su parcial en styles/components/card-themes/ y
// darlo de alta como pestaña en CardDesignLab.tsx (THEMES).
// =========================================================================

import { useId } from "react";

const CARD_W = 260;
const CARD_H = 364;
const AXIS = CARD_W / 2;

// --------------------------------------------------- Geometría del filete
// El filete es una pila de cuatro anillos concéntricos; cada uno se pinta como
// el trazo de un rect, de ahí que se guarden como [desde, hasta] respecto al
// borde de la carta y no como grosores sueltos.
const BAND = {
  rim: [2.5, 5.5], // filo exterior, el más brillante
  groove: [5.5, 7.5], // ranura oscura que separa filo y banda
  main: [7.5, 13.5], // banda de metal
  lip: [13.5, 14.5], // hairline oscuro contra el arte
} as const;

// Línea que separa el arte del panel de lectura. Tiene que coincidir con --art-h
// del tema (_armored.scss): a partir de ahí todo el ancho de la carta es panel.
// En Armored es también donde cae el filete inferior de la ventana y se centra
// el medallón de tipo.
const ART_BASE = 176;

const n = (v: number) => Number(v.toFixed(2));

// ------------------------------------------------ Herrajes de las esquinas
// Cantoneras: escuadras de metal pegadas al filete, con bocel grabado, remates
// en punta y un florón en el codo. Perfil achaflanado: cada brazo entra y sale
// con un chaflán a 45° y hay un escalón antes de la diagonal del codo.
const BRACKET = "M8,8 L84,8 L68,24 L44,24 L24,44 L24,68 L8,84 Z";

// Bocel grabado + filo de luz, los dos paralelos al borde interior. Son lo que
// hace que el herraje parezca metal moldeado y no un recorte de cartulina.
// Ojo con los extremos: van cortados por dentro del chaflán (que a la altura
// del bocel ya se ha comido el brazo), o asoman al arte como un arañazo.
const BRACKET_GROOVE = "M70,19 L42,19 L19,42 L19,70";
const BRACKET_BEVEL = "M67,22.5 L45,22.5 L22.5,45 L22.5,67";

// Roblones del herraje: el codo y los dos extremos.
const RIVETS: readonly [number, number, number][] = [
  [26, 26, 5],
  [72, 14, 3.4],
  [14, 72, 3.4],
];

export function CardFrameDefs() {
  return (
    <svg className="card-lab__defs" aria-hidden="true" focusable="false">
      <defs>
        {/* El metal del marco NO tiene gradiente compartido: es el color de la
            rareza y se pinta por carta en <ArmoredFrame> (ver allí). Aquí solo
            van las piezas comunes: la piel de vitela, la escuadra y el brillo. */}

        {/* --- Piel del panel de lectura: la vitela ---------------------- */}

        {/* Vitela: claro en el centro y curtido hacia los bordes, para que el
            texto caiga siempre sobre la parte más clara. */}
        <radialGradient
          id="vv-panel-fill"
          cx={AXIS}
          cy={ART_BASE + 60}
          r="168"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#faf1da" />
          <stop offset="55%" stopColor="#eddfba" />
          <stop offset="100%" stopColor="#d3ba8c" />
        </radialGradient>

        {/* Sombra: cierra la vitela contra la ventana y contra el pie. Más suave
            que la del metal — sobre claro, la misma opacidad ensucia. */}
        <linearGradient id="vv-panel-shade" x1="0" y1={ART_BASE - 34} x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5c4419" stopOpacity="0.26" />
          <stop offset="30%" stopColor="#5c4419" stopOpacity="0" />
          <stop offset="100%" stopColor="#5c4419" stopOpacity="0.2" />
        </linearGradient>

        {/* Grano de la vitela. El ruido se genera UNA vez en un mosaico de 96px
            y se tesela: con el filtro aplicado carta a carta, cada una pagaría
            su propio render. `stitchTiles` es lo que cose las juntas del
            mosaico; sin él se ve la cuadrícula. */}
        <filter id="vv-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="7" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.29
                    0 0 0 0 0.21
                    0 0 0 0 0.08
                    0.4 0.35 0.25 0 -0.28"
          />
        </filter>
        <pattern id="vv-grain" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" filter="url(#vv-noise)" />
        </pattern>

        {/* Manchas de humedad. Descolocadas y de tamaños distintos: en cuanto se
            reparten con orden dejan de parecer manchas y parecen un estampado. */}
        <radialGradient id="vv-stain">
          <stop offset="0%" stopColor="#8a6a2e" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#8a6a2e" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#8a6a2e" stopOpacity="0" />
        </radialGradient>

        {/* La escuadra de la cantonera. La pinta <ColorCorner> con el metal de
            la rareza; aquí solo va el trazado, compartido con su copia de
            sombra. */}
        <path id="vb-corner-shape" d={BRACKET} />

        {/* Destello del metal: brillos repartidos por el filete, la mitad de lo
            que hace que no parezca papel pintado. Blanco que se apaga rápido,
            para pegarlo con opacidad. */}
        <radialGradient id="vb-glint">
          <stop offset="0%" stopColor="#fff8e6" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#fff2d2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff2d2" stopOpacity="0" />
        </radialGradient>

        {/* Recorte al contorno de la carta: mantiene filete, ventana y panel
            dentro del redondeo sin depender de overflow. */}
        <clipPath id="vf-card">
          <rect x="0" y="0" width={CARD_W} height={CARD_H} rx="14" />
        </clipPath>
      </defs>
    </svg>
  );
}

// preserveAspectRatio="none" para que el marco encaje al píxel con el borde:
// los temas conservan el 260×364 del esqueleto, así que la relación de aspecto
// es 1:1 y no hay deformación de los trazos.
function FrameSvg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      className={className ? `card__frame ${className}` : "card__frame"}
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// Un anillo del filete a partir de su par [desde, hasta]: se pinta como el
// trazo de un rect, así que hay que centrarlo en la banda y encoger el radio
// al ritmo del inset o las esquinas se abren.
//
// El color va por `style` y no por el atributo `stroke`: así admite tanto un
// paint normal (hex, url(#gradiente)) como una variable CSS —var(#{--m-*})— que
// el atributo de presentación NO resolvería.
function Band({ from, to, fill, opacity }: { from: number; to: number; fill: string; opacity?: number }) {
  const mid = (from + to) / 2;
  return (
    <rect
      x={mid}
      y={mid}
      width={CARD_W - mid * 2}
      height={CARD_H - mid * 2}
      rx={Math.max(14 - mid, 1.5)}
      fill="none"
      style={{ stroke: fill }}
      strokeWidth={to - from}
      opacity={opacity}
    />
  );
}

// Cantonera recoloreada: escuadra + bisel + ranura + roblones, todo en el metal
// de la rareza, sobre el mismo trazado compartido vb-corner-shape.
function ColorCorner({ metal }: { metal: string }) {
  return (
    <g>
      <use href="#vb-corner-shape" fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1.4" />
      <path d={BRACKET_BEVEL} fill="none" style={{ stroke: "var(--m-hi)" }} strokeWidth="1.4" opacity="0.5" />
      <path d={BRACKET_GROOVE} fill="none" style={{ stroke: "var(--m-edge)" }} strokeWidth="1.3" opacity="0.5" />
      {RIVETS.map(([x, y, r]) => (
        <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
          <circle r={r} fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1" />
          <circle cx={n(-r * 0.28)} cy={n(-r * 0.28)} r={n(r * 0.34)} style={{ fill: "var(--m-hi)" }} opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

// --- Tema ARMORED (Blindado): vitela con el arte enventanado --------------
// Panel de vitela + filete metálico recoloreado por rareza, con el arte encerrado
// en una VENTANA rectangular de metal (el "borde interior" del marco). Las
// cantoneras cierran las cuatro esquinas de la ventana y el medallón de tipo va
// montado sobre su filete inferior. El borde superior del panel es RECTO y cae en
// ART_BASE, escondido por detrás del rail de la ventana.
//
// El metal NO es un color fijo, sino el de la rareza de la carta: cada carta
// renderiza su marco DENTRO de .card, así que el SVG hereda por CSS las variables
// --m-hi/--m/--m-lo/--m-edge que el parcial (_armored.scss) emite por
// [data-rarity]. El brillo diagonal es un gradiente propio de la carta con id
// único (useId) —no se puede compartir en <defs>, porque ahí var() se resolvería
// una sola vez para todas—.
function ArmoredFrame() {
  // Id único por instancia: el gradiente del metal vive en el <defs> de ESTA
  // carta para que sus paradas var(--m-*) tomen su rareza y no una común a todas.
  const gid = useId();
  const metal = `url(#${gid})`;

  // Ventana del arte. Su filete inferior cae en ART_BASE (el arranque del panel),
  // así el rectángulo termina justo donde empieza la vitela y el medallón se
  // centra sobre esa línea. Ver $gem-center en _armored.scss.
  const RAIL = ART_BASE; // 176
  const WIN = { x: 17, y: 17, w: CARD_W - 34, h: RAIL - 17 };
  const cs = 0.6; // escala de las cantoneras en las esquinas de la ventana

  // Las cantoneras se anclan por el BORDE EXTERIOR de la ventana, no por el
  // centro de su banda: así el codo se solapa con toda la banda de metal y se
  // funde con el filete en vez de quedar metido hacia dentro dejando la línea
  // del marco por fuera. `mo` es cuánto se lleva la esquina hacia ese borde.
  const mo = 1.8;
  const ox0 = WIN.x - mo;
  const oy0 = WIN.y - mo;
  const ox1 = WIN.x + WIN.w + mo;
  const oy1 = WIN.y + WIN.h + mo;

  // Las cuatro esquinas: [cx, cy, signo-x, signo-y]. La escuadra se dibuja en
  // (8,8) y aquí se lleva a la esquina de la ventana, reflejándola por signo.
  const corners: readonly [number, number, number, number][] = [
    [ox0, oy0, 1, 1],
    [ox1, oy0, -1, 1],
    [ox0, oy1, 1, -1],
    [ox1, oy1, -1, -1],
  ];
  const place = (cx: number, cy: number, sx: number, sy: number) =>
    `translate(${cx},${cy}) scale(${sx * cs},${sy * cs}) translate(-8,-8)`;

  return (
    <FrameSvg>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2={CARD_W} y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: "var(--m-lo)" }} />
          <stop offset="24%" style={{ stopColor: "var(--m-hi)" }} />
          <stop offset="50%" style={{ stopColor: "var(--m)" }} />
          <stop offset="76%" style={{ stopColor: "var(--m-hi)" }} />
          <stop offset="100%" style={{ stopColor: "var(--m-lo)" }} />
        </linearGradient>
      </defs>

      <g clipPath="url(#vf-card)">
        {/* Panel de vitela con el borde superior RECTO: la línea plana cae en
            RAIL, la misma altura que el filete inferior de la ventana, así que
            queda escondida por detrás del metal. */}
        <rect x="0" y={RAIL} width={CARD_W} height={CARD_H - RAIL} fill="url(#vv-panel-fill)" />
        <g>
          <ellipse cx="72" cy="238" rx="62" ry="44" fill="url(#vv-stain)" />
          <ellipse cx="206" cy="312" rx="48" ry="38" fill="url(#vv-stain)" />
          <ellipse cx="146" cy="352" rx="70" ry="30" fill="url(#vv-stain)" />
        </g>
        <rect x="0" y={RAIL} width={CARD_W} height={CARD_H - RAIL} fill="url(#vv-grain)" opacity="0.45" />
        <rect x="0" y={RAIL} width={CARD_W} height={CARD_H - RAIL} fill="url(#vv-panel-shade)" />

        {/* Ventana rectangular: el filete interior que encierra el arte. Cuatro
            anillos, como el filete exterior: filo oscuro, banda de metal, lip
            interior y realce de luz. */}
        <g fill="none">
          <rect
            x={WIN.x - 1.6}
            y={WIN.y - 1.6}
            width={WIN.w + 3.2}
            height={WIN.h + 3.2}
            rx="8"
            style={{ stroke: "var(--m-edge)" }}
            strokeWidth="1.4"
          />
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="6" stroke={metal} strokeWidth="3.4" />
          <rect
            x={WIN.x + 2.2}
            y={WIN.y + 2.2}
            width={WIN.w - 4.4}
            height={WIN.h - 4.4}
            rx="4"
            style={{ stroke: "var(--m-edge)" }}
            strokeWidth="1.1"
            opacity="0.75"
          />
          <rect
            x={WIN.x - 0.4}
            y={WIN.y - 0.4}
            width={WIN.w + 0.8}
            height={WIN.h + 0.8}
            rx="6"
            style={{ stroke: "var(--m-hi)" }}
            strokeWidth="0.9"
            opacity="0.5"
          />
        </g>

        {/* Cantoneras en las cuatro esquinas de la ventana (sombra + escuadra). */}
        <g opacity="0.4" fill="#0c0700">
          {corners.map(([cx, cy, sx, sy]) => (
            <use
              key={`sh-${cx}-${cy}`}
              href="#vb-corner-shape"
              transform={`translate(1.5,1.8) ${place(cx, cy, sx, sy)}`}
            />
          ))}
        </g>
        {corners.map(([cx, cy, sx, sy]) => (
          <g key={`co-${cx}-${cy}`} transform={place(cx, cy, sx, sy)}>
            <ColorCorner metal={metal} />
          </g>
        ))}

        {/* Montura del medallón de tipo: un bisel de metal empotrado en el rail
            con dos roblones a los lados, como una placa atornillada al marco.
            Rima con el lenguaje remachado del blindaje. Queda por detrás de la
            .card__badge (HTML), que le tapa el centro y deja ver solo el aro. */}
        <g>
          <circle cx={AXIS} cy={RAIL} r="27" fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1.4" />
          <circle
            cx={AXIS}
            cy={RAIL}
            r="24.5"
            fill="none"
            style={{ stroke: "var(--m-hi)" }}
            strokeWidth="1"
            opacity="0.5"
          />
          {[-42, 42].map((dx) => (
            <g key={dx} transform={`translate(${AXIS + dx},${RAIL})`}>
              <circle r="3.4" fill={metal} style={{ stroke: "var(--m-edge)" }} strokeWidth="1" />
              <circle cx="-1" cy="-1" r="1.2" style={{ fill: "var(--m-hi)" }} opacity="0.7" />
            </g>
          ))}
        </g>
      </g>

      {/* Filete exterior. */}
      <Band from={0} to={BAND.rim[1]} fill={metal} />
      <Band from={BAND.groove[0]} to={BAND.groove[1]} fill="var(--m-edge)" />
      <Band from={BAND.main[0]} to={BAND.main[1]} fill={metal} />
      <Band from={BAND.lip[0]} to={BAND.lip[1]} fill="var(--m-edge)" opacity={0.85} />
      <Band from={BAND.main[1] - 1.2} to={BAND.main[1]} fill="var(--m-hi)" opacity={0.5} />
      <Band from={BAND.main[0]} to={BAND.main[0] + 1} fill="var(--m-lo)" opacity={0.5} />

      <g fill="url(#vb-glint)">
        <ellipse cx="78" cy="7" rx="28" ry="4" />
        <ellipse cx="196" cy="11" rx="16" ry="3" />
        <ellipse cx="7" cy="96" rx="3.5" ry="24" />
        <ellipse cx="253" cy="228" rx="3.5" ry="30" />
        <ellipse cx="168" cy="358" rx="24" ry="4" />
      </g>
    </FrameSvg>
  );
}

// Un tema por pestaña del lab (THEMES en CardDesignLab.tsx) y por parcial de
// styles/components/card-themes/. Vive aquí para que CARD_FRAMES sea un Record
// exhaustivo: añadir un tema sin decidir su marco rompe el build, en la misma
// línea que las funciones de tokens del SCSS.
export type CardTheme = "armored";

// Marco por tema.
export const CARD_FRAMES: Record<CardTheme, () => React.ReactElement | null> = {
  armored: ArmoredFrame,
};

// El diseño elegido: el que pinta la vista cartas de la wiki
// (components/wiki/CardTableView.tsx). El lab puede probar los demás.
export const DEFAULT_CARD_THEME: CardTheme = "armored";
