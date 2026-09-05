// =========================================================================
// La carta de V3
//
// Un boceto es una respuesta a la pregunta de dónde caen los 13 datos de una
// carta de unidad (knowledge/v3/card-concept/README.md §"Contra qué se
// juzgan"). No es una piel: lo que un boceto decide es la POSICIÓN de las ocho
// Habilidades y de las Características.
//
// SE DIBUJARON DOCE Y QUEDA UNO. Fueron A · Rejilla, B · Gema, C · Losa,
// D · Blindada, E · Forja, F · Blasón, G · Estandarte, H · Recinto, I · Retablo,
// J · Orla, K · Moldura y L · Lámina, y se fueron borrando en tres tandas: los
// cuatro primeros el 22 de agosto de 2026, la F el 25, y E, G, H e I el 1 de
// septiembre. **El 3 de septiembre Dario eligió la L · Lámina como el diseño
// definitivo de la carta** y con ella se borraron las dos últimas que quedaban,
// la J —que había sido el diseño elegido desde el 25 de agosto— y la K. Lo que
// aprendió cada una sigue escrito en knowledge/v3/card-concept/README.md, que es
// donde vive el razonamiento; aquí solo vive lo que se dibuja.
//
// LA CARTA, EN UNA FRASE: NO HAY MARCO. La ilustración con doce píxeles de
// paspartú negro alrededor y las esquinas redondeadas de la carta base —no el
// chaflán del octógono—, con la Rareza dicha por una línea de 2px encendida en el
// canto del hueco de arte. Por dentro monta el cuerpo
// (styles/components/card-sketch/_cuerpo.scss, que es la fusión de la G y la H):
// disco del Tier en la esquina, estandarte de raza colgando de él, las ocho
// Habilidades en una fila y la placa al pie. Eso no lo decidió este boceto, lo
// heredó — es lo que sobrevivió a la comparación entera.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// LA MAQUINARIA DE VARIOS BOCETOS SE QUEDA aunque hoy solo haya uno: SKETCHES es
// de donde comen la pestaña y la ficha del laboratorio, y el Record SKETCH_CARDS
// es exhaustivo, así que dar de alta un id sin dibujarlo rompe el build. Un
// boceto nuevo es un componente aquí, su entrada en SKETCHES y su parcial en
// styles/components/card-sketch/ — y con dos, la fila de pestañas del lab vuelve
// a aparecer sola.
// =========================================================================

import type { CSSProperties } from "react";
import {
  DAMAGE,
  LONG_NAME,
  raceArtFor,
  raceBannerFor,
  rankOf,
  SKILLS,
  type SkillKey,
  type Subject,
} from "./sample";

export type SketchId = "lamina";

