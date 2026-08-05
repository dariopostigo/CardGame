"use client";

// Isla de cliente del especimen de casillas: dos interruptores acumulables e
// independientes (no excluyentes, por eso casilla y no radio).

import { useState } from "react";
import GameCheckbox from "@/components/game/ui/GameCheckbox";

export default function GameCheckboxDemo() {
  const [music, setMusic] = useState(true);
  const [autoLoot, setAutoLoot] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <GameCheckbox
        checked={music}
        onChange={(e) => setMusic(e.checked ?? false)}
        label="Battle Music"
        hint="Play the combat theme during encounters."
      />
      <GameCheckbox
        checked={autoLoot}
        onChange={(e) => setAutoLoot(e.checked ?? false)}
        label="Auto-Loot"
        hint="Pick up common items automatically."
      />
    </div>
  );
}
