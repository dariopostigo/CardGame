"use client";

import { useState } from "react";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { sketchFontVars } from "./sketch-fonts";
import SketchCard, { SKETCHES } from "./sketch-cards";
import { DECK_RACES } from "./races";
import { raceArtFor, type Subject } from "./sample";

// Los estilos viven en el árbol ITCSS: el esqueleto en
// styles/components/_card-sketch.scss y la carta en
// styles/components/card-sketch/ (el cuerpo y la lámina).

/* La carta de V3, dentro de la wiki. Una página, en `/docs/v3/cards/design`.
   Es el hermano del lab de v2 (components/design/CardDesignLab.tsx): aquel pinta
   el catálogo real leído de los .md, este pinta un roster escrito a mano
   (components/design/v3/races.ts) porque docs/v3/cards/ todavía no tiene tabla.

   ERAN DOS PÁGINAS Y SE FUNDIERON EL 3 DE SEPTIEMBRE DE 2026. "Diseño de cartas"
   comparaba bocetos sobre once sujetos de muestra y "Diseño baraja" pintaba el
   marco ya elegido sobre el roster real, raza por raza. Esa separación era la de
   una comparación y su resultado — y ese mismo día se cerró la comparación
   eligiendo la L · Lámina, así que dos páginas donde la única diferencia era
   «aquí se decide / aquí se aplica» pasaron a ser dos veces la misma carta con
   distintos sujetos delante. Se quedan las dos cosas en esta: **el roster
   completo** y, en un filtro, **los casos límite** que la muestra enseñaba.
   Componentes fundidos: CardSketchLab.tsx y CardDeck.tsx, borrados los dos.

   SE DIBUJARON DOCE BOCETOS Y QUEDA UNO. Fueron A · Rejilla, B · Gema, C · Losa,
   D · Blindada, E · Forja, F · Blasón, G · Estandarte, H · Recinto, I · Retablo,
   J · Orla, K · Moldura y L · Lámina, y la página llegó a enseñar cinco a la vez.
   El 22 de agosto se borraron los cuatro primeros; el 25 la F; el 1 de septiembre
   E, G, H e I, y el 3 la J —que fue el diseño elegido nueve días— y la K. Lo que
   enseñó cada uno está escrito en knowledge/v3/card-concept/README.md, que es
   donde vive el razonamiento; aquí solo vive lo que se dibuja.

   ESTA PÁGINA CRECE RAZA A RAZA, y el archivo que crece no es este: es races.ts.
   Una raza nueva son sus doce fichas allí y una línea en DECK_RACES — aquí no se
   toca nada. Hoy son cuatro razas y 48 cartas; con las once serán 132.

   SE BORRARON TRES MANDOS Y CONVIENE SABER POR QUÉ, porque los tres volverían a
   proponerse. El SELECTOR DE BOCETO se apaga solo, porque solo se pinta con más
   de una entrada en SKETCHES. La PROBETA DE ALEACIÓN, catorce metales, se fue el
   1 de septiembre: movía a los bocetos vectoriales cambiando un color y no tocaba
   a los otros, y un mando que mueve media página y deja la otra media quieta
   engaña más de lo que enseña — hoy además no habría a quién mover, porque esta
   carta no tiene banda de metal. Y la PROBETA DEL TIER duró unas horas el 2 de
   septiembre: seis variantes conmutables, y se fue el mismo día con su respuesta
   puesta, el canto encendido, porque un mando que ya tiene respuesta no es un
   mando. Lo que enseñó cada variante está en el README de card-concept §"Boceto L".

   Las dos fuentes que carga: Platypi para el nombre —la serif de titulación que
   entra en lugar de Cormorant, la serif de libro de las cartas de v2— y Oswald
   para los números, que es la condensada del tema de producción: un número de
   tres cifras en una cápsula de 34px necesita una condensada o no entra. */

/* La carta que se pinta. Se lee de SKETCHES y no se escribe el id a mano para
   que la ficha —de dónde sale y qué costó— salga del mismo sitio que el
   componente que la dibuja. Es la última de la lista por lo mismo de siempre: la
   viva es la última que se dibujó. */