/** Ficha de cada boceto: de aquí comen las pestañas y las notas del lab. */
export const SKETCHES: readonly {
  id: SketchId;
  label: string;
  /** De qué referencia sale. */
  source: string;
  /** Su apuesta, en una frase: qué hace distinto del otro. */
  bet: string;
}[] = [
  {
    id: "lamina",
    label: "L · Lámina",
    source: "La carta sin marco de ninguna clase (2-sept-2026)",
    bet: "ES EL DISEÑO DEFINITIVO DE LA CARTA (3 de septiembre de 2026), y con él se borraron los dos bocetos que quedaban: la J · Orla, que había sido el elegido desde el 25 de agosto, y la K · Moldura. Los once anteriores discutían CÓMO es el marco —de qué metal, con cuántos anillos, trazado por el navegador o traído hecho—; este preguntó lo único que nadie había puesto sobre la mesa en doce días, si hace falta, y la respuesta es que no. La carta es la ilustración con doce píxeles de paspartú negro alrededor, y nada más encima. EL ENCUADRE DEL ARTE no se eligió aquí: 12px era la ventana que dejaba la moldura fina de los héroes de la K, así que las dos cartas enseñaban el mismo trozo de ilustración y lo único que cambiaba era qué había alrededor — metal dibujado en una, negro en la otra. El número se quedó porque salió de esa comparación, no de un gusto. LAS ESQUINAS SON REDONDEADAS y no el chaflán a 45° del octógono: la primera versión, esa misma tarde, heredaba el octógono de .sketch--cuerpo sin haberlo decidido —era lo que traía puesto, no una elección— y se corrigió a petición de Dario. El radio tampoco es nuevo: es el de la carta base ($sketch-radius, 14px) sin tocar, encogido por el paspartú para la ventana del arte (14 − 12 = 2px), y la esquina se sigue leyendo curva porque el canto encendido se dibuja hacia fuera y su borde visible queda a 4. LA RAREZA SE QUEDÓ SIN PIEDRA y eso ya está resuelto: el rombo iba montado sobre la banda de metal, así que sin banda no hay dónde engastarlo, y las dos señales que quedaban —el baño de luz hacia dentro y el halo de fuera— son las dos de LUZ, que es lo único que no se imprime; en papel a 63mm esta carta no decía su raíl. La sustituye un CANTO ENCENDIDO: 2px del color del raíl en la línea donde el paspartú muere contra la ilustración, elegido entre seis variantes montadas en el lab y borradas el mismo día. Es pigmento y no cuesta ilustración, porque la línea se dibuja hacia fuera, sobre el negro que ya estaba. Con la decisión el disco se corrió 2,7px hacia dentro: sus cuatro puntas cruzaban la línea y la partían. Y EL PANEL PERDIÓ SU TAPA: en los otros dos bocetos iba a sangre y eran los 15px de metal los que le recortaban los cantos, así que aquí se recoge dentro del paspartú para que el borde cierre por los cuatro lados en vez de quedarse en forma de U. Todo lo demás es el cuerpo sin negociar —disco en la esquina, estandarte colgando, fila de ocho, placa al pie—, que es lo que sobrevivió a la comparación entera y no algo que este boceto decidiera. Lo que queda por mirar, y no se puede mirar en pantalla, es si 2px aguantan impresos; y en el raíl común el gris sobre negro se lee casi blanco, así que la carta más barata de la escala dice «tengo un canto» antes que decir de qué color es. Las dos variantes que perdieron por poco están escritas en knowledge/v3/card-concept/README.md §Boceto L, porque son las que se volverían a proponer: el paspartú entero teñido —se lee antes, pero es la vía que ya descartó el boceto D— y las muescas contadas en la banda de abajo, las únicas que llevaban el Tier EXACTO y no la clase.",
  },
];

const skillOf = (key: SkillKey) => SKILLS.find((s) => s.key === key)!;

/**
 * El orden de los ocho en la fila del pie.
 *
 * NO es el de razas.md: **⚔️ Ataque va delante de ❤️ Vida**, y las otras seis
 * detrás en el orden del catálogo. Sale de un boceto borrado, la G · Estandarte,
 * que sacaba ese par del grupo y lo mandaba a dos pines en las esquinas de abajo
 * —son los dos que se consultan en cada intercambio de golpes—; su sucesora los
 * devolvió a la fila pero conservando la pareja al frente, y así se quedó.
 *
 * Si algún día se decide que el orden es uno para todo el juego, esto se borra y
 * la fila vuelve a ser SKILLS.
 */
const CARD_SKILLS: readonly SkillKey[] = [
  "ataque",
  "vida",
  ...SKILLS.map((s) => s.key).filter((k) => k !== "ataque" && k !== "vida"),
];

// --- Piezas compartidas ---------------------------------------------------

/**
 * El hueco de arte, a sangre.
 *
 * Cae al emoji cuando el sujeto no tiene ilustración, y en las dos razas
 * dibujadas eso **ya no pasa nunca**: el arte de V3 va por **veinticuatro
 * archivos**, doce y doce —👤 Humanos entera desde el 🐉 Dragón dorado del 31 de
 * agosto de 2026, y ⛏️ Enanos entera desde el 26—, así que las dos progresiones
 * están dibujadas de arriba abajo. En la baraja quedan muchas cartas a emoji,
 * pero son de otras razas: 💀 No-muertos y 🔥 Demonios entraron enteras así, y
 * son las que enseñan cómo aguanta la carta un hueco de arte vacío. <img> plano
 * y no next/image por el mismo motivo que en SpriteLab: es imagen de
 * laboratorio, no arte de partida.
 *
 * Dónde acaba este <div> lo dice el SCSS y no esta pieza, y es lo único que hay
 * que tener presente: hoy se retira **12px** por los cuatro lados para dejar ver
 * el paspartú, y en los bocetos borrados era el fondo de la carta de dentro (la
 * J, `inset: 0` contra el inlay) o el hueco que le dejaba una moldura dibujada
 * (la K). El mismo elemento con otro `inset`, sin una prop de diferencia. Hubo
 * un boceto, la I · Retablo, donde el hueco era una VENTANA dibujada dentro de
 * una página de franjas, y de ahí viene la advertencia: esto no es "el fondo de
 * la carta", es "el hueco de arte, donde sea que esté".
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
 * Solo el rótulo: no hay subtítulo. Los bocetos borrados de la primera tanda
 * escribían debajo «raza · rango», y desde la E eso se dice sin letra —la raza
 * en un emblema, el rango en el color de la veta—, así que la línea se fue con
 * ellos. Si un boceto nuevo la necesita, vuelve como un hijo más y no como un
 * caso especial de esta pieza.
 */
