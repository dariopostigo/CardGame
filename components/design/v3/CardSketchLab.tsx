"use client";

import { useState } from "react";
import Link from "next/link";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { sketchFontVars } from "./sketch-fonts";
import SketchCard, { SKETCHES, type SketchId } from "./sketch-cards";
import { HEROES, STRESS, SUBJECTS, UNITS, type Subject } from "./sample";

// Los estilos viven en el árbol ITCSS: el esqueleto en
// styles/components/_card-sketch.scss, el cuerpo compartido y cada boceto en
// styles/components/card-sketch/.

/* Bocetos de marco de carta de V3, dentro de la wiki.
   Es el hermano del lab de v2 (components/design/CardDesignLab.tsx): aquel
   pinta el catálogo REAL con un marco ya decidido, este pinta sujetos de
   muestra con el marco que se está decidiendo.

   HUBO DIEZ BOCETOS Y QUEDAN DOS. Se dibujaron A · Rejilla, B · Gema, C · Losa,
   D · Blindada, E · Forja, F · Blasón, G · Estandarte, H · Recinto, I · Retablo
   y J · Orla, y de esos diez la página llegó a enseñar cinco a la vez. El 1 de
   septiembre de 2026 entró la K · Moldura y ese mismo día se borraron los cuatro
   que seguían vivos —E, G, H e I— por decisión de Dario. Lo que enseñó cada uno
   está escrito en knowledge/v3/card-concept/README.md, que es donde vive el
   razonamiento; esta página ya no es el archivo de la comparación, es el banco
   donde se mira la que sigue abierta.

   Y LA QUE SIGUE ABIERTA ES UNA SOLA, porque los dos que quedan son la misma
   carta con otro borde: por dentro montan el mismo cuerpo
   (styles/components/card-sketch/_cuerpo.scss), así que lo único que los separa
   es CON QUÉ SE DIBUJA EL MARCO. La J lo traza el navegador —un anillo de ocho
   lados con un canal de luz, dentro de un mat negro— y la K lo trae hecho, seis
   PNG generados, uno por raíl de color. Todo lo demás está decidido.

   SE BORRÓ TAMBIÉN LA PROBETA DE ALEACIÓN, el selector de catorce metales que
   vivía bajo los controles. No sobraba por gusto: movía a los bocetos
   vectoriales cambiando un color, y de los dos que quedan uno trae el metal
   horneado en un PNG. Un mando que mueve media página y deja la otra media
   quieta engaña más de lo que enseña, y la pregunta que contestaba —de qué metal
   es la carta— ya tiene respuesta: el latón medido de los pictogramas
   (public/assets/v3/icons/), que es lo que hay puesto en settings/_colors.scss.

   Las dos fuentes que carga: Platypi para el nombre —la serif de titulación que
   entra en lugar de Cormorant, la serif de libro de las cartas de v2— y Oswald
   para los números, que es la condensada del tema de producción: un número de
   tres cifras en una cápsula de 34px necesita una condensada o no entra. */

/* La selección es un solo valor porque las opciones se excluyen: o se mira un
   sujeto, o se mira una tanda entera. Las tandas se marcan con "@" para que no
   puedan chocar nunca con un id de sample.ts. */
const ALL_UNITS = "@unidades";
const EVERYTHING = "@todo";

