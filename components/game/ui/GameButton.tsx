// Botón de producción: el remache de hierro con bisel de example1.jpg
// (public/concepts/UI/), no el botón plano de las herramientas
// (components/ui/Button.tsx). Es el jugador quien lo ve, así que vive en
// components/game/ui/ y no en components/ui/ — mismo trato que
// components/game/board/ con las piezas del tablero.
//
// Dos pesos nada más, los dos que hay en la referencia: NEUTRO (acero
// oscuro — LEADERBOARDS, ACCEPT, CHANGE CLASS) y PRIMARIO (sangre — PLAY
// NOW, READY). No hay variante "fantasma" ni "destructiva": en la
// referencia todo botón lleva caja, así que inventar una sin caja sería
// documentar un componente que no existe.
//
// gameFontVars va en el propio <button>, no en un contenedor: un componente
// de galería tiene que funcionar solo, sin exigir que quien lo use recuerde
// envolverlo en un elemento con la fuente cargada.

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { gameFontVars } from "./game-fonts";

export type GameButtonVariant = "neutral" | "primary";

export type GameButtonLook = {
  /** Peso visual. Por defecto el neutro, el del hierro. */
  variant?: GameButtonVariant;
  size?: "sm" | "md";
  /** Cuadrado, sin rótulo. Exige `aria-label`. */
  iconOnly?: boolean;
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
};

/** Las clases del botón, por si algún día hace falta un <button> escrito a mano. */
export function gameButtonClass(look: GameButtonLook = {}, extra?: string): string {
  const { variant = "neutral", size = "md", iconOnly, block } = look;

  return [
    "game-button",
    `game-button--${variant}`,
    size === "sm" && "game-button--sm",
    iconOnly && "game-button--icon",
    block && "game-button--block",
    gameFontVars,
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type GameButtonProps = GameButtonLook &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    className?: string;
    children?: ReactNode;
  };

export default function GameButton({
  variant,
  size,
  iconOnly,
  block,
  className,
  type = "button",
  children,
  ...rest
}: GameButtonProps) {
  return (
    <button
      type={type}
      className={gameButtonClass({ variant, size, iconOnly, block }, className)}
      {...rest}
    >
      <span className="game-button__label">{children}</span>
    </button>
  );
}
