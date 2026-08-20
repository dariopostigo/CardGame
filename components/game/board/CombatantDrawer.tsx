"use client";

// =========================================================================
// Ficha de héroe o enemigo, en un panel lateral (presentacional)
//
// No conoce HeroClassId/EnemyClassId ni el motor de reglas: cada lab arma el
// `CombatantDrawerSubject` con los datos que ya tiene (HERO_ROSTER/ENEMY_ROSTER
// + el estado de la sesión) y este componente solo lo pinta. Mismo reparto de
// responsabilidad que HexBoard con `onHexClick`: la interacción sube como
// callback (`onClose`), nunca decide nada de la partida.
//
// Vive fijo al borde derecho de la VENTANA, no del tablero: así no hace falta
// tocar HexBoard.tsx ni su cámara (arrastre/zoom) para nada.
//
// La cabecera toma el color de la propia FICHA que se clicó (piece-art.tsx +
// $piece de settings) en vez de inventar una paleta nueva: es la misma cara
// que ya tiene ese héroe o ese enemigo en el tablero, así que abrir el panel
// se siente como "esto se ha desplegado" y no como una ventana genérica.
// =========================================================================

import { useEffect, useState } from "react";
import type { DamageType } from "@/lib/card-table";
import type { EffectId, Effects } from "@/lib/v2/rules/effects";
import { abilityMod } from "@/lib/v2/rules/hero-roster";
import type { Ability, AbilityScores } from "@/lib/v2/rules/state";
import Button from "@/components/ui/Button";
import { PieceIcon, type PieceSpec } from "./BoardPiece";

const ABILITY_ORDER: readonly Ability[] = [
  "fuerza",
  "destreza",
  "constitucion",
  "inteligencia",
  "sabiduria",
  "carisma",
];

const ABILITY_ABBR: Readonly<Record<Ability, string>> = {
  fuerza: "FUE",
  destreza: "DES",
  constitucion: "CON",
  inteligencia: "INT",
  sabiduria: "SAB",
  carisma: "CAR",
};

const EFFECT_LABEL: Readonly<Record<EffectId, string>> = {
  envenenado: "Envenenado",
  inmovilizado: "Inmovilizado",
};

/** Bajo este umbral de PV la barra pasa a leerse como alarma. */
const LOW_PV_RATIO = 1 / 3;

export type CombatantDrawerSubject = {
  /** La misma ficha (dibujo + color) que ese héroe o enemigo tiene en el tablero. */
  readonly piece: PieceSpec;
  /** "Guerrero" | "Lobo de las lindes". */
  readonly title: string;
  /** Naturaleza de la criatura ("Bestia"…), solo para enemigos. */
  readonly subtitle?: string;
  /**
   * Opcional porque hay fichas que no tienen: un mercenario lleva un bloque
   * plano derivado de su Rareza (`cards/mercenaries.md` §1b) y ni siquiera
   * tiene Destreza —por eso su iniciativa no se tira con el mod de DES—, así
   * que enseñarle una fila de seis dieces sería inventarle unas
   * características que el documento no le da.
   */
  readonly abilityScores?: AbilityScores;
  readonly pv: { readonly current: number; readonly max: number };
  /** Sin equipo en /lab/movement todavía: campo opcional a propósito. */
  readonly ca?: number;
  readonly speed?: number;
  readonly attack?: {
    readonly label: string;
    readonly dice: { readonly count: number; readonly sides: number };
    readonly range: number;
    readonly damageType: DamageType;
  };
  /** Ganchos de habilidad (EnemyAbilityHook) ya traducidos a texto por quien arma el subject. */
  readonly abilityNotes?: readonly string[];
  readonly effects: Effects;
};

type Props = {
  readonly subject: CombatantDrawerSubject | null;
  readonly onClose: () => void;
};

