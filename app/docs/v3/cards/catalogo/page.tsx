import type { Metadata } from "next";
import UnitCatalogView from "@/components/wiki/UnitCatalogView";
import { unitCardsOfRace } from "@/lib/v3/cards";
import { pilotCharacters } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Página de wiki que no es un .md, calco de ../design/ y de ../../razas/roster/.
//
// SE MUDÓ DESDE /dev/cartas EL 10 DE SEPTIEMBRE DE 2026, con el roster y por lo
// mismo (components/wiki/UnitCatalogView.tsx). El módulo «cartas» sigue en la
// cadena de construcción con `home` apuntando aquí.

// Sin esto la lectura de razas.md se congela en el primer render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El catálogo en datos",
  description:
    "Las 16 cartas de unidad de las dos razas piloto —Humanos y Enanos—: el Character de cada ficha más su ilustración real, leídos en vivo de razas.md.",
};

export default function UnitCatalogPage() {
  const catalog = getTraitCatalog();
  const cards = unitCardsOfRace(pilotCharacters(getRoster(), catalog));

  return <UnitCatalogView cards={cards} catalog={catalog} />;
}