export default function CardSketchLab() {
  // Se abre por el ÚLTIMO boceto y con la tabla entera delante, que es el
  // estado en el que se trabaja: el boceto vivo es siempre el último que se
  // dibujó, y una decisión de marco no se toma con una carta, se toma viendo
  // los once sujetos a la vez.
  //
  // El último de la lista y no un id escrito: dar de alta un boceto nuevo tiene
  // que bastar con añadirlo a SKETCHES.
  const [view, setView] = useState<SketchId>(SKETCHES[SKETCHES.length - 1].id);
  const [pick, setPick] = useState<string>(EVERYTHING);

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
      <p className="mb-4 max-w-3xl rounded-md border border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] px-4 py-3 text-sm text-[var(--wiki-text)]">
        <b>J · Orla es el diseño final</b>, elegido el 25 de agosto de 2026, y es
        el que se ve construido sobre el roster real, raza por raza, en{" "}
        <Link href="/docs/v3/cards/deck" className="underline">
          Cartas › Diseño baraja
        </Link>
        . Aquí al lado está la <b>K · Moldura</b> <i>(1 de septiembre)</i>, que{" "}
        <b>no discute nada de lo que se decidió</b>: por dentro es la misma carta.
        Lo único que pone en cuestión es <b>con qué se dibuja el marco</b> — si lo
        traza el navegador o si es un archivo generado.
      </p>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El <b>marco</b> de la carta de V3 — el objeto, no la ilustración que va dentro. La
        pregunta que contesta un boceto es dónde caen los <b>13 datos</b> de una carta de
        unidad, y esa parte está contestada: los <b>diez bocetos</b> que se dibujaron desde
        el 20 de agosto la fueron cerrando pieza a pieza, y los cuatro que seguían en pantalla{" "}
        <b>se borraron el 1 de septiembre de 2026</b> —E · Forja, G · Estandarte, H · Recinto
        e I · Retablo— junto con la probeta de aleación. Lo que enseñó cada uno sigue escrito
        en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        , que es donde vive el razonamiento. Los dos que quedan comparten cuerpo —disco del
        Tier en la esquina, estandarte de raza colgando de él, las ocho Habilidades en una
        fila, placa a sangre al pie— y se diferencian <b>solo en el borde</b>, que es lo que
        hay que mirar pasando de una pestaña a la otra.
      </p>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Los sujetos son la <b>plantilla real de la raza piloto</b>: las <b>ocho unidades</b> de
        👤 Humanos en su orden de progresión y <b>sus cuatro héroes</b>, con sus nombres, sus
        emojis y sus Características tal y como están en razas.md. Los héroes están por dos
        motivos: <b>no tienen tier</b> —un dato que el marco tiene que resolver— y concentran el{" "}
        <b>arte propio de V3</b>, así que son las cartas que dicen la verdad sobre cómo queda un
        marco encima del arte de este juego. Aparte va el 🐉 Dragón
        esquelético, que no es de Humanos: es el peor caso del catálogo entero —cinco
        Características y dieciocho caracteres de nombre— y sin él ningún boceto pasa de cuatro
        chips.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        <b>Los números no están decididos.</b> Lo único inventado son los valores de las
        Habilidades (los reales siguen pendientes en razas.md); ahí solo importa su forma, si
        tienen una, dos o tres cifras. La Rareza de las unidades va por tier a falta de una
        regla; los héroes no entran en esa escala y tienen <b>raíl propio</b>, en rojo sangre.
        De las ocho unidades <b>ya están las ocho</b> —del 🗡️ Miliciano al 🐉 Dragón dorado, que
        entró el 31 de agosto de 2026 y cierra la raza—, así que el relleno prestado de las
        cartas de clase de v2 <b>ya no está</b>: no queda una sola imagen del juego anterior en
        esta página. Y todas están en el mismo sitio, las ocho: el camino, la cerca y el castillo
        de estandartes azul y oro, que en la última sale diminuto abajo porque ahí hace de
        escala. La que <b>sí</b> cae al emoji es el 🐉 Dragón esquelético de al lado, que no es
        de esta raza — y con la piloto dibujada entera es <b>la única carta</b> de esta página
        donde se puede ver cómo aguanta un marco un hueco de arte vacío, que sigue siendo lo
        normal en el resto del catálogo.
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
      </div>

      {/* Escenario. Reutiliza el objeto del lab de v2 (objects/_stage.scss);
          el fondo oscuro lo pone .sketch-lab. */}
      <div className="card-lab__stage">
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
          documento porque es lo que se contesta AQUÍ, con las cartas delante.

          La lista era larguísima —quince puntos que iban de la silueta a la
          jerarquía de los ocho— y se recortó con los bocetos, el 1 de septiembre
          de 2026: sin la E, la G, la H y la I en pantalla, un punto que dice
          «compara la E con la H» son instrucciones que nadie puede seguir. Lo
          que se quitó no se perdió, está en knowledge/v3/card-concept/. Aquí
          queda lo que todavía se puede mirar con estas dos cartas delante. */}
      <section className="mt-8 max-w-3xl text-sm text-[var(--wiki-text)]">
        <h2 className="mb-2 text-lg font-semibold">Qué queda por mirar</h2>
        <p className="mb-3 text-[var(--wiki-muted)]">
          El reparto de la carta está decidido y no se discute aquí: el registro de{" "}
          <i>cómo</i> se llegó a él, boceto por boceto, está en{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
            knowledge/v3/card-concept/README.md
          </code>
          . Lo de abajo es lo que sigue teniendo respuesta en pantalla.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-[var(--wiki-muted)]">
          <li>
            <b>Si el marco se traza o se dibuja</b>, que es la única pregunta nueva y la razón
            de que haya dos pestañas. La <b>J</b> lo traza: un anillo de ocho lados, un canal de
            luz por dentro y un rombo de Rareza tallado en CSS, todo saliendo de dos variables
            de color. La <b>K</b> lo trae hecho, seis PNG generados. Lo que compra el archivo se
            ve solo —relieve, talla, una gema con facetas de verdad— y lo que cuesta también:{" "}
            <b>el metal ya no se puede afinar</b> (en la J basta cambiar un color para
            reconstruir el material entero; aquí hay que volver a generar los seis archivos, y
            por eso se borró la probeta de aleación que esta página tenía),{" "}
            <b>cada raíl de Rareza es un archivo</b> en vez de una variable, y las seis{" "}
            <b>tienen que ser intercambiables</b> porque la carta las apila en el mismo hueco.
            Pásalas con «Todo junto» y mira si el salto de una rareza a otra es el mismo en las
            dos columnas.
          </li>
          <li>
            <b>El canto de arriba de la K.</b> Su archivo llega a sangre por los lados y por
            abajo, pero deja un 3,6% de aire arriba donde asoma la mitad de la gema, así que en
            la carta hay una franja negra de 15px en el borde superior <i>y solo ahí</i>. Hoy
            está tal cual sale el archivo y se lee como un borde —la misma lectura que hace la J
            con su mat—; la alternativa es subir la moldura hasta el canto y dejar que la gema
            salga fuera de la carta. Es la única decisión abierta de ese boceto.
          </li>
          <li>
            <b>Dónde vive la Rareza.</b> Los dos dicen lo mismo y de dos maneras: una{" "}
            <b>veta</b> de luz por dentro del filete, más el baño que derrama sobre la
            ilustración — la carta no está teñida, está encendida. En la J esa veta es color
            sobre metal y el rombo del canto es una piedra tallada en CSS; en la K las dos cosas
            vienen dibujadas en el archivo. Mira el 🗡️ Miliciano (común) junto al 🐉 Dragón
            dorado (legendaria) y decide si la escala se lee igual de lejos en las dos. La vía
            contraria —teñir el marco entero del color de la rareza— se probó y se descartó
            (boceto D, borrado): se reconoce antes en una mano, pero convierte el marco en cinco
            piezas distintas y le roba la carta a la ilustración.
          </li>
          <li>
            <b>Cuánto detalle aguanta una pieza pequeña.</b> El rombo de la J es una{" "}
            <b>piedra tallada</b> de 16px: engaste de metal, cuatro facetas que se cortan en la
            mitad y una tabla con su destello. Se probó antes plano y a esa medida la talla no
            cabía —la tabla se quedaba en dos píxeles y medio—; cabe porque los cortes de dentro
            van en <i>fracciones</i> de la piedra y encogen con ella. A tamaño de pantalla se ve;
            la pregunta abierta es si se vería en una carta impresa de 63mm, o si a ese tamaño
            las facetas se emborronan y queda una mancha más sucia que la plana. La K contesta
            eso de otra manera —su gema está dibujada, no construida— así que las dos juntas son
            la comparación directa.
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
            <b>Qué pone en el hueco del Tier una carta de héroe.</b> Un héroe no tiene tier y no
            tiene nada que lo sustituya: V3 no tiene progresión de personaje, así que no hay
            ningún número en camino para ese sitio. El disco reserva el hueco igual, así que hay
            que rellenarlo: pone una 👑. Mira el ⚔️ Guerrero entre las ocho unidades y decide si
            se reconoce solo.
          </li>
          <li>
            <b>Si el rojo es el color de los héroes.</b> No entran en la escala de rareza, así que
            tienen raíl propio: la <b>sangre</b> del tema de producción, que además es el único
            hueco de color que quedaba —ninguna de las cinco rarezas es roja—. Eso los convierte
            en las únicas cartas con la veta encendida en rojo, y se reconocen de un vistazo entre
            las unidades. Lo único que queda por decidir es si ese rojo se comparte con algo más
            (en v2 lo tenía la carta de Enemigo). Todos los héroes van iguales, porque no hay
            ningún número que los ordene entre sí.
          </li>
          <li>
            <b>Si la carta puede decir la raza dos veces.</b> El estandarte que cuelga del disco
            lleva el emblema de la <b>raza</b>, y la raza vuelve a escribirse en versalitas al
            pie: 👤 arriba y «HUMANOS» abajo, el mismo dato dos veces y de dos maneras. Está así
            a propósito, para poder mirar juntas en una misma carta las dos respuestas y quedarse
            con una. Míralo en el 🐉 Dragón esquelético, que es el único que no es de Humanos:
            💀 y «NO-MUERTOS». El estandarte teñido inclina la balanza —tinte y emblema se leen a
            distancia de mesa y la versalita al pie no— pero no está cerrado.
          </li>
          <li>
            <b>Arriba no caben.</b> Se probó a subir las ocho Habilidades a una banda de
            cabecera y caía justo sobre las cabezas de los héroes, que es la franja que la
            dirección de arte manda dejar visible. La parte baja de la carta es la única que la
            ilustración da por perdida — conviene tenerlo presente antes de proponer mover nada
            al tercio alto.
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
            <b>El lienzo de la ilustración</b>, resuelto y comprobable a un clic. Nueve de los
            doce archivos están ya en <b>vertical 5:7</b> y entran a sangre —⚔️ Guerrero, 🔮 Mago
            héroe y las unidades 🏹 Arquero, 🛡️ Caballero, 🔮 Mago, 🐎 Caballería, 🦅 Grifo,
            ✝️ Paladín y 🐉 Dragón dorado—,
            mientras que ✝️ Sacerdote, 🏹 Arquero héroe y 🗡️ Miliciano siguen <b>apaisados</b> y
            hay que tirarles media anchura, así que el personaje sale enorme y descentrado. Cambia
            de sujeto y la diferencia se ve sola. La medida está en{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
              public/assets/v3/README.md
            </code>
            : <b>vertical 5:7 (1080×1512)</b>, y no depende del marco.
            <br />
            <b>Donde de verdad falla el arte es en el ENCUADRE.</b> La norma pide{" "}
            <b>plano general con aire</b>, la figura entre el 12% y el <b>72%</b> del alto, con el
            cuarto de abajo libre para la banda del nombre. Puestas las guías, <b>once de los
            doce</b> ponen los pies entre el 77% y el 91%, así que la figura invade ese cuarto y
            el panel le come las piernas — en cualquiera de los dos bocetos. El único que cumple
            es el ✝️ Sacerdote, y de rebote, porque su lienzo apaisado no da de sí para meter una
            figura más alta. Contando también las doce de ⛏️ Enanos, que solo se ven en{" "}
            <b>Diseño baraja</b>, el recuento va por <b>veintitrés de veinticuatro</b>. El que más
            se acerca es el 🦅 Grifo, al 77%, y no por el prompt sino porque <b>vuela</b>: su
            cuarto de abajo lo llena el castillo del fondo en vez de sus patas. Y el que más se
            aleja es el <b>✝️ Paladín</b>, con la bota de delante al <b>91%</b> y la figura
            ocupando el 81% del alto: ahí el panel no le come las piernas, le come las botas. El{" "}
            <b>🐉 Dragón dorado</b> empata esa cifra pero rompe el marco de otra manera, y conviene
            distinguirlo: su cuerpo para <b>antes</b> que el de nadie —las garras al 81%— y lo que
            baja al 91% es <b>la cola</b>, con las dos alas cortadas por los filos. Es el primer
            archivo que se sale por un apéndice y no por el cuerpo. Ojo también: este marco se
            come <b>15px por cada lado</b>.
            <br />
            <b>Y las doce ilustraciones son PROVISIONALES</b> <i>(26-ago-2026)</i>: el generador
            no está respetando la especificación, así que se van metiendo las que salen para que
            las cartas dejen de ser emojis y se puedan mirar de verdad. Nada de esto es{" "}
            <b>deuda que arreglar</b> —ni el lienzo de tres archivos ni el encuadre—, y no hay que
            cuadrar nada a mano: ni recortes, ni <code>object-position</code> por sujeto. La tabla
            del README es la <b>lista de comprobación de la tanda buena</b>, no una lista de
            tareas. Con el marco ya decidido, lo único que hay que mirar aquí es que lo que se
            mete <i>no engañe</i>: si una carta se ve mal, saber si es del archivo o del marco — y
            con los pies al 86% cuando el tope son 72, hoy casi siempre es del archivo.
          </li>
        </ul>
      </section>
    </div>
  );
}
