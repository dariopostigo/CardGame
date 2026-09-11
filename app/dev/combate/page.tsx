import type { Metadata } from "next";
import CombatModule from "@/components/dev/CombatModule";
import { getEffectCatalog } from "@/lib/v3/effects-catalog";
import { pilotCharacters } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: solo lee (catálogos + roster) y monta. Toda la
// interacción vive en CombatModule, el único "use client" de esta ruta
// (ARCHITECTURE.md §6). force-dynamic para que un cambio en razas.md o en
// effects.md no se quede en caché (lo llevan todas las páginas que leen del
// disco).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motor de combate",
  description:
    "Un combate 1 contra 1 entre fichas reales de las dos razas piloto —Humanos y Enanos—: la tirada oculta, el daño y ⚡ Iniciativa de lib/v3/battle.ts, ya no con estadísticas inventadas.",
};

export default function CombatPage() {
  const catalog = getTraitCatalog();
  // Las dos razas piloto (status.md §4). La lista vive en lib/v3/races.ts desde
  // el 10-sep-2026: estaba copiada en las cuatro páginas que la usan.
  const characters = pilotCharacters(getRoster(), catalog);
  const effects = getEffectCatalog();

  return <CombatModule characters={characters} effects={effects} catalog={catalog} />;
}
