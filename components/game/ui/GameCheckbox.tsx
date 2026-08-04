// Fila de selección del remache de hierro: la casilla de SELECT GAME MODE en
// example1.jpg (public/assets/UI/), cuadro hueco que solo muestra su check
// dorado al marcarse. El <input> real queda debajo, visualmente oculto pero
// presente para el foco y el lector de pantalla —no es una casilla de
// mentira dibujada con un <div>—.
//
// type="radio" vale igual que type="checkbox": en la referencia la lista de
// modos de partida es de elección única pero se dibuja con cuadros, no
// círculos, así que el que decide exclusividad es el atributo, no el look.

import type { InputHTMLAttributes, ReactNode } from "react";

type GameCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  type?: "checkbox" | "radio";
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
};

export default function GameCheckbox({
  type = "checkbox",
  label,
  hint,
  className,
  ...rest
}: GameCheckboxProps) {
  return (
    <label className={["game-checkbox", className].filter(Boolean).join(" ")}>
      <input type={type} className="game-checkbox__input" {...rest} />
      <span className="game-checkbox__box">
        <i className="pi pi-check" />
      </span>
      <span className="game-checkbox__text">
        <span className="game-type-body game-checkbox__label">{label}</span>
        {hint && <span className="game-type-meta game-checkbox__hint">{hint}</span>}
      </span>
    </label>
  );
}
