import type { Metadata } from "next";
import TokenLab from "@/components/dev/TokenLab";
import { getCardCatalog } from "@/lib/card-catalog";

// El catálogo se lee de docs/cards/*.md con fs (lib/card-catalog.ts) y Next no
// rastrea esas lecturas como dependencia de caché — igual que /dev/deck, o
// el lab serviría una foto congelada del catálogo en vez de reflejar las
// ediciones de los .md (loot, mazo de encuentro).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fichas del tablero",
  description:
    "Laboratorio de resolución de fichas: prueba de Terreno, tabla de loot de Tesoro y mazo de encuentro.",
};

export default function TokensLabPage() {
  return <TokenLab catalog={getCardCatalog()} />;
}
