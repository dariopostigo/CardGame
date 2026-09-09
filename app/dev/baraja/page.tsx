import type { Metadata } from "next";
import BarajaModule from "@/components/dev/BarajaModule";
import { unitCardsOfRace } from "@/lib/v3/cards";
import { charactersOfRace } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, las cartas y el montaje. Toda la interacción
// vive en BarajaModule (ARCHITECTURE.md §6), calco de app/dev/cartas/page.tsx.

// Sin esto la lectura de razas.md se congela en el primer render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baraja y Oteo",
  description:
    "El sistema de Mazo/Oteo/mano en sí, con las 16 cartas de unidad reales de las dos razas piloto como relleno: arrastra una carta hasta la arena real y verla convertirse en ficha.",
};

// Las dos razas piloto (status.md §4): igual que en /dev/razas y /dev/cartas.
const PILOT_RACES = ["👤 Humanos", "⛏️ Enanos"];

export default function BarajaPage() {
  const catalog = getTraitCatalog();
  const roster = getRoster();
  const cards = PILOT_RACES.flatMap((race) =>
    unitCardsOfRace(charactersOfRace(roster, catalog, race)),
  );

  return <BarajaModule cards={cards} catalog={catalog} />;
}
