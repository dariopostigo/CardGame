// =========================================================================
// Los bocetos de marco de V3
//
// Un boceto es una respuesta a la pregunta de dónde caen los 13 datos de una
// carta de unidad (knowledge/v3/card-concept/README.md §"Contra qué se
// juzgan"). No es una piel: lo que un boceto decide es la POSICIÓN de las ocho
// Habilidades y de las Características.
//
// Hubo cinco —A · Rejilla, B · Gema, C · Losa, D · Blindada y E · Forja— y de
// aquella tanda queda UNO: la E ganó y las cuatro anteriores se borraron, con
// sus parciales y sus piezas. Lo que aprendió cada una sigue escrito en
// knowledge/v3/card-concept/README.md, que es donde vive el razonamiento; aquí
// solo vive lo que se dibuja.
//
// La segunda tanda hizo lo mismo en dos días. La F · Blasón —réplica de una
// referencia, Might & Magic: Fates— entró para discutirle a la E cuatro cosas
// que daba por cerradas, y de ella y la E salió la G · Estandarte: el octógono
// de la F con la veta de la E. Montada la mezcla, la F dejó de tener nada que
// enseñar que la G no enseñara igual, así que se borró con su marco y su
// parcial. Lo suyo que valía —la silueta, el disco del Tier, los dos pines de
// esquina, el rótulo en versalitas— está en la G; lo que discutió sigue
// analizado en el concepto, que es donde vive el razonamiento.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// AÑADIR UN BOCETO: un componente aquí, su entrada en SKETCHES (abajo) y su
// parcial en styles/components/card-sketch/. El Record SKETCH_CARDS es
// exhaustivo, así que dar de alta un id sin dibujarlo rompe el build.
// =========================================================================

import { DAMAGE, LONG_NAME, rankOf, SKILLS, type SkillKey, type Subject } from "./sample";
import { EstandarteFrame, ForjaFrame } from "./sketch-frames";

export type SketchId = "forja" | "estandarte";

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
  {
    id: "estandarte",
    label: "G · Estandarte",
    source: "El octógono de la F · Blasón (borrada) con la luz de la E",
    bet: "Rompe lo único que la primera tanda no discutió, la SILUETA: la carta es un octógono, cuatro esquinas cortadas a 45° con un roblón en cada corte. Eso y la jerarquía de los ocho vienen de la réplica de Might & Magic: Fates —las dos que se consultan en cada intercambio de golpes salen a las esquinas de abajo en pines con forma, ⚔️ Ataque en hoja de acero y ❤️ Vida en gema de sangre, y las otras seis se juntan en UNA fila dentro del panel—, junto con el Tier escrito en número en un disco montado sobre la esquina y el rótulo en versalitas. Pero la Rareza NO va en el canto: vuelve dentro del metal, en la veta encendida de la E, que corre por el canal del filete y derrama su baño sobre la ilustración. Y sin las cantoneras de la E, que allí cortan la veta en las cuatro esquinas: aquí el canal da la vuelta entera y la carta queda rodeada por un aro continuo de ocho lados. El rombo de la Rareza va tallado —engaste de metal, cuatro facetas y tabla— y del disco del Tier cuelga un estandarte con el emblema de la raza: la ficha que la referencia dedica a la facción, que V3 no tiene.",
  },
];

const skillOf = (key: SkillKey) => SKILLS.find((s) => s.key === key)!;

/**
 * El reparto de las ocho del boceto G, y es SU apuesta, no un detalle de
 * maquetación: los dos que se consultan en cada intercambio de golpes salen del
 * grupo y se van a las esquinas de abajo, con forma y tamaño propios; los otros
 * seis se quedan juntos en el panel.
 *
 * Sale del concepto B (`knowledge/v3/card-concept/README.md`), que ya señalaba
 * los "dos pines de esquina inferior" como lo que había que robarle y que
 * ningún boceto llegó a dibujar: A, C, D y E ponen los ocho números al mismo
 * tamaño y en la misma fila, así que la carta no dice cuáles importan.
 *
 * El orden importa: el Ataque va a la izquierda y la Vida a la derecha, como en
 * la referencia (hoja de acero a un lado, gema roja al otro).
 */
