// Elegir modalidad (docs/game-design.md §1b, paso 1). Campaña sale apagada
// a propósito: "saldría comentado de momento" — no se quita del menú, se
// deja ver como lo que falta por construir, igual que el resto del roadmap
// visible en /dev y en los repositorios de componentes.

import Link from "next/link";
import { gameButtonClass } from "@/components/game/ui/GameButton";

export default function ModeChooser() {
  return (
    <div className="game-screen__panel">
      <h1 className="game-screen__title">Nuevo juego</h1>

      <Link href="/play/new-game/quick" className={gameButtonClass({ variant: "primary", block: true })}>
        <span className="game-button__label">Partida rápida</span>
      </Link>

      <span
        className={gameButtonClass({ block: true })}
        aria-disabled="true"
        title="Próximamente"
      >
        <span className="game-button__label">Campaña</span>
      </span>
    </div>
  );
}
