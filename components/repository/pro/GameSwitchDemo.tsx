"use client";

// Isla de cliente del especimen de interruptores: dos ajustes que se notan
// al instante, sin confirmar nada —por eso interruptor y no casilla—.

import { useState } from "react";
import GameSwitch from "@/components/game/ui/GameSwitch";

export default function GameSwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [pvp, setPvp] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <GameSwitch
        checked={notifications}
        onChange={(e) => setNotifications(Boolean(e.value))}
        label="Guild Notifications"
      />
      <GameSwitch checked={pvp} onChange={(e) => setPvp(Boolean(e.value))} label="PvP Mode" />
    </div>
  );
}
