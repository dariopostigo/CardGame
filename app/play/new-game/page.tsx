import type { Metadata } from "next";
import ModeChooser from "@/components/game/new-game/ModeChooser";

export const metadata: Metadata = {
  title: "Nuevo juego · CardGame",
};

export default function NewGamePage() {
  return (
    <div className="game-screen">
      <ModeChooser />
    </div>
  );
}
