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

   Hubo cinco bocetos y queda uno, la E · Forja: la comparación terminó y los
   cuatro anteriores se borraron. Lo que enseñó cada uno está en
   knowledge/v3/card-concept/README.md. Los que vengan se derivan de la E y se
   añaden en sketch-cards.tsx; mientras haya uno solo, la fila de pestañas no
   se pinta —una pestaña que no lleva a ningún sitio es ruido—.

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

/* Probeta de aleación del boceto E (TEMPORAL).
   El metal de la carta sale de un solo color, así que probarlo es cambiar ese
   color: el atributo data-alloy va al escenario y el @each de
   styles/components/card-sketch/_forja.scss hace el resto.

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
        Hubo <b>cinco</b> —tres salidos del análisis de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        , uno por referencia, y dos mezclas— y queda <b>uno</b>: la <b>E · Forja</b>. Los cuatro
        anteriores están borrados; lo que enseñó cada uno sigue escrito en el concepto, y lo que
        venga se deriva de esta.
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
        {/* La probeta de metal, que solo tiene sentido en un boceto cuyo metal
            NO lleve la rareza: si el marco fuera la rareza —como en la D—,
            cambiarle el tono sería cambiar de boceto y no de material. */}
        {view === "forja" && (
          <div className="flex flex-wrap items-center gap-2">
            {label("Aleación")}
            {ALLOYS.map(([id, name]) => (
              <button key={id} className={btn(alloy === id)} onClick={() => setAlloy(id)}>
                {name}
              </button>
            ))}
          </div>
        )}
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
            <b>Si una línea de luz basta para reconocer la rareza.</b> Es la apuesta grande de
            este marco y la única que no se puede comprobar con una carta sola: todas son del
            mismo peltre y el color queda reducido a una <b>veta</b> entre los dos raíles del
            filete, más el baño que derrama hacia dentro. La alternativa que se descartó era
            teñir el marco entero de la aleación de la rareza —se reconoce antes en una mano, pero
            convierte el marco en cinco piezas distintas y le roba la carta a la ilustración—.
            Mira el Miliciano (común) junto al Dragón dorado (legendaria) con «Todo junto» y
            decide si la luz llega.
          </li>
          <li>
            <b>Si el raíl de Características se lleva bien con un marco con herrajes.</b> El raíl
            va sobre el arte, y con las cantoneras en las esquinas tiene que arrancar más abajo
            para no meterse debajo de una. Míralo en el 🐉 Dragón esquelético, que trae cinco.
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
            <b>Si el Tier se puede no escribir.</b> Esta carta <b>no lo escribe en ningún
            sitio</b>: lo dice el color de la veta, y ahí está el precio — la escala agrupa los
            ocho tiers en cinco escalones, así que la carta dice de qué <i>clase</i> de tier es,
            no cuál. El Miliciano y el Arquero son la misma carta gris. O se acepta eso, o hacen
            falta ocho colores; escribirlo otra vez debajo del nombre es la tercera salida, y es
            la que se descartó.
          </li>
          <li>
            <b>Si un emblema puede sustituir al texto.</b> El medallón lleva el icono de la{" "}
            <b>raza</b>, y con eso la placa se queda sin subtítulo: bajo el nombre no hay nada
            escrito. Es lo que más aligera el pie, y su prueba está en el 🐉 Dragón esquelético
            junto a cualquier humano — 💀 contra 👤 y sin leer. El
            reparo: el emoji de Humanos es una silueta genérica, así que como emblema depende de
            que razas.md le dé uno que valga a ese tamaño.
          </li>
          <li>
            <b>Qué dice de un héroe una carta que no escribe el rango.</b> Un héroe no tiene
            tier: tiene nivel, y el nivel no está definido. Este marco disuelve el problema —el
            medallón lleva la raza, así que no hay ningún hueco esperando un número que un héroe
            no tiene— pero a cambio deja de decir «Héroe» con palabras y lo fía todo al rojo de
            la veta. Mira el ⚔️ Guerrero entre las ocho unidades y decide si se reconoce solo.
          </li>
          <li>
            <b>Si el rojo es el color de los héroes.</b> No entran en la escala de rareza, así que
            tienen raíl propio: la <b>sangre</b> del tema de producción, que además es el único
            hueco de color que quedaba —ninguna de las cinco rarezas es roja—. Eso los convierte
            en las únicas cartas con la veta encendida en rojo, y se reconocen de un vistazo entre
            las unidades. Lo que hay que decidir es si ese rojo se comparte con
            algo más (en v2 lo tenía la carta de Enemigo) y si todos los héroes van iguales o el
            nivel los diferencia cuando exista.
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
            tiene que ser metálico siquiera.
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
            se leen como un solo bloque. Las cartas de v2 no se tocan.
          </li>
          <li>
            <b>Dos Características distintas con el mismo emoji.</b> El ⚔️ Guerrero lleva
            🛡️ Resistente al daño físico y 🛡️ Último aliento, y como las Características se
            dibujan en glifo y sin texto, la carta enseña el mismo icono dos veces.
            No es del marco, es del catálogo de razas.md — pero se ve aquí.
          </li>
          <li>
            <b>El lienzo de la ilustración</b>, ya resuelto y visible aquí mismo: los tres héroes
            traen arte apaisado de ~1516×1038 y en un marco vertical hay que tirar la mitad de la
            anchura, así que el personaje sale enorme, descentrado y cortado por el muslo. Confirmó
            que <b>el 1536×1050 heredado de v2 no sirve</b>, y la medida ya está escrita en{" "}
            <code>public/assets/v3/README.md</code>: <b>vertical 5:7 (1080×1512), plano entero y
            figura centrada</b>, con el cuarto inferior reservado a la banda del nombre. No depende
            del marco —la carta es 300×420 con el arte a sangre—, así que los tres héroes se
            regeneran igual. Ojo: este marco se come <b>15px por cada lado</b>.
          </li>
        </ul>
      </section>
    </div>
  );
}
