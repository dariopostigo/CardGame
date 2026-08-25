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
// Y de la G salió la H · Recinto, que es el primer boceto DERIVADO: la misma
// carta con dos cosas cambiadas —todo dentro del contorno, y las ocho
// Habilidades juntas en vez de dos en las esquinas—. No está para llevarle la
// contraria a nadie, está para desempatar: la E y la G se diferencian en dos
// cosas a la vez (silueta y jerarquía), así que puestas al lado no se puede
// saber cuál de las dos es la que gusta. Con la H hay tres de las cuatro celdas
// y las dos preguntas quedan separadas.
//
// La I · Retablo cruza la H con una carta de Magic: The Gathering por dentro
// —mete la ilustración en una ventana— y la J · Orla la cruza con Magic por
// fuera: un borde negro macizo rodeando la H (knowledge/v3/card-concept/
// README.md, §Mezcla J). La primera versión de la J envolvía a RecintoCard sin
// tocarla; se corrigió el mismo día, porque el filete de la H —cantoneras,
// roblones, 15px de banda— está pensado para ser el CANTO de la carta, y
// dentro de un borde negro deja de serlo. OrlaCard clona el árbol de la H
// pieza por pieza (mismo disco, mismo estandarte, misma fila de ocho) pero con
// su propio marco, OrlaFrame: más fino y sin herrajes.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// AÑADIR UN BOCETO: un componente aquí, su entrada en SKETCHES (abajo) y su
// parcial en styles/components/card-sketch/. El Record SKETCH_CARDS es
// exhaustivo, así que dar de alta un id sin dibujarlo rompe el build. Si el
// boceto nuevo es una copia de otro con cambios, lleva `derives` en su ficha y
// su parcial solo escribe las diferencias.
// =========================================================================

import { DAMAGE, LONG_NAME, rankOf, SKILLS, type SkillKey, type Subject } from "./sample";
import { EstandarteFrame, ForjaFrame, OrlaFrame } from "./sketch-frames";

export type SketchId = "forja" | "estandarte" | "recinto" | "retablo" | "orla";

