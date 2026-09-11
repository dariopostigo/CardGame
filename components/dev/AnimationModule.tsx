"use client";

// =========================================================================
// Módulo «Animación» de /dev — el banco donde se decide cómo se siente el juego
//
// LA PREGUNTA QUE CONTESTA ESTA PANTALLA no es de reglas, y es la primera del
// proyecto que no lo es: si V3 puede parecer un videojuego y no una web que
// aplica un reglamento. Todo lo demás —la arena, el despliegue, el ritmo— ya
// está midiendo cosas que se pueden escribir en un documento. Esto mide una
// que no: cuánto tiene que durar una caída para que la ficha PESE.
//
// Y por eso es un banco con diales y no una implementación: no hay forma de
// escribir en un documento de diseño que el aplastado dura 110 ms. Se mira, se
// mueve el dial, se vuelve a mirar. Igual que el marco de carta.
//
// LO QUE HAY QUE MIRAR, en este orden, porque cada uno enseña una cosa que los
// otros no:
//
//   1. Suelta una carta con el CONGELADO a 0 y luego a 70 ms. Es el mismo
//      golpe, y no lo parece. Es el efecto más barato del catálogo.
//   2. Pon la curva de caída en «Suave» —la que usa hoy todo el proyecto— y
//      compárala con «Peso». La suave frena al llegar, así que la ficha no cae:
//      se posa. Es el error por defecto de animar con las curvas de una
//      interfaz en vez de con las de un juego.
//   3. Baja el APLASTADO a 0. No se rompe nada; simplemente se muere.
//   4. Sube la ALTURA a 200 px sin tocar la duración. La caída es la misma de
//      larga y pesa el doble, porque lo que pesa es el recorrido, no el reloj.
//   5. Encadena GOLPEAR y FALLAR. Los primeros 170 ms son idénticos —tienen que
//      serlo—: sin dados en pantalla, la animación es lo único que cuenta lo que
//      pasó, y si el fallo se notara en la embestida el resultado se leería en
//      el gesto. Luego tira una TANDA DE 12, que es lo que no se puede juzgar de
//      uno en uno: si el conjunto lleva un ritmo o va a trompicones.
//   6. Pon las tres cartas en el campo y CÓGELAS una por una. Son 🗡️, ✨ y 🏹, y
//      👢 Movimiento va por tipo de daño (3, 2 y 1): tres ofertas distintas sobre
//      el mismo tablero. Luego pon una ficha en medio del camino y vuelve a
//      cogerlas — la oferta encoge, porque no se atraviesa a nadie (§5).
//   7. Anda con una y mira las OTRAS. La que acaba de andar es la única que no
//      respira, y eso es lo que dice cuál ya se movió. Ahora baja el ALIENTO a 0
//      y busca cuál era: sigue hundida y sigue apagada, y aun así hay que
//      recorrer el tablero mirando fichas de una en una. Esa es toda la
//      diferencia entre las dos animaciones más baratas de esta pantalla.
//
// LO QUE ESTA PANTALLA NO DECIDE: el aspecto. Las fichas son discos con un
// glifo, la carta es un rectángulo con un borde y el suelo es un retal de
// quince hexágonos, todo a propósito. Aquí se decide el MOVIMIENTO, y
// mezclarlo con el aspecto haría que se juzgaran los dos a la vez y mal.
//
// Esos cuatro remiendos no son deuda escondida: están declarados como `standIn`
// en lib/dev-registry.ts, en las cuatro aristas que este módulo tiene con el
// tablero, el diseño de ficha, el marco de carta y la baraja. El hub de /dev
// los enseña, así que cuando alguno de esos módulos exista se ve de un vistazo
// que hay que volver aquí. Antes esto era este párrafo y nada más.
//
// Ninguna regla de juego vive aquí (ARCHITECTURE.md §6): los tiempos son datos
// de lib/v3/anim.ts y este componente solo tiene estado de interfaz.
// =========================================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import { InputSwitch } from "primereact/inputswitch";
import {
  TIMINGS,
  attackPhases,
  reduced,
  schedule,
  totalDuration,
  type AnimEvent,
  type KnobId,
  type Timings,
} from "@/lib/v3/anim";
import { HIT_BAND, LUCK_CAP, cappedLuck, expectedMix } from "@/lib/v3/combat";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import AnimationBench from "./AnimationBench";
import AnimationBacklog from "./AnimationBacklog";
import { AnimationCatalog } from "./AnimationPreview";
import { buttonClass } from "@/components/ui/Button";


