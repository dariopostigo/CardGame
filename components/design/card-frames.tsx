// =========================================================================
// Marcos vectoriales de los temas "Vector"
//
// Trazados propios (nada de bitmaps) inspirados en los sheets de
// public/assets/Vector: filete dorado, valance de nubes sobre el arte, cresta
// del panel con gema y filigrana de rama. Escalan y se recolorean.
//
// Reparto de responsabilidades con el SCSS:
//   - AQUÍ va lo que NO depende del layout: filete, valance, cresta del panel y
//     ornamentos. Se dibuja en un viewBox fijo de 260×364 (la geometría de la
//     carta, settings/_card.scss).
//   - En el SCSS van las piezas que deben seguir al contenido (banda de
//     nombre, gemas, paneles): se hacen con clip-path/gradientes sobre el
//     propio elemento HTML para que se adapten a su alto real.
//
// Los <defs> se emiten UNA sola vez por página (<CardFrameDefs/>, en el
// escenario del lab) y las cartas los referencian por id: con 100 cartas en
// pantalla no tiene sentido duplicar gradientes. De ahí los prefijos: "vf-" lo
// compartido y "vb-" lo que solo usa Blasón.
// =========================================================================

const CARD_W = 260;
const CARD_H = 364;
const AXIS = CARD_W / 2;

// ------------------------------------------------- Tema BLASÓN: geometría
// Cotas medidas sobre public/assets/Vector/vector1.png (la carta completa del
// sheet, reescalada de 145×202 px a nuestro 260×364).
//
// El filete es una pila de cuatro anillos concéntricos; cada uno se pinta como
// el trazo de un rect, de ahí que se guarden como [desde, hasta] respecto al
// borde de la carta y no como grosores sueltos.
const BAND = {
  rim: [2.5, 5.5], // filo exterior, el más brillante
  groove: [5.5, 7.5], // ranura oscura que separa filo y banda
  main: [7.5, 13.5], // banda de oro batido
  lip: [13.5, 14.5], // hairline oscuro contra el arte
} as const;

const INNER = BAND.lip[1]; // borde interior del marco: donde empieza el arte

// Base de la cresta del panel. Tiene que coincidir EXACTAMENTE con --art-h del
// tema (_vector-blason.scss): es el punto MÁS BAJO de la silueta dorada, así
// que a partir de ahí todo el ancho de la carta ya es panel y el nombre nunca
// cae sobre el arte. Si se mueve una, se mueve la otra.
const CREST_BASE = 176;

// Centro de la gema del blasón, clavada en el pico de la cresta. La gema en sí
// es .card__badge (44px de diámetro, _vector-blason.scss); aquí solo se dibuja
// el engarce en estrella que asoma por detrás.
const GEM = { cx: AXIS, cy: 172 };

// ------------------------------------------------------------- Siluetas
// Las dos siluetas —el arco que corona el arte y la cresta del panel— son
// simétricas respecto al eje de la carta, así que se autora SOLO la mitad
// izquierda y la derecha se genera reflejándola. Reflejar no basta: hay que
// recorrer los tramos al revés, y al invertir una cúbica sus dos puntos de
// control se intercambian.
type Pt = readonly [number, number];

// Tramo del perfil: recto hasta `to`, cuadrática con `c`, o cúbica con `c`+`c2`.
type Step = { to: Pt; c?: Pt; c2?: Pt };

const n = (v: number) => Number(v.toFixed(2));
const pt = ([x, y]: Pt) => `${n(x)},${n(y)}`;
const flip = ([x, y]: Pt): Pt => [CARD_W - x, y];

function step({ to, c, c2 }: Step): string {
  if (c && c2) return `C${pt(c)} ${pt(c2)} ${pt(to)}`;
  return c ? `Q${pt(c)} ${pt(to)}` : `L${pt(to)}`;
}