/** Ficha de cada boceto: de aquí comen las pestañas y las notas del lab. */
export const SKETCHES: readonly {
  id: SketchId;
  label: string;
  /** De qué referencia sale. */
  source: string;
  /** Su apuesta, en una frase: qué hace distinto de los otros dos. */
  bet: string;
  /**
   * De qué boceto es una COPIA, si lo es.
   *
   * Un boceto derivado no se dibuja entero: hereda la clase del que le sirve de
   * base y su parcial solo pisa lo que cambia (styles/components/card-sketch/).
   * Es la forma honesta de decir «esta carta es aquella con dos cosas
   * distintas», y de garantizar que lo que no se ha cambiado no se pueda
   * desviar: si mañana se toca la base, el derivado va detrás.
   */
  derives?: SketchId;
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
  {
    id: "recinto",
    label: "H · Recinto",
    source: "La G · Estandarte, con todo dentro del contorno",
    derives: "estandarte",
    bet: "Es la G con DOS cambios, y existe para separar dos preguntas que la E y la G tenían pegadas. (1) Nada se sale del contorno: el disco del Tier deja de montar sobre el chaflán y se mete en la esquina por dentro del filete, y el estandarte de raza baja con él, así que la bandera ya no tapa el canal de la veta y el aro de ocho lados da la vuelta entero. Se pierde el sello colgado —lo que hacía que el disco pareciera una pieza puesta y no un botón dibujado era justamente que no cabía— y se gana una carta que se puede recortar por su octógono sin cortar un número. (2) Las ocho vuelven a ser una: ⚔️ Ataque y ❤️ Vida dejan las esquinas y vuelven a la fila, con los mismos escalones de letra que la E —así el cuerpo de la cifra deja de ser una diferencia entre las dos cartas— pero abriendo por ⚔️ Ataque y no por ❤️ Vida, al revés que razas.md; y la línea de raza vuelve al flujo del panel porque ya no hay pines que esquivar. El disco del Tier además pierde su aro de oro: era el remate que lo hacía moneda, y una moneda es algo que se cuelga del canto. Con esto hay tres de las cuatro celdas posibles —E: rectángulo y ocho juntas; G: octógono y ocho partidas; H: octógono y ocho juntas—, así que por fin se puede saber si lo que gusta de la G es la silueta o la jerarquía.",
  },
  {
    id: "retablo",
    label: "I · Retablo",
    source: "La H · Recinto cruzada con una carta de Magic: The Gathering",
    bet: "Contradice lo único que los ocho bocetos anteriores nunca discutieron: que la carta ES su ilustración. Aquí la carta es una PÁGINA de franjas apiladas y el arte va METIDO EN UNA VENTANA, hundida y enmarcada, sin un solo dato encima. De la referencia (imgs/magic-the-gathering-fading-hope-mid.webp) se queda la anatomía entera: barra de título con el rótulo solo y el Tier en el bisel donde va el coste de maná; ventana de arte; línea de tipo que ESCRIBE «Unidad — Humanos» y remata con un sello de Rareza de 12px —en Magic el símbolo de colección es literalmente lo que dice la rareza, por color—; y una caja de datos sobre VITELA, el primer sitio claro de una carta de V3, con los ocho números arriba y las Características debajo del filete que la referencia usa para separar su texto de ambientación. De la H se queda el octógono con su roblón, el filete de metal con la veta, la aleación única y las ocho Habilidades juntas en una fila. Tres cosas contesta que ningún otro podía: si la ilustración puede dejar de cargar con los datos —el panel de la H le corta las piernas al Miliciano y eso no tiene arreglo mientras el arte sea el fondo—, si la carta aguanta un bloque de papel dentro (y qué le pasa a un 💀 o un 🧊 sobre vitela), y si la Rareza necesita ser una pieza tallada o le basta un glifo en un renglón. El precio está medido: la ventana se queda con el 52% del interior, así que una fuente vertical 5:7 pierde ~38% del alto — pero las tres ilustraciones apaisadas que hoy están mal solo perderían el 18% del ancho, o sea que si gana este boceto la norma de encuadre cambia de signo. Y la tensión que la mezcla no resuelve: Magic TAMBIÉN saca fuerza y resistencia del grupo, en su ficha de esquina, así que las dos referencias votan lo contrario que la H en la jerarquía de los ocho.",
  },
  {
    id: "orla",
    label: "J · Orla",
    source: "La H · Recinto detrás del borde negro de una carta de Magic: The Gathering",
    bet: "Cruza la H con la misma referencia que la I (imgs/magic-the-gathering-fading-hope-mid.webp), pero por el otro extremo: no la anatomía de franjas, el BORDE. La carta deja de ser un octógono físico y vuelve a ser un rectángulo redondeado, como la E —ya no hace falta troquel, se corta recta—, y detrás de un mat negro macizo vive la H adaptada, no calcada: mismo octógono, misma veta encendida de Rareza, mismo disco de Tier metido en la esquina, misma fila de ocho juntas, pero con un ANILLO propio (OrlaFrame) mucho más fino que el de la G/H y sin un solo herraje. Las cantoneras y los roblones decían «esto es blindaje atornillado al canto de la carta» — un mensaje que tenía sentido mientras el octógono ERA el canto; aquí ya no lo es, vive dentro de un borde negro, y una ficha remachada sobre otro borde deja de leerse como blindaje y pasa a leerse como ruido. El octógono se sigue leyendo —lo traza el CONTRASTE entre el negro del mat y el metal encendido de dentro, no un recorte físico—, así que la objeción de imprenta que arrastran la F, la G y la H desde que el troquel entró en la página deja de tener con qué discutir: no hace falta troquel donde no hay nada que cortar, exactamente la solución que Magic usa desde 1993 para absorber el desalineado. Y de regalo, un efecto que ningún boceto anterior tenía dónde enseñar: el resplandor de la Rareza, que en la H se perdía contra el fondo de la página, aquí se derrama sobre el negro del propio marco. El precio sigue siendo nuevo entre los nueve bocetos —la carta CRECE, aunque ahora bastante menos que en la primera versión—, porque el borde se suma por fuera en vez de restarle sitio a la H de dentro.",
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

/**
 * El orden de los ocho en el boceto H, que junta lo que la G reparte.
 *
 * No es el de razas.md —el que usa la E—: **⚔️ Ataque va delante de ❤️ Vida**.
 * Y no es una lista escrita a mano, son las dos del par de la G seguidas de las
 * otras seis, así que la fila arranca con las dos que se consultan en cada
 * intercambio de golpes y en el mismo orden izquierda-derecha que la referencia
 * les da en las esquinas (hoja de acero primero, gema roja después).
 *
 * Cuesta algo y conviene tenerlo escrito: la fila de la H deja de coincidir con
 * la de la E, que sigue leyendo la Vida primero. Los cuerpos de letra siguen
 * siendo los mismos, así que entre las dos cartas ya no cambia solo la silueta
 * —cambia también el orden de lectura—. Si algún día se decide que el orden es
 * uno para todo el juego, esto se borra y las dos vuelven a SKILLS.
 */
const RECINTO_SKILLS: readonly SkillKey[] = [...PIN_SKILLS, ...PANEL_SKILLS];

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
// Míralo en los cuatro héroes y en el 🗡️ Miliciano: son los sujetos con arte
// propio de V3, así que son los que dicen la verdad sobre cómo cae este marco
// encima del arte de este juego. Y el Miliciano es ahora la prueba directa de
// ese precio: es el tier 1 con ilustración, así que la carta gris sin número ya
// no es una hipótesis.
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

// --- H · Recinto ----------------------------------------------------------
// La G con dos cambios, y por eso este componente es el de la G con dos líneas
// menos: mismo marco, mismo orden de piezas, misma placa.
//
//   · NO HAY PINES. Las ocho van juntas en la fila del panel, así que el <ul>
//     de las esquinas desaparece del árbol y los pods pasan de PANEL_SKILLS a
//     RECINTO_SKILLS: las ocho, pero con ⚔️ Ataque delante de ❤️ Vida y no al
//     revés como en razas.md, que es el orden que sigue la E.
//   · EL DISCO Y EL ESTANDARTE ENTRAN. Eso no se ve aquí y es como tiene que
//     ser: son dos posiciones, y las posiciones las calcula el SCSS. El árbol
//     no sabe que han cambiado de sitio.
//
// Lo que SÍ hay que respetar aquí es el orden de esas dos piezas: el estandarte
// sigue yendo antes que el disco porque las dos viven en z("chip") y ahí manda
// el orden del árbol. Metidas dentro del marco el solape es el mismo, así que
// la razón no ha cambiado ni un pixel.
//
// El sujeto que dice la verdad sobre este boceto es el 🐉 Dragón dorado: Vida
// 240 es el único número de tres cifras del muestrario, y en una fila de ocho
// columnas de ~30px es él quien decide si la fila se lee o solo cabe.
function RecintoCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      <EstandarteFrame />
      <Rail subject={subject} />

      <span className="sketch__gem" title={`Rareza: ${subject.rarity}`} />

      <span className="sketch__banner" title={`Raza: ${subject.race}`}>
        <b className="sketch__banner-icon">{subject.raceIcon}</b>
      </span>

      <span className="sketch__disc" title={rankOf(subject)}>
        <b className="sketch__disc-value">{subject.tier ?? "👑"}</b>
      </span>

      <div className="sketch__foot">
        <Plate
          subject={subject}
          className="sketch__plate sketch__plate--panel"
          after={
            <>
              <ul className="sketch__pods">
                {RECINTO_SKILLS.map((k) => (
                  <Stat key={k} subject={subject} skill={k} base="pod" />
                ))}
              </ul>
              {/* Sin pines entre los que caer, la raza vuelve a ser el último
                  renglón del panel y no una pieza anclada. */}
              <p className="sketch__type">{subject.race}</p>
            </>
          }
        />
      </div>
    </>
  );
}

