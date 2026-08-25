import type { Metadata } from "next";
import CardDeck from "@/components/design/v3/CardDeck";

export const metadata: Metadata = { title: "Diseño baraja" };

// Sin `dynamic = "force-dynamic"`, igual que su hermana de bocetos
// (app/docs/v3/cards/design/page.tsx): no lee nada del disco —el roster real
// de la raza piloto está en components/design/v3/sample.ts—, así que se
// prerenderiza.
export default function CardDeckPage() {
  return <CardDeck />;
}
