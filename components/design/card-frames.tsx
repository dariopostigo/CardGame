// =========================================================================
// Marcos vectoriales de los temas "Vector"
//
// Inspirados en los sheets de public/assets/Vector: filete dorado, silueta
// de nube/ola entre el arte y el panel de texto, filigrana de rama y
// zarcillos de espinas. Todo son paths propios (nada de bitmaps), así que
// escalan y se recolorean.
//
// Reparto de responsabilidades con el SCSS:
//   - AQUÍ va lo que NO depende del layout: marco, ola, ornamentos. Se
//     dibuja en un viewBox fijo de 260×364 (la geometría de la carta,
//     settings/_card.scss).
//   - En el SCSS van las piezas que deben seguir al contenido (banda de
//     nombre, gemas, paneles): se hacen con clip-path/gradientes sobre el
//     propio elemento HTML para que se adapten a su alto real.
//
// Los <defs> se emiten UNA sola vez por página (<CardFrameDefs/>, en el
// escenario del lab) y las cartas los referencian por id: con 60 cartas en
// pantalla no tiene sentido duplicar gradientes. De ahí el prefijo "vf-".
// =========================================================================

const CARD_W = 260;
const CARD_H = 364;

// Silueta de nube/ola que separa el arte del panel de texto: cuatro lóbulos
// convexos de 65px. Los puntos de control van pegados a los extremos de cada
// lóbulo, y eso es lo que hace que las uniones salgan en pico hacia abajo en
// vez de redondeadas — la firma de las plantillas de referencia.
//
// La base en y=164 tiene que coincidir EXACTAMENTE con --art-h de los temas
// ($art-height-theme en _vector-oro/_vector-sombra): si la ola arranca más
// abajo que el arte, entre los dos asoma una banda del fondo de la carta en
// los valles. Y es también lo que deja bajo el panel sitio para el texto más
// largo (card-fit 3) y el pie.
const WAVE_BASE = 164;
const WAVE_CREST = 132;

// Cuatro lóbulos de 65px. Los puntos de control van muy pegados a los extremos
// (8 y 57 de 65), y eso es lo que hace que las uniones salgan en pico agudo
// hacia abajo en vez de redondeadas — la firma de las plantillas de referencia.
const WAVE = [
  `M0,${WAVE_BASE}`,
  ...[0, 65, 130, 195].map(
    (x) => `C${x + 8},${WAVE_CREST} ${x + 57},${WAVE_CREST} ${x + 65},${WAVE_BASE}`
  ),
].join(" ");
const WAVE_PANEL = `${WAVE} L${CARD_W},${CARD_H} L0,${CARD_H} Z`;

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

        {/* Plata lavanda del tema Sombra (espinas y filete). */}
        <linearGradient id="vf-silver" x1="0" y1="0" x2={CARD_W} y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c5fa6" />
          <stop offset="30%" stopColor="#e6d8ff" />
          <stop offset="55%" stopColor="#b394dd" />
          <stop offset="80%" stopColor="#f2e9ff" />
          <stop offset="100%" stopColor="#6a4a94" />
        </linearGradient>

        {/* Paneles: verticales, del claro de la cresta al oscuro del pie. */}
        <linearGradient id="vf-panel-oro" x1="0" y1={WAVE_CREST} x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f7d495" />
          <stop offset="30%" stopColor="#e8b465" />
          <stop offset="100%" stopColor="#c9873c" />
        </linearGradient>

        {/* El violeta se mantiene claro hasta el pie a propósito: la tinta del
            texto es casi negra y con el #7d5cb0 de antes al fondo del panel el
            contraste se caía justo donde acaba el texto más largo. */}
        <linearGradient id="vf-panel-sombra" x1="0" y1={WAVE_CREST} x2="0" y2={CARD_H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ded0f4" />
          <stop offset="30%" stopColor="#c4aae3" />
          <stop offset="100%" stopColor="#a086d0" />
        </linearGradient>

        <path id="vf-wave-panel" d={WAVE_PANEL} />
        <path id="vf-wave-edge" d={WAVE} />

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

        {/* Tramo de zarcillo (tema Sombra), 58px de recorrido. Dos púas y no
            cuatro: con más, los cuatro tramos se cruzaban en las esquinas y el
            marco se leía como arañazos en vez de como espinas. */}
        <g id="vf-thorn" fill="none" strokeWidth="1.2" strokeLinecap="round">
          <path d="M0,0 C16,2.5 30,-3 44,0.5 C50,1.6 54,1 58,0" />
          <path d="M15,1.6 l3,-6.5" />
          <path d="M34,-1.2 l-2.5,-6.5" />
        </g>

        {/* Esquina = tramo horizontal + el mismo girado 90°. */}
        <g id="vf-thorn-corner">
          <use href="#vf-thorn" />
          <use href="#vf-thorn" transform="rotate(90)" />
        </g>

        {/* Recorte al contorno de la carta: mantiene la ola y los ornamentos
            dentro del redondeo sin depender de overflow. */}
        <clipPath id="vf-card">
          <rect x="0" y="0" width={CARD_W} height={CARD_H} rx="14" />
        </clipPath>
      </defs>
    </svg>
  );
}

