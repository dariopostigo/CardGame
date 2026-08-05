"use client";

// Isla de cliente del especimen de radios: Select Game Mode, elección única
// —antes se dibujaba con casillas cuadradas (example1.jpg), ahora con el
// círculo real de <RadioButton> para enseñar el componente sin disfraz—.

import { useState } from "react";
import GameRadio from "@/components/game/ui/GameRadio";

const MODES = [
  { value: "1v1", label: "1v1", hint: "Average waiting time 20s." },
  { value: "2v2", label: "2v2", hint: "Average waiting time 20s." },
  { value: "50v50", label: "50v50", hint: "Average waiting time 20s." },
];

export default function GameRadioDemo() {
  const [mode, setMode] = useState("50v50");

  return (
    <div className="flex flex-col gap-3">
      {MODES.map((m) => (
        <GameRadio
          key={m.value}
          name="mode"
          value={m.value}
          checked={mode === m.value}
          onChange={(e) => setMode(String(e.value))}
          label={m.label}
          hint={m.hint}
        />
      ))}
    </div>
  );
}