function symmetricPath(start: Pt, steps: readonly Step[]): string {
  const out = [`M${pt(start)}`, ...steps.map(step)];
  for (let i = steps.length - 1; i >= 0; i--) {
    const { c, c2 } = steps[i];
    const to = flip(i === 0 ? start : steps[i - 1].to);
    out.push(step(c2 && c ? { to, c: flip(c2), c2: flip(c) } : { to, c: c && flip(c) }));
  }
  return out.join(" ");
}

// ------------------------------------------------ Herrajes de las esquinas
// Lo que corona el arte son cantoneras: escuadras de metal pegadas al filete,
// con bocel grabado, remates en punta y un florón en el codo. Es el ornamento
// de carta de rol de toda la vida.
//
// Antes hubo aquí dos intentos peores, por si a alguien le tienta repetirlos:
// el festón de lóbulos calcado del sheet (se leía como un cielo de dibujos
// animados) y un arco de tracería gótica (a lo ancho que es el hueco del arte,
// 230×160, un arco apuntado sale forzosamente aplastado y parecía un ala de
// murciélago). Las esquinas funcionan porque no compiten con la ilustración.
// Perfil achaflanado, a juego con los dientes de la cresta: la carta ya tiene
// un lenguaje de aristas abajo y con el herraje redondeado arriba se peleaban.
// Cada brazo entra y sale con un chaflán a 45° y hay un escalón antes de la
// diagonal del codo.
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

// Cresta, mitad izquierda. Los valores salen de muestrear el sheet columna a
// columna y reescalar. De izquierda a derecha: caída larga desde el filete,
// valle (el único punto que toca CREST_BASE), diente fino, loma, valle ancho y
// subida al pico central, que queda detrás de la gema.
//
// El relieve de los laterales va deliberadamente más plano que en el sheet: allí
// la cresta cae al 68% de la carta y aquí al 48% (nos hace falta panel para el
// texto), y a esa altura los mismos desniveles se leían como una cordillera y
// le disputaban el protagonismo al pico central.
const CREST_STEPS: readonly Step[] = [
  { to: [29, 166], c: [14, 161] },
  { to: [36, CREST_BASE] }, // baja al valle
  { to: [39.5, 169] }, //     y vuelve a subir: el diente
  { to: [61.5, 164], c: [50, 169] },
  { to: [94, 174], c: [78, 170] },
  { to: [AXIS, 142], c: [112, 146] },
];

const CREST = symmetricPath([0, 158], CREST_STEPS);
const PANEL = `${CREST} L${CARD_W},${CARD_H} L0,${CARD_H} Z`;

// -------------------------------------------------------- Tema RÚNICA
// Otra familia distinta: sobre el pack de public/assets/AffinityDesign. Aquí
// el arte no es un rectángulo a sangre sino un MEDALLÓN circular con anillo de
// metal, y la información va en placas horizontales con las puntas en flecha
// que se le montan encima por arriba y por abajo.
//
// Reparto: este archivo dibuja el marco, el anillo del medallón, el emblema y
// la cenefa rúnica; las placas van en el SCSS con clip-path, porque tienen que
// seguir al alto real del nombre y de los stats.
const RN = {
  band: [2.2, 11.5], // banda de metal del marco, desde el borde de la carta
  // Medallón del arte (= .card__art, 210px). Se sale por arriba y por abajo a
  // propósito: las dos placas le tapan los casquetes, como en el pack.
  ring: { cx: AXIS, cy: 114, r: 105 },
  emblem: { cx: AXIS, cy: 222, r: 19 }, // emblema, a caballo de la placa de clase
  runes: { y: 352, from: 44, to: 216, step: 12 },
} as const;

