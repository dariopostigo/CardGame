"use client";

// =========================================================================
// UN BANCO POR ANIMACIÓN — el retal más pequeño que contesta una pregunta
//
// QUÉ ES: el mismo suelo, las mismas fichas y las MISMAS secuencias que el banco
// grande, pero con una sola cosa moviéndose y solo los diales que la mueven. Se
// pide por su `AnimationSpec` (lib/v3/anim.ts `ANIMATIONS`), así que la lista de
// lo que se puede mirar es un DATO y no una colección de pantallas escritas a
// mano: añadir una animación al catálogo la hace aparecer aquí.
//
// POR QUÉ AHORA Y NO ANTES: hasta el 11 de septiembre de 2026 las secuencias
// vivían dentro de AnimationBench.tsx, así que mirar solo la embestida
// significaba montar el banco entero —cuatro fichas, tres cartas, la barra de
// mandos y los cuarenta diales—. Con cada secuencia en su archivo
// (components/dev/motion/) esto son cien líneas.
//
// LOS DOS DIALES SON EL MISMO DIAL, y esto es lo que no puede perderse de vista:
// el preview NO tiene estado propio de tiempos. Lee y escribe el mismo `Timings`
// que el banco grande, que vive en AnimationModule. Si cada uno guardara el
// suyo, volverían las «dos respuestas a la misma pregunta» que este módulo
// acaba de pagar dos veces —el retal y el aliento—, y encima en la misma
// pantalla.
//
// Y AQUÍ VIVEN TODOS LOS DIALES, desde el 11 de septiembre de 2026. Había
// además una caja «Todos los diales» al final de la pantalla con los treinta y
// cinco juntos y agrupados por familia; era el mismo estado pintado dos veces, y
// se fue. Con ella se fue el campo `group` de `Knob`: quién enseña cada dial lo
// dice `ANIMATIONS`, que es la lista de aquí al lado. Lo que NO era un dial y no
// estaba en ningún preview se repartió en vez de borrarse — el presupuesto de la
// oferta y los tres relojes bajaron a la secuencia que miden (`OfferBudget`,
// `Outcomes`, al final de este archivo) y los umbrales 🎯/🍀 subieron al banco,
// que es el único sitio donde hay una TANDA sobre la que signifiquen algo.
//
// Y NO SUSTITUYE AL BANCO. Aislada, cada secuencia parece bien; lo que no se ve
// de una en una es la MEZCLA, que es donde están las dos cosas que esta pantalla
// descubrió: que lo gastado se lee por AUSENCIA del aliento —y una ausencia solo
// se ve si lo demás está presente— y que el ritmo de una tanda de doce no se
// juzga mirando un ataque. Por eso el catálogo va ARRIBA y el banco entero
// debajo, y no en su lugar.
//
// NADA EN BUCLE, y no es un detalle de rendimiento: `idleRise` viene a 0 en todo
// /dev porque un bucle infinito se cuela por debajo de lo que estés juzgando.
// Ocho previews respirando a la vez serían ese problema multiplicado por ocho.
// Se reproduce A DEMANDA, y el único que respira es el que tiene el aliento por
// tema — con su propio dial, que es justo lo que se está mirando.
// =========================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { Slider, type SliderChangeEvent } from "primereact/slider";
import { SelectButton } from "primereact/selectbutton";
import { InputSwitch } from "primereact/inputswitch";
import {
  ANIMATIONS,
  CURVES,
  OFFER_BUDGET,
  OFFER_RISE_MS,
  attackPhases,
  knobsOf,
  offerDuration,
  type AnimationSpec,
  type CurveId,
  type KnobId,
  type Timings,
} from "@/lib/v3/anim";
import { ARENA, buildArena } from "@/lib/v3/arena";
import { MOVEMENT_BAND } from "@/lib/v3/tempo";
import type { AttackResult } from "@/lib/v3/combat";
import { DAMAGE_TYPES, type DamageTypeId } from "@/lib/v3/damage";
import * as Hex from "@/lib/v3/hex";
import type { HexKey } from "@/lib/v3/hex";
import { PATCH_SMALL, handEntry, patchHexes, type PatchLayout } from "@/lib/v3/patch";
import {
  PatchDust,
  PatchGround,
  PatchShadow,
  useDustField,
  usePatchLayout,
} from "./HexPatch";
import {
  IdleChorus,
  attackMotion,
  flyAndLand,
  idleKeyOf,
  slump,
  tokenRest,
  transform,
  vanish,
  walkPath,
  type Ground,
} from "./motion";
import { buttonClass } from "@/components/ui/Button";

