"use client";

import { useState } from "react";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { sketchFontVars } from "./sketch-fonts";
import SketchCard from "./sketch-cards";
import { HEROES, UNITS, type Subject } from "./sample";

// =========================================================================
// Diseño baraja — el marco YA elegido, sobre el roster real
//
// Es el hermano definitivo de components/design/v3/CardSketchLab.tsx: aquel
// compara nueve bocetos con sujetos de muestra mientras el marco se decide;
// este no compara nada — pinta LA carta elegida, J · Orla (25 de agosto de
// 2026, tras la comparación completa en Cartas › Diseño de cartas), sobre los
// personajes reales del juego, agrupados por raza.
//
// UNA SOLA RAZA HOY, Y ES A PROPÓSITO. knowledge/v3/races-concept/razas.md
// tiene las 11 razas con nombre, icono, tipo de daño y Características de sus
// 8 unidades y 4 héroes, pero SOLO 👤 Humanos tiene números de Habilidades
// escritos —Vida, Ataque, Defensa...— y esos son inventados, con la forma
// real (una, dos o tres cifras) pero sin que el valor esté decidido (ver el
// aviso en sample.ts y razas.md §"La escala"). Las otras diez razas no tienen
// ni un número, y esta página no se los inventa para rellenar un hueco: crece
// raza a raza, según razas.md se complete, no de golpe con datos que nadie ha
// escrito.
//
// UNITS y HEROES son los mismos que pinta el laboratorio de bocetos
// (sample.ts): es el roster real de la raza piloto, no una selección aparte,
// así que no hay dos copias del mismo dato que puedan desalinearse.
const RACES: readonly {
  readonly name: string;
  readonly icon: string;
  readonly units: readonly Subject[];
  readonly heroes: readonly Subject[];
}[] = [{ name: "Humanos", icon: "👤", units: UNITS, heroes: HEROES }];

// El filtro de raza, escrito ANTES de que haga falta. Con una sola raza en
// RACES no filtra nada de verdad, pero once razas de ocho unidades y cuatro
// héroes cada una son 132 cartas en una sola página, y para entonces filtrar
// por raza deja de ser una comodidad y pasa a ser la única forma de mirarla
// sin perderse en el scroll. Escribirlo hoy, contra un array de un elemento,
// es la manera de comprobar que el mecanismo funciona sin tener que volver a
// tocarlo el día que razas.md tenga la segunda raza con números: esa raza solo
// necesita una línea nueva en RACES, nada de esta página.
//
// "use client" entra por esto: sin ALGÚN control no haría falta estado y la
// página sería, como antes, un componente de servidor.
const ALL_RACES = "@todas";

export default function CardDeck() {
  const [race, setRace] = useState<string>(ALL_RACES);
  const shownRaces = race === ALL_RACES ? RACES : RACES.filter((r) => r.name === race);

  const btn = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-[var(--wiki-accent)] bg-[var(--wiki-accent-soft)] font-medium text-[var(--wiki-accent)]"
        : "border-[var(--wiki-border)] text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]"
    }`;

  return (
    <div className={`sketch-lab ${sketchFontVars} ${gameFontVars}`}>
      <h1 className="mb-1 text-2xl font-bold text-[var(--wiki-text)]">Diseño baraja</h1>
      <p className="mb-5 max-w-3xl text-sm text-[var(--wiki-muted)]">
        El diseño de carta de V3 ya está elegido: <b>J · Orla</b> — el octógono de
        la G/H, encendido por dentro con la veta de Rareza, detrás de un borde
        negro macizo como el de una carta de Magic: The Gathering. Se decidió el
        25 de agosto de 2026, tras nueve bocetos comparados en{" "}
        <b>Cartas › Diseño de cartas</b>. Esta página no compara nada: pinta esa
        carta sobre el <b>roster real</b> del juego, raza por raza. Hoy solo{" "}
        <b>👤 Humanos</b>, la única raza con números de Habilidades escritos en{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/races-concept/razas.md
        </code>{" "}
        —inventados, con la forma real pero sin decidir—; las otras diez se
        suman aquí según se les escriban los suyos.
      </p>

      {/* El filtro de raza. A diferencia de la fila de bocetos de
          CardSketchLab, se pinta SIEMPRE, aunque hoy solo filtre entre
          "Todas" y "👤 Humanos" sin mover una carta: es la manera de ver el
          control ya en la página, no solo en el código, mientras
          knowledge/v3/races-concept/razas.md no tenga números para una
          segunda raza. */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
          Raza
        </span>
        <button className={btn(race === ALL_RACES)} onClick={() => setRace(ALL_RACES)}>
          Todas
        </button>
        {RACES.map((r) => (
          <button key={r.name} className={btn(race === r.name)} onClick={() => setRace(r.name)}>
            {r.icon} {r.name}
          </button>
        ))}
      </div>

      {/* Escenario. Mismo objeto que el laboratorio de bocetos
          (objects/_stage.scss); el fondo oscuro lo pone .sketch-lab.

          data-alloy="carbon" es fijo y no un control: reutiliza la probeta de
          aleación (styles/components/card-sketch/_alloy-probe.scss) sin su
          picker, para clavar la baraja en Carbón pase lo que pase con el
          metal por defecto de settings/ ($sketch-alloy, hoy Peltre) — que
          sigue siendo el que abre el laboratorio de bocetos y puede cambiar
          ahí sin mover esta página. Si el día de mañana Carbón deja de ser el
          elegido, este atributo es el único sitio que hay que tocar. */}
      <div className="card-lab__stage" data-alloy="carbon">
        {shownRaces.map((r) => (
          <section key={r.name} className="mb-10 last:mb-0">
            <h2 className="mb-5 text-center text-lg font-semibold text-[var(--wiki-text)]">
              {r.icon} {r.name}
            </h2>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              Unidades
            </h3>
            <div className="card-lab__grid mb-8">
              {r.units.map((s) => (
                <SketchCard key={s.id} id="orla" subject={s} />
              ))}
            </div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
              Héroes
            </h3>
            <div className="card-lab__grid">
              {r.heroes.map((s) => (
                <SketchCard key={s.id} id="orla" subject={s} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