// Alfabeto de la cenefa: ocho runas de palo, cada una como lista de
// polilíneas en una celda de 5×8. Son inventadas pero con la gramática de las
// de verdad (un asta y trazos rectos colgando), que es lo que hace que se lean
// como escritura y no como una greca.
type Poly = readonly Pt[];
const RUNES: readonly (readonly Poly[])[] = [
  [[[0, 0], [0, 8]], [[0, 1], [4, 2.5]], [[0, 4], [4, 5.5]]],
  [[[0, 8], [0, 1], [4, 3], [4, 8]]],
  [[[0, 0], [0, 8]], [[0, 2], [4, 4], [0, 6]]],
  [[[0, 8], [0, 1], [4, 0]], [[0, 4], [4, 3]]],
  [[[0, 0], [0, 8]], [[0, 0], [4, 2], [0, 4]], [[0, 4], [4, 8]]],
  [[[4, 0], [0, 4], [4, 8]]],
  [[[2, 0], [2, 8]], [[0, 1], [2, 3], [4, 1]]],
  [[[2, 0], [2, 8]], [[0, 3], [2, 0], [4, 3]]],
];

// La cenefa se recorre en orden fijo, sin aleatorio: así la carta se ve igual
// en el servidor y en el cliente, y de paso no cambia entre recargas.
function runeStrip({ y, from, to, step }: typeof RN.runes): string {
  const count = Math.floor((to - from) / step) + 1;
  return Array.from({ length: count }, (_, i) => {
    const ox = from + i * step;
    return RUNES[i % RUNES.length]
      .map((poly) => `M${poly.map(([px, py]) => `${n(ox + px)},${n(y + py)}`).join(" L")}`)
      .join(" ");
  }).join(" ");
}

const RUNE_STRIP = runeStrip(RN.runes);

// Roblón: cabeza de clavo con su luz arriba a la izquierda, igual que el resto
// del relieve de la carta.
function Rivet({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} fill="url(#vb-rivet-fill)" stroke="#3d2005" strokeWidth="1" />
      <circle cx={n(-r * 0.28)} cy={n(-r * 0.28)} r={n(r * 0.34)} fill="#fdefc8" opacity="0.65" />
    </g>
  );
}