/** El centrado del disco, que tiene que seguir en toda cadena que lo mueva. */
const TOKEN_BASE = "translate(-50%, -50%)";

/**
 * Los dos casos de la oferta, y por qué se miden AQUÍ y no en el retal.
 *
 * El preview enseña la onda sobre quince hexágonos, donde siempre cabe: por eso
 * debajo de esa escena va una cuenta hecha contra la arena de verdad, que es la
 * única que puede salirse del presupuesto. Andar ofrece como mucho el 👢 más
 * largo de la banda; desplegar ofrece el tablero entero desde la mano, y ese es
 * el caso peor. Se calculan una vez, al cargar el módulo: no dependen de los
 * diales, solo de la geometría.
 */
const MAX_BOOTS = Math.max(...Object.values(MOVEMENT_BAND));

const DEPLOY_SPAN = (() => {
  const arena = buildArena(ARENA);
  const entry = Hex.offsetToAxial({ col: Math.floor(ARENA.cols / 2), row: ARENA.rows - 1 });
  return arena.hexes.reduce((max, hex) => Math.max(max, Hex.distance(hex, entry)), 0);
})();

/**
 * Cómo se encaja el retal pequeño, y por qué hay dos.
 *
 * La escena de CARTA es la única que tiene algo debajo del suelo —el naipe en la
 * mano, que mide 9,8 rem de alto entero— así que el retal se retira hacia
 * arriba para dejarle sitio. En las demás el suelo se lo queda casi todo, que es
 * lo que hace que el hexágono salga grande: por debajo de unos 60 px de radio,
 * un aplastado del 18 % que dura 110 ms deja de poder verse, y un preview en el
 * que no se ve lo que mide no sirve.
 */
const FIT = { gutter: 28, groundShare: 0.68, topPad: 14, minSize: 12, minBox: 60 } as const;
const FIT_CARD = { ...FIT, groundShare: 0.5 } as const;

/** Lo que mide la carta de mentira, espejo de `.anim__face` (7 × 9,8 rem). */
const CARD_H = 9.8 * 16;

/** Dónde se planta cada ficha del preview, en coordenadas de fila y columna. */
const SPOT = {
  actor: { col: 0, row: 1 },
  target: { col: 2, row: 1 },
  solo: { col: 1, row: 1 },
} as const;

type Actor = {
  readonly id: string;
  readonly damage: DamageTypeId;
  readonly side: "propio" | "enemigo";
  hex: Hex.HexCoord | null;
  moved: boolean;
  gone: boolean;
};

/** Quién sale en cada escena. Lo dice el catálogo, no este archivo. */
function castOf(spec: AnimationSpec): Actor[] {
  const at = (s: { col: number; row: number }) => Hex.offsetToAxial(s);
  switch (spec.scene) {
    case "carta":
      // En la mano: es lo que hay que soltar.
      return [{ id: "carta", damage: "cuerpo-a-cuerpo", side: "propio", hex: null, moved: false, gone: false }];
    case "duelo":
      return [
        { id: "actor", damage: "cuerpo-a-cuerpo", side: "propio", hex: at(SPOT.actor), moved: false, gone: false },
        { id: "objetivo", damage: "cuerpo-a-cuerpo", side: "enemigo", hex: at(SPOT.target), moved: false, gone: false },
      ];
    case "camino":
      return [{ id: "actor", damage: "cuerpo-a-cuerpo", side: "propio", hex: at(SPOT.actor), moved: false, gone: false }];
    case "ficha":
    default:
      return [{ id: "actor", damage: "cuerpo-a-cuerpo", side: "propio", hex: at(SPOT.solo), moved: false, gone: false }];
  }
}

