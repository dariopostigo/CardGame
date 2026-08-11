import type { Metadata } from "next";
import Link from "next/link";
import { gameButtonClass } from "@/components/game/ui/GameButton";

// Siguiente parada: la selección de héroe estilo "versus" (docs/game-design.md
// §1b, paso 2). Todavía no construida — este stub marca el sitio exacto
// donde entra, en vez de dejar un enlace muerto desde ModeChooser.

export const metadata: Metadata = {
  title: "Partida rápida · CardGame",
};

export default function QuickGamePage() {
  return (
    <div className="game-screen">
      <div className="game-screen__panel">
        <h1 className="game-screen__title">Partida rápida</h1>
        <p className="game-type-body text-sm">
          Selección de héroe: próximamente.
        </p>
        <Link href="/play/new-game" className={gameButtonClass({ block: true })}>
          <span className="game-button__label">Volver</span>
        </Link>
      </div>
    </div>
  );
}
