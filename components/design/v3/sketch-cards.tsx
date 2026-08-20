// =========================================================================
// Los bocetos de marco de V3
//
// Cada uno es una respuesta DISTINTA a la misma pregunta: dónde caen los 13
// datos de una carta de unidad (knowledge/v3/card-concept/README.md §"Contra
// qué se juzgan"). No son varias pieles del mismo esqueleto —eso sería elegir
// color, no diseño—: lo que cambia en cada uno es la POSICIÓN de las ocho
// Habilidades y de las Características, que es lo único que está en discusión.
//
// A, B y C salen cada uno de una referencia del concepto. D es de otra
// especie: es una MEZCLA de dos cosas que ya existen —el tema `armored` de v2
// y el boceto C—, y por eso se lee después de ellos.
//
// Todos comparten, porque en eso coinciden las tres referencias del concepto
// y ahí no hay nada que decidir:
//   · arte a sangre, sin ventana enmarcada;
//   · el nombre siempre sobre una banda opaca solapada, nunca sobre el arte
//     desnudo;
//   · las Características son glifos, nunca texto;
//   · Rareza en el filete, como ya se resolvió en v2.
//
// Reparto con el SCSS, el mismo de card-frames.tsx: aquí va la ESTRUCTURA (qué
// piezas hay y en qué orden), en styles/components/card-sketch/ va todo lo
// demás. Aquí no se calcula ni una posición.
//
// AÑADIR UN BOCETO: un componente aquí, su entrada en SKETCHES (abajo) y su
// parcial en styles/components/card-sketch/. El Record SKETCH_CARDS es
// exhaustivo, así que dar de alta un id sin dibujarlo rompe el build.
// =========================================================================

import {
  CORNER_SKILLS,
  LONG_NAME,
  SKILLS,
  STRIP_SKILLS,
  type SkillKey,
  type Subject,
} from "./sample";
import { BlindadaFrame } from "./sketch-frames";

export type SketchId = "rejilla" | "gema" | "losa" | "blindada";

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
    id: "rejilla",
    label: "A · Rejilla",
    source: "Olden Era",
    bet: "Las ocho en una rejilla 4×2 sobre panel opaco, todas al mismo peso, y las Características en un raíl vertical de medallones encima del arte.",
  },
  {
    id: "gema",
    label: "B · Gema",
    source: "Mano de Steam",
    bet: "Jerarquía: Vida y Ataque como gemas que desbordan las esquinas, Defensa y Resistencia colgando de ellas, y las cuatro restantes en una tira fina. Características en cenefa al pie.",
  },
  {
    id: "losa",
    label: "C · Losa",
    source: "Warhammer Combat Cards",
    bet: "Nada de panel: arte a carta entera, losa de piedra solapada con el nombre, las ocho en una sola fila de cápsulas y los glifos pegados al borde inferior.",
  },
  {
    id: "blindada",
    label: "D · Blindada",
    source: "Armored (v2) × boceto C",
    bet: "El esqueleto de C con el herraje de v2: el filete de 3px se convierte en una banda de metal con cantoneras remachadas, la losa de piedra en una placa de hierro atornillada, y el Tier se sube a un medallón montado en su borde. La Rareza deja de ser una línea de color y pasa a ser la aleación del marco entero.",
  },
];

const skillOf = (key: SkillKey) => SKILLS.find((s) => s.key === key)!;

// --- Piezas compartidas ---------------------------------------------------

/**
 * El hueco de arte, a sangre en los tres bocetos.
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

/** Nombre + subtítulo «raza · tier», el bloque que todos llevan igual. */
function Plate({
  subject,
  className,
  sub,
  children,
}: {
  subject: Subject;
  className: string;
  /**
   * Subtítulo, cuando no sirve el de por defecto. Lo usa el boceto D, que se
   * queda solo con la raza porque su medallón ya dice el Tier — que es
   * justamente lo que ese boceto propone comprobar.
   */
  sub?: React.ReactNode;
  /** Piezas ancladas a la placa: el medallón de Tier del boceto D. */
  children?: React.ReactNode;
}) {
  return (
    <header className={className}>
      {children}
      <h3 className="sketch__name" data-long={subject.name.length > LONG_NAME || undefined}>
        {subject.name}
      </h3>
      <p className="sketch__sub">
        {sub ?? (
          <>
            {subject.raceIcon} {subject.race} · Tier {subject.tier}
          </>
        )}
      </p>
    </header>
  );
}

