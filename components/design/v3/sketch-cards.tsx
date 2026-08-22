// =========================================================================
// Los bocetos de marco de V3
//
// Un boceto es una respuesta a la pregunta de dónde caen los 13 datos de una
// carta de unidad (knowledge/v3/card-concept/README.md §"Contra qué se
// juzgan"). No es una piel: lo que un boceto decide es la POSICIÓN de las ocho
// Habilidades y de las Características.
//
// Hubo cinco —A · Rejilla, B · Gema, C · Losa, D · Blindada y E · Forja— y
// queda UNO. La comparación terminó: E gana y las cuatro anteriores se han
// borrado, con sus parciales y sus piezas. Lo que aprendió cada una sigue
// escrito en knowledge/v3/card-concept/README.md, que es donde vive el
// razonamiento; aquí solo vive lo que se dibuja. Los bocetos nuevos parten de
// la E, así que la lista y el Record se quedan: sirven para lo que viene, no
// para lo que hubo.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// AÑADIR UN BOCETO: un componente aquí, su entrada en SKETCHES (abajo) y su
// parcial en styles/components/card-sketch/. El Record SKETCH_CARDS es
// exhaustivo, así que dar de alta un id sin dibujarlo rompe el build.
// =========================================================================

import { LONG_NAME, rankOf, SKILLS, type SkillKey, type Subject } from "./sample";
import { ForjaFrame } from "./sketch-frames";

export type SketchId = "forja";

/** Ficha de cada boceto: de aquí comen las pestañas y las notas del lab. */
export const SKETCHES: readonly {
  id: SketchId;
  label: string;
  /** De qué referencia sale. */
  source: string;
  /** Su apuesta, en una frase: qué hace distinto de los otros dos. */
  bet: string;
}[] = [
  {
    id: "forja",
    label: "E · Forja",
    source: "Boceto D, abierto por la mitad",
    bet: "El metal NO lleva la rareza: todas las cartas son del mismo peltre —material de carta, no dato— y el color vive en una veta encendida que corre por el canal entre los dos raíles del filete, derramándose hacia dentro sobre la ilustración. La carta no está teñida, está encendida. El pie se reduce a UNA pieza: una placa traslúcida a sangre de lado a lado con el rótulo —a mayor tamaño— y las ocho Habilidades dentro. Sin subtítulo: el medallón lleva el emblema de la raza y el color de la veta dice la clase de tier, así que no queda texto que escribir bajo el nombre. Las Características van en un raíl vertical de medallones sobre el arte.",
  },
];

const skillOf = (key: SkillKey) => SKILLS.find((s) => s.key === key)!;

// --- Piezas compartidas ---------------------------------------------------

/**
 * El hueco de arte, a sangre.
 *
 * Cae al emoji cuando el sujeto no tiene ilustración, que hoy es lo normal:
 * public/assets/v3/ está vacío y lo único dibujado son las cuatro cartas de
 * clase de v2. <img> plano y no next/image por el mismo motivo que en
 * SpriteLab: es imagen de laboratorio, no arte de partida.
 */
function Art({ subject }: { subject: Subject }) {
  return (
    <div className="sketch__art" aria-hidden="true">
      {subject.art ? (
        <img className="sketch__art-img" src={subject.art} alt="" />
      ) : (
        <span className="sketch__art-glyph">{subject.icon}</span>
      )}
    </div>
  );
}

/**
 * La placa del nombre.
 *
 * Solo el rótulo: no hay subtítulo. Los bocetos borrados escribían debajo
 * «raza · rango» y la E lo dice sin letra —la raza en el medallón, el rango en
 * el color de la veta—, así que la línea se fue con ellos. Si un boceto nuevo
 * la necesita, vuelve como un hijo más y no como un caso especial de esta
 * pieza.
 */
function Plate({
  subject,
  className,
  children,
  after,
}: {
  subject: Subject;
  className: string;
  /** Piezas ancladas a la placa: el medallón de raza de la E. */
  children?: React.ReactNode;
  /**
   * Lo que va DENTRO de la placa, debajo del rótulo: la fila de ocho, que en
   * este boceto no es una banda aparte apilada bajo la placa, vive dentro.
   */
  after?: React.ReactNode;
}) {
  return (
    <header className={className}>
      {children}
      <h3 className="sketch__name" data-long={subject.name.length > LONG_NAME || undefined}>
        {subject.name}
      </h3>
      {after}
    </header>
  );
}

/**
 * Raíl vertical de Características sobre el arte.
 *
 * Es la mejor respuesta al Miliciano que hay sobre la mesa: con cero
 * medallones no queda un hueco vacío, queda arte. No es una fila del layout,
 * es una capa encima — por eso no vive dentro del pie.
 */
