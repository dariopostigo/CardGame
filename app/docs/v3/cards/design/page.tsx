import type { Metadata } from "next";
import CardDesign from "@/components/design/v3/CardDesign";

export const metadata: Metadata = { title: "Diseño de cartas" };

// UNA PÁGINA, y hasta el 3 de septiembre de 2026 eran dos: esta enseñaba los
// bocetos de marco sobre sujetos de muestra y `../deck/` pintaba el elegido
// sobre el roster real. Eran una comparación y su resultado; cerrada la
// comparación con la L · Lámina, se fundieron aquí y la ruta /docs/v3/cards/deck
// se borró con su carpeta.
//
// Sin `dynamic = "force-dynamic"`, a diferencia de su hermana de v2
// (app/docs/v2/cards/design/page.tsx): aquella lee el catálogo de los .md con
// fs y Next no rastrea esas lecturas, así que sin la marca serviría una foto
// congelada. Esta no lee nada del disco —el roster está escrito en
// components/design/v3/races.ts, que importa 👤 Humanos de sample.ts— así que
// puede prerenderizarse.
export default function CardDesignPage() {
  return <CardDesign />;
}