/** El caso peor del §4: tres jugadores contra un bando espejo, todos atacando. */
const ROUND = 30;

/**
 * Los pasos que anda una ficha media en su turno. El §5 dice que mueve Y ataca,
 * así que una ronda que solo cuente ataques miente por defecto — y bastante: son
 * dos pasos de más por ficha y treinta fichas.
 */
const ROUND_STEPS = Math.round(
  (MOVEMENT_BAND["cuerpo-a-cuerpo"] + MOVEMENT_BAND.magico + MOVEMENT_BAND["a-distancia"]) / 3,
);

/**
 * La cola de ejemplo con la que se mide cuánto duraría una ronda.
 *
 * Se construye con el REPARTO que dan los umbrales, no con treinta impactos: un
 * fallo y un crítico no cuestan lo mismo que un golpe, así que una ronda con
 * 🎯 65 dura distinto que una con 🎯 95. Esa es justo la cifra que decide si
 * hace falta un botón de saltar animaciones, y sale sin pintar un píxel.
 */
function sampleRound(precision: number, luck: number): AnimEvent[] {
  const mix = expectedMix(ROUND, precision, luck);
  const out: AnimEvent[] = [];
  let i = 0;
  for (const [result, n] of Object.entries(mix)) {
    for (let k = 0; k < n; k++, i++) {
      out.push({ kind: "paso", id: `f${i}`, steps: ROUND_STEPS });
      out.push({ kind: "ataque", id: `f${i}`, target: `e${i}`, result: result as never });
    }
  }
  return out;
}


