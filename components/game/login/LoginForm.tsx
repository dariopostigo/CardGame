"use client";

// Identidad local, no autenticación real: no hay backend todavía
// (ARCHITECTURE.md §0), así que "loguearse" es guardar un nombre en
// localStorage, igual que ya hace el tema claro/oscuro
// (components/wiki/ThemeControls.tsx). El día que exista un backend de
// verdad, esto es lo que se sustituye.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import GameInput from "@/components/game/ui/GameInput";
import GameButton from "@/components/game/ui/GameButton";
import GameLoadingScreen from "@/components/game/ui/GameLoadingScreen";

export const PLAYER_NAME_KEY = "cardgame.player-name";

export default function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [entering, setEntering] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    localStorage.setItem(PLAYER_NAME_KEY, trimmed);
    setEntering(true);
    // Loading simulado: no hay nada real que esperar todavía, pero la
    // transición debe sentirse igual que cuando sí lo haya.
    setTimeout(() => router.push("/play"), 900);
  }

  if (entering) return <GameLoadingScreen label="Entrando" />;

  return (
    <form className="game-screen__panel" onSubmit={handleSubmit}>
      <h1 className="game-screen__title">CardGame</h1>
      <label className="game-screen__field">
        <span className="game-screen__label">Nombre de jugador</span>
        <GameInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={24}
          placeholder="¿Cómo te llamamos?"
        />
      </label>
      <GameButton type="submit" variant="primary" block disabled={!name.trim()}>
        Entrar
      </GameButton>
    </form>
  );
}
