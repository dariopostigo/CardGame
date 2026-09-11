import type { Metadata } from "next";
import BarajaModule from "@/components/dev/BarajaModule";
import { unitCardsOfRace } from "@/lib/v3/cards";
import { pilotCharacters } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Server Component: metadata, las cartas y el montaje. Toda la interacción
// vive en BarajaModule (ARCHITECTURE.md §6). Las mismas 16 cartas que pinta
// /docs/v3/cards/catalogo, con la misma llamada.

// Sin esto la lectura de razas.md se congela en el primer render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baraja y Oteo",
  description:
    "El sistema de Mazo/Oteo/mano en sí, con las 16 cartas de unidad reales de las dos razas piloto como relleno: arrastra una carta hasta la arena real y verla convertirse en ficha.",
};

export default function BarajaPage() {
  const catalog = getTraitCatalog();
  // Las dos razas piloto (status.md §4). La lista vive en lib/v3/races.ts desde
  // el 10-sep-2026: estaba copiada en las cuatro páginas que la usan.
  const cards = unitCardsOfRace(pilotCharacters(getRoster(), catalog));

  return <BarajaModule cards={cards} catalog={catalog} />;
}
