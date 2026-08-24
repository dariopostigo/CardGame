"use client";

import { useState } from "react";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { sketchFontVars } from "./sketch-fonts";
import SketchCard, { SKETCHES, type SketchId } from "./sketch-cards";
import { HEROES, STRESS, SUBJECTS, UNITS, type Subject } from "./sample";

// Los estilos viven en el árbol ITCSS: el esqueleto en
// styles/components/_card-sketch.scss y cada boceto en
// styles/components/card-sketch/.

/* Bocetos de marco de carta de V3, dentro de la wiki.
   Es el hermano del lab de v2 (components/design/CardDesignLab.tsx): aquel
   pinta el catálogo REAL con un marco ya decidido, este pinta sujetos de
   muestra con el marco que se está decidiendo.

   Hubo cinco bocetos en la primera tanda y quedó uno, la E · Forja; los cuatro
   anteriores se borraron y lo que enseñó cada uno está en
   knowledge/v3/card-concept/README.md. La F · Blasón abre la segunda: no se
   deriva de la E, sale de una referencia y la contradice a propósito. Con dos
   en la lista vuelve a pintarse la fila de pestañas —con uno solo no se pinta,
   porque una pestaña que no lleva a ningún sitio es ruido—.

   Las dos fuentes que carga: Platypi para el nombre —la serif de titulación que
   entra en lugar de Cormorant, la serif de libro de las cartas de v2— y Oswald
   para los números, que es la condensada del tema de producción: un número de
   tres cifras en una cápsula de 34px necesita una condensada o no entra.
   Cormorant y EB Garamond ya no se cargan aquí: al dejar de titular no las
   pedía nadie, y eran dos familias bajando para nada. Las cartas de v2 (y su
   lab) las siguen usando por su cuenta. */

/* La selección es un solo valor porque las opciones se excluyen: o se mira un
   sujeto, o se mira una tanda entera. Las tandas se marcan con "@" para que no
   puedan chocar nunca con un id de sample.ts. */
const ALL_UNITS = "@unidades";
const EVERYTHING = "@todo";

/* Probeta de aleación (TEMPORAL).
   El metal de la carta sale de un solo color, así que probarlo es cambiar ese
   color: el atributo data-alloy va al escenario y el @each de
   styles/components/_card-sketch.scss hace el resto. Mueve los dos marcos a la
   vez —la E y la F comparten aleación—, que es lo que hay que querer: si cada
   boceto llevara su metal, la comparación sería de color y no de marco.

   Esta lista es el espejo de las claves de $sketch-alloy (settings/_colors.scss)
   y no su fuente: si allí se añade una aleación, aquí se añade su rótulo. No hay
   comprobación que lo ate, así que un id mal escrito no rompe nada — se queda
   con el metal por defecto, que es lo que hay que mirar si un botón "no hace
   nada".

   Van de oscura a clara, en el mismo orden que el mapa: la fila se recorre como
   una escala y así se ve de un tirón dónde el marco deja de aguantar el oro del
   rótulo y dónde empieza a comerse la ilustración.

   Se borra entera cuando se elija, junto con el mapa y el @each. */
const ALLOYS = [
  ["carbon", "Carbón"],
  ["pavonado", "Pavonado"],
  ["hierro", "Hierro"],
  ["cardenillo", "Cardenillo"],
  ["oxido", "Óxido"],
  ["acero", "Acero"],
  ["peltre", "Peltre"],
  ["cobre", "Cobre"],
  ["bronce", "Bronce"],
  ["estano", "Estaño"],
  ["laton", "Latón"],
  ["plata", "Plata"],
  ["oro", "Oro"],
  ["marfil", "Marfil"],
] as const;

/** El metal que hoy está puesto en settings/: con el que abre el lab. */
const ALLOY_NOW = "peltre";

