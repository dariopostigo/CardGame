"use client";

// Hub del juego: menú lateral con logo, versión y las opciones de
// app/play/. Sale entero de lib/game-menu.ts, así que una opción nueva
// aparece aquí solo con añadir su entrada — mismo patrón que DevSidebar
// con lib/dev-labs.ts.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import packageJson from "@/package.json";
import { HUB_MENU, isHubEntryAvailable } from "@/lib/game-menu";
import { PLAYER_NAME_KEY } from "@/components/game/login/LoginForm";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { gameButtonClass } from "@/components/game/ui/GameButton";

export default function Hub() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PLAYER_NAME_KEY);
    if (!stored) {
      router.replace("/play/login");
      return;
    }
    setPlayerName(stored);
  }, [router]);

  if (!playerName) return null;

  return (
    <div className="game-hub">
      <aside className="game-hub__sidebar">
        <div className={["game-hub__logo", gameFontVars].join(" ")}>
          Card<span className="game-hub__logo-accent">Game</span>
        </div>
        <span className="game-hub__version">BETA · v{packageJson.version}</span>

        <nav className="game-hub__menu">
          {HUB_MENU.map((entry) => {
            const available = isHubEntryAvailable(entry);
            const content = (
              <span className="game-button__label">
                <i className={entry.icon} />
                <span>{entry.label}</span>
              </span>
            );

            if (!available) {
              return (
                <span
                  key={entry.slug}
                  className={gameButtonClass({ block: true }, "game-hub__menu-item")}
                  aria-disabled="true"
                >
                  {content}
                </span>
              );
            }

            return (
              <Link
                key={entry.slug}
                href={`/play/${entry.slug}`}
                className={gameButtonClass({ block: true }, "game-hub__menu-item")}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <span className="game-hub__player">{playerName}</span>
      </aside>

      <main className="game-hub__stage" />
    </div>
  );
}
