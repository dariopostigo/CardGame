// =========================================================================
// Los dos bocetos de marco de V3
//
// Un boceto es una respuesta a la pregunta de dónde caen los 13 datos de una
// carta de unidad (knowledge/v3/card-concept/README.md §"Contra qué se
// juzgan"). No es una piel: lo que un boceto decide es la POSICIÓN de las ocho
// Habilidades y de las Características.
//
// HUBO DIEZ Y QUEDAN DOS. Se dibujaron A · Rejilla, B · Gema, C · Losa,
// D · Blindada, E · Forja, F · Blasón, G · Estandarte, H · Recinto, I · Retablo
// y J · Orla; el 1 de septiembre de 2026 entró la K · Moldura y ese mismo día
// se borraron los cuatro que seguían vivos —E, G, H e I— por decisión de Dario.
// Lo que aprendió cada uno sigue escrito en
// knowledge/v3/card-concept/README.md, que es donde vive el razonamiento; aquí
// solo vive lo que se dibuja.
//
// LOS DOS QUE QUEDAN SON LA MISMA CARTA CON OTRO MARCO, y esa es la única razón
// de que sigan los dos: por dentro montan el mismo cuerpo
// (styles/components/card-sketch/_cuerpo.scss, que es la fusión de la G y la H),
// así que lo único que se compara entre ellos es el borde.
//
//   J · Orla     el marco lo TRAZA el navegador: un anillo de ocho lados con un
//                canal de luz, dentro de un mat negro macizo. Es el diseño
//                elegido el 25 de agosto de 2026 y el que pinta la baraja.
//   K · Moldura  el marco es un ARCHIVO: seis PNG, uno por raíl de color, y el
//                CSS solo los coloca.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// AÑADIR UN BOCETO: un componente aquí, su entrada en SKETCHES (abajo) y su
// parcial en styles/components/card-sketch/. El Record SKETCH_CARDS es
// exhaustivo, así que dar de alta un id sin dibujarlo rompe el build.
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
import { OrlaFrame } from "./sketch-frames";