const CARD = SKETCHES[SKETCHES.length - 1];

/* El filtro es un solo valor porque las opciones se excluyen. Las tandas se
   marcan con "@" para que no puedan chocar nunca con el nombre de una raza. */
const ALL_RACES = "@todas";
const LIMITS = "@limites";

/**
 * Los CASOS LÍMITE: las cartas que rompen algo, con lo que rompe cada una.
 *
 * Es lo único que la página de bocetos hacía y la baraja no. Aquella pintaba
 * once sujetos de muestra —la plantilla entera de la raza piloto— y su valor no
 * era la muestra: era que ahí estaban juntos el que no tiene Características y
 * el que tiene cinco. Con 48 cartas repartidas en cuatro razas esos casos están
 * todos, pero a doce cartas de distancia unos de otros; esta lista los junta.
 *
 * NO SON SUJETOS APARTE: son ids del roster, así que no hay una segunda copia de
 * ningún dato. Un id que deje de existir desaparece de la lista en silencio —lo
 * que no se quiere es que una página de la wiki reviente por una curación—, así
 * que si se renombra una ficha, hay que pasar por aquí.
 *
 * Y no están todos los que podrían: la lista es para MIRAR, así que cabe lo que
 * cabe en una pantalla. Un caso nuevo entra echando otro.
 */
const LIMIT_CASES: readonly { id: string; why: string }[] = [
  { id: "miliciano", why: "cero Características —el raíl vacío— y una 🍀 Suerte 0 impresa" },
  { id: "dragon-esqueletico", why: "cinco Características y dieciocho caracteres de nombre" },
  { id: "enanos-coloso-de-adamantita", why: "veinte caracteres, el rótulo más largo del juego" },
  { id: "demonios-balor", why: "cinco Características, dos de ellas con el mismo 🔥" },
  { id: "demonios-demonio-de-fuego", why: "🔥 Fuego y 🔥 Inmune al fuego, contiguas y opuestas" },
  { id: "heroe-guerrero", why: "un héroe no tiene tier: el disco pone 👑" },
  { id: "enanos-heroe-berserker", why: "🍀 Suerte de dos cifras, la única del juego" },
];

const ALL_SUBJECTS: readonly Subject[] = DECK_RACES.flatMap((r) => [...r.units, ...r.heroes]);

const LIMIT_SUBJECTS: readonly Subject[] = LIMIT_CASES.map(({ id }) =>
  ALL_SUBJECTS.find((s) => s.id === id),
).filter((s): s is Subject => s !== undefined);

