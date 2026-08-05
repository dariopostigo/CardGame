"use client";

// Hermano de GameCheckbox para la elección excluyente: reviste <RadioButton>
// de PrimeReact en vez de reutilizar el checkbox con type="radio" —son
// componentes distintos en la librería (cx/estado propios), así que aquí
// también van separados—. Redondo a propósito: el cuadro es cosa de la
// casilla, el círculo es lo que se reconoce como radio button.

import { useId, type ReactNode } from "react";
import { RadioButton, type RadioButtonProps } from "primereact/radiobutton";

type GameRadioProps = RadioButtonProps & {
  label?: ReactNode;
  hint?: ReactNode;
};

export default function GameRadio({
  className,
  inputId,
  label,
  hint,
  ...rest
}: GameRadioProps) {
  const autoId = useId();
  const id = inputId ?? autoId;

  return (
    <span className="game-radio">
      <RadioButton
        inputId={id}
        className={["game-radio__control", className].filter(Boolean).join(" ")}
        {...rest}
      />
      {(label || hint) && (
        <label htmlFor={id} className="game-radio__text">
          {label && <span className="game-type-body game-radio__label">{label}</span>}
          {hint && <span className="game-type-meta game-radio__hint">{hint}</span>}
        </label>
      )}
    </span>
  );
}
