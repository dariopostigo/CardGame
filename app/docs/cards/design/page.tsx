import type { Metadata } from "next";
import CardDesignLab from "@/components/design/CardDesignLab";
import { getCardCatalog } from "@/lib/card-catalog";

export const metadata: Metadata = { title: "Diseño de cartas" };

// El catálogo se lee de docs/cards/*.md con fs (lib/card-catalog.ts) y Next no
// rastrea esas lecturas como dependencia de caché — igual que la wiki
// (app/docs/[[...slug]]/page.tsx), o el lab serviría una foto congelada del
// catálogo en vez de reflejar las ediciones de los .md.
export const dynamic = "force-dynamic";

export default function CardDesignPage() {
  return <CardDesignLab cards={getCardCatalog()} />;
}