export function CardFrameDefs() {
  return (
    <svg className="card-lab__defs" aria-hidden="true" focusable="false">
      <defs>
        {/* Oro batido: la diagonal recorre la carta, así que el filete pasa
            de sombra a brillo y otra vez a sombra en cada lado. */}
        <linearGradient id="vf-gilt" x1="0" y1="0" x2={CARD_W} y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6b4a1e" />
          <stop offset="18%" stopColor="#c79a4e" />
          <stop offset="38%" stopColor="#f6e3ac" />
          <stop offset="52%" stopColor="#e0bb6f" />
          <stop offset="72%" stopColor="#b9853f" />
          <stop offset="88%" stopColor="#f0d69a" />
          <stop offset="100%" stopColor="#5e401a" />
        </linearGradient>

        {/* Hoja de 9×6: dos curvas que se cierran en punta por los dos lados.
            A la escala de la carta (260px de ancho) tiene que ser pequeña —
            con elipses de 16px las cuatro hojas se fundían con el tallo y la
            esquina se leía como un borrón. */}
        <path id="vf-leaf" d="M0,0 C2.5,-3.2 6.5,-3.2 9,0 C6.5,3.2 2.5,3.2 0,0 Z" />

        {/* Rama para la esquina superior izquierda del tema Arbórea; las otras
            salen de reflejarla. El tallo va fino y las hojas llevan filo
            oscuro: es lo que las separa del tallo a tamaño real. */}
        <g id="vf-branch">
          <path
            d="M0,30 C4,16 14,6 30,2.5 C40,0.5 48,1 56,3"
            fill="none"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g stroke="#2b1c0a" strokeWidth="0.5">
            <use href="#vf-leaf" transform="translate(5,22) rotate(-70)" />
            <use href="#vf-leaf" transform="translate(12,11) rotate(-45)" />
            <use href="#vf-leaf" transform="translate(24,4) rotate(-18)" />
            <use href="#vf-leaf" transform="translate(40,1.5) rotate(6)" />
          </g>
        </g>

        {/* ------------------------------------------------ Tema BLASÓN --- */}

        {/* Oro del marco. Va en diagonal para que cada lado recorra luz y
            sombra, con los picos claros descolocados respecto al centro: un
            gradiente simétrico deja una banda plana justo en las esquinas. */}
        <linearGradient id="vb-gold" x1="0" y1="0" x2={CARD_W} y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8a5a24" />
          <stop offset="12%" stopColor="#e7ae57" />
          <stop offset="26%" stopColor="#f8dda6" />
          <stop offset="44%" stopColor="#d18c3e" />
          <stop offset="58%" stopColor="#a86c2e" />
          <stop offset="74%" stopColor="#f3cd8d" />
          <stop offset="88%" stopColor="#c9873c" />
          <stop offset="100%" stopColor="#77491c" />
        </linearGradient>

        {/* Panel de lectura. El brillo del sheet corre por el EJE VERTICAL de
            la carta (bordes apagados, centro encendido), así que el gradiente
            es horizontal y el volumen de arriba abajo lo pone vb-panel-shade. */}
        <linearGradient id="vb-panel-fill" x1="0" y1="0" x2={CARD_W} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b96c2e" />
          <stop offset="20%" stopColor="#d78b3f" />
          <stop offset="50%" stopColor="#efb063" />
          <stop offset="80%" stopColor="#d78b3f" />
          <stop offset="100%" stopColor="#b96c2e" />
        </linearGradient>

        {/* Sombra que asienta el panel bajo la cresta y lo cierra abajo. */}
        <linearGradient id="vb-panel-shade" x1="0" y1={CREST_BASE - 40} x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3a1c02" stopOpacity="0.32" />
          <stop offset="34%" stopColor="#3a1c02" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a1c02" stopOpacity="0.22" />
        </linearGradient>

        {/* --- Tema VITELA: solo cambia la piel del panel de lectura ------ */}

        {/* Vitela: claro en el centro y curtido hacia los bordes, para que el
            texto caiga siempre sobre la parte más clara. */}
        <radialGradient
          id="vv-panel-fill"
          cx={AXIS}
          cy={CREST_BASE + 60}
          r="168"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#faf1da" />
          <stop offset="55%" stopColor="#eddfba" />
          <stop offset="100%" stopColor="#d3ba8c" />
        </radialGradient>

        {/* Sombra: cierra la vitela contra la cresta y contra el pie. Más suave
            que la del oro — sobre claro, la misma opacidad ensucia. */}
        <linearGradient id="vv-panel-shade" x1="0" y1={CREST_BASE - 34} x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
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

        {/* Oro de las cantoneras: la luz les entra por la esquina, que es de
            donde nacen. */}
        <linearGradient id="vb-corner-fill" x1={INNER} y1={INNER} x2="76" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f4cb8c" />
          <stop offset="45%" stopColor="#d2893c" />
          <stop offset="100%" stopColor="#96591f" />
        </linearGradient>

        {/* Cabeza de roblón: el gradiente va en caja de objeto (el de por
            defecto) para que cada clavo tenga su propia luz sin recolocarlo. */}
        <radialGradient id="vb-rivet-fill" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#f6d79a" />
          <stop offset="100%" stopColor="#a8701f" />
        </radialGradient>

        {/* La escuadra pelada: se usa aparte para la sombra, así que va sin
            pintar y sin los adornos, que en una silueta solo hacen ruido. */}
        <path id="vb-corner-shape" d={BRACKET} />

        <g id="vb-corner">
          <use href="#vb-corner-shape" fill="url(#vb-corner-fill)" stroke="#3d2005" strokeWidth="1.4" />
          <path d={BRACKET_BEVEL} fill="none" stroke="#fbe6b6" strokeWidth="1.4" opacity="0.45" />
          <path d={BRACKET_GROOVE} fill="none" stroke="#3d2005" strokeWidth="1.3" opacity="0.5" />
          {RIVETS.map(([x, y, r]) => (
            <Rivet key={`${x}-${y}`} x={x} y={y} r={r} />
          ))}
        </g>

        {/* Panel y su cresta. Al ser un trazado único el sombreado translúcido
            no tiene el problema del valance, y el filo de luz sale de trazar la
            misma línea en vez de tener que calcular un contorno. */}
        <path id="vb-panel-shape" d={PANEL} />
        <path id="vb-crest-line" d={CREST} />

        {/* Mismo contorno como recorte: lo necesitan las manchas de la vitela,
            que son elipses sueltas y sin él se salen por la cresta al arte. */}
        <clipPath id="vb-panel-clip">
          <path d={PANEL} />
        </clipPath>

        {/* Engarce de la gema: estrella de cuatro puntas, las verticales más
            largas, de la que solo asoman las puntas por detrás de la piedra
            (44px de diámetro). Se dibuja centrada en 0,0 y se coloca con
            transform. */}
        <path id="vb-socket" d="M0,-32 Q3.5,-7 28,0 Q3.5,7 0,32 Q-3.5,7 -28,0 Q-3.5,-7 0,-32 Z" />

        {/* Destello del oro: los sheets llevan estos brillos repartidos por el
            filete y son la mitad de lo que hace que el metal no parezca papel
            pintado. Blanco que se apaga rápido, para pegarlo con opacidad. */}
        <radialGradient id="vb-glint">
          <stop offset="0%" stopColor="#fff8e6" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#fff2d2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff2d2" stopOpacity="0" />
        </radialGradient>

        {/* ------------------------------------------------ Tema RÚNICA --- */}

        {/* Metal del marco y del anillo. Más pálido y menos saturado que el oro
            de Blasón: en el pack de referencia es peltre dorado, no oro. */}
        <linearGradient id="rn-metal" x1="0" y1="0" x2={CARD_W} y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a5127" />
          <stop offset="14%" stopColor="#d9b47e" />
          <stop offset="30%" stopColor="#f0e0bd" />
          <stop offset="48%" stopColor="#c39763" />
          <stop offset="66%" stopColor="#8a5f34" />
          <stop offset="82%" stopColor="#e5cb9d" />
          <stop offset="100%" stopColor="#6d4620" />
        </linearGradient>

        {/* El emblema lleva metal propio, vertical y más claro: el del marco es
            diagonal y a la altura de la placa pasa por su tramo oscuro, así que
            la pieza salía apagada justo en el centro de la carta. */}
        <linearGradient
          id="rn-emblem-metal"
          x1="0"
          y1={RN.emblem.cy - RN.emblem.r}
          x2="0"
          y2={RN.emblem.cy + RN.emblem.r}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f3e3c1" />
          <stop offset="50%" stopColor="#c9a06b" />
          <stop offset="100%" stopColor="#8a5f34" />
        </linearGradient>

        {/* Emblema del medallón: anillo, triángulo y piedra. La piedra toma
            var(--rarity) — las custom properties de la carta llegan al SVG
            inline, así que el emblema cuenta la rareza sin duplicar temas. */}
        <g id="rn-emblem" stroke="url(#rn-emblem-metal)">
          <circle r={RN.emblem.r} fill="#2a2119" strokeWidth="2.8" />
          <circle r={RN.emblem.r - 5} fill="none" strokeWidth="1" opacity="0.7" />
          <path
            d={`M0,${-RN.emblem.r + 2.5} L${RN.emblem.r - 3},${RN.emblem.r - 7} L${-RN.emblem.r + 3},${RN.emblem.r - 7} Z`}
            fill="none"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <g stroke="none">
            <circle cy="3" r="5.5" fill="var(--rarity)" />
            <circle cy="3" r="5.5" fill="url(#rn-gem-shine)" />
          </g>
        </g>

        <radialGradient id="rn-gem-shine" cx="34%" cy="28%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {/* Recorte al contorno de la carta: mantiene valance, cresta y panel
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
      stroke={fill}
      strokeWidth={to - from}
      opacity={opacity}
    />
  );
}

