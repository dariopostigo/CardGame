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
import { SelectButton } from "primereact/selectbutton";
import { InputSwitch } from "primereact/inputswitch";
import {
  CURVES,
  KNOBS,
  OFFER_BUDGET,
  TIMINGS,
  attackPhases,
  offerDuration,
  reduced,
  schedule,
  totalDuration,
  type AnimEvent,
  type CurveId,
  type Knob,
  type Timings,
} from "@/lib/v3/anim";
import { HIT_BAND, LUCK_CAP, cappedLuck, expectedMix } from "@/lib/v3/combat";
import { ARENA, buildArena } from "@/lib/v3/arena";
import * as Hex from "@/lib/v3/hex";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import AnimationBench from "./AnimationBench";
import { buttonClass } from "@/components/ui/Button";

const GROUPS: { id: Knob["group"]; label: string; blurb: string }[] = [
  {
    id: "despliegue",
    label: "Soltar la carta",
    blurb:
      "De la mano al suelo. Las tres cosas que hacen que pese son la altura, la curva y el aplastado; la duración es la que menos manda.",
  },
  {
    id: "impacto",
    label: "Golpear y caer",
    blurb:
      "La embestida, el contacto y la baja. El congelado es el dial más importante de esta caja y el que menos se parece a lo que uno esperaría.",
  },
  {
    id: "desenlace",
    label: "Fallar y criticar",
    blurb:
      "Los tres desenlaces del §4.1 son el mismo golpe con otra suerte, así que aquí no hay tiempos propios: son multiplicadores de los de arriba. Todos actúan A PARTIR del contacto — la embestida es idéntica en los tres a propósito, y esa es la regla que sostiene que una tirada oculta tenga suspense.",
  },
  {
    id: "vida",
    label: "La mesa viva",
    blurb:
      "Lo que pasa cuando NO pasa nada. Las fichas respiran, cada una en su fase, y la que ya ha andado deja de hacerlo: lo gastado se lee por AUSENCIA, y por eso las dos cosas son una sola y no se pueden juzgar por separado. Apaga el aliento y mira si todavía distingues cuál ya se movió.",
  },
  {
    id: "movimiento",
    label: "Ofrecer y andar",
    blurb:
      "Al coger una ficha, el terreno al que llega se levanta en onda desde ella. La cuenta no es de aquí: la hace lib/v3/movement.ts, que rodea los cuerpos porque no se atraviesa a nadie (§5), así que la oferta puede ser bastante menor que el círculo de su 👢 — y eso es justo lo que hay que poder ver.",
  },
  {
    id: "polvo",
    label: "El polvo",
    blurb:
      "Partículas sobre un <canvas>, sin librería. Los mandos son los del reventón al aterrizar; el del golpe, el del crítico y el de la muerte se derivan de él para que no se desafinen entre sí.",
  },
];

// Sin `readonly`: el <SelectButton> de PrimeReact pide un array mutable.
const CURVE_OPTIONS: { value: CurveId; label: string }[] = (
  Object.keys(CURVES) as CurveId[]
).map((id) => ({ value: id, label: CURVES[id].label }));

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

/**
 * El hexágono más lejano que puede ofrecer un DESPLIEGUE en la arena de verdad.
 *
 * Es el caso peor de la onda y el único que puede salirse del presupuesto: al
 * mover, la oferta llega como mucho a 👢 3, pero al soltar una carta se ofrece el
 * tablero entero. Se mide contra el 14×12 y no contra el retal del banco, porque
 * el retal siempre va a caber y no contesta la pregunta.
 */
/** El 👢 más largo de la banda: el caso peor de la oferta al andar. */
const MAX_BOOTS = Math.max(...Object.values(MOVEMENT_BAND));

