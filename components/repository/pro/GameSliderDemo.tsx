"use client";

// Isla de cliente del especimen de deslizadores: <Slider> de PrimeReact es
// controlado igual que <Dropdown>, así que necesita el mismo estado aparte.

import { useState } from "react";
import GameSlider from "@/components/game/ui/GameSlider";
import { Cluster } from "@/components/repository/Showcase";

export default function GameSliderDemo() {
  const [lockStrength, setLockStrength] = useState(65);
  const [priorityBias, setPriorityBias] = useState(30);

  return (
    <Cluster>
      <GameSlider
        className="w-48"
        value={lockStrength}
        onChange={(e) => setLockStrength(Number(e.value))}
        aria-label="Target Lock Strength"
      />
      <GameSlider
        className="w-48"
        value={priorityBias}
        onChange={(e) => setPriorityBias(Number(e.value))}
        aria-label="Enemy Priority Bias"
      />
    </Cluster>
  );
}