export type AnimationPreviewProps = {
  spec: AnimationSpec;
  /** LOS MISMOS tiempos del banco grande. No hay una copia por preview. */
  timings: Timings;
  onKnob: (id: KnobId, value: number) => void;
  onCurve: (curve: CurveId) => void;
  /** Aparte de `onKnob` porque `evenOut` es un sí o un no, no un número. */
  onEvenOut: (value: boolean) => void;
};

export default function AnimationPreview({
  spec,
  timings,
  onKnob,
  onCurve,
  onEvenOut,
}: AnimationPreviewProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const idles = useRef(new IdleChorus());

  const { box, layout } = usePatchLayout(
    stageRef,
    PATCH_SMALL,
    spec.scene === "carta" ? FIT_CARD : FIT,
  );
  const dustRef = useDustField(canvasRef, box);

  const [cast, setCast] = useState<Actor[]>(() => castOf(spec));
  const [busy, setBusy] = useState(false);
  const [offered, setOffered] = useState<ReadonlyMap<HexKey, number> | null>(null);

  const busyRef = useRef(false);

  // La geometría y los tiempos se leen desde dentro de un `await` que empezó
  // hace medio segundo: con los del cierre de su render, mover un slider a mitad
  // de una caída usaría el valor viejo en el tramo que falta. Se sincronizan en
  // un efecto y no en el cuerpo del componente —escribir una `ref` durante el
  // render es de las cosas que React pide no hacer—, y llega de sobra: un efecto
  // corre tras el pintado, o sea mucho antes de que nadie pueda pulsar nada.
  const layoutRef = useRef<PatchLayout | null>(null);
  const t = useRef(timings);
  useEffect(() => {
    layoutRef.current = layout;
    t.current = timings;
  }, [layout, timings]);

  const groundOf = useCallback(
    (l: PatchLayout): Ground => ({ scene: sceneRef.current, dust: dustRef.current, size: l.size }),
    [dustRef],
  );

  // Estables entre repintados: las tres leen referencias, que no cambian nunca.
  const nodeOf = useCallback((id: string) => nodes.current.get(id) ?? null, []);
  const tokenOf = useCallback(
    (id: string) => nodes.current.get(id)?.querySelector<HTMLElement>(".anim__token") ?? null,
    [],
  );
  const shadowOf = useCallback(
    (id: string) =>
      sceneRef.current?.querySelector<HTMLElement>(`.patch__shadow[data-for="${id}"]`) ?? null,
    [],
  );

  /**
   * Cada ficha en su sitio, sin animación.
   *
   * Toda secuencia acaba exactamente en estas cadenas: una que termine en otra
   * cosa deja la ficha corrida un píxel para siempre, y eso se acumula.
   */
  const settle = useCallback(() => {
    const l = layoutRef.current;
    if (!l) return;
    for (const actor of cast) {
      const el = nodeOf(actor.id);
      if (!el) continue;
      const shadow = shadowOf(actor.id);
      const token = tokenOf(actor.id);
      if (token) {
        token.style.opacity = actor.hex ? "1" : "0";
        const rest = tokenRest(actor.moved, l.size, t.current, TOKEN_BASE);
        token.style.transform = rest.transform;
        token.style.filter = rest.filter;
      }
      const at = actor.hex ? l.centers.get(Hex.key(actor.hex)) : null;
      if (at) {
        el.style.opacity = actor.gone ? "0" : "1";
        el.style.transform = transform(at.x, at.y, 0, 1);
        if (shadow) {
          shadow.style.transform = `translate(${at.x}px, ${at.y}px) scale(1)`;
          shadow.style.opacity = actor.gone ? "0" : "0.55";
        }
      } else {
        // En la mano: abajo, en el centro, y a la escala de la carta. La altura
        // sale de la MITAD de la carta más un dedo de aire, no de un número
        // elegido: así el canto de abajo queda dentro del escenario en vez de
        // salirse por él, que es lo que pasaba con la carta a tamaño natural.
        const hand = handSpot(l);
        el.style.opacity = "1";
        el.style.transform = transform(hand.x, hand.y, 0, t.current.cardScale);
        if (shadow) {
          shadow.style.transform = `translate(${hand.x}px, ${hand.y}px) scale(1.6)`;
          shadow.style.opacity = "0.18";
        }
      }
    }
  }, [cast, nodeOf, tokenOf, shadowOf]);

  useEffect(() => {
    if (!busyRef.current) settle();
  }, [settle, layout]);

  // El aliento solo corre en el preview que lo tiene por tema, y solo si su
  // propio dial lo enciende. En los demás sería un bucle infinito por debajo de
  // lo que se está mirando — que es exactamente por lo que viene a 0.
  const breathes = spec.id === "aliento" || spec.id === "gastado";
  const idleKey = idleKeyOf(timings, layout?.size ?? 0);
  useEffect(() => {
    const chorus = idles.current;
    chorus.stopAll();
    if (!breathes || !layout) return;
    for (const actor of cast) {
      if (!actor.hex || actor.moved || actor.gone) continue;
      chorus.start(
        actor.id,
        {
          el: tokenOf(actor.id),
          blot: shadowOf(actor.id)?.querySelector<HTMLElement>(".patch__blot"),
          prefix: TOKEN_BASE,
        },
        timings,
        layout.size,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathes, cast, idleKey, layout]);

  useEffect(() => {
    const chorus = idles.current;
    return () => chorus.stopAll();
  }, []);

  /** Todo a su sitio de partida, y el polvo fuera. */
  const reset = useCallback(() => {
    if (busyRef.current) return;
    idles.current.stopAll();
    setOffered(null);
    setCast(castOf(spec));
  }, [spec]);

  // --- Reproducir -----------------------------------------------------------
  //
  // Un `switch` sobre el id del catálogo, y esa es toda la lógica del archivo:
  // cada animación sabe qué llamada suya hay que hacer. Las llamadas son las de
  // components/dev/motion/, o sea LAS MISMAS que ejecuta el banco grande — si
  // fueran otras, el preview mediría una cosa y el banco otra.

  const play = useCallback(
    async (result: AttackResult = "impacto") => {
      const l = layoutRef.current;
      if (!l || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      const c = t.current;
      const ground = groundOf(l);

      try {
        switch (spec.id) {
          case "despliegue":
          case "polvo": {
            const actor = cast[0];
            const el = nodeOf(actor.id);
            const target = l.centers.get(Hex.key(Hex.offsetToAxial(SPOT.solo)));
            if (!el || !target) break;
            const hand = handSpot(l);
            await flyAndLand(
              {
                el,
                face: el.querySelector<HTMLElement>(".anim__face"),
                token: el.querySelector<HTMLElement>(".anim__token"),
                shadow: shadowOf(actor.id),
              },
              ground,
              hand,
              target,
              { scale: c.cardScale, lift: c.hover, rested: 1 },
              c,
            );
            setCast((prev) =>
              prev.map((p) => (p.id === actor.id ? { ...p, hex: Hex.offsetToAxial(SPOT.solo) } : p)),
            );
            break;
          }

          case "oferta": {
            // La oferta no es una secuencia: es un estado que se enciende. Se
            // deja puesta el tiempo que tarda la onda entera más un respiro,
            // para poder verla llegar hasta el último hexágono.
            const from = handEntry(PATCH_SMALL);
            const map = new Map<HexKey, number>();
            for (const hex of patchHexes(PATCH_SMALL)) {
              map.set(Hex.key(hex), Hex.distance(hex, from));
            }
            setOffered(map);
            await new Promise((r) => window.setTimeout(r, 900));
            setOffered(null);
            break;
          }

          case "paso": {
            const actor = cast[0];
            const el = nodeOf(actor.id);
            if (!el || !actor.hex) break;
            const path = [SPOT.actor, { col: 1, row: 1 }, SPOT.target]
              .map((s) => l.centers.get(Hex.key(Hex.offsetToAxial(s))))
              .filter((p): p is { x: number; y: number } => !!p);
            if (path.length < 2) break;
            await walkPath({ el, shadow: shadowOf(actor.id) }, path, ground, c);
            setCast((prev) =>
              prev.map((p) =>
                p.id === actor.id ? { ...p, hex: Hex.offsetToAxial(SPOT.target) } : p,
              ),
            );
            break;
          }

          case "gastado": {
            const actor = cast[0];
            const moved = !actor.moved;
            idles.current.stop(actor.id);
            await slump([tokenOf(actor.id)], moved, c, l.size, TOKEN_BASE, c.wakeStagger);
            setCast((prev) => prev.map((p) => (p.id === actor.id ? { ...p, moved } : p)));
            break;
          }

          case "embestida":
          case "desenlace": {
            const [actor, victim] = cast;
            const a = nodeOf(actor.id);
            const b = nodeOf(victim.id);
            const from = actor.hex && l.centers.get(Hex.key(actor.hex));
            const to = victim.hex && l.centers.get(Hex.key(victim.hex));
            if (!a || !b || !from || !to) break;
            await attackMotion(
              { el: a, shadow: shadowOf(actor.id) },
              { el: b, shadow: shadowOf(victim.id) },
              from,
              to,
              ground,
              result,
              c,
              { damage: 4 + Math.floor(Math.random() * 8) },
            );
            break;
          }

          case "muerte": {
            const victim = cast.find((p) => p.side === "enemigo") ?? cast[0];
            const el = nodeOf(victim.id);
            const at = victim.hex && l.centers.get(Hex.key(victim.hex));
            if (!el || !at || victim.gone) break;
            await vanish({ el, shadow: shadowOf(victim.id) }, at, ground, c);
            setCast((prev) => prev.map((p) => (p.id === victim.id ? { ...p, gone: true } : p)));
            break;
          }
        }
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [cast, groundOf, spec.id, nodeOf, tokenOf, shadowOf],
  );

  const knobs = knobsOf(spec.id);
  const dirty =
    cast.some((p) => p.gone || p.moved) || (spec.scene === "carta" && !!cast[0]?.hex) ||
    (spec.id === "paso" && !!cast[0]?.hex && !Hex.equals(cast[0].hex, Hex.offsetToAxial(SPOT.actor)));

  return (
    <div className="anim-preview">
      <div className="anim-preview__head">
        <span className="anim-preview__title">{spec.label}</span>
        <span className="anim-preview__question">{spec.question}</span>
      </div>

      <div className="anim-preview__stage anim" data-scene={spec.scene} ref={stageRef}>
        <div
          className="anim__scene"
          ref={sceneRef}
          style={{ ["--offer-rise-ms" as string]: `${OFFER_RISE_MS}ms` }}
        >
          {layout && <PatchGround layout={layout} offered={offered} timings={timings} />}
          <PatchDust canvasRef={canvasRef} />

          {layout && (
            <div className="patch__shadows">
              {cast.map((p) => (
                <PatchShadow key={`s-${p.id}`} layout={layout} dataFor={p.id} />
              ))}
            </div>
          )}

          {layout &&
            cast.map((p) => {
              const type = DAMAGE_TYPES[p.damage];
              const w = layout.size * 1.2;
              return (
                <div
                  key={p.id}
                  ref={(node) => {
                    if (node) nodes.current.set(p.id, node);
                    else nodes.current.delete(p.id);
                  }}
                  className="anim__piece"
                  data-piece-id={p.id}
                  data-side={p.side}
                  data-placed={p.hex ? "true" : "false"}
                >
                  <div
                    className="anim__token"
                    style={{
                      width: `${w}px`,
                      height: `${w * layout.tilt}px`,
                      fontSize: `${layout.size * 0.6}px`,
                    }}
                  >
                    {type.icon}
                  </div>
                  {!p.hex && (
                    <div
                      className="anim__face"
                      style={{ ["--counter" as string]: 1 / timings.cardScale }}
                    >
                      <span className="anim__face-icon">{type.icon}</span>
                      <span className="anim__face-name">{type.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="anim-preview__bar">
        {spec.id === "desenlace" ? (
          // Los tres, uno al lado del otro: la comparación ES el experimento.
          <>
            <button className={buttonClass()} disabled={busy} onClick={() => void play("impacto")}>
              Golpear
            </button>
            <button className={buttonClass()} disabled={busy} onClick={() => void play("fallo")}>
              Fallar
            </button>
            <button className={buttonClass()} disabled={busy} onClick={() => void play("critico")}>
              Crítico
            </button>
          </>
        ) : spec.id === "aliento" ? (
          // No hay botón, y no es un olvido: el aliento ES el estado de reposo,
          // así que no hay nada que reproducir. Lo que se mueve aquí es el dial,
          // y la ficha responde sola.
          <span className="anim-preview__still">
            {timings.idleRise > 0 ? "Respirando" : "Apagado: sube el aliento"}
          </span>
        ) : (
          <button className={buttonClass()} disabled={busy} onClick={() => void play()}>
            <i className="pi pi-play mr-1" />
            {spec.id === "gastado" ? (cast[0]?.moved ? "Turno nuevo" : "Ha andado") : "Ver"}
          </button>
        )}
        {dirty && (
          <button className={buttonClass()} disabled={busy} onClick={reset} title="Todo a su sitio.">
            <i className="pi pi-replay" />
          </button>
        )}
        {spec.curve && (
          <SelectButton
            value={timings.fallCurve}
            onChange={(e) => e.value && onCurve(e.value as CurveId)}
            options={CURVE_OPTIONS}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        )}
      </div>

      <div className="anim__knobs anim-preview__knobs">
        {knobs.map((knob) => (
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
                typeof e.value === "number" && onKnob(knob.id, e.value)
              }
            />
          </div>
        ))}
      </div>

      <p className="anim-preview__try">{spec.try}</p>

      {/* Lo que no se puede ver en el retal, medido al lado de la secuencia que
          mide. Las dos son PROPIEDADES —se contestan con una cuenta y sin
          pintar un píxel— y hasta el 11 de septiembre de 2026 vivían las dos
          juntas en una caja aparte, lejos de la animación de la que hablaban. */}
      {spec.id === "oferta" && <OfferBudget t={timings} />}
      {spec.id === "desenlace" && <Outcomes t={timings} onEvenOut={onEvenOut} />}
    </div>
  );
}

/**
 * El presupuesto de la oferta: la onda contra los 250 ms que se tarda en decidir.
 *
 * Va debajo de «Ofrecer el terreno» porque es la pregunta que el retal NO puede
 * contestar: quince hexágonos siempre caben. Los dos casos no se parecen —al
 * andar se ofrecen tres y al desplegar el tablero entero—, así que el que puede
 * romperse es el segundo.
 */
function OfferBudget({ t }: { t: Timings }) {
  return (
    <div className="anim-preview__aside">
      <div className="anim-preview__aside-head">El presupuesto de la oferta</div>
      <p className="anim-preview__aside-note">
        Una ayuda que llega después de que hayas decidido no es una ayuda: es un parpadeo por
        detrás del gesto. El presupuesto son{" "}
        <b className="text-[var(--wiki-text)]">{OFFER_BUDGET} ms</b> —lo que se tarda en pasar de
        coger una ficha a haber elegido a dónde va—, y es una afirmación a comprobar, no una ley.
        La cuenta va contra la arena de verdad y no contra el retal de aquí arriba, que siempre
        cabe.
      </p>
      <div className="grid gap-1 text-xs">
        <OfferRow label={`Andar · 👢 ${MAX_BOOTS}, el más largo`} steps={MAX_BOOTS} t={t} />
        <OfferRow
          label={`Desplegar · arena ${ARENA.cols}×${ARENA.rows}, desde la mano`}
          steps={DEPLOY_SPAN}
          t={t}
        />
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

/**
 * Los tres relojes, uno al lado del otro, y el interruptor que los iguala.
 *
 * Es la única caja del catálogo donde el número importa tanto como lo que se ve:
 * la igualdad del primer tramo en los tres desenlaces es una PROPIEDAD, y aquí
 * se comprueba de un vistazo en vez de creérsela mirando tres botones.
 */
function Outcomes({ t, onEvenOut }: { t: Timings; onEvenOut: (value: boolean) => void }) {
  const phases = {
    impacto: attackPhases("impacto", t),
    fallo: attackPhases("fallo", t),
    critico: attackPhases("critico", t),
  };
  return (
    <div className="anim-preview__aside">
      <div className="anim-preview__aside-head">Los tres relojes</div>
      <div className="grid gap-1 text-xs">
        <div className="grid grid-cols-[5.5rem_1fr_1fr_1fr] gap-2 font-semibold text-[var(--wiki-muted)]">
          <span />
          <span>Ida</span>
          <span>Congelado</span>
          <span>Vuelta</span>
        </div>
        {(["impacto", "fallo", "critico"] as const).map((id) => (
          <div key={id} className="grid grid-cols-[5.5rem_1fr_1fr_1fr] gap-2 text-[var(--wiki-text)]">
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
      <p className="anim-preview__aside-note mt-2">
        La columna de la <b className="text-[var(--wiki-text)]">ida</b> tiene que ser la misma en
        las tres filas, siempre. Es lo único de esta pantalla que no es cuestión de gusto: si el
        fallo se notara antes del contacto, se leería el resultado en el gesto y una tirada oculta
        sin suspense no sirve para nada.
      </p>
      <label className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--wiki-muted)]">
        <InputSwitch checked={t.evenOut} onChange={(e) => onEvenOut(!!e.value)} />
        <span>
          <b className="text-[var(--wiki-text)]">Que los tres duren lo mismo.</b> No es información,
          es ritmo: sin esto una racha de fallos va más rápida que una de golpes y se nota antes de
          saber por qué. Con esto, el crítico paga su congelado acortando la vuelta. Míralo con una
          tanda en el banco de abajo, no con un ataque suelto de aquí.
        </span>
      </label>
    </div>
  );
}

// Sin `readonly`: el <SelectButton> de PrimeReact pide un array mutable.
const CURVE_OPTIONS: { value: CurveId; label: string }[] = (
  Object.keys(CURVES) as CurveId[]
).map((id) => ({ value: id, label: CURVES[id].label }));

/** Dónde se sostiene la carta: abajo, en el centro, y entera dentro del retal. */
function handSpot(l: PatchLayout): { x: number; y: number } {
  return { x: l.box.w / 2, y: l.box.h - CARD_H / 2 - 6 };
}

/** Las décimas solo cuando el dial las tiene: un «70,00 ms» dice menos que «70». */
function format(value: number, step: number): string {
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3;
  return value.toFixed(decimals).replace(".", ",");
}

/** El catálogo entero, en el orden en el que se construyen las cosas. */
export function AnimationCatalog(props: Omit<AnimationPreviewProps, "spec">) {
  return (
    <div className="anim-catalog">
      {ANIMATIONS.map((spec) => (
        <AnimationPreview key={spec.id} spec={spec} {...props} />
      ))}
    </div>
  );
}