// --- Tema ARBÓREA: filete + rama de hojas en las cuatro esquinas ----------
function FrameArborea() {
  return (
    <FrameSvg>
      <rect x="4.5" y="4.5" width="251" height="355" rx="10.5" fill="none" stroke="url(#vf-gilt)" strokeWidth="3.5" />
      <rect x="10.5" y="10.5" width="239" height="343" rx="8" fill="none" stroke="url(#vf-gilt)" strokeWidth="1" opacity="0.7" />
      {/* La rama se dibuja una vez para la esquina superior izquierda y se
          refleja en la derecha. Solo arriba: los paneles de texto y pie son
          opacos y van en un plano superior, así que las ramas inferiores
          quedaban tapadas por completo. */}
      <g fill="url(#vf-gilt)" stroke="url(#vf-gilt)">
        <use href="#vf-branch" transform="translate(8,8)" />
        <use href="#vf-branch" transform="translate(252,8) scale(-1,1)" />
      </g>
    </FrameSvg>
  );
}

// --- Temas BLASÓN y VITELA: sobre vector1.png -----------------------------
// Los dos comparten marco: filete, cantoneras, cresta y engarce son los mismos
// trazados, y lo ÚNICO que cambia es con qué se rellena el panel de lectura —
// oro batido en Blasón, vitela en Vitela. De ahí que no sean dos componentes
// sino uno con dos pieles: si se retoca la geometría, se retoca para ambos.
//
// (En el SCSS sí son dos parciales independientes, siguiendo la convención de
// la casa: la piel de cada tema puede divergir y compartirla los ataría.)
const PANEL_SKIN = {
  blason: { fill: "url(#vb-panel-fill)", shade: "url(#vb-panel-shade)", crest: "#fbe3b0", aged: false },
  vitela: { fill: "url(#vv-panel-fill)", shade: "url(#vv-panel-shade)", crest: "#e8bf74", aged: true },
} as const;

