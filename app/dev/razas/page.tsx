import type { Metadata } from "next";
import RaceModule from "@/components/dev/RaceModule";
import { charactersOfRace } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, el roster y el montaje. Toda la interacción
// vive en RaceModule (ARCHITECTURE.md §6), calco de app/dev/personaje/page.tsx.

// Sin esto la lectura de razas.md se congela en el primer render, igual que
// le pasaba a la wiki antes de leer los .md en vivo.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Razas y unidades",
  description:
    "El roster real de las dos razas piloto —Humanos y Enanos—: sus 4 héroes y sus 8 unidades cada una, construidos desde razas.md con la anatomía de /dev/personaje.",
};

// Las dos razas piloto (status.md §4): la v1 se juega con estas dos, el
// resto queda en StandBy hasta que RACE_BASES (character.ts) traiga su par.
const PILOT_RACES = ["👤 Humanos", "⛏️ Enanos"];

export default function RacesPage() {
  const catalog = getTraitCatalog();
  const roster = getRoster();
  const characters = PILOT_RACES.flatMap((race) => charactersOfRace(roster, catalog, race));

  return <RaceModule characters={characters} catalog={catalog} />;
}