export default function AnimationModule() {
  const [timings, setTimings] = useState<Timings>(TIMINGS);
  const [note, setNote] = useState("Arrastra una carta a un hexágono.");

  // Los dos umbrales del §4.1. NO son diales de sensación: son regla, y por eso
  // están separados de `timings` y no viven en anim.ts. El punto de partida es
  // el centro de la banda de acierto (65–95) y una Suerte alta pero por debajo
  // del tope, para que en una tanda de doce salgan los tres desenlaces.
  const [precision, setPrecision] = useState(80);
  const [luck, setLuck] = useState(18);
  const odds = useMemo(
    () => ({ precision, luck: cappedLuck(luck, precision) }),
    [precision, luck],
  );

  // `prefers-reduced-motion` se respeta, pero esta pantalla existe para mirar
  // movimiento: si el sistema lo tiene puesto, se avisa y se deja desactivar
  // aquí dentro. Apagarlo en silencio sería saltarse la preferencia; no
  // ofrecerlo sería dejar la pantalla inservible para quien la tenga puesta por
  // costumbre y no por necesidad.
  const [systemReduced, setSystemReduced] = useState(false);
  const [respect, setRespect] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const still = systemReduced && respect;
  const effective = useMemo(() => (still ? reduced(timings) : timings), [still, timings]);

  const set = (id: KnobId, value: number) =>
    setTimings((prev) => ({ ...prev, [id]: value }));

  const phases = {
    impacto: attackPhases("impacto", effective),
    fallo: attackPhases("fallo", effective),
    critico: attackPhases("critico", effective),
  };
  const mix = expectedMix(ROUND, odds.precision, odds.luck);
  const round = totalDuration(schedule(sampleRound(odds.precision, odds.luck), effective));

  const card = "rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3";

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Animación</h1>
      <p className="mb-3 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El banco donde se decide <b className="text-[var(--wiki-text)]">cómo se siente</b> V3: qué
        pasa cuando sueltas una carta, cuando una ficha golpea y cuando una ficha cae. Es la
        primera pantalla del proyecto que no mide una regla — mide una sensación, y por eso son
        diales y no números escritos en un documento.
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El escenario <b className="text-[var(--wiki-text)]">no es el tablero</b>: son quince
        hexágonos quietos con la geometría y la cámara de{" "}
        <Link href="/dev/tablero" className="text-[var(--wiki-accent)] hover:underline">
          la arena
        </Link>
        , para poder mirar una caída de cerca y repetirla cien veces. Cuando los tiempos estén
        decididos, lo que se muda a la arena son las cifras, no la pantalla. El aspecto tampoco se
        decide aquí: la ficha es un disco y la carta un rectángulo a propósito, porque el marco de
        carta y la ilustración del campo se están decidiendo por su cuenta.
      </p>

      {systemReduced && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-3 text-sm text-[var(--wiki-text)]">
          <i className="pi pi-info-circle text-[var(--wiki-accent)]" />
          <span className="flex-1">
            Tu sistema pide <b>movimiento reducido</b>, así que las secuencias van sin
            desplazamiento: se queda el destello y el aplastado —que dicen qué ficha se ha llevado
            el golpe— y se va el vuelo, la embestida, el temblor y el polvo.
          </span>
          <label className="flex items-center gap-2">
            <InputSwitch checked={!respect} onChange={(e) => setRespect(!e.value)} />
            Verlo con movimiento
          </label>
        </div>
      )}

      {/* --- El banco --- */}
      <AnimationBench timings={effective} odds={odds} onNote={setNote} className="mb-2" />

      <p className="mb-5 text-xs text-[var(--wiki-muted)]">{note}</p>

      {/* --- Y aquí se cruza la frontera: esto ya es REGLA ---
          Van pegados al banco, y no al catálogo de abajo, porque no son de una
          animación: son los dos números con los que TIRA la tanda de doce de
          aquí arriba. Un preview enseña el desenlace que le pidas con un botón;
          el REPARTO entre golpes, fallos y críticos solo existe cuando hay
          tanda, así que este es el único sitio de la pantalla donde significan
          algo. */}
      <div className={`${card} mb-5`}>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
          Los umbrales · esto no es un dial, es la regla
        </div>
        <p className="mb-3 text-xs text-[var(--wiki-muted)]">
          Los dos números del §4.1, y están aquí solo para que la{" "}
          <b className="text-[var(--wiki-text)]">tanda de 12</b> tire con la distribución de
          verdad. La tirada la resuelve{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
            lib/v3/combat.ts
          </code>
          , no el banco: un{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
            Math.random() &lt; 0.15
          </code>{" "}
          en el componente sería inventarse la regla en la capa equivocada y, peor, mentir sobre
          cada cuánto aparece un fallo.
        </p>
        <div className="anim__knobs">
          <div className="anim__knob">
            <span className="anim__knob-head">
              🎯 Precisión
              <span className="anim__knob-value">{precision}</span>
            </span>
            <Slider
              value={precision}
              min={40}
              max={100}
              step={1}
              onChange={(e: SliderChangeEvent) =>
                typeof e.value === "number" && setPrecision(e.value)
              }
            />
          </div>
          <div className="anim__knob">
            <span className="anim__knob-head">
              🍀 Suerte
              <span className="anim__knob-value">
                {odds.luck}
                {odds.luck !== luck && " (con tope)"}
              </span>
            </span>
            <Slider
              value={luck}
              min={0}
              max={40}
              step={1}
              onChange={(e: SliderChangeEvent) =>
                typeof e.value === "number" && setLuck(e.value)
              }
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--wiki-muted)]">
          La banda de acierto es{" "}
          <b className="text-[var(--wiki-text)]">
            {HIT_BAND.min}–{HIT_BAND.max}
          </b>{" "}
          y 🍀 Suerte tiene tope <b className="text-[var(--wiki-text)]">{LUCK_CAP}</b> — el slider
          llega a 40 para poder ver el tope actuar—. Con estos, de cada {ROUND} ataques salen{" "}
          <b className="text-[var(--wiki-text)]">{mix.impacto}</b> golpes,{" "}
          <b className="text-[var(--wiki-text)]">{mix.fallo}</b> fallos y{" "}
          <b className="text-[var(--wiki-text)]">{mix.critico}</b> críticos.
        </p>
      </div>

      {/* --- El catálogo: un banco por animación --- */}
      <h2 className="mb-1 text-lg font-bold text-[var(--wiki-text)]">Una a una</h2>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Cada tarjeta es el <b className="text-[var(--wiki-text)]">mismo suelo</b>, las mismas fichas
        y las mismas secuencias de arriba, con <b className="text-[var(--wiki-text)]">una sola cosa
        moviéndose</b> y solo los diales que la mueven. Sirve para afinar una propiedad sin que las
        demás se metan por debajo: los tiempos son los mismos que los del banco —un dial, un valor—,
        así que lo que muevas aquí se mueve allí. Y es el{" "}
        <b className="text-[var(--wiki-text)]">único</b> sitio donde están: ya no hay una caja con
        los treinta y cinco juntos al final de la página, porque un dial suelto no se puede mirar:
        se mira la animación que lo mueve.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Lo que <b className="text-[var(--wiki-text)]">no</b> sustituye es el banco de arriba, y es
        la advertencia importante: aislada, cada secuencia parece bien. Lo que no se ve de una en
        una es la <b className="text-[var(--wiki-text)]">mezcla</b> — que lo ya andado se lee por
        AUSENCIA del aliento, y que el ritmo de una tanda de doce no se juzga mirando un ataque.
      </p>
      <AnimationCatalog
        timings={timings}
        onKnob={set}
        onCurve={(curve) => setTimings((prev) => ({ ...prev, fallCurve: curve }))}
        onEvenOut={(value) => setTimings((prev) => ({ ...prev, evenOut: value }))}
      />
      <div className="mb-5 mt-4 flex flex-wrap items-center gap-3">
        <button className={buttonClass()} onClick={() => setTimings(TIMINGS)}>
          <i className="pi pi-undo mr-1" />
          Volver a los valores de partida
        </button>
        <span className="text-xs text-[var(--wiki-muted)]">
          Vuelven <b className="text-[var(--wiki-text)]">todos</b>, los de las nueve tarjetas: es un
          solo juego de tiempos y no nueve. Nada de esto se guarda —los valores viven en{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
            lib/v3/anim.ts
          </code>
          , y cerrar uno es escribirlo ahí—.
        </span>
      </div>

      {/* --- Las que no están: la lista abierta --- */}
      <h2 className="mb-1 text-lg font-bold text-[var(--wiki-text)]">Otras animaciones</h2>
      <p className="mb-2 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las de arriba son las nueve que <b className="text-[var(--wiki-text)]">hay</b>. Estas son
        las que no, con un veredicto técnico pegado a cada una: si se puede hacer con lo que hay
        montado y a qué precio. Es una lista <b className="text-[var(--wiki-text)]">abierta</b> —se
        escribe antes de decidir nada— y no es un orden de trabajo: no hay prioridades ni fechas
        porque todavía no se saben, y ponerlas haría que esto se leyera como un plan.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Las dos listas son datos del mismo archivo (
        <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">ANIMATIONS</code> y{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">BACKLOG</code>, en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">lib/v3/anim.ts</code>
        ), y construir una es <b className="text-[var(--wiki-text)]">moverla</b> de una a la otra:
        se borra su fila de aquí y sube a «Una a una» con sus diales. Ese es todo el mecanismo que
        impide que esta pantalla acabe mintiendo.
      </p>
      <p className="mb-4 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Y dos avisos que <b className="text-[var(--wiki-text)]">bloquean familias enteras</b>, por
        eso no son filas: el suceso de muerte lleva solo el id —sin saber qué la mató, las siete
        formas de caer no se pueden repartir— y el daño se calcula en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">resolveHit()</code> y
        se tira en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">toAnimEvents()</code>.
        Las dos se arreglan añadiendo un campo, no rediseñando nada.
      </p>
      <div className="mb-5">
        <AnimationBacklog />
      </div>

      {/* --- La cola, que es la parte de arquitectura --- */}
      <div className={`${card} mb-5 text-sm`}>
        <div className="mb-2 font-semibold text-[var(--wiki-text)]">
          La cola: lo que esto le va a exigir al motor
        </div>
        <p className="mb-3 text-[var(--wiki-muted)]">
          Nada de lo de arriba se puede enseñar si el motor cambia el estado en el mismo instante
          en que el jugador suelta la carta: React repinta y la ficha aparece ya puesta. La única
          forma es que el motor <b className="text-[var(--wiki-text)]">emita sucesos</b> y que la
          pantalla los reproduzca en cola, aplicando cada cambio cuando su animación termina. Es
          literalmente lo que hace Hearthstone.{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">duel.ts</code> ya
          devuelve <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">turns[]</code>{" "}
          en vez de un estado final, que es la mitad correcta;{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">schedule()</code> es
          la otra.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[var(--wiki-text)]">
          <span title="La ida, el congelado y la vuelta de un golpe que entra.">
            un golpe: <b>{phases.impacto.total} ms</b>
          </span>
          <span title="Sin congelado, pero con la vuelta pesada de quien se ha vaciado en un golpe que no estaba.">
            un fallo: <b>{phases.fallo.total} ms</b>
          </span>
          <span title="El congelado del crítico es el que paga la diferencia.">
            un crítico: <b>{phases.critico.total} ms</b>
          </span>
          <span title="Los pasos que anda una ficha media antes de pegar. El §5 dice que mueve Y ataca en el mismo turno, así que esto no es opcional en la cuenta.">
            andar {ROUND_STEPS}: <b>{ROUND_STEPS * effective.step} ms</b>
          </span>
          <span
            className="font-semibold"
            title="Treinta fichas andando y atacando una detrás de otra, que es el caso peor del §4: tres jugadores contra un bando espejo. El reparto entre golpes, fallos y críticos sale de los umbrales."
          >
            una ronda de {ROUND}: <b>{(round / 1000).toFixed(1)} s</b>
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--wiki-muted)]">
          Esa última cifra es la que decide si el juego se puede mirar o hace falta un botón de
          saltar animaciones, y ahora cuenta la ronda entera: cada ficha{" "}
          <b className="text-[var(--wiki-text)]">anda y ataca</b> (§5), no solo ataca. Con solo los
          golpes salía casi la mitad, que era una cifra tranquilizadora y falsa. Depende también de
          los umbrales, porque una ronda en la que se falla mucho no dura lo mismo. Todo esto se
          calcula sin pantalla, que es justo por lo que los tiempos viven en{" "}
          <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">lib/v3/</code> y no
          en el componente.
        </p>
      </div>

      {/* --- Lo que falta, dicho en la propia pantalla --- */}
      <div className={`${card} text-sm`}>
        <div className="mb-2 font-semibold text-[var(--wiki-text)]">Lo siguiente</div>
        <ul className="grid gap-1 text-[var(--wiki-muted)]">
          <li>
            <b className="text-[var(--wiki-text)]">Mudar esto a la arena</b>: hoy el banco y{" "}
            <Link href="/dev/tablero" className="text-[var(--wiki-accent)] hover:underline">
              el tablero
            </Link>{" "}
            no se tocan. La mudanza no es copiar el componente sino darle a ArenaBoard una capa de
            fichas que se pueda animar —hoy son SVG dentro de un grupo con filtro— y un canvas para
            el polvo.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">La cola de verdad</b>: `schedule()` pone hora, y
            desde el 7 de septiembre de 2026 ya hay quien la rellena con hechos de verdad —
            `battle.ts` `toAnimEvents()` traduce lo que jugó `fight()` (paso, ataque, muerte) al
            vocabulario de aquí—. Lo que sigue faltando es reproducirla contra el estado de una
            partida en esta pantalla: hoy el traductor solo está probado fuera de React.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">Las secuencias que faltan</b>: están arriba, una
            a una, en <b className="text-[var(--wiki-text)]">«Otras animaciones»</b>. Lo que aquí
            queda dicho es la forma que tienen las que más pesan, los nueve estados: el crítico ya
            deja uno puesto, pero es un glifo que aparece y se queda, y un estado de verdad es un
            BUCLE que vive mientras dure y que tiene que seguir a la ficha en su embestida y en su
            muerte —otro objeto, no otro reventón—. El aliento ya es el primer bucle del banco, así
            que el sitio donde colgarlos existe.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">La oferta, en el tablero de verdad</b>: aquí se
            mide contra quince hexágonos y siempre cabe. En el 14×12 un despliegue ofrece el campo
            entero, y ese es el único caso que puede pasarse del presupuesto — la cifra está
            calculada arriba, pero verla es otra cosa. Con ella entra la pareja que falta: enseñar
            a la vez lo que ALCANZA MOVIÉNDOSE y lo que AMENAZA atacando, que son dos colores
            distintos (<code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
              $arena-move
            </code>{" "}
            y{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">$arena-reach</code>
            ) porque una ficha hace las dos cosas en el mismo turno.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">Beats en paralelo en `schedule()`</b>: cerrado el
            7 de septiembre de 2026. La cola acepta lotes (`Batch`) además de sucesos sueltos —el
            tic de estados al empezar el turno son diez fichas por tres estados, y en fila eso era
            una eternidad—: escalonados con `stagger` se leen como una cascada en vez de como un
            fallo de pintado, y lo que viene después espera a que termine el último del lote. Falta
            que los nueve estados existan para tener con qué llenar un lote de verdad.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">El sonido</b>, que no está en esta pantalla y es
            la mitad de lo que aquí se llama contundencia. Un golpe con congelado y sin ruido sigue
            siendo la mitad de un golpe.
          </li>
        </ul>
      </div>
    </div>
  );
}