const DEPLOY_SPAN = (() => {
  const arena = buildArena(ARENA);
  const entry = Hex.offsetToAxial({ col: Math.floor(ARENA.cols / 2), row: ARENA.rows - 1 });
  return arena.hexes.reduce((max, hex) => Math.max(max, Hex.distance(hex, entry)), 0);
})();

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

  const set = (id: Knob["id"], value: number) =>
    setTimings((prev) => ({ ...prev, [id]: value }));

  const phases = {
    impacto: attackPhases("impacto", effective),
    fallo: attackPhases("fallo", effective),
    critico: attackPhases("critico", effective),
  };
  const mix = expectedMix(ROUND, odds.precision, odds.luck);
  const round = totalDuration(schedule(sampleRound(odds.precision, odds.luck), effective));

  const label = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";
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

      {/* --- Los diales --- */}
      <div className="mb-5 grid gap-4">
        {GROUPS.map((group) => (
          <div key={group.id} className={card}>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold text-[var(--wiki-text)]">{group.label}</span>
              {group.id === "despliegue" && (
                <div className="flex items-center gap-2">
                  <span className={label} title={CURVES[timings.fallCurve].help}>
                    Curva de caída
                  </span>
                  <SelectButton
                    value={timings.fallCurve}
                    onChange={(e) =>
                      e.value && setTimings((prev) => ({ ...prev, fallCurve: e.value as CurveId }))
                    }
                    options={CURVE_OPTIONS}
                    optionLabel="label"
                    optionValue="value"
                    allowEmpty={false}
                  />
                </div>
              )}
            </div>
            <p className="mb-3 text-xs text-[var(--wiki-muted)]">{group.blurb}</p>

            <div className="anim__knobs">
              {KNOBS.filter((k) => k.group === group.id).map((knob) => (
                <div key={knob.id} className="anim__knob" title={knob.help}>
                  <span className="anim__knob-head">
                    {knob.label}
                    <span className="anim__knob-value">
                      {format(timings[knob.id], knob.step)}
                      {knob.unit && ` ${knob.unit}`}
                    </span>
                  </span>
                  <Slider
                    value={timings[knob.id]}
                    min={knob.min}
                    max={knob.max}
                    step={knob.step}
                    onChange={(e: SliderChangeEvent) =>
                      typeof e.value === "number" && set(knob.id, e.value)
                    }
                  />
                </div>
              ))}
            </div>

            {group.id === "despliegue" && (
              <p className="mt-3 text-xs text-[var(--wiki-muted)]">
                <b className="text-[var(--wiki-text)]">{CURVES[timings.fallCurve].label}</b>:{" "}
                {CURVES[timings.fallCurve].help}
              </p>
            )}

            {group.id === "vida" && (
              <p className="mt-3 text-xs text-[var(--wiki-muted)]">
                Con el <b className="text-[var(--wiki-text)]">aliento</b> a 0 no queda un tablero
                quieto: queda una captura de pantalla. Y de paso desaparece la mitad de la lectura
                de <b className="text-[var(--wiki-text)]">lo ya andado</b>, porque lo que dice que
                una ficha ya se movió no es que esté hundida, es que es la única que{" "}
                <b className="text-[var(--wiki-text)]">no respira</b> — y una ausencia solo se ve
                si lo demás está. Es la razón de que estas dos se hayan construido juntas.
              </p>
            )}

            {group.id === "movimiento" && (
              <div className="mt-4 rounded-md border border-dashed border-[var(--wiki-border)] p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                  El presupuesto de la oferta
                </div>
                <p className="mb-3 text-xs text-[var(--wiki-muted)]">
                  Una ayuda que llega después de que hayas decidido no es una ayuda: es un
                  parpadeo por detrás del gesto. El presupuesto son{" "}
                  <b className="text-[var(--wiki-text)]">{OFFER_BUDGET} ms</b> —lo que se tarda en
                  pasar de coger una ficha a haber elegido a dónde va—, y es una afirmación a
                  comprobar, no una ley. Los dos casos no se parecen: al{" "}
                  <b className="text-[var(--wiki-text)]">andar</b> se ofrecen tres hexágonos y al{" "}
                  <b className="text-[var(--wiki-text)]">desplegar</b> se ofrece el tablero entero,
                  así que el que puede romperse es el segundo — y no se ve en el banco, porque el
                  retal de quince siempre cabe.
                </p>
                <div className="grid gap-1 text-xs">
                  <OfferRow
                    label={`Andar · 👢 ${MAX_BOOTS}, el más largo`}
                    steps={MAX_BOOTS}
                    t={effective}
                  />
                  <OfferRow
                    label={`Desplegar · arena ${ARENA.cols}×${ARENA.rows}, desde la mano`}
                    steps={DEPLOY_SPAN}
                    t={effective}
                  />
                </div>
              </div>
            )}

            {group.id === "desenlace" && (
              <>
                {/* Los tres relojes, uno al lado del otro. Es la única caja de
                    la pantalla donde el número importa tanto como lo que se ve:
                    la igualdad del primer tramo es una PROPIEDAD, y aquí se
                    comprueba de un vistazo en vez de creérsela. */}
                <div className="mt-4 grid gap-1 text-xs">
                  <div className="grid grid-cols-[5.5rem_1fr_1fr_1fr] gap-2 font-semibold text-[var(--wiki-muted)]">
                    <span />
                    <span>Ida</span>
                    <span>Congelado</span>
                    <span>Vuelta</span>
                  </div>
                  {(["impacto", "fallo", "critico"] as const).map((id) => (
                    <div
                      key={id}
                      className="grid grid-cols-[5.5rem_1fr_1fr_1fr] gap-2 text-[var(--wiki-text)]"
                    >
                      <span className="font-semibold capitalize">{id}</span>
                      <span>{phases[id].lunge} ms</span>
                      <span>{phases[id].stop} ms</span>
                      <span>
                        {phases[id].back} ms{" "}
                        <span className="text-[var(--wiki-muted)]">· {phases[id].total} total</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--wiki-muted)]">
                  La columna de la <b className="text-[var(--wiki-text)]">ida</b> tiene que ser la
                  misma en las tres filas, siempre. Es lo único de esta pantalla que no es cuestión
                  de gusto: si el fallo se notara antes del contacto, se leería el resultado en el
                  gesto y una tirada oculta sin suspense no sirve para nada.
                </p>

                <label className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--wiki-muted)]">
                  <InputSwitch
                    checked={timings.evenOut}
                    onChange={(e) => setTimings((prev) => ({ ...prev, evenOut: !!e.value }))}
                  />
                  <span>
                    <b className="text-[var(--wiki-text)]">Que los tres duren lo mismo.</b> No es
                    información, es ritmo: sin esto una racha de fallos va más rápida que una de
                    golpes y se nota antes de saber por qué. Con esto, el crítico paga su congelado
                    acortando la vuelta. Míralo con una tanda, no con un ataque suelto.
                  </span>
                </label>

                {/* --- Y aquí se cruza la frontera: esto ya es REGLA --- */}
                <div className="mt-4 rounded-md border border-dashed border-[var(--wiki-border)] p-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                    Los umbrales · esto no es un dial, es la regla
                  </div>
                  <p className="mb-3 text-xs text-[var(--wiki-muted)]">
                    Los dos números del §4.1, y están aquí solo para que la{" "}
                    <b className="text-[var(--wiki-text)]">tanda de 12</b> tire con la distribución
                    de verdad. La tirada la resuelve{" "}
                    <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
                      lib/v3/combat.ts
                    </code>
                    , no el banco: un{" "}
                    <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
                      Math.random() &lt; 0.15
                    </code>{" "}
                    en el componente sería inventarse la regla en la capa equivocada y, peor,
                    mentir sobre cada cuánto aparece un fallo.
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
                    y 🍀 Suerte tiene tope <b className="text-[var(--wiki-text)]">{LUCK_CAP}</b> —
                    el slider llega a 40 para poder ver el tope actuar—. Con estos, de cada{" "}
                    {ROUND} ataques salen <b className="text-[var(--wiki-text)]">{mix.impacto}</b>{" "}
                    golpes, <b className="text-[var(--wiki-text)]">{mix.fallo}</b> fallos y{" "}
                    <b className="text-[var(--wiki-text)]">{mix.critico}</b> críticos.
                  </p>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button className={buttonClass()} onClick={() => setTimings(TIMINGS)}>
            <i className="pi pi-undo mr-1" />
            Volver a los valores de partida
          </button>
          <span className="text-xs text-[var(--wiki-muted)]">
            Nada de esto se guarda: los valores viven en{" "}
            <code className="rounded bg-[var(--wiki-code-bg)] px-1 text-[0.85em]">
              lib/v3/anim.ts
            </code>
            , y cerrar uno es escribirlo ahí.
          </span>
        </div>
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
            <b className="text-[var(--wiki-text)]">La cola de verdad</b>: `schedule()` pone hora,
            pero no hay todavía quien la reproduzca contra el estado de una partida. Entra con el
            motor de combate, y es lo que hay que tener escrito ANTES de que el motor crezca:
            meterla después, sobre reglas que mutan estado a la primera, es rehacerlas.
          </li>
          <li>
            <b className="text-[var(--wiki-text)]">Las secuencias que faltan</b>: los nueve estados
            —el crítico ya deja uno puesto, pero es un glifo que aparece y se queda: un estado de
            verdad es un BUCLE que vive mientras dure y que tiene que seguir a la ficha en su
            embestida y en su muerte, que es otro objeto y no otro reventón—, y el robo de carta
            con el abanico recolocándose. El aliento ya es el primer bucle del banco, así que el
            sitio donde colgarlos existe.
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
            <b className="text-[var(--wiki-text)]">Beats en paralelo en `schedule()`</b>: hoy la cola
            es estrictamente secuencial. El tic de estados al empezar el turno son diez fichas por
            tres estados, y en fila eso es una eternidad; escalonados 60 ms se lee como una cascada
            y a la vez se lee como un fallo de pintado. Es el cambio que más decide si un turno se
            puede mirar.
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

/**
 * Una fila del presupuesto: lo que tarda la onda en cubrir `steps` hexágonos, y
 * si eso entra o no.
 *
 * La cifra sale de `offerDuration()`, que vive en lib/v3/anim.ts justamente
 * porque esto se puede contestar sin pintar nada — igual que la igualdad de la
 * ida en los tres desenlaces. Que se pueda medir sin pantalla es lo que la
 * convierte en una propiedad y no en una impresión.
 */
function OfferRow({ label, steps, t }: { label: string; steps: number; t: Timings }) {
  const ms = offerDuration(steps, t);
  const over = ms > OFFER_BUDGET;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <span className="text-[var(--wiki-muted)]">{label}</span>
      <span className={over ? "font-semibold text-[var(--wiki-danger)]" : "text-[var(--wiki-text)]"}>
        {ms} ms{" "}
        <span className="font-normal text-[var(--wiki-muted)]">
          · {steps} hex ·{" "}
          {over ? `${ms - OFFER_BUDGET} ms tarde` : `sobran ${OFFER_BUDGET - ms}`}
        </span>
      </span>
    </div>
  );
}

/** Los diales con paso decimal se enseñan con decimales; los de milisegundos, enteros. */
function format(value: number, step: number): string {
  if (step >= 1) return String(Math.round(value));
  return value.toFixed(step < 0.1 ? 2 : 1);
}