// Orden de pintado (importa): panel → cantoneras → engarce → filete. El filete
// va el último porque el panel sale a sangre y es él quien lo corta limpio
// contra el borde de la carta.
function BlasonFrame({ skin }: { skin: keyof typeof PANEL_SKIN }) {
  const s = PANEL_SKIN[skin];
  return (
    <FrameSvg>
      <g clipPath="url(#vf-card)">
        {/* Panel, su sombreado y el filo de la cresta, que es lo que lo despega
            del arte. El filo va con linejoin en punta para que el diente no se
            redondee. */}
        <use href="#vb-panel-shape" fill={s.fill} />
        {s.aged && (
          <>
            <g clipPath="url(#vb-panel-clip)">
              <ellipse cx="72" cy="238" rx="62" ry="44" fill="url(#vv-stain)" />
              <ellipse cx="206" cy="312" rx="48" ry="38" fill="url(#vv-stain)" />
              <ellipse cx="146" cy="352" rx="70" ry="30" fill="url(#vv-stain)" />
            </g>
            <use href="#vb-panel-shape" fill="url(#vv-grain)" opacity="0.45" />
          </>
        )}
        <use href="#vb-panel-shape" fill={s.shade} />
        <use
          href="#vb-crest-line"
          fill="none"
          stroke={s.crest}
          strokeWidth="1.6"
          strokeLinejoin="miter"
          opacity="0.9"
        />

        {/* Cantoneras, solo las de arriba: abajo caerían sobre el panel dorado
            y el oro sobre oro no se ve. Cada una lleva su copia retrasada 2.5px
            de sombra, que es lo que la despega del arte. */}
        <g opacity="0.45" fill="#160a01" transform="translate(2,2.5)">
          <use href="#vb-corner-shape" />
          <use href="#vb-corner-shape" transform={`translate(${CARD_W - 4},0) scale(-1,1)`} />
        </g>
        <use href="#vb-corner" />
        <use href="#vb-corner" transform={`translate(${CARD_W},0) scale(-1,1)`} />

        {/* Engarce en estrella detrás de la gema (.card__badge, que va en un
            plano superior). Lleva filo oscuro: sin él las puntas que asoman
            sobre el panel dorado se leen como recortes de cartulina. */}
        <use
          href="#vb-socket"
          fill="url(#vb-gold)"
          stroke="#5c3712"
          strokeWidth="1.2"
          strokeLinejoin="round"
          transform={`translate(${GEM.cx},${GEM.cy})`}
        />
      </g>

      {/* Filete: cuatro anillos concéntricos (ver BAND). */}
      <Band from={BAND.rim[0]} to={BAND.rim[1]} fill="url(#vb-gold)" />
      <Band from={BAND.groove[0]} to={BAND.groove[1]} fill="#140600" />
      <Band from={BAND.main[0]} to={BAND.main[1]} fill="url(#vb-gold)" />
      <Band from={BAND.lip[0]} to={BAND.lip[1]} fill="#140600" opacity={0.85} />
      {/* Bisel: luz por dentro de la banda ancha y sombra por fuera. */}
      <Band from={BAND.main[1] - 1.2} to={BAND.main[1]} fill="#fbe6b6" opacity={0.5} />
      <Band from={BAND.main[0]} to={BAND.main[0] + 1} fill="#6b3f12" opacity={0.5} />

      {/* Destellos sueltos sobre el filete. Van a mano y descolocados a
          propósito: repartidos a intervalos iguales el oro se lee como una
          cenefa impresa. Cada elipse cabe dentro de su banda. */}
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

// --- Tema RÚNICA: sobre el pack de AffinityDesign -------------------------
// Van DOS lienzos: el emblema tiene que quedar por encima de las placas (que
// son HTML, en el plano "content") y el anillo por debajo, y un solo SVG no
// puede estar en dos planos a la vez. El segundo lleva --top y el parcial del
// tema lo sube al plano de las fichas.
function FrameRunica() {
  const { cx, cy, r } = RN.ring;
  return (
    <>
      <FrameSvg>
        {/* Banda de metal del marco, con filo oscuro por fuera y por dentro. */}
        <Band from={0.8} to={2.2} fill="#3a2a1c" />
        <Band from={RN.band[0]} to={RN.band[1]} fill="url(#rn-metal)" />
        <Band from={RN.band[1]} to={RN.band[1] + 1.4} fill="#3a2a1c" />

        {/* Cenefa rúnica en la banda de abajo. */}
        <path
          d={RUNE_STRIP}
          fill="none"
          stroke="#4a3016"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Anillo del medallón: aro de metal con filo oscuro a los dos lados y
            cuatro roblones en los puntos cardinales. */}
        <g fill="none">
          <circle cx={cx} cy={cy} r={r + 2.8} stroke="#3a2a1c" strokeWidth="1.3" opacity="0.85" />
          <circle cx={cx} cy={cy} r={r} stroke="url(#rn-metal)" strokeWidth="5" />
          <circle cx={cx} cy={cy} r={r - 2.8} stroke="#3a2a1c" strokeWidth="1.3" opacity="0.85" />
        </g>
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <Rivet key={deg} x={n(cx + r * Math.cos(a))} y={n(cy + r * Math.sin(a))} r={3} />;
        })}
      </FrameSvg>

      <FrameSvg className="card__frame--top">
        <use href="#rn-emblem" transform={`translate(${RN.emblem.cx},${RN.emblem.cy})`} />
      </FrameSvg>
    </>
  );
}

// Un tema por pestaña del lab (THEMES en CardDesignLab.tsx) y por parcial de
// styles/components/card-themes/. Vive aquí para que CARD_FRAMES sea un Record
// exhaustivo: añadir un tema sin decidir su marco rompe el build, en la misma
// línea que las funciones de tokens del SCSS.
export type CardTheme =
  | "pergamino"
  | "vector-arborea"
  | "vector-blason"
  | "vector-vitela"
  | "runica";

// Marco por tema. Pergamino no lleva SVG (su marco es puro CSS), de ahí el null.
export const CARD_FRAMES: Record<CardTheme, () => React.ReactElement | null> = {
  pergamino: () => null,
  "vector-arborea": FrameArborea,
  "vector-blason": () => <BlasonFrame skin="blason" />,
  "vector-vitela": () => <BlasonFrame skin="vitela" />,
  runica: FrameRunica,
};
