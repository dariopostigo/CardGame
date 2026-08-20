import type { Metadata } from "next";
import CardSketchLab from "@/components/design/v3/CardSketchLab";

export const metadata: Metadata = { title: "Diseño de cartas" };

// Sin `dynamic = "force-dynamic"`, a diferencia de su hermana de v2
// (app/docs/v2/cards/design/page.tsx): aquella lee el catálogo de los .md con
// fs y Next no rastrea esas lecturas, así que sin la marca serviría una foto
// congelada. Esta no lee nada del disco —los sujetos de muestra están en
// components/design/v3/sample.ts— así que puede prerenderizarse.
export default function CardSketchPage() {
  return <CardSketchLab />;
}
