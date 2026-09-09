import type { Metadata } from "next";
import CombatModule from "@/components/dev/CombatModule";
import { getEffectCatalog } from "@/lib/v3/effects-catalog";
import { charactersOfRace } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: solo lee (catálogos + roster) y monta. Toda la
// interacción vive en CombatModule, el único "use client" de esta ruta
// (ARCHITECTURE.md §6). force-dynamic para que un cambio en razas.md o en
// effects.md no se quede en caché (ver /dev/razas y /dev/cartas).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motor de combate",
  description:
    "Un combate 1 contra 1 entre fichas reales de las dos razas piloto —Humanos y Enanos—: la tirada oculta, el daño y ⚡ Iniciativa de lib/v3/battle.ts, ya no con estadísticas inventadas.",
};

// Las dos razas piloto (status.md §4): igual que en /dev/razas y /dev/cartas.
const PILOT_RACES = ["👤 Humanos", "⛏️ Enanos"];

export default function CombatPage() {
  const catalog = getTraitCatalog();
  const roster = getRoster();
  const characters = PILOT_RACES.flatMap((race) => charactersOfRace(roster, catalog, race));
  const effects = getEffectCatalog();

  return <CombatModule characters={characters} effects={effects} catalog={catalog} />;
}
