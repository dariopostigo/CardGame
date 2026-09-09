import type { Metadata } from "next";
import CardModule from "@/components/dev/CardModule";
import { unitCardsOfRace } from "@/lib/v3/cards";
import { charactersOfRace } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, las cartas y el montaje. Toda la interacción
// vive en CardModule (ARCHITECTURE.md §6), calco de app/dev/razas/page.tsx.

// Sin esto la lectura de razas.md se congela en el primer render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de cartas",
  description:
    "Las 16 cartas de unidad de las dos razas piloto —Humanos y Enanos—: el Character de cada ficha más su ilustración real, leídos en vivo de razas.md.",
};

// Las dos razas piloto (status.md §4): igual que en /dev/razas.
const PILOT_RACES = ["👤 Humanos", "⛏️ Enanos"];

export default function CardsPage() {
  const catalog = getTraitCatalog();
  const roster = getRoster();
  const cards = PILOT_RACES.flatMap((race) =>
    unitCardsOfRace(charactersOfRace(roster, catalog, race)),
  );

  return <CardModule cards={cards} catalog={catalog} />;
}