// --- I · Retablo ----------------------------------------------------------
// La mezcla de la H con una carta de Magic
// (knowledge/v3/card-concept/imgs/magic-the-gathering-fading-hope-mid.webp), y
// el primer boceto cuyo ÁRBOL es distinto de verdad: los otros tres son arte a
// sangre más piezas sueltas encima, y este es una PÁGINA con franjas dentro.
//
// Aquí sí importa el orden y la anidación, al revés que en la G y la H:
//
//   · EL MARCO VA PRIMERO Y SUELTO, como siempre (se pinta encima por z-index).
//   · TODO LO DEMÁS CUELGA DE .sketch__page, que es la chapa que rellena el
//     octógono. No hay ni una pieza flotando sobre la carta: si algo no está en
//     la página, no está.
//   · EL ARTE VA DENTRO DE LA VENTANA, y por eso se reutiliza <Art> tal cual sin
//     una sola prop nueva: su `inset: 0` deja de referirse a la carta y pasa a
//     referirse a la ventana en cuanto el SCSS le da `position: relative`. Es la
//     única pieza compartida que cambia de significado con el sitio, y conviene
//     saberlo antes de tocarle nada al esqueleto.
//
// No hay <Rail>: las Características bajan de la ilustración a la caja de datos,
// que es la mitad de lo que este boceto viene a probar. Y no hay <Plate>: el
// rótulo va solo en su barra, sin nada que envolver.
//
// Los sujetos que dicen la verdad aquí son dos, y por motivos opuestos: el
// 🗡️ Miliciano, que con cero Características deja medio cajón de vitela en
// blanco —el caso que el raíl vertical resolvía sin despeinarse—, y el
// 🐉 Dragón esquelético, que con cinco lo llena y enseña qué le pasa a un 💀 y a
// un 🧊 sobre papel claro.
function RetabloCard({ subject }: { subject: Subject }) {
  return (
    <>
      <EstandarteFrame />

      <div className="sketch__page">
        {/* La barra de título: el rótulo solo y, al otro extremo, el bisel
            donde la referencia pone el coste de maná. Un héroe no tiene tier y
            lleva corona, que es la respuesta que la G ya daba y que no obliga a
            inventar una escala que V3 no tiene. */}
        <header className="sketch__bar">
          <h3 className="sketch__name" data-long={subject.name.length > LONG_NAME || undefined}>
            {subject.name}
          </h3>
          <span className="sketch__cost" title={rankOf(subject)}>
            <b className="sketch__cost-value">{subject.tier ?? "👑"}</b>
          </span>
        </header>

        {/* La ventana. Es lo único que este boceto añade al árbol y lo que más
            cambia de la carta: la ilustración deja de ser el fondo. */}
        <div className="sketch__window">
          <Art subject={subject} />
        </div>

        {/* La línea de tipo, donde la referencia escribe «Creature — Human
            Soldier». La carta dice la raza DOS veces a propósito, en emblema y
            en texto, como la G: puestas las dos se puede decidir cuál sobra. */}
        <p className="sketch__typeline">
          <span className="sketch__typeline-text">
            <b aria-hidden="true">{subject.raceIcon}</b>{" "}
            {subject.kind === "heroe" ? "Héroe" : "Unidad"} — {subject.race}
          </span>
          {/* El sello, en el sitio del símbolo de colección: en Magic ese glifo
              ES la rareza, por color. Aquí la carta la dice tres veces contando
              la veta y su baño, que es lo que hay que mirar — o sobra el sello
              o sobra la piedra tallada de la G. */}
          <span className="sketch__seal" title={`Rareza: ${subject.rarity}`} />
        </p>

        {/* La caja de datos, sobre vitela. Los ocho en el orden de la H, no en
            el de razas.md: se reutiliza RECINTO_SKILLS a propósito para que el
            orden no sea una diferencia más entre las dos cartas que se
            comparan. */}
        <div className="sketch__databox">
          <ul className="sketch__pods">
            {RECINTO_SKILLS.map((k) => (
              <Stat key={k} subject={subject} skill={k} base="pod" />
            ))}
          </ul>

          {/* Las Características bajan del raíl al cajón. Con cero no se pinta
              nada —ni la lista ni el filete que la separa—, así que el hueco
              queda en blanco: es el caso del Miliciano y no se disimula. */}
          {subject.traits.length > 0 && (
            <ul className="sketch__traits">
              {subject.traits.map((t) => (
                <li className="sketch__trait" key={t.label} title={t.label}>
                  {t.icon}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// --- J · Orla ---------------------------------------------------------------
// Cruza la H con Magic por el otro extremo de lo que cruzó la I: no la
// anatomía de franjas, el BORDE. La carta vuelve a ser un rectángulo
// redondeado —ya no hace falta troquel, se corta recta— y detrás de un mat
// negro macizo (styles/components/card-sketch/_orla.scss) vive la H, adaptada
// y no calcada.
//
// La primera versión de este componente envolvía a <RecintoCard> sin tocarle
// una prop, con el argumento de que «la H entera, sin tocar un píxel» era la
// apuesta del boceto. Se corrigió el mismo día: el filete de la H —cantoneras,
// roblones, 15px de banda— está dibujado para ser el CANTO de la carta, la
// pieza que dice «esto es blindaje atornillado al borde». Metido dentro de un
// borde negro deja de serlo, y una ficha remachada montada sobre otro borde no
// se lee como blindaje, se lee como ruido. Por eso este componente SÍ tiene
// cuerpo propio: clona el árbol de <RecintoCard> pieza por pieza —mismo Art,
// mismo raíl, mismo gema, mismo estandarte, mismo disco, misma placa con la
// fila de ocho— pero con <OrlaFrame /> en vez de <EstandarteFrame />: el
// mismo octógono, la misma idea de una veta que dice la Rareza, con un anillo
// mucho más fino y sin un solo herraje (ver sketch-frames.tsx).
//
// No lleva `derives` en su ficha de SKETCHES aunque ADAPTA la H: `derives`
// apila las clases de dos generaciones en el MISMO elemento (así hereda la H
// el marco de la G sin escribirlo dos veces), y aquí las clases de la H
// (.sketch--estandarte.sketch--recinto) tienen que caer en el HIJO —el
// inlay—, no en el artículo —el mat—, y además se pisan con reglas propias de
// la J (styles/components/card-sketch/_orla.scss) para el filete más fino. Es
// herencia real, solo que de un nivel del árbol para abajo y con overrides
// encima, así que el mecanismo genérico de SketchCard no encaja y se escribe
// a mano aquí.
//
// data-rarity se repite en el inlay porque octagon-shell
// (styles/tools/_mixins.scss) elige la veta con un selector de atributo
// sobre el MISMO elemento que lleva la clase; sin el atributo aquí, la
// selección no encuentra pareja y la carta se queda con la veta común.
function OrlaCard({ subject }: { subject: Subject }) {
  return (
    <div className="sketch__inlay sketch--estandarte sketch--recinto" data-rarity={subject.rarity}>
      <Art subject={subject} />
      <OrlaFrame />
      <Rail subject={subject} />

      <span className="sketch__gem" title={`Rareza: ${subject.rarity}`} />

      <span className="sketch__banner" title={`Raza: ${subject.race}`}>
        <b className="sketch__banner-icon">{subject.raceIcon}</b>
      </span>

      <span className="sketch__disc" title={rankOf(subject)}>
        <b className="sketch__disc-value">{subject.tier ?? "👑"}</b>
      </span>

      <div className="sketch__foot">
        <Plate
          subject={subject}
          className="sketch__plate sketch__plate--panel"
          after={
            <>
              <ul className="sketch__pods">
                {RECINTO_SKILLS.map((k) => (
                  <Stat key={k} subject={subject} skill={k} base="pod" />
                ))}
              </ul>
              <p className="sketch__type">{subject.race}</p>
            </>
          }
        />
      </div>
    </div>
  );
}

const SKETCH_CARDS: Record<SketchId, (p: { subject: Subject }) => React.ReactElement> = {
  forja: ForjaCard,
  estandarte: EstandarteCard,
  recinto: RecintoCard,
  retablo: RetabloCard,
  orla: OrlaCard,
};

/**
 * Una carta de boceto: el artículo con su rareza, y dentro el cuerpo que le
 * toque. La rareza se publica como atributo y no como color porque de ella
 * cuelgan las variables --rarity/--seam del SCSS; el artículo no pinta nada.
 *
 * Un boceto derivado se lleva las DOS clases, la de su base y la suya, en ese
 * orden. Es lo que le deja heredar el marco entero y pisar solo lo que cambia,
 * y por eso su parcial escribe los selectores con las dos juntas: así gana por
 * especificidad y no por orden de importación.
 */
export default function SketchCard({ id, subject }: { id: SketchId; subject: Subject }) {
  const Body = SKETCH_CARDS[id];
  const base = SKETCHES.find((s) => s.id === id)?.derives;
  const mod = base ? `sketch--${base} sketch--${id}` : `sketch--${id}`;
  return (
    <article className={`sketch ${mod}`} data-rarity={subject.rarity}>
      <Body subject={subject} />
    </article>
  );
}