const PIN_SKILLS: readonly SkillKey[] = ["ataque", "vida"];

/** Las otras seis, en el orden de razas.md. */
const PANEL_SKILLS: readonly SkillKey[] = SKILLS.map((s) => s.key).filter(
  (k) => !PIN_SKILLS.includes(k),
);

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
 *
 * De qué lado cae lo decide el boceto y no esta pieza: la E lo pone a la
 * izquierda y la G a la derecha, porque allí la esquina izquierda se la llevan
 * el disco del Tier y el estandarte que cuelga de él.
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
/**
 * Uno de los ocho números.
 *
 * El de ⚔️ Ataque es el único que no lleva su propio icono: lleva el del TIPO
 * DE DAÑO de la ficha (🗡️ / 🏹 / ✨), que es campo obligatorio de las 132 y no
 * una Característica. Se dibuja aquí a propósito —y no como un chip más del
 * raíl— porque un dato que llevan todas las cartas no informa de nada en la
 * fila de las excepciones, y porque pegado al número dice de un golpe cuánto
 * pega y de qué manera sin gastar un pixel de marco. Ver razas.md §"Tipo de
 * daño".
 */
function Stat({ subject, skill, base }: { subject: Subject; skill: SkillKey; base: string }) {
  const s = skillOf(skill);
  const d = skill === "ataque" ? DAMAGE[subject.damage] : null;
  const label = d ? `${s.label} ${d.label.toLowerCase()}` : s.label;
  return (
    <li className={`sketch__${base}`} title={`${label}: ${subject.skills[skill]}`}>
      <span className={`sketch__${base}-icon`} aria-hidden="true">
        {d ? d.icon : s.icon}
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

// --- G · Estandarte -------------------------------------------------------
// El boceto que salió de cruzar la E con la réplica de
// `knowledge/v3/card-concept/imgs/might-magic-fates-heroes-tcg-pc-cd-key-4.webp`
// (F · Blasón, borrada el 25 de agosto de 2026 en cuanto esta la absorbió). De
// la réplica se queda tres cosas que la E daba por cerradas:
//
//   · LA SILUETA SE DISCUTE. Los cinco bocetos de la primera tanda son el mismo
//     rectángulo redondeado con distinta piel. Este es un OCTÓGONO, y es lo
//     primero que se reconoce de la referencia antes de leer un solo número.
//   · LOS OCHO NÚMEROS NO SON IGUALES. La E los pone todos del mismo tamaño en
//     una fila; aquí ⚔️ Ataque y ❤️ Vida se van a las esquinas de abajo en pines
//     con forma propia y los otros seis se quedan juntos en el panel. La carta
//     dice cuáles se consultan en combate y cuáles se consultan una vez.
//   · LA CARTA VUELVE A ESCRIBIR. La E no escribe el Tier en ningún sitio —lo
//     dice el color de la veta, y por eso solo puede decir de qué CLASE de tier
//     es—; aquí va en número, en el disco de la esquina, que es lo que la
//     referencia hace con el coste. Y la raza vuelve a escribirse, en
//     versalitas al pie, donde la referencia pone el tipo de criatura.
//
// Y de la E se queda lo que la réplica había sacado fuera: la RAREZA vuelve
// dentro del metal —la veta de luz por el canal del filete, con su baño sobre
// la ilustración—, así que el canto teñido desaparece y la carta está encendida
// en vez de acuñada. Con dos diferencias propias:
//
//   · LA VETA DA LA VUELTA ENTERA. La E la corta en cuatro tramos con sus
//     cantoneras —metal encendido entre chapas—; aquí no hay escuadra, solo el
//     roblón del chaflán, así que el canal se cierra en un aro de ocho lados.
//     Tramos contra aro, y es la misma pregunta con otra forma.
//   · CUELGA UN ESTANDARTE DE RAZA del disco del Tier, por debajo de él. Es la
//     ficha que la réplica había dejado VACÍA: allí cuelga el banderín de la
//     facción, y V3 no tiene facción —tiene una sola taxonomía, la raza, y ya
//     se escribe al pie—. Aquí se dibuja con lo único que hay, la raza en
//     emblema, así que la carta la dice dos veces a propósito: puestas las dos,
//     se puede decidir cuál sobra, que es la discusión que la E (emblema, sin
//     texto) y la réplica (texto, sin emblema) tenían abierta sin poder mirarla
//     junta.
//
// El Miliciano es el caso que hay que mirar: sin Características el raíl
// derecho desaparece y la carta se queda con el disco a un lado y nada al otro,
// que es justo lo que el raíl vertical resolvía en la E.
function EstandarteCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      <EstandarteFrame />
      <Rail subject={subject} />

      {/* La Rareza, en rombo a caballo del canto de arriba, donde la referencia
          la pone: en el eje del nombre. Es la tercera vez que la carta la dice,
          contando la veta y su baño. */}
      <span className="sketch__gem" title={`Rareza: ${subject.rarity}`} />

      {/* El estandarte de raza va ANTES que el disco a propósito: las dos
          piezas viven en la misma capa (z("chip"), la de las fichas que montan
          sobre el marco) y ahí manda el orden del árbol, así que quien va
          primero queda debajo. Es lo que hace que la bandera asome por debajo
          del disco en vez de taparle el canto. Con un z-index menor se habría
          metido debajo del marco, que es la capa siguiente hacia abajo, y
          entonces dejaría de montar sobre el filete. */}
      <span className="sketch__banner" title={`Raza: ${subject.race}`}>
        <b className="sketch__banner-icon">{subject.raceIcon}</b>
      </span>

      {/* El disco del Tier, montado sobre el chaflán y desbordándolo. Un héroe
          no tiene tier y aquí NO se le deja el hueco vacío: lleva corona, que
          es la respuesta que ya daba el boceto D y la única que no obliga a
          inventar una escala que V3 no tiene. */}
      <span className="sketch__disc" title={rankOf(subject)}>
        <b className="sketch__disc-value">{subject.tier ?? "👑"}</b>
      </span>

      <div className="sketch__foot">
        <Plate
          subject={subject}
          className="sketch__plate sketch__plate--panel"
          after={
            <>
              {/* Las seis del panel, en el orden de razas.md. Que vayan en una
                  fila y no en dos renglones lo decide el SCSS: aquí no se
                  calcula ni una posición. */}
              <ul className="sketch__pods">
                {PANEL_SKILLS.map((k) => (
                  <Stat key={k} subject={subject} skill={k} base="pod" />
                ))}
              </ul>
              {/* Donde la referencia escribe el tipo de criatura (WIZARD,
                  CONSTRUCT) nosotros escribimos la raza, que es la única
                  taxonomía que tiene V3. Va entre los dos pines a propósito:
                  es la línea que los separa. */}
              <p className="sketch__type">{subject.race}</p>
            </>
          }
        />
      </div>

      {/* Los dos pines, fuera del pie: montan sobre el marco y sobre el
          chaflán, así que no pueden ir dentro de una pieza recortada. */}
      <ul className="sketch__pins">
        {PIN_SKILLS.map((k) => (
          <Stat key={k} subject={subject} skill={k} base="pin" />
        ))}
      </ul>
    </>
  );
}

const SKETCH_CARDS: Record<SketchId, (p: { subject: Subject }) => React.ReactElement> = {
  forja: ForjaCard,
  estandarte: EstandarteCard,
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
