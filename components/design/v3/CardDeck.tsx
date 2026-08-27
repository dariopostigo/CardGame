"use client";

import { useState } from "react";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { sketchFontVars } from "./sketch-fonts";
import SketchCard from "./sketch-cards";
import { DECK_RACES } from "./races";
import { raceArtFor } from "./sample";

// =========================================================================
// Diseño baraja — el marco YA elegido, sobre el roster real
//
// Es el hermano definitivo de components/design/v3/CardSketchLab.tsx: aquel
// compara nueve bocetos con sujetos de muestra mientras el marco se decide;
// este no compara nada — pinta LA carta elegida, J · Orla (25 de agosto de
// 2026, tras la comparación completa en Cartas › Diseño de cartas), sobre los
// personajes reales del juego, agrupados por raza.
//
// CUATRO RAZAS DE ONCE, Y ES A PROPÓSITO. knowledge/v3/races-concept/razas.md
// tiene las 11 razas con nombre, icono, tipo de daño y Características de sus
// 8 unidades y 4 héroes, pero NINGUNA tiene números de Habilidades escritos:
// los de 👤 Humanos, ⛏️ Enanos, 💀 No-muertos y 🔥 Demonios infernales están
// inventados, con la forma real (una, dos o tres cifras) y dentro de la escala
// cerrada, pero sin que el valor esté decidido (ver el aviso en sample.ts, en
// races.ts y en razas.md §"La escala"). Las otras siete no tienen ni uno, y esta
// página no se los inventa en bloque para rellenar un hueco: crece raza a raza,
// y cada una que entra se escribe con SU sesgo — ⛏️ Enanos aguantan y no
// alcanzan, 💀 No-muertos no tienen suerte ni defensa, 🔥 Demonios pegan más que
// nadie y caen. Cuatro razas con los mismos números serían una raza pintada
// cuatro veces, que de un marco no enseña nada.
//
// El roster no vive aquí, vive en races.ts: 👤 Humanos se importa de sample.ts,
// que es la muestra del laboratorio de bocetos, y las demás se escriben allí.
// Ahí está el porqué de la separación — añadir razas a sample.ts las metería en
// la comparación de nueve marcos, que con cuarenta y ocho cartas por marco deja
// de ser una comparación.

// El filtro de raza se escribió contra un array de un elemento, cuando no
// filtraba nada, para que el día de la segunda raza no hubiera que tocar esta
// página — y las tres siguientes entraron sin mover una línea de aquí, solo la
// suya en DECK_RACES. Con cuatro razas son 48 cartas en "Todas", y con las once
// serán 132, donde el filtro deja de ser una comodidad y pasa a ser la única
// forma de mirar la página.
//
// "use client" entra por esto: sin ALGÚN control no haría falta estado y la
// página sería, como antes, un componente de servidor.
const ALL_RACES = "@todas";

export default function CardDeck() {
  const [race, setRace] = useState<string>(ALL_RACES);

  const shownRaces =
    race === ALL_RACES ? DECK_RACES : DECK_RACES.filter((r) => r.name === race);

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
        carta sobre el <b>roster real</b> del juego, raza por raza. Hoy{" "}
        <b>👤 Humanos</b>, <b>⛏️ Enanos</b>, <b>💀 No-muertos</b> y{" "}
        <b>🔥 Demonios infernales</b> — cuatro de las cinco razas base de{" "}
        <code className="rounded bg-[var(--wiki-code-bg)] px-1.5 py-0.5 text-[0.8em]">
          knowledge/v3/races-concept/razas.md
        </code>
        , 48 cartas. Nombres, tipo de daño y Características salen de ahí tal
        cual; los números de las 8 Habilidades son <b>inventados</b> —con la
        forma real, dentro de la escala cerrada y con el sesgo de cada raza, pero
        sin decidir—. Falta 🧝 Elfos para cerrar las bases; las seis de DLC
        quedan fuera hasta que estas sean jugables.
      </p>

      {/* El filtro de raza, y ya el único control de la página. Se pinta
          SIEMPRE, a diferencia de la fila de bocetos de CardSketchLab, y con
          cuatro razas ya es la única forma de mirar la página: 48 cartas en
          "Todas" contra doce por raza.

          Al lado vivió, del 26 al 27 de agosto de 2026, un conmutador
          pictograma / emoji para la fila de ocho. Se quita al empezar a fijar
          el resultado final de la carta: el pictograma está elegido, y un botón
          para volver al emoji dejaba la página enseñando dos cartas distintas
          cuando lo que tiene que enseñar es LA carta. */}
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
      </div>

      {/* Escenario. Mismo objeto que el laboratorio de bocetos
          (objects/_stage.scss); el fondo oscuro lo pone .sketch-lab.

          Sin data-alloy: la baraja va con el metal por defecto de settings/
          (card-sketch("alloy"), hoy el latón medido de los pictogramas), igual
          que el laboratorio de bocetos.

          Hasta el 27 de agosto de 2026 esta página clavaba data-alloy="carbon"
          —la probeta de aleación (styles/components/card-sketch/_alloy-probe.scss)
          usada sin su picker— para quedarse en Carbón pasara lo que pasara con
          el valor de settings/. Se quita al elegir metal: la baraja es donde se
          mira la carta tal cual va a ser, y un metal propio la convertía en una
          segunda opinión sobre algo ya decidido. */}
      <div className="card-lab__stage">
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