export default function CardDesign() {
  const [race, setRace] = useState<string>(ALL_RACES);

  const shownRaces =
    race === ALL_RACES || race === LIMITS
      ? DECK_RACES
      : DECK_RACES.filter((r) => r.name === race);

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className={`sketch-lab ${sketchFontVars} ${gameFontVars}`}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño de cartas</h1>
      <p className="mb-4 max-w-3xl rounded-md border border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] px-4 py-3 text-sm text-[var(--wiki-text)]">
        <b>L · Lámina es el diseño definitivo de la carta</b>, elegido el{" "}
        <b>3 de septiembre de 2026</b> tras doce bocetos. Con él se borraron los dos que
        quedaban —la <b>J · Orla</b>, que era el elegido desde el 25 de agosto, y la{" "}
        <b>K · Moldura</b>— y esta página <b>absorbió a «Diseño baraja»</b>: eran una
        comparación y su resultado, y sin comparación que hacer sobraba la separación.
        Aquí está <b>la baraja entera</b>, y cualquier arreglo de la carta se hace ya
        sobre esta, no eligiendo otra.
      </p>

      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        La <b>carta</b> de V3 como objeto — no la ilustración que va dentro. La pregunta que
        contesta un boceto es dónde caen los <b>13 datos</b> de una carta de unidad, y los doce
        la fueron cerrando pieza a pieza: primero el <b>reparto</b> —disco del Tier en la
        esquina, estandarte de raza colgando de él, las ocho Habilidades en una fila, placa al
        pie—, que quedó fijado con la fusión de la G y la H y no ha vuelto a discutirse; y al
        final <b>el borde</b>, que era la única variable abierta y tenía tres valores: trazado
        por el navegador (J), traído dibujado en un archivo (K) o <b>ninguno</b> (L). Ganó el
        tercero. Lo que enseñó cada boceto sigue escrito en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/card-concept/
        </code>
        , que es donde vive el razonamiento.
      </p>

      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Lo que se pinta es el <b>roster real</b> del juego, raza por raza, y la página{" "}
        <b>crece con él</b>: hoy <b>👤 Humanos</b>, <b>⛏️ Enanos</b>, <b>💀 No-muertos</b> y{" "}
        <b>🔥 Demonios infernales</b> — cuatro de las cinco razas base de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/races-concept/razas.md
        </code>
        , <b>48 cartas</b>; con las once serán 132. Falta 🧝 Elfos para cerrar las bases; las
        seis de DLC quedan fuera hasta que estas sean jugables. Nombres, tipo de daño y
        Características salen de razas.md tal cual.
      </p>

      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        <b>Los números no están decididos.</b> Los valores de las 8 Habilidades son{" "}
        <b>inventados</b> —con la forma real, dentro de la escala cerrada y con el sesgo de cada
        raza, pero sin decidir—, y de ellos aquí solo importa su <i>forma</i>: si tienen una, dos
        o tres cifras. La Rareza de las unidades va por tier a falta de una regla; los héroes no
        entran en esa escala y tienen <b>raíl propio</b>, en rojo sangre. Y las{" "}
        <b>ilustraciones son provisionales</b> <i>(26-ago-2026)</i>: hay veinticuatro archivos
        —👤 Humanos y ⛏️ Enanos enteras—, las otras dos razas van a emoji, y de los veinticuatro{" "}
        <b>veintitrés fallan el encuadre</b>, con los pies entre el 77% y el 91% del alto cuando
        la norma pide 72. No es deuda que cuadrar a mano: la tabla de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          public/assets/v3/README.md
        </code>{" "}
        es la lista de comprobación de la tanda buena. Lo único que hay que saber mirando esta
        página es <i>si una carta se ve mal por el archivo o por la carta</i> — y hoy casi
        siempre es por el archivo.
      </p>

      {/* La ficha de la carta: de dónde sale y qué costó. Va plegada y no
          suelta en la página porque son dos mil caracteres que ya no deciden
          nada — es el registro de la elección, no lo que hay que leer para
          mirar la baraja. Antes iba abierta, y podía: entonces la página
          comparaba tres y esto era el argumento de cada una. */}
      <details className="mb-5 max-w-3xl rounded-md border border-[var(--wiki-border)] bg-[var(--wiki-surface-2)] px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-[var(--wiki-text)]">
          La ficha del diseño elegido — {CARD.label}
        </summary>
        <p className="mt-3 text-xs leading-relaxed text-[var(--wiki-muted)]">
          <b>{CARD.source}.</b> {CARD.bet}
        </p>
      </details>

      {/* El único control de la página, y con cuatro razas ya es la única forma
          de mirarla: 48 cartas en "Todas" contra doce por raza.

          «Casos límite» no es una raza sexta: es una CURACIÓN sobre el mismo
          roster (LIMIT_CASES, arriba), y es lo que se salvó de la página de
          bocetos al fundirla aquí. Aquella pintaba once sujetos de muestra para
          juzgar un marco; con el marco elegido lo que sigue haciendo falta no
          son los once, son los siete que rompen algo. */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
          Raza
        </span>
        <button className={btn(race === ALL_RACES)} onClick={() => setRace(ALL_RACES)}>
          Todas
        </button>
        {/* El emblema del filtro es el mismo PNG que lleva la carta desde el 27
            de agosto de 2026, no el emoji. Aquí sí hace falta dimensionarlo a
            mano —no hay escalón de tipografía que heredar, es cromo de
            laboratorio— y de ahí el tamaño en clase de Tailwind en vez del
            factor en `em` que usa la carta. El emoji sigue en DECK_RACES de
            respaldo: si una raza entra sin archivo, este botón lo enseña. */}
        {DECK_RACES.map((r) => {
          const art = raceArtFor(r.name);
          return (
            <button key={r.name} className={btn(race === r.name)} onClick={() => setRace(r.name)}>
              {art ? (
                <img src={art} alt="" aria-hidden="true" className="mr-1 inline-block h-4 w-4 align-[-0.2em] object-contain" />
              ) : (
                `${r.icon} `
              )}
              {r.name}
            </button>
          );
        })}
        <button className={btn(race === LIMITS)} onClick={() => setRace(LIMITS)}>
          ⚠️ Casos límite
        </button>
      </div>

      {/* Escenario. Mismo objeto que el lab de v2 (objects/_stage.scss); el
          fondo oscuro lo pone .sketch-lab. No hay ningún mando que cambie la
          carta, y eso es lo correcto: esta es la página donde se mira tal cual
          va a ser. */}
      <div className="card-lab__stage">
        {race === LIMITS ? (
          <section>
            <h2 className="mb-2 text-center text-lg font-semibold text-[var(--wiki-text)]">
              Casos límite
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-xs text-[var(--wiki-muted)]">
              Las cartas del roster que rompen algo, juntas. En orden:{" "}
              {LIMIT_CASES.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && " · "}
                  {c.why}
                </span>
              ))}
              .
            </p>
            <div className="card-lab__grid">
              {LIMIT_SUBJECTS.map((s) => (
                <SketchCard key={s.id} id={CARD.id} subject={s} />
              ))}
            </div>
          </section>
        ) : (
          shownRaces.map((r) => (
            <section key={r.name} className="mb-10 last:mb-0">
              <h2 className="mb-5 text-center text-lg font-semibold text-[var(--wiki-text)]">
                {r.icon} {r.name}
              </h2>

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                Unidades
              </h3>
              <div className="card-lab__grid mb-8">
                {r.units.map((s) => (
                  <SketchCard key={s.id} id={CARD.id} subject={s} />
                ))}
              </div>

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                Héroes
              </h3>
              <div className="card-lab__grid">
                {r.heroes.map((s) => (
                  <SketchCard key={s.id} id={CARD.id} subject={s} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Lo que sigue abierto de la carta. Va en la página y no solo en el
          documento porque tres de los cuatro se ven AQUÍ, con las cartas
          delante. Y tiene un segundo trabajo, más callado: frenar las
          propuestas que ya se descartaron una vez.

          SE LLAMABA "QUÉ QUEDA POR MIRAR" Y EL TÍTULO ERA EL PROBLEMA. Lo dijo
          Dario el 3 de septiembre de 2026: sonaba a tarea pendiente que hay que
          despachar para dar el apartado por terminado. Y tenía media razón, que
          es lo que hizo falta averiguar: bajo un solo título convivían cuatro
          clases de cosa —decisiones suyas, algo bloqueado por lo que no existe,
          tareas de otro archivo y avisos que no se cierran nunca—, y «mirar»
          no nombra el resultado de ninguna. Su respuesta no fue renombrar sino
          RESOLVER, así que primero se cerraron las que se podían cerrar y el
          título se puso al final, cuando ya se sabía qué quedaba. Por eso cada
          punto empieza declarando a qué espera: es lo único que impide que la
          lista vuelva a mezclar cuatro cosas.

          LA LISTA HA PERDIDO ONCE PUNTOS Y NO SE HA PERDIDO NADA. Eran quince,
          de la silueta a la jerarquía de los ocho. Se fueron en cinco tandas:
          el 1 de septiembre de 2026 con E, G, H e I —un punto que dice «compara
          la E con la H» son instrucciones que nadie puede seguir—; el 3 al
          elegir la L, los tres que comparaban bordes y el del rombo tallado,
          que era una pieza de la J; ese mismo día los tres que eran REGISTRO DE
          UNA DECISIÓN y no pregunta —el marco, el Tier en el canto, el tipo de
          daño en el icono del Ataque—, que ya estaban escritos en
          knowledge/v3/card-concept/README.md; los tres que Dario cerró
          contestándolos —los ceros, el disco del héroe y la raza dos veces—; y
          el último, EL ROJO DE LOS HÉROES. Están todos en ese mismo README,
          cada uno pegado a la entrada que los preguntaba, con lo que perdía
          cada alternativa.

          EL ROJO SE FUE POR UNA RAZÓN QUE CONVIENE NO OLVIDAR: estaba escrito
          como "parado hasta que exista el catálogo de cartas", y no lo estaba.
          Lo que hacía falta no era el catálogo sino decir QUÉ dice el raíl de
          color, y eso se podía preguntar sin una sola carta escrita. Un punto
          etiquetado como bloqueado puede estar solo mal planteado: la prueba es
          buscarle la pregunta que no necesita lo que falta.

          Y EL DEL RAÍL DE GLIFOS CAMBIÓ DE FAMILIA, no de contenido. Mandaba
          "repartir emojis en razas.md" y eso era falso por dos sitios: el 🔥 lo
          comparten A PROPÓSITO desde la auditoría de icon-concept/icons.md §3
          —el glifo dice que van del mismo tema y lo que falta es el aro del
          papel—, y el 💀 y el 🗡️ los deshace el DIBUJO, no el catálogo, porque
          la colisión la fabrica el emoji: es lo único que no se puede dibujar
          distinto, así que obliga a dos conceptos vecinos a verse idénticos
          (Dario, 3 de septiembre: «los emojis son provisionales, ya se
          generarán otros donde se diferencien mejor»). Ahora espera a los
          iconos, igual que el encuadre espera a las ilustraciones.

          Y uno se fue por estar mal etiquetado: "cuántas Características
          aguanta" no era una pregunta, era un hecho —son cinco y la carta está
          montada para cinco—, y vive donde se cuentan los datos de la carta
          (§"Contra qué se juzgan"). */}
      <section className="mt-8 max-w-3xl text-sm text-[var(--wiki-text)]">
        <h2 className="mb-2 text-lg font-semibold">Lo que sigue abierto</h2>
        <p className="mb-3 text-[var(--wiki-muted)]">
          <b>Nada de esto bloquea la baraja</b>, y ninguno es trabajo de código. Quedan{" "}
          <b>cuatro</b> cosas y cada una espera algo distinto, así que cada punto empieza
          diciendo <i>a qué</i> espera: una se contesta mirando esta página, dos esperan a que
          se dibuje algo —los iconos de verdad y la tanda de ilustraciones—, y la última no se
          cierra nunca porque es memoria.
        </p>
        <p className="mb-3 text-[var(--wiki-muted)]">
          <b>El 3 de septiembre de 2026 se cerraron cuatro</b>, y por eso ya no están abajo:
          los <b>ceros se imprimen</b> —un 0 es un dato y la fila mantiene sus ocho cápsulas en
          el mismo sitio—, el disco de un héroe pone una <b>👑</b> —el hueco se reserva, así
          que se rellena—, la carta <b>dice la raza dos veces a propósito</b>, que era el punto
          más viejo de la lista —no se borra ninguno de los dos huecos porque llegan{" "}
          <b>sub-facciones dentro de las razas</b> y van a dejar de decir lo mismo— y el{" "}
          <b>rojo no se comparte</b>: el raíl de color dice la Rareza y nada más, y el héroe es
          la única excepción porque no tiene tier del que sacar una. El porqué de las cuatro,
          con lo que perdía cada alternativa, está en{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
            knowledge/v3/card-concept/README.md
          </code>
          , que es donde vive el razonamiento — igual que el registro de <i>cómo</i> se llegó a
          esta carta, boceto por boceto.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-[var(--wiki-muted)]">
          <li>
            <i>Se contesta mirando esta página</i> — <b>si la Rareza se lee sin marco.</b> La J
            y la K la decían de dos maneras a la vez
            —una <b>veta</b> de luz por dentro del filete y el baño que derramaba sobre la
            ilustración—, y sin filete no hay veta ni piedra donde engastar el rombo. Quedan{" "}
            <b>tres</b> señales: el baño hacia dentro, el halo de fuera y el <b>canto
            encendido</b>, 2px del color del raíl en la línea donde el paspartú muere contra la
            ilustración. Mira el 🗡️ Miliciano (común) junto al 🐉 Dragón dorado (legendaria) y
            decide si la escala se lee de lejos. Y de paso <b>🔥 Demonios</b>, que es donde el
            sistema se pone a prueba por el otro lado: raíl de héroe <b>rojo</b> sobre un
            estandarte rojo sangre. Ese rojo ya no compite con nada más —desde el 3 de
            septiembre es de los héroes y de nadie más—, pero sí compite con la carta que hay
            debajo.
            <br />
            Dos cosas van anotadas y no se contestan mirando: en el raíl <b>común</b> el gris
            sobre negro se lee casi blanco —la carta más barata dice «tengo un canto» antes que
            decir de qué color es—, y si 2px aguantan a 63mm solo lo dice una <b>prueba
            impresa</b>. Y una vía muerta, porque se volverá a proponer: <b>teñir el paspartú
            entero</b> del color del raíl se descartó dos veces por lo mismo —el boceto D y la
            probeta del Tier—, que le roba la carta a la ilustración.
          </li>
          <li>
            <i>Esperando a los iconos de verdad</i> — <b>el raíl de glifos choca consigo mismo,
            y la culpa es del emoji.</b> Tiene tres formas: un rasgo que usa el icono de un{" "}
            <b>campo</b> (🗡️ <i>Perforante</i> contra el tipo de daño 🗡️ Cuerpo a cuerpo), el{" "}
            <b>emblema de raza</b> repetido dentro del raíl (💀 es la raza, la Característica y
            el retrato) y <b>dos Características con el mismo emoji</b>, contiguas y de sentido
            opuesto: 🔥 es a la vez fuente, resistencia e inmunidad. Míralo en{" "}
            <b>Casos límite</b>.
            <br />
            <b>Lo que ya no es: un problema de catálogo.</b> El emoji es lo único de la carta
            que no se puede dibujar distinto, así que obliga a dos conceptos vecinos —una raza
            de muertos y un rasgo de muerto— a verse <i>idénticos</i>; un pictograma propio se
            parece sin ser el mismo. Por eso las dos primeras <b>se apagan solas</b> al
            dibujarlas, y el 🗡️ tiene hasta fecha: cuando exista el archivo del tipo de daño{" "}
            <i>Cuerpo a cuerpo</i>, el único de los tres que falta. La tercera no, porque el
            🔥 lo comparten <i>a propósito</i> —dicen que van del mismo tema— y ahí lo que falta
            es el <b>aro que marca el papel</b>. Que todo salga aquí tampoco es casualidad: el
            raíl es la única de las cuatro familias que sigue entera en emoji —<b>8/8</b>{" "}
            Habilidades dibujadas, <b>11/11</b> emblemas, <b>2/3</b> tipos de daño y <b>0 de
            41</b> Características—.
          </li>
          <li>
            <i>Esperando a la tanda de ilustraciones</i> — <b>el encuadre, y ahora se ve
            más que nunca.</b> El estado de los veinticuatro archivos está arriba, y la lista de
            comprobación es{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
              public/assets/v3/README.md
            </code>
            . Lo que sí es de la carta es la letra pequeña de haber quitado el marco: se come{" "}
            <b>12px</b> por los cuatro lados contra los 16 de la J —entre su mat y
            su anillo— y los 15,5 de la K, que además subían a 30,5 por arriba. La que quedó es
            la que enseña más ilustración y, de rebote, la que menos disimula un encuadre malo.
          </li>
          <li>
            <i>No se cierra, es memoria</i> — <b>arriba no caben.</b> Se probó a subir las ocho
            Habilidades a una banda de
            cabecera y caía justo sobre las cabezas de los héroes, que es la franja que la
            dirección de arte manda dejar visible. La parte baja de la carta es la única que la
            ilustración da por perdida — conviene tenerlo presente antes de proponer mover nada
            al tercio alto.
          </li>
        </ul>
      </section>
    </div>
  );
}
