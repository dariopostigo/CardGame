"use client";

// Interruptor nuevo, sin equivalente nativo previo: reviste <InputSwitch> de
// PrimeReact, que ya trae la pista y el pomo como <span>/<div> reales (no un
// <input type="checkbox"> con accent-color, que en el slider ya dio problemas
// por depender del widget de fábrica del navegador).

import { useId, type ReactNode } from "react";
import { InputSwitch, type InputSwitchProps } from "primereact/inputswitch";

type GameSwitchProps = InputSwitchProps & {
  label?: ReactNode;
  hint?: ReactNode;
};

export default function GameSwitch({
  className,
  inputId,
  label,
  hint,
  ...rest
}: GameSwitchProps) {
  const autoId = useId();
  const id = inputId ?? autoId;

  return (
    <span className="game-switch">
      <InputSwitch
        inputId={id}
        className={["game-switch__control", className].filter(Boolean).join(" ")}
        {...rest}
      />
      {(label || hint) && (
        <label htmlFor={id} className="game-switch__text">
          {label && <span className="game-type-body game-switch__label">{label}</span>}
          {hint && <span className="game-type-meta game-switch__hint">{hint}</span>}
        </label>
      )}
    </span>
  );
}