// preserveAspectRatio="none" para que el marco encaje al píxel con el borde:
// los tres temas conservan el 260×364 del esqueleto, así que la relación de
// aspecto es 1:1 y no hay deformación de los trazos.
function FrameSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="card__frame"
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// --- Tema ORO: doble filete dorado + ola + destellos ----------------------
function FrameOro() {
  return (
    <FrameSvg>
      <g clipPath="url(#vf-card)">
        <use href="#vf-wave-panel" fill="url(#vf-panel-oro)" />
        <use href="#vf-wave-edge" fill="none" stroke="#fbeec4" strokeWidth="2" opacity="0.75" />
      </g>
      {/* Filete exterior grueso + hairline interior, ambos en oro batido. El
          exterior arranca en 4.5 para dejarle los 2px del borde al rim de
          rareza (.card::before), que va por encima en la cascada. */}
      <rect x="4.5" y="4.5" width="251" height="355" rx="11" fill="none" stroke="url(#vf-gilt)" strokeWidth="4" />
      <rect x="10" y="10" width="240" height="344" rx="8" fill="none" stroke="url(#vf-gilt)" strokeWidth="1.2" opacity="0.85" />
    </FrameSvg>
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

// --- Tema SOMBRA: misma ola que Oro en violeta + zarcillos de espinas -----
function FrameSombra() {
  return (
    <FrameSvg>
      <g clipPath="url(#vf-card)">
        <use href="#vf-wave-panel" fill="url(#vf-panel-sombra)" />
        <use href="#vf-wave-edge" fill="none" stroke="#ecdcff" strokeWidth="2" opacity="0.7" />
      </g>
      <rect x="4" y="4" width="252" height="356" rx="11" fill="none" stroke="url(#vf-silver)" strokeWidth="3" />
      {/* Solo las esquinas de arriba: los zarcillos se dibujan después de la
          ola, así que abajo caían sobre el panel violeta claro y la plata
          sobre claro se leía como arañazos. Arriba van sobre el arte oscuro. */}
      <g stroke="url(#vf-silver)">
        <use href="#vf-thorn-corner" transform="translate(11,11)" />
        <use href="#vf-thorn-corner" transform="translate(249,11) scale(-1,1)" />
      </g>
    </FrameSvg>
  );
}

// Un tema por pestaña del lab (THEMES en CardDesignLab.tsx) y por parcial de
// styles/components/card-themes/. Vive aquí para que CARD_FRAMES sea un Record
// exhaustivo: añadir un tema sin decidir su marco rompe el build, en la misma
// línea que las funciones de tokens del SCSS.
export type CardTheme = "pergamino" | "vector-oro" | "vector-arborea" | "vector-sombra";

// Marco por tema. Pergamino no lleva SVG (su marco es puro CSS), de ahí el null.
export const CARD_FRAMES: Record<CardTheme, () => React.ReactElement | null> = {
  pergamino: () => null,
  "vector-oro": FrameOro,
  "vector-arborea": FrameArborea,
  "vector-sombra": FrameSombra,
};