export default function CombatantDrawer({ subject, onClose }: Props) {
  const open = subject !== null;

  // El <aside> vive montado siempre, aunque nunca se haya abierto: así el
  // primer clic ya encuentra el elemento en su sitio (fuera de pantalla vía
  // `transform`) y la transición CSS tiene algo de lo que partir. Sin esto,
  // el primer despliegue aparecería de golpe en vez de deslizarse.
  //
  // `shown` conserva el último sujeto real mientras `subject` es `null`: es
  // lo que se sigue pintando MIENTRAS el panel desliza hacia fuera; si
  // pintáramos `subject` a pelo, el contenido desaparecería de golpe y solo
  // se vería una caja vacía deslizándose.
  const [shown, setShown] = useState(subject);
  if (subject && subject !== shown) {
    setShown(subject);
  }

  // Antes de cerrar, quita el foco de lo que lo tenga: si se queda en el
  // botón de cerrar, ese botón termina con foco dentro de un contenedor
  // `aria-hidden` en cuanto arranca la salida.
  function handleClose() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const pvRatio = shown && shown.pv.max > 0 ? shown.pv.current / shown.pv.max : 0;
  const pvWidth = Math.max(0, Math.min(1, pvRatio)) * 100;

  return (
    <aside
      className="combatant-drawer"
      data-open={open}
      data-piece={shown?.piece.id}
      aria-hidden={!open}
      aria-label={shown ? `Ficha de ${shown.title}` : undefined}
    >
      {shown && (
        <>
          <header className="combatant-drawer__header">
            <PieceIcon piece={shown.piece} size={44} className="combatant-drawer__icon" />
            <div className="combatant-drawer__heading">
              <h2 className="combatant-drawer__title">{shown.title}</h2>
              {shown.subtitle && <p className="combatant-drawer__subtitle">{shown.subtitle}</p>}
            </div>
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              className="combatant-drawer__close"
              aria-label="Cerrar ficha"
              title="Cerrar"
              onClick={handleClose}
            >
              <i className="pi pi-times" />
            </Button>
          </header>

          {/* La key cambia con la ficha mostrada: cada vez que se clica otra,
              el cuerpo se remonta y su animación de entrada vuelve a jugar —
              la cabecera no, para no repetir el deslizamiento lateral si el
              panel ya estaba abierto. */}
          <div className="combatant-drawer__body" key={shown.title + (shown.subtitle ?? "")}>
            <div className="combatant-drawer__pv">
              <div className="combatant-drawer__pv-bar">
                <div
                  className="combatant-drawer__pv-fill"
                  data-low={pvRatio <= LOW_PV_RATIO}
                  style={{ width: `${pvWidth}%` }}
                />
              </div>
              <span className="combatant-drawer__pv-label">
                PV {shown.pv.current}/{shown.pv.max}
              </span>
            </div>

            {shown.abilityScores && (
              <div className="combatant-drawer__abilities">
                {ABILITY_ORDER.map((ability) => (
                  <div key={ability} className="combatant-drawer__ability">
                    <span className="combatant-drawer__ability-label">{ABILITY_ABBR[ability]}</span>
                    <span className="combatant-drawer__ability-value">
                      {shown.abilityScores![ability]}
                    </span>
                    <span className="combatant-drawer__ability-mod">
                      {signed(abilityMod(shown.abilityScores![ability]))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(shown.ca !== undefined || shown.speed !== undefined) && (
              <ul className="combatant-drawer__stats">
                {shown.ca !== undefined && <li>CA {shown.ca}</li>}
                {shown.speed !== undefined && <li>Velocidad {shown.speed}</li>}
              </ul>
            )}

            {shown.attack && (
              <p className="combatant-drawer__attack">
                <b>{shown.attack.label}</b> — {shown.attack.dice.count}d{shown.attack.dice.sides} de daño{" "}
                {shown.attack.damageType}
                {" · "}
                {shown.attack.range === 1 ? "cuerpo a cuerpo" : `alcance ${shown.attack.range}`}
              </p>
            )}

            {shown.abilityNotes && shown.abilityNotes.length > 0 && (
              <ul className="combatant-drawer__notes">
                {shown.abilityNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}

            {shown.effects.length > 0 && (
              <ul className="combatant-drawer__effects">
                {shown.effects.map((effect) => (
                  <li key={effect.id}>
                    {EFFECT_LABEL[effect.id] ?? effect.id} · {effect.turnsLeft} turno{effect.turnsLeft === 1 ? "" : "s"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}