/** Cenefa horizontal de Características (bocetos B y C). */
function Frieze({ subject, className }: { subject: Subject; className: string }) {
  if (subject.traits.length === 0) return null;
  return (
    <ul className={className}>
      {subject.traits.map((t) => (
        <li className="sketch__glyph" key={t.label} title={t.label}>
          {t.icon}
        </li>
      ))}
    </ul>
  );
}

/**
 * Un par icono-sobre-número. Es la pieza que más se repite —ocho por carta— y
 * la única que cambia de piel según dónde caiga: `base` nombra el bloque BEM
 * (cell, gem, hang, pod) y `mod` su modificador de posición, si lo lleva. La
 * estructura interna es siempre la misma, que es justo lo que se quiere
 * comparar entre bocetos.
 */
function Stat({
  subject,
  skill,
  base,
  mod,
}: {
  subject: Subject;
  skill: SkillKey;
  base: string;
  mod?: string;
}) {
  const s = skillOf(skill);
  return (
    <li
      className={`sketch__${base}${mod ? ` sketch__${base}--${mod}` : ""}`}
      title={`${s.label}: ${subject.skills[skill]}`}
    >
      <span className={`sketch__${base}-icon`} aria-hidden="true">
        {s.icon}
      </span>
      <b className={`sketch__${base}-value`}>{subject.skills[skill]}</b>
    </li>
  );
}

// --- A · Rejilla ----------------------------------------------------------
// La respuesta de Olden Era: las ocho estadísticas sin jerarquía, todas al
// mismo tamaño, en una rejilla sobre panel opaco al pie. Es el único de los
// tres en el que ninguna Habilidad manda sobre otra.
//
// El raíl de Características va en vertical sobre el arte porque es la mejor
// respuesta al Miliciano: con cero medallones no queda un hueco vacío, queda
// arte. El raíl no es una fila del layout, es una capa encima.
function RejillaCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      {subject.traits.length > 0 && (
        <ul className="sketch__rail">
          {subject.traits.map((t) => (
            <li className="sketch__medal" key={t.label} title={t.label}>
              {t.icon}
            </li>
          ))}
        </ul>
      )}
      <div className="sketch__foot">
        <Plate subject={subject} className="sketch__plate" />
        <ul className="sketch__grid">
          {SKILLS.map((s) => (
            <Stat key={s.key} subject={subject} skill={s.key} base="cell" />
          ))}
        </ul>
      </div>
    </>
  );
}

// --- B · Gema -------------------------------------------------------------
// La respuesta contraria: SÍ hay jerarquía. Vida y Ataque son lo que se mira
// en cada intercambio de golpes, así que salen a las esquinas de arriba en
// gemas que desbordan el marco; Defensa y Resistencia mágica cuelgan debajo en
// fichas pequeñas —el patrón de la gema con su `+2` de la referencia—; y las
// cuatro que solo se consultan de vez en cuando se van a una tira fina.
//
// El precio de las gemas desbordadas está anotado en el concepto: una carta
// así no se puede recortar sin cortar números.
function GemaCard({ subject }: { subject: Subject }) {
  const [main, second] = [CORNER_SKILLS.slice(0, 2), CORNER_SKILLS.slice(2)];
  return (
    <>
      <Art subject={subject} />
      <ul className="sketch__gems">
        {main.map((k, i) => (
          <Stat key={k} subject={subject} skill={k} base="gem" mod={i === 0 ? "l" : "r"} />
        ))}
        {second.map((k, i) => (
          <Stat key={k} subject={subject} skill={k} base="hang" mod={i === 0 ? "l" : "r"} />
        ))}
      </ul>
      <div className="sketch__foot">
        <Plate subject={subject} className="sketch__plate" />
        <ul className="sketch__strip">
          {STRIP_SKILLS.map((k) => (
            <Stat key={k} subject={subject} skill={k} base="pod" />
          ))}
        </ul>
        <Frieze subject={subject} className="sketch__frieze" />
      </div>
    </>
  );
}