export type SketchId = "orla" | "moldura";

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
    id: "orla",
    label: "J · Orla",
    source: "El cuerpo de la carta detrás del borde negro de una carta de Magic: The Gathering",
    bet: "ES EL DISEÑO ELEGIDO (25 de agosto de 2026) y el que pinta la baraja. La carta no es un octógono físico: es un rectángulo redondeado —se corta recta, no hace falta troquel— y detrás de un mat negro macizo vive el cuerpo entero, con su octógono, su veta encendida de Rareza, su disco de Tier en la esquina y su fila de ocho. El octógono se sigue leyendo porque lo traza el CONTRASTE entre el negro del mat y el metal encendido de dentro, no un recorte físico, que es exactamente la solución que Magic usa desde 1993 para absorber el desalineado de imprenta. Su anillo (OrlaFrame) es la mitad de fino que el filete con el que están medidas las piezas del cuerpo y no lleva un solo herraje: las cantoneras y los roblones decían «esto es blindaje atornillado al canto de la carta», y ese mensaje solo se sostiene mientras el octógono ES el canto — aquí vive dentro de un borde negro, así que una ficha remachada pasa de leerse como blindaje a leerse como ruido. Y de regalo un efecto que ningún boceto anterior tenía dónde enseñar: el resplandor de la Rareza se derrama sobre el negro del propio marco en vez de perderse contra el fondo de la página. El precio es que la carta CRECE —300×420 pasan a 316×436—, porque el borde se suma por fuera en vez de restarle sitio al cuerpo.",
  },
  {
    id: "moldura",
    label: "K · Moldura",
    source: "El mismo cuerpo con el marco generado como ilustración (1-sept-2026)",
    bet: "El primer boceto cuyo marco NO lo dibuja el navegador: la moldura es un ARCHIVO, seis, uno por raíl de color (public/assets/v3/frames/card/), y el CSS no traza metal, solo lo coloca. La apuesta es que si el marco es una pieza de arte y no de código puede tener relieve, talla y pedrería de verdad — la gema de la Rareza ya viene tallada dentro del archivo, en el eje del canto de arriba, y el rombo de CSS que la J sigue pintando desaparece. Lo que se pierde es poder moverlo, y son tres cosas: EL METAL NO SE AFINA DESDE EL CSS —en la J basta cambiar un color para reconstruir el material entero; aquí el latón viene horneado y cambiarlo es volver a generar los seis archivos, que es también por lo que la probeta de aleación de esta página se borró—; LA RAREZA CUESTA UN ARCHIVO, así que la escala se cierra en los seis raíles que hoy usa la baraja en vez de salir gratis de una variable de color; y LAS SEIS SON INTERCAMBIABLES o no son nada, porque la carta las apila en el mismo hueco (medidas y dispersión en public/assets/v3/README.md §frames/card). Todo lo demás es el cuerpo sin negociar —disco en la esquina, estandarte colgando, fila de ocho, placa a sangre— y encaja sin volver a medir nada porque la banda dibujada mide 15,5px contra los 15 del filete vectorial: medio píxel. Lo único que hay que deshacer es la SILUETA, que vuelve a ser un rectángulo redondeado con un radio bastante más abierto que el de la J (35px contra 14) porque es el que trae la moldura. Y el archivo tiene una asimetría que no es un defecto: por los lados y por abajo llega a sangre, y por arriba deja 15px de aire donde asoma la mitad de la gema.",
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
 * pero son de otras razas: 💀 No-muertos y 🔥 Demonios entraron enteras así; y en
 * el laboratorio de bocetos queda **una sola**, el 🐉 Dragón esquelético del caso
 * límite, que es la única carta donde ya se puede ver cómo aguanta un marco sin
 * ilustración. Ojo
 * con el reparto, porque esta pieza la comparten las dos páginas: el
 * laboratorio de bocetos pinta solo la raza piloto, así que **las doce de Enanos
 * únicamente se ven en Diseño baraja**. <img> plano y no next/image por el mismo
 * motivo que en SpriteLab: es imagen de laboratorio, no arte de partida.
 *
 * Dónde acaba este <div> depende del boceto, y es lo único de esta pieza que hay
 * que tener presente: en la J es el fondo de la carta de dentro (`inset: 0`
 * contra el inlay) y en la K está metido en la ventana que le deja la moldura —
 * el mismo elemento con otro `inset`, puesto por el SCSS. Ni una prop de
 * diferencia. Hubo un boceto, la I · Retablo, donde el hueco era una VENTANA
 * dibujada dentro de una página de franjas, y de ahí viene la advertencia: esto
 * no es "el fondo de la carta", es "el hueco de arte, donde sea que esté".
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
 * De qué lado cae lo decide el SCSS y no esta pieza. Hoy cae a la derecha en
 * los dos bocetos, porque la esquina izquierda se la llevan el disco del Tier y
 * el estandarte que cuelga de él; en los borrados que no tenían disco caía a la
 * izquierda.
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
 * Va como componente y no repetido porque el emblema cae en más de un hueco
 * —hoy el estandarte de la J y el de la K, y en los bocetos borrados también un
 * medallón y un renglón de texto— y son todos el mismo par imagen/emoji con
 * distinta clase encima.
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
 * El ESTANDARTE de raza: el paño, con el emblema dentro. Lo pintan los dos
 * bocetos, y hasta el 27 de agosto de 2026 era CSS puro.
 *
 * La raza que tiene archivo lo trae como imagen y las demás siguen con el paño
 * de CSS, así que la carta no se rompe mientras el set se dibuja — y de paso se
 * puede mirar una dibujada al lado de tres pintadas, que es lo que hace falta
 * para juzgar la primera.
 *
 * El archivo va por custom property y no por `<img>`, al revés que el emblema, y
 * es la misma razón que da _orla.scss para el disco del Tier: **esto no es un
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

// --- J · Orla ---------------------------------------------------------------
// El diseño elegido. La carta es un rectángulo redondeado —se corta recta, no
// hace falta troquel— y detrás de un mat negro macizo
// (styles/components/card-sketch/_orla.scss) vive el cuerpo entero.
//
// EL CUERPO VA EN UN HIJO, no en el artículo, y de ahí sale casi todo lo demás:
// el artículo ES el mat, así que la carta de dentro necesita su propia caja
// (.sketch__inlay) y es ella la que lleva .sketch--cuerpo. Por eso también se
// repite aquí data-rarity: octagon-shell (styles/tools/_mixins.scss) elige la
// veta con un selector de atributo sobre el MISMO elemento que lleva la clase,
// y sin el atributo en el inlay la carta se queda con la veta común.
//
// SU MARCO NO ES EL DEL CUERPO. La primera versión de este componente envolvía
// tal cual al boceto del que sale, con el argumento de que «entero y sin tocar
// un píxel» era la apuesta; se corrigió el mismo día. Aquel filete —cantoneras,
// roblones, 15px de banda— estaba dibujado para ser el CANTO de la carta, la
// pieza que dice «esto es blindaje atornillado al borde», y metido dentro de un
// borde negro deja de serlo: una ficha remachada montada sobre otro borde no se
// lee como blindaje, se lee como ruido. Así que aquí va <OrlaFrame />, que es el
// mismo octógono y la misma idea de una veta que dice la Rareza, con un anillo
// mucho más fino y sin un solo herraje (ver sketch-frames.tsx).
function OrlaCard({ subject }: { subject: Subject }) {
  return (
    <div className="sketch__inlay sketch--cuerpo" data-rarity={subject.rarity}>
      <Art subject={subject} />
      <OrlaFrame />
      <Rail subject={subject} />

      <span className="sketch__gem" title={`Rareza: ${subject.rarity}`} />

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

// --- K · Moldura ------------------------------------------------------------
// El único boceto cuyo marco no lo traza el navegador. Donde la J pone un <svg>
// de sketch-frames.tsx, este pone una capa vacía y el SCSS le cuelga un PNG
// (styles/components/card-sketch/_moldura.scss): seis archivos, uno por raíl de
// color, en public/assets/v3/frames/card/.
//
// El árbol es el de la J salvo por dos líneas, y las dos dicen lo mismo —que
// el marco dejó de ser código—:
//
//   · <span className="sketch__frame" /> en vez de <OrlaFrame />. La capa es la
//     misma de siempre (inset 0, z("frame"), sin puntero); lo que cambia es que
//     su contenido lo pinta el CSS con background-image y no un trazado. Va
//     vacío y no como un <img> por la norma de la carpeta: una moldura no dice
//     ningún dato, así que no es contenido — es fondo.
//   · NO hay .sketch__gem. El rombo de la Rareza está tallado dentro del
//     archivo, a caballo del canto de arriba y en el mismo sitio en los seis;
//     pintar además el de CSS sería una segunda piedra encima de la primera.
//
// Lo demás es el cuerpo tal cual, igual que en la J: el inlay lleva
// .sketch--cuerpo y hereda la composición entera, así que lo único que se
// compara entre las dos cartas es el marco. Aquí el inlay no hace falta para
// meter la carta dentro de un mat —no hay mat— pero se conserva por eso mismo:
// las dos tienen que montar el cuerpo en el mismo sitio del árbol o dejarían de
// ser comparables.
function MolduraCard({ subject }: { subject: Subject }) {
  return (
    <div className="sketch__inlay sketch--cuerpo" data-rarity={subject.rarity}>
      <Art subject={subject} />
      <span className="sketch__frame" aria-hidden="true" />
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
  orla: OrlaCard,
  moldura: MolduraCard,
};

/**
 * Una carta de boceto: el artículo con su rareza, y dentro el cuerpo que le
 * toque. La rareza se publica como atributo y no como color porque de ella
 * cuelgan las variables --rarity/--seam del SCSS; el artículo no pinta nada.
 *
 * Hubo aquí un mecanismo de HERENCIA —una ficha con `derives` que apilaba la
 * clase del boceto base y la del derivado en el mismo elemento— y se borró con
 * el único boceto que lo usaba, la H · Recinto. Los dos que quedan heredan de
 * otra manera: la clase del cuerpo compartido va en el HIJO (ver OrlaCard) y no
 * en el artículo, así que no hay nada que apilar aquí.
 */
export default function SketchCard({ id, subject }: { id: SketchId; subject: Subject }) {
  const Body = SKETCH_CARDS[id];
  return (
    <article className={`sketch sketch--${id}`} data-rarity={subject.rarity}>
      <Body subject={subject} />
    </article>
  );
}
