"use client";

// Campo de texto nuevo, sin equivalente nativo previo: reviste <InputText>
// de PrimeReact, que por debajo es un <input> normal —admite value/onChange
// controlados o defaultValue sin controlar, igual que el nativo—.

import { InputText, type InputTextProps } from "primereact/inputtext";

export default function GameInput({ className, ...rest }: InputTextProps) {
  return (
    <InputText className={["game-input", className].filter(Boolean).join(" ")} {...rest} />
  );
}