// --- C · Losa -------------------------------------------------------------
// La respuesta de Warhammer: la carta ES la ilustración y todo lo demás flota
// encima. No hay panel de lectura en ningún sitio; la losa de piedra con el
// nombre se solapa sobre el tercio inferior y bajo ella van las ocho en UNA
// sola fila de cápsulas, que es la prueba de fuego de este boceto.
//
// Su coste vuelve a la dirección de arte: la losa se come el centro de la
// composición, así que la ilustración hay que encuadrarla para ella —la cabeza
// alta— y eso es una restricción sobre illustrations.md.
function LosaCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      <div className="sketch__foot">
        <Plate subject={subject} className="sketch__slab" />
        <ul className="sketch__pods">
          {SKILLS.map((s) => (
            <Stat key={s.key} subject={subject} skill={s.key} base="pod" />
          ))}
        </ul>
        <Frieze subject={subject} className="sketch__frieze sketch__frieze--edge" />
      </div>
    </>
  );
}

// --- D · Blindada ---------------------------------------------------------
// La mezcla: el esqueleto del boceto C con el herraje del tema `armored` de v2
// (components/design/card-frames.tsx + styles/components/card-themes/).
//
// De C se queda TODO lo estructural, que es lo que se está juzgando: arte a
// carta entera, placa solapada sobre el tercio inferior, las ocho en una sola
// fila y los glifos al pie. De Armored se trae lo que es piel y herraje:
//
//   · el filete de 3px se convierte en una BANDA de metal con cantoneras
//     remachadas en las cuatro esquinas (BlindadaFrame, en sketch-frames.tsx);
//   · el metal es el color de la Rareza, no un adorno tintado. Es la respuesta
//     de este boceto a la pregunta abierta de dónde vive la Rareza;
//   · la losa de piedra pasa a ser una placa de hierro atornillada;
//   · y el medallón del tipo de carta —que en v2 iba montado sobre el filete
//     de la ventana— se recicla para el TIER, que es la otra pregunta abierta.
//     Por eso el subtítulo aquí solo dice la raza.
//
// Lo que Armored NO trae, y es la mitad del interés de la mezcla: su VENTANA
// de arte. Los tres conceptos coinciden en el arte a sangre y el concepto ya
// avisaba de que la ventana es lo que hace que el tema de v2 «se note de otra
// familia». Aquí se comprueba si el herraje sobrevive sin ella.
//
// Lo que hay que mirar: si la banda de 15px deja sitio a la fila de ocho
// (cada cápsula se queda en ~30px, cuatro menos que en C) y si el metal de
// rareza compite con la ilustración en vez de enmarcarla.
function BlindadaCard({ subject }: { subject: Subject }) {
  return (
    <>
      <Art subject={subject} />
      <BlindadaFrame />
      <div className="sketch__foot">
        <Plate
          subject={subject}
          className="sketch__plate sketch__plate--metal"
          sub={`${subject.raceIcon} ${subject.race}`}
        >
          <span className="sketch__boss" title={`Tier ${subject.tier}`}>
            <b className="sketch__boss-value">{subject.tier}</b>
          </span>
        </Plate>
        <ul className="sketch__pods">
          {SKILLS.map((s) => (
            <Stat key={s.key} subject={subject} skill={s.key} base="pod" />
          ))}
        </ul>
        <Frieze subject={subject} className="sketch__frieze sketch__frieze--rail" />
      </div>
    </>
  );
}

const SKETCH_CARDS: Record<SketchId, (p: { subject: Subject }) => React.ReactElement> = {
  rejilla: RejillaCard,
  gema: GemaCard,
  losa: LosaCard,
  blindada: BlindadaCard,
};

/**
 * Una carta de boceto. El filete de rareza lo pone el propio artículo
 * (.sketch::after en el SCSS) y no cada boceto: es lo único que A, B y C
 * heredan tal cual de v2. El boceto D lo apaga, porque su marco entero es de
 * metal de rareza y una línea de más sobraría.
 */
export default function SketchCard({ id, subject }: { id: SketchId; subject: Subject }) {
  const Body = SKETCH_CARDS[id];
  return (
    <article className={`sketch sketch--${id}`} data-rarity={subject.rarity}>
      <Body subject={subject} />
    </article>
  );
}
