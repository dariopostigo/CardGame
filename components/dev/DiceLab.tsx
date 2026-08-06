"use client";

// =========================================================================
// Laboratorio de TIRADA DE DADOS — /dev/dice
//
// Prueba de una técnica de UI, no una regla de juego: si vale la pena
// sustituir el botón-que-hace-random() por dados físicos de verdad
// (Three.js + cannon-es, calco de codepen.io/Mant0uStudio/pen/ZYWywJB)
// generalizados a los 7 tipos de D&D. Toda la geometría y la física viven
// en dice-geometry.ts/dice-scene.ts, sin React de por medio — este
// componente solo monta el lienzo, ofrece los mandos (tipo, cantidad,
// lanzar) y pinta el resultado que le devuelve el motor.
//
// Deliberadamente NO conectado a lib/rules/rng.ts: ese motor es
// determinista (misma semilla → misma tirada, para poder reproducir una
// partida) y el azar de este lab sale de la física, no de una semilla. Si
// los dados físicos llegan a sustituir alguna tirada real del juego, esa
// tensión hay que resolverla antes — no aquí.
// =========================================================================

import { useEffect, useRef, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { buttonClass } from "@/components/ui/Button";
import { DICE_KINDS, DICE_LABEL, type DiceKind } from "./dice-geometry";
import { mountDiceScene, type DiceRollResult, type DiceSceneHandle } from "./dice-scene";

const COUNT_OPTIONS = [1, 2, 3, 4] as const;

export default function DiceLab() {
  const [kind, setKind] = useState<DiceKind>("d6");
  const [count, setCount] = useState<number>(2);
  const [result, setResult] = useState<DiceRollResult | null>(null);
  const [rolling, setRolling] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<DiceSceneHandle | null>(null);

  // Se monta una sola vez: el motor vive fuera de React durante toda la
  // vida del componente, y setDice/throwDice lo mutan sin desmontarlo.
  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;

    const handle = mountDiceScene(container, {
      onRollStart: () => setResult(null),
      onResult: (r) => {
        setResult(r);
        setRolling(false);
      },
    });
    sceneRef.current = handle;

    return () => {
      handle.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Cambiar tipo o cantidad reconstruye la bandeja (nuevo dado, sin arrastrar
  // el resultado de la anterior). El reset de `result` va en los propios
  // manejadores de cambio, no aquí: un setState síncrono dentro del efecto
  // dispara un re-render en cascada evitable.
  useEffect(() => {
    sceneRef.current?.setDice(kind, count);
  }, [kind, count]);

  function handleThrow() {
    setRolling(true);
    sceneRef.current?.throwDice();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Tirada de dados</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Dados físicos de verdad —Three.js para la malla, cannon-es para la caída, gravedad y
        rebote— en vez de un botón que hace un <code>random()</code> y anima un número. El
        resultado no se lee de ninguna animación: se calcula viendo qué cara del dado ya parado
        apunta más hacia arriba (el d4 es la excepción: como en uno físico, se apoya sobre una
        cara entera y se lee el vértice que queda arriba).
      </p>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        Arrastra los dados de la bandeja y suéltalos para lanzarlos, o usa el botón «Tirar». El d6
        es el calco directo de la referencia; el resto (d4, d8, d10, d12, d20, d100) sale de la
        misma receta generalizada: geometría del sólido + qué cara mira hacia dónde + qué valor
        lleva cada una — ver <code>components/dev/dice-geometry.ts</code>.
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            Dado
          </span>
          <SelectButton
            value={kind}
            onChange={(e) => {
              if (!e.value) return;
              setKind(e.value);
              setResult(null);
            }}
            options={DICE_KINDS.map((k) => ({ label: DICE_LABEL[k], value: k }))}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
            Cantidad
          </span>
          <SelectButton
            value={count}
            onChange={(e) => {
              if (e.value === null) return;
              setCount(e.value);
              setResult(null);
            }}
            options={COUNT_OPTIONS.map((n) => ({ label: String(n), value: n }))}
            optionLabel="label"
            optionValue="value"
            allowEmpty={false}
          />
        </div>

        <button className={buttonClass({ variant: "primary" })} onClick={handleThrow}>
          Tirar
        </button>
      </div>

      <div className="dice-lab">
        <div ref={stageRef} className="dice-lab__stage" />

        <div className={`dice-lab__result ${result ? "dice-lab__result--show" : ""}`}>
          {rolling && !result ? (
            <span className="dice-lab__rolling">Rodando…</span>
          ) : result ? (
            <>
              <span className="dice-lab__total">{result.total}</span>
              {result.rolls.length > 1 && (
                <span className="dice-lab__detail">({result.rolls.join(" + ")})</span>
              )}
            </>
          ) : (
            <span className="dice-lab__rolling">Arrastra los dados o pulsa «Tirar»</span>
          )}
        </div>
      </div>
    </div>
  );
}
