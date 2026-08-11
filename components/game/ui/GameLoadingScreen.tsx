// Transición entre pantallas del juego: el logo y cuatro puntos en cascada,
// nada más —no hay barra de progreso real que medir, es una carga simulada
// entre rutas—. Vive en components/game/ui/ porque la usan varias pantallas
// (login → hub, hub → nuevo juego…), igual que GameButton.

import { gameFontVars } from "./game-fonts";

export default function GameLoadingScreen({ label = "Cargando" }: { label?: string }) {
  return (
    <div className={["game-loading", gameFontVars].join(" ")} role="status" aria-live="polite">
      <span className="game-loading__logo">
        Card<span className="game-loading__logo-accent">Game</span>
      </span>
      <span className="game-loading__dots" aria-hidden="true">
        <span className="game-loading__dot" />
        <span className="game-loading__dot" />
        <span className="game-loading__dot" />
        <span className="game-loading__dot" />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