function Rail({ subject }: { subject: Subject }) {
  if (subject.traits.length === 0) return null;
  return (
    <ul className="sketch__rail">
      {subject.traits.map((t) => (
        <li className="sketch__medal" key={t.label} title={t.label}>
          {t.icon}
        </li>
      ))}
    </ul>
  );
}

/**
 * Un par icono-sobre-número. Es la pieza que más se repite —ocho por carta— y
 * la que cambia de piel según dónde caiga: `base` nombra el bloque BEM. Hoy
 * solo hay una piel ("pod", la cápsula de la fila de ocho), pero el parámetro
 * se queda porque es el punto por donde un boceto nuevo cambia la forma sin
 * tocar la estructura — que es siempre la misma, y es justo lo que se compara.
 */
function Stat({ subject, skill, base }: { subject: Subject; skill: SkillKey; base: string }) {
  const s = skillOf(skill);
  return (
    <li className={`sketch__${base}`} title={`${s.label}: ${subject.skills[skill]}`}>
      <span className={`sketch__${base}-icon`} aria-hidden="true">
        {s.icon}
      </span>
      <b className={`sketch__${base}-value`}>{subject.skills[skill]}</b>
    </li>
  );
}

// --- E · Forja ------------------------------------------------------------
// El boceto que gana, y la base de todo lo que venga. Nació de la D —la mezcla
// que teñía la carta entera del color de su rareza— y acabó diciendo lo
// contrario que ella; de esa oposición salen sus tres decisiones, que son las
// que hay que respetar al derivar un boceto nuevo:
//
//   · EL METAL NO ES UN DATO. Todas las cartas son del mismo peltre —material
//     de carta— y el color vive en una VETA DE LUZ que corre por el canal entre
//     los dos raíles del filete (ForjaFrame), derramándose hacia dentro sobre
//     la ilustración. La carta no está teñida: está encendida.
//   · EL PIE ES UNA SOLA PIEZA. No una pila de bandas —nombre, fila de ocho,
//     cenefa—, sino UNA placa a sangre de lado a lado con el rótulo y los ocho
//     números dentro. Es lo que deja al nombre ir grande: ya no hay tres
//     franjas repartiéndose el tercio inferior.
//   · LA CARTA ENSEÑA, NO ESCRIBE. Bajo el nombre no hay nada escrito: el
//     medallón lleva el emblema de la RAZA y el rango lo dice el color de la
//     veta —que en una unidad sale del tier y en un héroe es su raíl rojo—.
//
// Las Características van en un raíl vertical de medallones sobre el arte, y no
// en una cenefa al pie: con cero Características no queda un hueco vacío, queda
// arte. El raíl no es una fila del layout, es una capa encima.
//
// El precio de la tercera decisión sigue abierto: la veta agrupa los ocho tiers
// en cinco escalones (sample.ts, rarityForTier), así que dice de qué CLASE de
// tier es la carta, no cuál. Sin el número, un Miliciano y un Arquero son la
// misma carta gris.
//
// Míralo en los tres héroes: son los únicos sujetos con ilustración definitiva
// de V3, así que son los que dicen la verdad sobre cómo cae este marco encima
// del arte de este juego.
function ForjaCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      <ForjaFrame />
      <Rail subject={subject} />
      <div className="sketch__foot">
        <Plate
          subject={subject}
          className="sketch__plate sketch__plate--metal"
          after={
            <ul className="sketch__pods">
              {SKILLS.map((s) => (
                <Stat key={s.key} subject={subject} skill={s.key} base="pod" />
              ))}
            </ul>
          }
        >
          {/* El medallón lleva la RAZA, y con eso la placa se queda sin
              subtítulo: el emblema dice de quién es la carta y el color de la
              veta, de qué clase de tier —o si es un héroe—. El rango sigue en
              el title para poder comprobarlo. */}
          <span className="sketch__boss" title={`${subject.race} · ${rankOf(subject)}`}>
            <b className="sketch__boss-value">{subject.raceIcon}</b>
          </span>
        </Plate>
      </div>
    </>
  );
}

const SKETCH_CARDS: Record<SketchId, (p: { subject: Subject }) => React.ReactElement> = {
  forja: ForjaCard,
};

/**
 * Una carta de boceto: el artículo con su rareza, y dentro el cuerpo que le
 * toque. La rareza se publica como atributo y no como color porque de ella
 * cuelgan las variables --rarity/--seam del SCSS; el artículo no pinta nada.
 */
export default function SketchCard({ id, subject }: { id: SketchId; subject: Subject }) {
  const Body = SKETCH_CARDS[id];
  return (
    <article className={`sketch sketch--${id}`} data-rarity={subject.rarity}>
      <Body subject={subject} />
    </article>
  );
}
