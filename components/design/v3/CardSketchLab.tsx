"use client";

import { useState } from "react";
import Link from "next/link";
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
   knowledge/v3/card-concept/README.md. La segunda tanda acabó igual: entró la
   F · Blasón —réplica de una referencia, montada para contradecir a la E— y de
   cruzarla con la E salió la G · Estandarte, que la dejó sin nada propio que
   enseñar, así que la F se borró también. Y de la G salió la H · Recinto, que es
   ella misma con todo dentro del contorno y las ocho Habilidades juntas: existe
   porque la E y la G se diferenciaban en DOS cosas a la vez —silueta y jerarquía
   de los ocho— y así no se podía saber cuál de las dos era la que gustaba.

   La I · Retablo abre la tercera tanda y no discute una pieza, discute el
   AXIOMA: cruza la H con una carta de Magic y mete la ilustración en una
   ventana. Los ocho bocetos anteriores son la misma idea con distinta piel —arte
   a sangre y datos flotando encima—, y esa frase estaba escrita en el esqueleto
   como si fuera un hecho.

   Y la J · Orla cruza la H con Magic por el otro extremo: no la anatomía de
   franjas, el BORDE. La carta vuelve a ser un rectángulo —ya no hace falta
   troquel, se corta recta— y detrás de un mat negro vive una H adaptada, no
   calcada: mismo octógono, misma idea de veta encendida, pero con un anillo
   propio (OrlaFrame) mucho más fino y sin cantoneras ni roblones — un herraje
   remachado tenía sentido mientras el octógono ERA el canto de la carta, y
   aquí ya no lo es. Es la respuesta a algo que el propio concepto había dado
   por imposible: «el borde negro es una solución de imprenta para una carta
   que necesita troquel» (knowledge/v3/card-concept/README.md, §Concepto
   Magic) — la J no le lleva la contraria, le cambia la pregunta: el troquel
   deja de hacer falta en cuanto el octógono se PINTA en vez de recortarse.

   Quedan cinco. Con más de uno en la lista vuelve a pintarse la fila de
   pestañas —con uno solo no se pinta, porque una pestaña que no lleva a ningún
   sitio es ruido—.

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
   styles/components/card-sketch/_alloy-probe.scss hace el resto. Mueve los
   cinco bocetos a la vez —E, G, H, I y J comparten aleación—, que es lo que
   hay que querer: si cada boceto llevara su metal, la comparación sería de
   color y no de marco. En la I además mueve MÁS carta que en los otros: allí
   el metal no es solo el
   filete, es también la página entera sobre la que se apoyan las franjas. Y en
   la J el selector NO mueve el borde: el mat negro es card-sketch("void") fijo,
   ajeno a la aleación, exactamente como en Magic el borde es siempre negro
   pase lo que pase con el color de la carta.

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
  // que bastar con añadirlo a SKETCHES. Hoy la lista tiene cinco.
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
      <p className="mb-4 max-w-3xl rounded-md border border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] px-4 py-3 text-sm text-[var(--wiki-text)]">
        <b>J · Orla es el diseño final</b>, elegido el 25 de agosto de 2026. Se ve
        construido sobre el roster real, raza por raza, en{" "}
        <Link href="/docs/v3/cards/deck" className="underline">
          Cartas › Diseño baraja
        </Link>
        . Esta página se queda tal cual, como lo que ya era antes de decidirlo:
        el archivo donde se compararon los nueve bocetos, para el día que haga
        falta volver a abrir la pregunta del marco.
      </p>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El <b>marco</b> de la carta de V3 — el objeto, no la ilustración que va dentro. La
        pregunta que contesta un boceto es dónde caen los <b>13 datos</b> de una carta de unidad.
        De la primera tanda —cinco, salidos del análisis de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        — quedó <b>la E · Forja</b>; los otros cuatro están borrados y lo que enseñó cada uno
        sigue escrito en el concepto. Al lado está la <b>G · Estandarte</b> <i>(24 de agosto)</i>,
        que sale de cruzar la E con la <b>F · Blasón</b> —la réplica de una referencia,{" "}
        <i>Might &amp; Magic: Fates</i>, montada para llevarle la contraria a la E en las cuatro
        cosas que daba por cerradas—. De la réplica se queda <b>el octógono</b>, la jerarquía de
        los ocho números y el Tier escrito en el disco; de la E, la <b>veta</b> encendida por
        dentro del metal, así que el canto teñido desaparece. Encima talla el rombo de la Rareza,
        junta las seis Habilidades del panel en una sola fila y cuelga del disco del Tier un{" "}
        <b>estandarte con el emblema de la raza</b> — la ficha que la referencia dedica a la
        facción y que la réplica había dejado en blanco. Con eso la <b>F se quedó sin nada propio
        que enseñar y está borrada</b>: lo que discutió sigue en el concepto.
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
        <b>Nada de esto está decidido.</b> Lo único inventado son los números de las Habilidades
        (los reales siguen pendientes en razas.md); ahí solo importa su forma, si tienen una, dos
        o tres cifras. La Rareza de las unidades va por tier a falta de una regla; los héroes no
        entran en esa escala y tienen <b>raíl propio</b>, en rojo sangre. De las ocho unidades{" "}
        <b>cuatro tienen ya arte propio de V3</b> —🗡️ Miliciano, 🏹 Arquero, 🛡️ Caballero y
        🔮 Mago, media progresión y los cuatro en el mismo camino con el mismo castillo al
        fondo—, así que el relleno prestado de las cartas de clase de v2 <b>ya no está</b>: no
        queda una sola imagen del juego anterior en esta página. Las otras cuatro caen al emoji,
        que sigue siendo lo normal y también hay que verlo.
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
        {/* La probeta de metal. Vale para los cinco bocetos porque en los
            cinco el metal NO lleva la rareza: si el marco fuera la rareza
            —como en la D—, cambiarle el tono sería cambiar de boceto y no de
            material. En la J solo mueve el ANILLO de dentro, nunca el borde
            negro que lo rodea —ese es fijo, como en Magic.
            Y es la misma aleación para todos a propósito: así se comparan con
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
        <h2 className="mb-2 text-lg font-semibold">Qué falta decidir (cerrado: J · Orla)</h2>
        <p className="mb-3 text-[var(--wiki-muted)]">
          Todo lo de aquí abajo está contestado — J hereda las respuestas de la H y
          responde por su cuenta la única pregunta que quedaba, si la carta es un
          rectángulo. La lista se queda entera, sin tocar una línea: es el registro
          de <i>cómo</i> se llegó ahí, no de qué falta.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-[var(--wiki-muted)]">
          <li>
            <b>Si la ilustración va a sangre o en una ventana</b>, que es lo más gordo que hay en
            esta página y lo más nuevo. Los ocho bocetos anteriores dan por hecho que la carta{" "}
            <i>es</i> su ilustración y que los datos flotan encima: raíl sobre el arte, disco en la
            esquina, placa traslúcida al pie. La <b>I</b> hace lo que la carta de Magic —la carta
            es una <b>página</b> de franjas apiladas y el arte va metido en una ventana hundida,{" "}
            <b>sin un solo dato encima</b>—. Y no es una preferencia: el 25 de agosto se midió que
            el panel de la H le corta las piernas al 🗡️ Miliciano, y ese problema{" "}
            <b>no tiene arreglo mientras el arte sea el fondo</b>, porque siempre habrá algo
            encima. El precio también está medido: la ventana se queda con el <b>52%</b> del
            interior, así que una ilustración vertical 5:7 pierde alrededor del{" "}
            <b>38% del alto</b>. Y aquí conviene saber <i>qué</i> 38%, porque de no mirarlo salió
            una conclusión equivocada que estuvo un día en pie: la ventana enseña la banda que va
            del <b>9,8% al 72,1%</b> del alto de la fuente, que es <b>exactamente</b> la que la
            norma de encuadre reserva para la figura. <b>Lo que tira es aire, no sujeto</b>, y el
            mismo archivo vertical vale para los cuatro bocetos. Así que si una carta sale cortada
            por el muslo aquí, el que no cumple la norma es el archivo — y hoy no la cumplen siete
            de los ocho.
          </li>
          <li>
            <b>Si la carta aguanta un bloque de papel dentro.</b> Ocho bocetos de oscuro sobre
            oscuro —velo, cristal ahumado, metal— y el valor no se ha invertido nunca. La caja de
            datos de la <b>I</b> es <b>vitela</b>, y con ella se ven dos cosas de golpe: las ocho
            cifras en tinta negra se leen mejor que en ninguna otra carta, y los emoji de
            Característica pasan la prueba <i>por los pelos</i> gracias a su contorno negro —los
            casos malos son 💀 y 🧊, míralos en el 🐉 Dragón esquelético—. Es el hilo que el
            concepto lleva abierto desde la E: un emoji no acepta color y necesita un papel detrás
            que le vaya bien. Y trae su propio coste, que también se ve sin buscarlo: con{" "}
            <b>cero</b> Características el cajón se queda medio vacío (el 🗡️ Miliciano). En Magic
            ese hueco lo llena el texto de ambientación; V3 no tiene texto de ambientación.
          </li>
          <li>
            <b>Si la carta es un rectángulo.</b> Los cinco bocetos de la primera tanda no lo
            preguntaron nunca: los cinco son la misma caja redondeada con distinta piel. La
            réplica de la referencia lo cortó —un <b>octógono</b>, con las cuatro esquinas a 45° y
            un roblón en cada corte— y la <b>G</b> se quedó esa silueta, así que la pregunta está
            en pantalla: <b>rectángulo (E) contra octógono (G)</b>. No es una piel, es lo primero
            que se reconoce de una carta a distancia de mesa. El precio se ve en el propio marco:
            cada esquina cortada es sitio que se pierde. Cambia también la producción: una carta
            impresa con las esquinas cortadas es un troquel, no un corte recto.
            <br />
            Y ahora la pregunta está casi limpia, que antes no lo estaba en absoluto: la <b>H</b>{" "}
            es el octógono con las ocho juntas y del mismo cuerpo que la E, así que{" "}
            <b>E contra H</b> ya no arrastra la jerarquía. Queda una diferencia y conviene saberla
            al mirar: la H abre su fila por ⚔️ Ataque y la E por ❤️ Vida.
            <br />
            Y la <b>J</b> añade un tercer término que la pregunta no tenía: ni redondeado sin más
            (E) ni cortado de verdad (G, H), sino cortado <i>solo a la vista</i>. Detrás de un mat
            negro vive una H adaptada, no calcada: mismo octógono, misma idea de veta encendida,
            pero con un <b>anillo propio</b> —OrlaFrame— mucho más fino que el filete de la G/H y
            sin cantoneras ni roblones. La primera versión de este boceto se quedó con el filete de
            la H tal cual, y el mismo día se corrigió: una cantonera remachada dice «esto es
            blindaje atornillado al canto», y ese mensaje solo se sostiene mientras el octógono ES
            el canto. Aquí ya no lo es —vive dentro de un borde negro— así que el herraje se quitó
            en vez de encogerse. El octógono se sigue leyendo porque lo traza el{" "}
            <b>contraste</b> entre el negro del mat y el metal encendido de dentro, no un recorte
            físico. La carta vuelve a cortarse recta, como la E, así que la objeción de imprenta
            que arrastran F, G y H desde que el troquel entró en la página deja de tener con qué
            discutir: no hace falta troquel donde no hay nada que cortar. El precio sigue siendo
            nuevo entre los nueve bocetos —la carta <b>crece</b>, 300×420 pasan a 316×436—, pero
            bastante menos que en la primera versión (330×450): el mat se adelgazó con el anillo,
            no por separado.
          </li>
          <li>
            <b>Si los ocho números van todos iguales.</b> La <b>E</b> dice que sí —misma fila,
            mismo cuerpo, mismo peso—, y la ventaja es que la carta no elige por ti. La <b>G</b>{" "}
            dice que no: ⚔️ Ataque y ❤️ Vida se van a las esquinas de abajo en pines con forma
            propia y a mayor tamaño, y los otros seis se quedan juntos en el panel. Es lo que el
            concepto B señalaba como digno de robar y ningún boceto dibujó hasta la réplica.
            Decide si la carta debe decir <i>cuáles</i> se consultan en cada golpe, o si eso es
            una decisión de reglas que el marco no tiene por qué congelar.
            <br />
            Aquí también hay ya una comparación limpia, y es la otra mitad de la anterior: la{" "}
            <b>H</b> es la G con las ocho juntas y todo lo demás igual, así que{" "}
            <b>G contra H</b> juzga la jerarquía sola. Fíjate en lo que se lleva por delante al
            deshacerla: el panel pierde la franja de 48px que reservaba para los pines, la línea de
            raza vuelve al flujo y la ilustración se queda con ese sitio.
          </li>
          <li>
            <b>Si algo de la carta puede salirse del contorno.</b> En la <b>G</b> el disco del Tier
            monta sobre el chaflán y lo desborda, y lo que la hace parecer un <i>sello colgado</i>{" "}
            y no un botón dibujado es justamente que no cabe. La <b>H</b> lo mete dentro, con el
            estandarte detrás. Tres cosas que se ven al cambiarlo, y ninguna es de gusto: (1) la
            carta ya se puede <b>recortar por su octógono</b> sin cortar un número, que es la mitad
            de la objeción de imprenta que arrastra esta silueta; (2) el aro de ocho lados da la
            vuelta <b>entero</b>, porque la bandera ya no le cruza el canal por arriba; y (3) las
            dos piezas pasan a apoyarse <b>sobre la ilustración</b>, que es sitio que antes no
            gastaban — míralo en los tres héroes, que son los únicos con arte de verdad, y decide
            si el sello valía lo que costaba. En la misma dirección, el disco de la <b>H</b>{" "}
            pierde el <b>aro de oro</b> que lleva el de la G: el oro era el remate que lo hacía
            moneda, y dentro del marco repetía el oro del rótulo y del rombo sin ser el importante
            de los tres. Compara los dos discos en el 🐉 Dragón dorado, donde además la veta ya es
            dorada.
          </li>
          <li>
            <b>Si el icono va encima del número o al lado</b>, y ya con la respuesta. El esqueleto
            tenía escrito que el apilado <i>era</i> la pieza —en fila, icono y cifra dejan de
            leerse como un par—, y se escribió con ocho en una fila de 33px. La réplica lo probó
            en las otras condiciones: seis en tres columnas de ~85px, con el icono al lado, y ahí
            el par aguanta. La <b>G</b> los junta en una fila de seis, o sea ~41px por columna, y
            a esa anchura el par en línea ocupa 39 de los 41 — dos vecinos se tocan y la fila se
            lee como una tapia, así que vuelven a apilarse. <b>La regla era de la anchura, no de
            la pieza</b>: por debajo de unos 60px hay que apilar, por encima se puede elegir.
          </li>
          <li>
            <b>Si el Tier se escribe o se enseña</b>, ya con las dos respuestas dibujadas. La{" "}
            <b>E</b> no lo escribe en ningún sitio y paga que solo puede decir de qué{" "}
            <i>clase</i> de tier es (cinco escalones para ocho tiers: el Miliciano y el Arquero son
            la misma carta gris). La <b>G</b> lo escribe en número, en el disco de la esquina —que
            es lo que la referencia hace con el coste—. Una enseña y la otra escribe; es la misma
            pregunta que la del subtítulo, pero ahora se puede mirar en vez de discutirse.
          </li>
          <li>
            <b>Si la carta puede decir la raza dos veces.</b> Bajo el disco de coste de la
            referencia cuelga un <b>banderín de facción</b>, y la réplica lo dejó fuera: esa carta
            tiene <b>dos</b> taxonomías —la facción (Academy) y el tipo de criatura (WIZARD)— y V3
            solo tiene una. La <b>G</b> lo dibuja de todas formas y le pone lo único que hay, la{" "}
            <b>raza</b>, que ya está escrita en versalitas al pie: 👤 arriba y «HUMANOS» abajo, el
            mismo dato dos veces y de dos maneras. Está así a propósito, porque es la única forma
            de mirar juntas en una misma carta las dos respuestas que hasta ahora venían por
            separado —emblema sin texto (E) y texto sin emblema (la réplica)— y quedarse con una.
            Míralo en el 🐉 Dragón esquelético, que es el único que no es de Humanos: 💀 y
            «NO-MUERTOS». Y si sobra el estandarte, lo que queda pendiente es el hueco: media
            docena de fichas de una referencia existen porque su juego tiene un eje que el nuestro
            no tiene.
          </li>
          <li>
            <b>Dónde vive la Rareza.</b> Los cinco bocetos comparten una respuesta —una{" "}
            <b>veta</b> de luz entre los dos raíles del filete, más el baño que derrama sobre lo
            que haya dentro: la carta no está teñida, está encendida—, y eso es lo que hace que
            sirvan para comparar la <i>forma</i> y no el color. La <b>I</b> añade una segunda, y
            es la de la referencia: un <b>sello</b> de 12px al final de la línea de tipo, que es
            donde Magic pone su símbolo de colección — un glifo cuyo <i>color</i> es literalmente
            la rareza. Están los dos puestos a propósito, así que hay que decidir: la G le dedica
            una piedra tallada de 16px a caballo del canto y la I un rombo plano dentro de un
            renglón. O sobra el sello, o sobra la piedra. La respuesta contraria se probó y está
            borrada: la réplica sacaba el color al <i>canto</i>, un filete duro de 2,2px alrededor
            del octógono entero, y de ahí quedó apuntado que <b>el filete se lee antes que la
            veta</b>, no por sutileza sino por área. Encendido contra acuñado, y esa parte de la
            discusión ya no está en pantalla. Lo que sí se puede mirar es <b>cómo</b> se enseña la
            veta: la <b>E</b> la corta en <b>cuatro tramos</b> con sus cantoneras —metal encendido
            entre chapas— y la <b>G</b> no lleva escuadras, solo el roblón del chaflán, así que el
            canal se cierra en un <b>aro continuo</b> de ocho lados. Si la luz tiene que parecer
            una pieza de metal caliente o un contorno encendido. La otra vía, teñir el marco
            entero de la aleación de la rareza, ya se probó y se descartó (mezcla D): se reconoce
            antes en una mano, pero convierte el marco en cinco piezas distintas y le roba la
            carta a la ilustración. Mira el Miliciano (común) junto al Dragón dorado (legendaria)
            con «Todo junto» en los cinco bocetos. La <b>J</b> hereda la IDEA de la veta —un canal
            de luz entre dos raíles que dice la Rareza— pero no el filete que la dibuja:{" "}
            <code>OrlaFrame</code> es un marco propio, más fino que <code>EstandarteFrame</code> y
            sin cantoneras ni roblones, porque esos herrajes decían «esto es blindaje atornillado
            al canto» y aquí el canto ya no es el octógono, es el borde negro de fuera. Y le suma
            un efecto que ningún boceto anterior tenía dónde enseñar: el resplandor de la Rareza
            (<code>drop-shadow(var(--rarity-soft))</code> de <code>octagon-shell</code>) ya no se
            pierde contra el fondo de la página, se derrama sobre el negro del propio mat. El tier
            se ve arder por debajo del marco antes de leer un número.
          </li>
          <li>
            <b>Cuánto detalle aguanta una pieza pequeña.</b> El rombo de la Rareza de la <b>G</b>{" "}
            es una <b>piedra tallada</b> de 16px: engaste de metal, cuatro facetas que se cortan
            en la mitad y una tabla con su destello. Se probó antes plano —una cara de color
            girada 45°, a 15px— y a esa medida la talla no cabía: la tabla se quedaba en dos
            píxeles y medio. Subió a 20px para que cupiera y volvió a 16 sin perderla, porque los
            dos cortes de dentro dejaron de ir en píxeles clavados y ahora son fracciones de la
            piedra: encogen con ella. Ahí está media respuesta —<b>la talla cabe si va en
            proporción</b>—; la otra media la da el medallón del raíl, donde lo pequeño no era el
            tallado sino la <i>silueta</i>, y esa no cupo de ninguna manera. A tamaño de pantalla
            la talla se ve; la pregunta que queda es si se vería en una carta impresa de 63mm, o
            si a ese tamaño las facetas se emborronan y lo único que queda es una mancha más sucia
            que la plana. Es la misma pregunta que hay que hacerle a los roblones y al bocel del
            marco.
          </li>
          <li>
            <b>Si el raíl de Características se lleva bien con un marco con herrajes.</b> El raíl
            va sobre el arte, y con las cantoneras en las esquinas tiene que arrancar más abajo
            para no meterse debajo de una. Míralo en el 🐉 Dragón esquelético, que trae cinco. En
            la <b>G</b> además cambia de lado: se va a la derecha, porque la esquina izquierda se
            la llevan el disco del Tier y el estandarte que cuelga de él. Sus medallones probaron a
            repetir el octógono de la carta en pequeño y <b>volvieron a ser redondos</b>, que es lo
            que hay en pantalla: a 30px el chaflán son dos píxeles por esquina y el eco no llegaba
            a leerse. Y de ahí siguió adelgazando hasta el final: primero el aro se quedó en la
            mitad y después <b>se fue la chapa entera</b>, así que hoy el glifo de la <b>G</b> va{" "}
            <b>desnudo</b> sobre la ilustración, más grande, y lo único que lo despega es el
            drop-shadow del raíl — que sin caja recorta la silueta del emoji en vez de un círculo.
            Contra el remache de la <b>E</b>, que sigue siendo una pieza atornillada, es la
            comparación limpia entre <i>ficha</i> y <i>marca</i>. Míralas una debajo de otra en el
            🐉 Dragón esquelético.
            <br />Y ahora hay una tercera respuesta que no es ni una ni otra: la <b>I</b>{" "}
            <b>no tiene raíl</b>. Sus Características bajan de la ilustración a la caja de datos,
            en una fila bajo el filete, así que dejan de gastar arte y pasan a gastar papel. Ahí se
            invierte el caso bueno del raíl: con cero Características el raíl deja <i>arte</i>{" "}
            —que es la razón por la que ganó— y la caja deja <b>hueco en blanco</b>.
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
            uno que valga a ese tamaño. Lo contrario es escribir «HUMANOS» en versalitas al pie,
            que es lo que la referencia hace con el tipo de criatura: cuesta una línea y no
            depende de ningún catálogo de iconos. La <b>G</b> pone las dos a la vez —emblema en el
            estandarte y texto al pie— para poder compararlas en la misma carta; el punto está
            arriba, en «si la carta puede decir la raza dos veces».
          </li>
          <li>
            <b>Qué pone en el hueco del Tier una carta de héroe.</b> Un héroe no tiene tier y no
            tiene nada que lo sustituya: V3 no tiene progresión de personaje, así que no hay ningún
            número en camino para ese sitio. La <b>E</b> disuelve el problema —el medallón lleva la
            raza, no un número— pero a cambio deja de decir «Héroe» con palabras y lo fía todo al
            rojo de la veta. La <b>G</b> sí reserva el sitio, así que tiene que rellenarlo: pone
            una 👑, que es la respuesta que ya daba la mezcla D — y la <b>H</b> la hereda, porque
            mover el disco dentro del marco no cambia que el sitio siga reservado, y la <b>J</b>{" "}
            hereda la de la H sin cambiar nada, solo con un mat negro alrededor. Mira el
            ⚔️ Guerrero entre las ocho unidades en los cinco y decide si se reconoce solo. La{" "}
            <b>I</b> hereda la corona igual, pero con una diferencia que conviene ver: allí el
            hueco es el <b>bisel del coste de maná</b> de la referencia, o sea el sitio con más
            peso de toda su carta, y una 👑 puesta ahí dice «héroe» más alto que en la esquina.
          </li>
          <li>
            <b>Si el rojo es el color de los héroes.</b> No entran en la escala de rareza, así que
            tienen raíl propio: la <b>sangre</b> del tema de producción, que además es el único
            hueco de color que quedaba —ninguna de las cinco rarezas es roja—. Eso los convierte
            en las únicas cartas con la veta encendida en rojo, y se reconocen de un vistazo entre
            las unidades. Lo único que queda por decidir es si ese rojo se comparte con algo más
            (en v2 lo tenía la carta de Enemigo). Todos los héroes van iguales, porque no hay
            ningún número que los ordene entre sí. <b>La G le ha encontrado un roce</b>: su pin de
            ❤️ Vida es una gema roja —de la referencia— y en una carta de héroe acaba a juego con
            la veta encendida del marco, que además baña la ilustración entera. Se vio primero en
            la réplica, donde el rojo del marco era un filete de 2,2px; aquí es media carta, así
            que se ve bastante peor. O el héroe cambia de color, o la Vida no puede ser roja.
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
            tiene que ser metálico siquiera. El selector mueve <b>los cinco bocetos a la vez</b>:
            comparten aleación para que lo que se compare sea el marco y no el color. En la G hay
            una cosa más que mirar, el <b>estandarte</b>, que necesita cara clara para que el
            emblema se lea — en carbón o pavonado el 👤 se pierde, y es el mismo reparo que el
            medallón de la E. Y la <b>I</b> es la que más pone en juego con este selector, porque
            allí el metal no es un filete: es la <b>página entera</b>, la mitad de la superficie de
            la carta. Un marfil o una plata la convierten en una lámina clara con una foto pegada,
            y un carbón la acercan a las otras tres. Si hay una aleación que solo funciona en la I,
            o una que solo funciona en las otras, se va a ver aquí. La <b>J</b> no añade una
            cuarta cosa que mirar: su anillo es más fino que el de la H pero es el mismo material
            —peltre, cobre, lo que se elija—, y lo único que la aleación NUNCA toca es el mat negro
            que lo rodea — ahí está la comparación que sí es suya, la de un marco que cambia de
            metal contra un borde que no cambia nunca.
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
            <b>Y la G ha encontrado el límite del 300</b>: titula en <b>versalitas</b>, como la
            referencia, y una versal fina y pequeña no tiene trazo con el que sostenerse — ahí
            sube a 500. O la carta titula en fino y en caja mixta (E), o titula en versalitas y
            necesita peso (G); las dos a la vez, no.
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
            <b>El lienzo de la ilustración</b>, resuelto y comprobable a un clic. Cinco de los
            ocho archivos están ya en <b>vertical 5:7</b> y entran a sangre —⚔️ Guerrero, 🔮 Mago
            héroe y las unidades 🏹 Arquero, 🛡️ Caballero y 🔮 Mago—, mientras que ✝️ Sacerdote,
            🏹 Arquero héroe y 🗡️ Miliciano siguen <b>apaisados</b> y hay que tirarles media
            anchura, así que el personaje sale enorme y descentrado. Cambia de sujeto y la
            diferencia se ve sola. La medida está en <code>public/assets/v3/README.md</code>:{" "}
            <b>vertical 5:7 (1080×1512)</b>. Y <b>no depende del marco</b>, ni siquiera con la I
            en la mesa: su ventana enseña justo la banda que la norma reserva a la figura, así que
            el mismo archivo sirve para los cuatro bocetos.
            <br />
            <b>Donde de verdad falla el arte es en el ENCUADRE.</b> La norma pide{" "}
            <b>plano general con aire</b>, la figura entre el 12% y el <b>72%</b> del alto, con el
            cuarto de abajo libre para la banda del nombre. Puestas las guías, <b>siete de los
            ocho</b> ponen los pies entre el 78% y el 89%, así que la figura invade ese cuarto y
            el panel le come las piernas — en cualquier boceto. Y con la vuelta de tuerca
            incómoda: <b>los cinco de lienzo correcto son los cinco peores de encuadre</b>. El
            único que cumple es el ✝️ Sacerdote, y de rebote, porque su lienzo apaisado no da de
            sí para meter una figura más alta. Míralo en el 🛡️ Caballero, que está en 5:7 exacto:
            en la <b>H</b> el panel le tapa las botas y en la <b>I</b> la ventana lo corta por el
            muslo, y en los dos casos el que se sale de la norma es el archivo, no el marco. Ojo
            también: este marco se come <b>15px por cada lado</b>.
            <br />
            <b>Y las ocho ilustraciones son PROVISIONALES</b> <i>(26-ago-2026)</i>: el generador
            no está respetando la especificación, así que se van metiendo las que salen para que
            las cartas dejen de ser emojis y se puedan mirar de verdad. Nada de esto es{" "}
            <b>deuda que arreglar</b> —ni el lienzo de tres archivos ni el encuadre de siete—, y
            no hay que cuadrar nada a mano: ni recortes, ni <code>object-position</code> por
            sujeto. La tabla del README es la <b>lista de comprobación de la tanda buena</b>, no
            una lista de tareas. Con el marco ya decidido, lo único que hay que mirar aquí es que
            lo que se mete <i>no engañe</i>: si una carta se ve mal, saber si es del archivo o de
            la <b>J · Orla</b> — y con los pies al 86% cuando el tope son 72, hoy casi siempre es
            del archivo.
          </li>
        </ul>
      </section>
    </div>
  );
}