export default function CardSketchLab() {
  // Se abre por el ÚLTIMO boceto y con la tabla entera delante, que es el
  // estado en el que se trabaja: el boceto vivo es siempre el último que se
  // dibujó, y una decisión de marco no se toma con una carta, se toma viendo
  // los once sujetos a la vez.
  //
  // El último de la lista y no un id escrito: dar de alta un boceto nuevo tiene
  // que bastar con añadirlo a SKETCHES. Hoy la lista tiene uno.
  const [view, setView] = useState<SketchId>(SKETCHES[SKETCHES.length - 1].id);
  const [pick, setPick] = useState<string>(EVERYTHING);
  // Arranca en el metal que hoy está puesto en settings/, para que la primera
  // pantalla sea la carta tal cual es y no una de las pruebas. Va por nombre y
  // no por posición: la lista está ordenada por tono, y el orden cambia en
  // cuanto se añade una aleación.
  const [alloy, setAlloy] = useState<string>(ALLOY_NOW);

  const shownSketches = SKETCHES.filter((s) => s.id === view);
  const shownSubjects =
    pick === ALL_UNITS ? UNITS : pick === EVERYTHING ? SUBJECTS : SUBJECTS.filter((s) => s.id === pick);

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  // Un botón por sujeto. El title lleva lo que decide si la carta se rompe:
  // cuántas Características trae y cuántas cifras tiene la Vida.
  const subjectBtn = (s: Subject) => (
    <button
      key={s.id}
      className={btn(pick === s.id)}
      onClick={() => setPick(s.id)}
      title={`${s.traits.length} Características · Vida ${s.skills.vida}`}
    >
      {s.icon} {s.name}
    </button>
  );

  const label = (text: string) => (
    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
      {text}
    </span>
  );

  return (
    <div className={`sketch-lab ${sketchFontVars} ${gameFontVars}`}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de cartas</h1>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El <b>marco</b> de la carta de V3 — el objeto, no la ilustración que va dentro. La
        pregunta que contesta un boceto es dónde caen los <b>13 datos</b> de una carta de unidad.
        De la primera tanda —cinco, salidos del análisis de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        — quedó <b>la E · Forja</b>; los otros cuatro están borrados y lo que enseñó cada uno
        sigue escrito en el concepto. Al lado está ahora la <b>F · Blasón</b>, que no se deriva de
        ella: es la réplica de una referencia (<i>Might &amp; Magic: Fates</i>) y le lleva la
        contraria en las cuatro cosas que la E daba por cerradas — la silueta, dónde vive la
        Rareza, si los ocho números van todos iguales y si la carta escribe el Tier o lo enseña.
      </p>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Los sujetos son la <b>plantilla real de la raza piloto</b>: las <b>ocho unidades</b> de
        👤 Humanos en su orden de progresión y <b>tres de sus cuatro héroes</b>, con sus nombres,
        sus emojis y sus Características tal y como están en razas.md. Los héroes están por dos
        motivos: <b>no tienen tier</b> —un dato que el marco tiene que resolver— y son los únicos
        con <b>ilustración definitiva de V3</b>, así que son las tres cartas que dicen la verdad
        sobre cómo queda un marco encima del arte de este juego. Aparte va el 🐉 Dragón
        esquelético, que no es de Humanos: es el peor caso del catálogo entero —cinco
        Características y dieciocho caracteres de nombre— y sin él ningún boceto pasa de cuatro
        chips.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        <b>Nada de esto está decidido.</b> Lo único inventado son los números de las Habilidades
        (los reales siguen pendientes en razas.md); ahí solo importa su forma, si tienen una, dos
        o tres cifras. La Rareza de las unidades va por tier a falta de una regla; los héroes no
        entran en esa escala y tienen <b>raíl propio</b>, en rojo sangre. De las ocho unidades
        solo dos tienen imagen, prestada de las cartas de clase de v2; el resto cae al emoji, que
        hoy es lo normal y también hay que verlo.
      </p>

      {/* Controles. Los sujetos van en tres grupos y no en una lista porque la
          separación es real: la progresión de la raza, sus héroes —que no
          tienen tier— y un caso que no es de Humanos. */}
      <div className="mb-5 space-y-3">
        {/* La fila de bocetos solo aparece cuando hay entre qué elegir. Con uno
            sería una pestaña que no lleva a ningún sitio; el nombre del boceto
            ya lo dice la cabecera del escenario. */}
        {SKETCHES.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {label("Boceto")}
            {SKETCHES.map((s) => (
              <button key={s.id} className={btn(view === s.id)} onClick={() => setView(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {label("Unidades")}
          {UNITS.map(subjectBtn)}
          <button className={btn(pick === ALL_UNITS)} onClick={() => setPick(ALL_UNITS)}>
            Las ocho
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {label("Héroes")}
            {HEROES.map(subjectBtn)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {label("Caso límite")}
            {STRESS.map(subjectBtn)}
          </div>
          <button className={btn(pick === EVERYTHING)} onClick={() => setPick(EVERYTHING)}>
            Todo junto
          </button>
        </div>
        {/* La probeta de metal. Vale para los dos bocetos porque en los dos el
            metal NO lleva la rareza: si el marco fuera la rareza —como en la
            D—, cambiarle el tono sería cambiar de boceto y no de material.
            Y es la misma aleación para ambos a propósito: así se comparan con
            el mismo material y lo que se ve es el marco, no el color. */}
        <div className="flex flex-wrap items-center gap-2">
          {label("Aleación")}
          {ALLOYS.map(([id, name]) => (
            <button key={id} className={btn(alloy === id)} onClick={() => setAlloy(id)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Escenario. Reutiliza el objeto del lab de v2 (objects/_stage.scss);
          el fondo oscuro lo pone .sketch-lab. */}
      <div className="card-lab__stage" data-alloy={alloy}>
        {shownSketches.map((sk) => (
          <section key={sk.id} className="mb-8 last:mb-0">
            <header className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-[var(--wiki-text)]">{sk.label}</h2>
              <p className="mx-auto max-w-2xl text-xs text-[var(--wiki-muted)]">
                <b>{sk.source}.</b> {sk.bet}
              </p>
            </header>
            <div className="card-lab__grid">
              {shownSubjects.map((s) => (
                <SketchCard key={s.id} id={sk.id} subject={s} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Lo que hay que decidir mirando esto. Va en la página y no solo en el
          documento porque es lo que se contesta AQUÍ, con las cartas delante. */}
      <section className="mt-8 max-w-3xl text-sm text-[var(--wiki-text)]">
        <h2 className="mb-2 text-lg font-semibold">Qué falta decidir</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[var(--wiki-muted)]">
          <li>
            <b>Si la carta es un rectángulo.</b> Los cinco bocetos de la primera tanda no lo
            preguntaron nunca: los cinco son la misma caja redondeada con distinta piel. La{" "}
            <b>F</b> la corta — es un <b>octógono</b>, con las cuatro esquinas a 45° y un roblón
            en cada corte— y eso no es una piel, es lo primero que se reconoce de una carta a
            distancia de mesa. El precio se ve en el propio marco: cada esquina cortada es sitio
            que se pierde, y por eso el disco del Tier tiene que <i>desbordar</i> el chaflán en vez
            de caber dentro. Cambia también la producción: una carta impresa con las esquinas
            cortadas es un troquel, no un corte recto.
          </li>
          <li>
            <b>Si los ocho números van todos iguales.</b> La <b>E</b> dice que sí —misma fila,
            mismo cuerpo, mismo peso—, y la ventaja es que la carta no elige por ti. La <b>F</b>{" "}
            dice que no: ⚔️ Ataque y ❤️ Vida se van a las esquinas de abajo en pines con forma
            propia y a mayor tamaño, y los otros seis se quedan en una rejilla de 3×2. Es lo que
            el concepto B señalaba como digno de robar y ningún boceto había dibujado. Míralas
            juntas y decide si la carta debe decir <i>cuáles</i> se consultan en cada golpe, o si
            eso es una decisión de reglas que el marco no tiene por qué congelar.
          </li>
          <li>
            <b>Si el icono va encima del número o al lado.</b> El esqueleto tiene escrito que el
            apilado <i>es</i> la pieza —en fila, icono y cifra dejan de leerse como un par—, y se
            escribió con ocho en una fila de 33px. La F lo prueba en las otras condiciones: seis
            en tres columnas de ~85px, con el icono al lado. Si ahí también se deshace, la regla
            es de la pieza; si aguanta, era de la anchura.
          </li>
          <li>
            <b>Si el Tier se escribe o se enseña</b>, ya con las dos respuestas dibujadas. La{" "}
            <b>E</b> no lo escribe en ningún sitio y paga que solo puede decir de qué{" "}
            <i>clase</i> de tier es (cinco escalones para ocho tiers: el Miliciano y el Arquero son
            la misma carta gris). La <b>F</b> lo escribe en número, en el disco de la esquina —que
            es lo que la referencia hace con el coste—, y de paso la raza vuelve a escribirse en
            versalitas al pie. Una enseña y la otra escribe; es la misma pregunta que la del
            subtítulo, pero ahora se puede mirar en vez de discutirse.
          </li>
          <li>
            <b>Lo que la referencia tiene y aquí no cabe.</b> Bajo su disco de coste cuelga un{" "}
            <b>banderín de facción</b>, y no está en la réplica: esa carta tiene <b>dos</b>{" "}
            taxonomías —la facción (Academy) y el tipo de criatura (WIZARD)— y V3 solo tiene una,
            la raza, que ya se escribe al pie. El otro candidato, el tipo de daño, viaja pegado al
            número de Ataque desde la E y ahí no cuesta ni un pixel. Merece anotarse: la mitad de
            las fichas de una referencia existen porque su juego tiene un eje que el nuestro no
            tiene, y copiarlas sin ese eje es rellenar huecos.
          </li>
          <li>
            <b>Dónde vive la Rareza</b>, con dos respuestas opuestas en pantalla. La <b>E</b> la
            mete <i>dentro</i> del metal: una <b>veta</b> de luz entre los dos raíles del filete,
            más el baño que derrama sobre la ilustración — la carta no está teñida, está
            encendida. La <b>F</b> la saca al <i>canto</i>: un filete duro de 2,2px que rodea el
            octógono entero, más un <b>rombo</b> a caballo del borde de arriba, en el eje del
            nombre. Encendido contra acuñado. La tercera vía, teñir el marco entero de la aleación
            de la rareza, ya se probó y se descartó (mezcla D): se reconoce antes en una mano,
            pero convierte el marco en cinco piezas distintas y le roba la carta a la ilustración.
            Mira el Miliciano (común) junto al Dragón dorado (legendaria) con «Todo junto» en los
            dos bocetos.
          </li>
          <li>
            <b>Si el raíl de Características se lleva bien con un marco con herrajes.</b> El raíl
            va sobre el arte, y con las cantoneras en las esquinas tiene que arrancar más abajo
            para no meterse debajo de una. Míralo en el 🐉 Dragón esquelético, que trae cinco. En
            la F además cambia de lado —se va a la derecha, porque la esquina izquierda se la
            lleva el disco del Tier— y los medallones dejan de ser redondos: repiten el octógono
            de la carta en pequeño.
          </li>
          <li>
            <b>Arriba no caben.</b> Se probó a subir las ocho Habilidades a una banda de
            cabecera y caía justo sobre las cabezas de los tres héroes, que es la franja que la
            dirección de arte manda dejar visible. La parte baja de la carta es la única que la
            ilustración da por perdida — conviene tenerlo presente antes de proponer mover nada
            al tercio alto.
          </li>
          <li>
            <b>Cuántas Características tiene que aguantar el marco.</b> El concepto dice «de 0 a
            4», pero en razas.md hay seis unidades de tier 8 con <b>cinco</b> (Dragón esquelético,
            Balor, Dragón ancestral, Kraken ancestral, Coloso mecánico y Abominación de plaga).
            El marco está montado para cinco.
          </li>
          <li>
            <b>Si los ceros se imprimen o se ocultan.</b> Aquí se imprimen: mira la Suerte 0 del
            Miliciano y decide si molesta más el cero o el hueco.
          </li>
          <li>
            <b>Si un emblema puede sustituir al texto.</b> En la <b>E</b> el medallón lleva el
            icono de la <b>raza</b>, y con eso la placa se queda sin subtítulo: bajo el nombre no
            hay nada escrito. Es lo que más aligera el pie, y su prueba está en el 🐉 Dragón
            esquelético junto a cualquier humano — 💀 contra 👤 y sin leer. El reparo: el emoji de
            Humanos es una silueta genérica, así que como emblema depende de que razas.md le dé
            uno que valga a ese tamaño. La <b>F</b> hace lo contrario y escribe «HUMANOS» en
            versalitas al pie, que es lo que la referencia hace con el tipo de criatura: cuesta
            una línea y no depende de ningún catálogo de iconos.
          </li>
          <li>
            <b>Qué pone en el hueco del Tier una carta de héroe.</b> Un héroe no tiene tier y no
            tiene nada que lo sustituya: V3 no tiene progresión de personaje, así que no hay ningún
            número en camino para ese sitio. La <b>E</b> disuelve el problema —el medallón lleva la
            raza, no un número— pero a cambio deja de decir «Héroe» con palabras y lo fía todo al
            rojo de la veta. La <b>F</b> sí reserva el sitio, así que tiene que rellenarlo: pone
            una 👑, que es la respuesta que ya daba la mezcla D. Mira el ⚔️ Guerrero entre las ocho
            unidades en los dos y decide si se reconoce solo.
          </li>
          <li>
            <b>Si el rojo es el color de los héroes.</b> No entran en la escala de rareza, así que
            tienen raíl propio: la <b>sangre</b> del tema de producción, que además es el único
            hueco de color que quedaba —ninguna de las cinco rarezas es roja—. Eso los convierte
            en las únicas cartas con la veta encendida en rojo, y se reconocen de un vistazo entre
            las unidades. Lo único que queda por decidir es si ese rojo se comparte con algo más
            (en v2 lo tenía la carta de Enemigo). Todos los héroes van iguales, porque no hay
            ningún número que los ordene entre sí. <b>La F le ha encontrado un roce</b>: su pin de
            ❤️ Vida es una gema roja —de la referencia— y en una carta de héroe acaba a juego con
            el filete del marco, así que las dos cosas rojas de la carta dejan de distinguirse. O
            el héroe cambia de color, o la Vida no puede ser roja.
          </li>
          <li>
            <b>De qué metal es la carta.</b> Se puede preguntar porque aquí el metal no dice
            nada: no lleva la rareza, así que su tono es libre. Hay <b>catorce aleaciones</b> en
            el selector de arriba, ordenadas de oscura a
            clara para que la fila se recorra como una escala: del carbón al marfil, pasando por
            el peltre de ahora. Las tres cosas que hay que mirar al pasarlas no son el marco, son
            lo que se apoya en él: el <b>oro del rótulo</b> sobre la placa (el latón casi se lo
            traga, y el oro es la prueba de fuego), el <b>emblema</b> sobre el medallón, que
            necesita cara clara, y la <b>veta</b> de rareza, que se apaga cuando el metal ya es de
            su tono — compara la legendaria del 🐉 Dragón dorado en peltre y en latón. Los
            oscuros hacen lo contrario: apagan el marco y suben todo lo demás. Dos están fuera de
            la familia a propósito: el <b>cardenillo</b> (verde de pátina, el único que no es gris
            ni dorado) y el <b>marfil</b>, que ya no parece metal — están para ver si el marco
            tiene que ser metálico siquiera. El selector mueve <b>los dos bocetos a la vez</b>:
            comparten aleación para que lo que se compare sea el marco y no el color. En la F hay
            una cosa más que mirar, el <b>hilo de oro</b> que corre por dentro del filete — con los
            metales claros deja de verse.
          </li>
          <li>
            <b>Qué tipografía titula la carta.</b> El nombre iba en <b>Cormorant</b>, la serif de
            libro heredada de las cartas de v2: correcta, pero dice «documento» antes que «objeto
            de juego». Ahora está puesta <b>Platypi</b>, una serif de titulación de remates de
            pala. Se carga <b>variable (300–800)</b>, así que el rótulo se puede afinar por peso
            sin bajar un archivo por escalón, y está puesta en <b>300</b>: el nombre en fino se
            lee como una inscripción y deja mandar al arte, en vez de competir con los números.
            El precio es que la jerarquía ya no la hace el contraste sino el aire, y por eso la
            fila de ocho baja 16px del rótulo — con menos, el nombre fino y los números macizos
            se leen como un solo bloque. Las cartas de v2 no se tocan.{" "}
            <b>Y la F ha encontrado el límite del 300</b>: titula en <b>versalitas</b>, como la
            referencia, y una versal fina y pequeña no tiene trazo con el que sostenerse — ahí
            sube a 500. O la carta titula en fino y en caja mixta (E), o titula en versalitas y
            necesita peso (F); las dos a la vez, no.
          </li>
          <li>
            <b>Dos Características distintas con el mismo emoji</b>, ya resuelto. El ⚔️ Guerrero
            llevaba 🛡️ Resistente al daño físico y 🛡️ Último aliento, y como las Características
            se dibujan en glifo y sin texto, la carta enseñaba el mismo icono dos veces. No era
            del marco sino del catálogo, pero se vio aquí: Último aliento pasa a 😤, que además
            deja de mentir —es un buff de daño, no de defensa—. Lo que sigue repitiendo glifo son
            las familias elementales (🔥 Fuego / Resistente / Inmune), y ahí es a propósito.
          </li>
          <li>
            <b>El tipo de daño se dibuja en el icono del ⚔️ Ataque</b> <i>(23-ago-2026)</i>. Las
            132 fichas llevan uno —🗡️ Cuerpo a cuerpo, 🏹 A distancia o ✨ Mágico— y es campo
            obligatorio, no Característica. La decisión de dónde ponerlo salió de esta página: un
            dato que llevan todas las cartas <b>no informa de nada</b> en el raíl de las
            excepciones, y allí habría gastado dos de los cinco medallones. Pegado al número no
            cuesta un pixel de marco y la carta dice de un golpe cuánto pega y de qué manera.
            Míralo en el 🔮 Mago y el 🏹 Arquero: el número lleva ✨ y 🏹, y sus raíles se
            quedaron <b>vacíos</b> al salir de ahí los dos rasgos que eran este campo disfrazado.
          </li>
          <li>
            <b>El lienzo de la ilustración</b>, ya resuelto y visible aquí mismo: los tres héroes
            traen arte apaisado de ~1516×1038 y en un marco vertical hay que tirar la mitad de la
            anchura, así que el personaje sale enorme, descentrado y cortado por el muslo. Confirmó
            que <b>el 1536×1050 heredado de v2 no sirve</b>, y la medida ya está escrita en{" "}
            <code>public/assets/v3/README.md</code>: <b>vertical 5:7 (1080×1512), plano general con aire y
            figura centrada</b>, con el cuarto inferior reservado a la banda del nombre. No depende
            del marco —la carta es 300×420 con el arte a sangre—, así que los tres héroes se
            regeneran igual. Ojo: este marco se come <b>15px por cada lado</b>.
          </li>
        </ul>
      </section>
    </div>
  );
}
