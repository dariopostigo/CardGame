"use client";

// <Dropdown> es de las que se manejan solas (v10, sin genéricos): no hay
// forma no controlada, así que el especimen necesita su estado. Es la única
// isla de cliente de app/repository-pro/forms/page.tsx —GameCheckbox y
// GameSlider no la necesitan— por eso vive aparte y no en la propia página.

import { useState } from "react";
import GameSelect from "@/components/game/ui/GameSelect";

const VISUAL_STYLES = [
  { label: "Notes of Music", value: "notes-of-music" },
  { label: "Dark Fantasy", value: "dark-fantasy" },
  { label: "Grimdark", value: "grimdark" },
];

export default function GameSelectDemo() {
  const [value, setValue] = useState("notes-of-music");

  return (
    <GameSelect
      value={value}
      onChange={(e) => setValue(String(e.value))}
      options={VISUAL_STYLES}
      optionLabel="label"
      optionValue="value"
      aria-label="Visual Style"
    />
  );
}