function Plate({
  subject,
  className,
  after,
}: {
  subject: Subject;
  className: string;
  /**
   * Lo que va DENTRO de la placa, debajo del rótulo: la fila de ocho, que en
   * estos bocetos no es una banda aparte apilada bajo la placa, vive dentro.
   */
  after?: React.ReactNode;
}) {
  return (
    <header className={className}>
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
 * De qué lado cae lo decide el SCSS y no esta pieza. Cae a la derecha porque la
 * esquina izquierda se la llevan el disco del Tier y el estandarte que cuelga de
 * él; en los bocetos borrados que no tenían disco caía a la izquierda.
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

  // El pictograma manda cuando existe; si no hay archivo —hoy solo 🗡️ Cuerpo a
  // cuerpo— cae al emoji sin caso especial, que es justo lo que se quiere ver:
  // el hueco a la vista dentro de la fila.
  //
  // Ya no hay forma de pedir el emoji a propósito: el conmutador
  // pictograma / emoji que envolvía la baraja en un contexto se borró el 27 de
  // agosto de 2026, al empezar a fijar el resultado final de la carta. El
  // `icon` de SKILLS y de DAMAGE sigue existiendo, y no como resto: es este
  // respaldo, lo único que se ve mientras falten archivos.
  const art = d ? d.art : s.art;

  return (
    <li className={`sketch__${base}`} title={`${label}: ${subject.skills[skill]}`}>
      <span className={`sketch__${base}-icon`} aria-hidden="true">
        {art ? <img className="sketch__stat-art" src={art} alt="" /> : d ? d.icon : s.icon}
      </span>
      <b className={`sketch__${base}-value`}>{subject.skills[skill]}</b>
    </li>
  );
}

/**
 * El emblema de la raza. Mismo trato que la fila de ocho: **el pictograma manda
 * cuando existe el archivo y el emoji es el respaldo**, sin caso especial — si
 * una raza entra en races.ts antes que su emblema, la carta enseña el hueco.
 *
 * Los once existen desde el 27 de agosto de 2026, así que hoy el respaldo no se
 * ve en ninguna carta. No se borra por eso: es lo que sostiene la raza nueva y
 * los sitios sin CSS que dimensione una imagen (el `title` de aquí al lado no
 * lleva glifo, pero la baraja sí lo usa en sus filtros).
 *
 * Va como componente y no repetido porque el emblema cae en más de un hueco —hoy
 * el estandarte, y en los bocetos borrados también un medallón y un renglón de
 * texto— y son todos el mismo par imagen/emoji con distinta clase encima.
 */
function RaceEmblem({ subject, className }: { subject: Subject; className: string }) {
  const art = raceArtFor(subject.race);
  return (
    <b className={className} aria-hidden="true">
      {art ? <img className="sketch__race-art" src={art} alt="" /> : subject.raceIcon}
    </b>
  );
}

/**
 * El ESTANDARTE de raza: el paño, con el emblema dentro. Hasta el 27 de agosto
 * de 2026 era CSS puro.
 *
 * La raza que tiene archivo lo trae como imagen y las demás siguen con el paño
 * de CSS, así que la carta no se rompe mientras el set se dibuja — y de paso se
 * puede mirar una dibujada al lado de tres pintadas, que es lo que hace falta
 * para juzgar la primera.
 *
 * El archivo va por custom property y no por `<img>`, al revés que el emblema, y
 * es la misma razón que da _lamina.scss para el disco del Tier: **esto no es un
 * dato, es moldura**, así que lo pinta el CSS con `background-image`. Y tiene
 * que ir por variable porque la ruta cambia con la raza, que es lo que un
 * parcial de SCSS no puede saber.
 */
function RaceBanner({ subject }: { subject: Subject }) {
  const art = raceBannerFor(subject.race);
  return (
    <span
      className="sketch__banner"
      data-art={art ? "" : undefined}
      style={art ? ({ "--banner-img": `url("${art}")` } as CSSProperties) : undefined}
      title={`Raza: ${subject.race}`}
    >
      <RaceEmblem subject={subject} className="sketch__banner-icon" />
    </span>
  );
}

// --- L · Lámina -------------------------------------------------------------
// El árbol de la carta, y es el más corto de los doce bocetos: lo que le falta
// es justo lo que se estaba preguntando. Contra la J y la K, dos líneas de
// menos, y las dos se quedaron fuera por una razón distinta:
//
//   · NO HAY CAPA DE MARCO. Ni el <svg> vectorial de la J ni el
//     <span className="sketch__frame" /> al que la K le colgaba un PNG: no hay
//     nada que dibujar ahí, así que la capa se borró del esqueleto con los dos
//     bocetos. El contorno lo pinta el propio artículo, con el radio de la carta
//     base y no el chaflán octogonal que trae el cuerpo
//     (styles/components/card-sketch/_lamina.scss lo deshace).
//   · NO HAY .sketch__gem. La K tampoco la pintaba, pero por el motivo
//     contrario: allí la piedra venía tallada DENTRO del archivo, así que estaba
//     puesta dos veces si se dibujaba. Aquí no hay dónde engastarla —una piedra
//     necesita banda de metal y esta carta no tiene—, y lo que hace su trabajo no
//     es un elemento: es el CANTO ENCENDIDO, 2px del color del raíl en el borde
//     del hueco de arte, que lo pinta el SCSS con un box-shadow sobre
//     .sketch__art (card-sketch/_lamina.scss). Por eso este árbol no gana una
//     pieza al resolver la Rareza: la marca vive en el canto de una que ya
//     estaba.
//
// Lo demás es el cuerpo tal cual: el inlay lleva .sketch--cuerpo y hereda la
// composición entera. Y ES EN EL INLAY Y NO EN EL ARTÍCULO, aunque aquí ya no
// haya mat dentro del que meterlo — se conserva porque es donde vive
// data-rarity: octagon-shell (styles/tools/_mixins.scss) elige la veta con un
// selector de atributo sobre el MISMO elemento que lleva la clase, así que sin
// el atributo repetido aquí la carta se quedaría con la veta común.
function LaminaCard({ subject }: { subject: Subject }) {
  return (
    // Llevó un data-tier durante unas horas, el 2 de septiembre de 2026, y se
    // fue con la probeta que lo pedía: era para contar muescas desde el CSS, y
    // la variante que ganó —el canto encendido— es una línea de color que sale
    // de data-rarity, que ya estaba.
    <div className="sketch__inlay sketch--cuerpo" data-rarity={subject.rarity}>
      <Art subject={subject} />
      <Rail subject={subject} />

      {/* Antes que el disco: entre dos piezas de la misma capa manda el orden
          del árbol, y el estandarte tiene que pasar por debajo del medallón del
          que cuelga. */}
      <RaceBanner subject={subject} />

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
                {CARD_SKILLS.map((k) => (
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
  lamina: LaminaCard,
};

/**
 * Una carta: el artículo con su rareza, y dentro el cuerpo. La rareza se publica
 * como atributo y no como color porque de ella cuelgan las variables
 * --rarity/--seam del SCSS.
 *
 * El artículo SÍ pinta, y esto cambió con la L: mientras la carta elegida fue la
 * J era un mat negro, y mientras hubo tres bocetos aquí no se pintaba nada
 * —cada uno ponía su fondo—. Hoy el artículo es la lámina: fondo, radio y halo
 * de Rareza salen del `.sketch` de siempre (styles/components/_card-sketch.scss)
 * sin que ningún parcial los pise.
 *
 * Hubo aquí un mecanismo de HERENCIA —una ficha con `derives` que apilaba la
 * clase del boceto base y la del derivado en el mismo elemento— y se borró con
 * el único boceto que lo usaba, la H · Recinto. Lo que quedó hereda de otra
 * manera: la clase del cuerpo va en el HIJO (ver LaminaCard) y no en el
 * artículo, así que no hay nada que apilar aquí.
 */
export default function SketchCard({ id, subject }: { id: SketchId; subject: Subject }) {
  const Body = SKETCH_CARDS[id];
  return (
    <article className={`sketch sketch--${id}`} data-rarity={subject.rarity}>
      <Body subject={subject} />
    </article>
  );
}
