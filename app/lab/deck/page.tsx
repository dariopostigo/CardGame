import type { Metadata } from "next";
import DeckLab from "@/components/lab/DeckLab";
import { getCardCatalog } from "@/lib/card-catalog";

// El catálogo se lee de docs/cards/*.md con fs (lib/card-catalog.ts) y Next no
// rastrea esas lecturas como dependencia de caché — igual que el lab de
// diseño de cartas (app/docs/v2/cards/design/page.tsx), o el lab serviría una
// foto congelada del catálogo en vez de reflejar las ediciones de los .md.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baraja y Oteo",
  description:
    "Laboratorio de Mazo y Oteo: tope fijo de \"en juego\" y la regla madre de jugar una carta.",
};

export default function DeckLabPage() {
  const classCards = getCardCatalog().filter((c) => c.category === "clase");
  return <DeckLab classCards={classCards} />;
}
