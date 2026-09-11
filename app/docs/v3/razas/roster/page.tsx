import type { Metadata } from "next";
import RosterView from "@/components/wiki/RosterView";
import { pilotCharacters } from "@/lib/v3/races";
import { getRoster, getTraitCatalog } from "@/lib/v3/traits-catalog";

// Página de wiki que no es un .md, como su vecina /docs/v3/cards/design: el
// catch-all de app/docs/[[...slug]] solo sirve documentos, y una carpeta con
// nombre propio gana sobre él. Entra en el menú por lib/docs.ts `getNavTree()`,
// que es donde se declaran las páginas especiales de cada grupo.
//
// SE MUDÓ DESDE /dev/razas EL 10 DE SEPTIEMBRE DE 2026. El motivo está en la
// cabecera de components/wiki/RosterView.tsx; el módulo sigue en la cadena de
// construcción con `home` apuntando aquí (lib/dev-registry.ts).

// Sin esto la lectura de razas.md se congela en el primer render y editar el
// documento no cambiaría nada en pantalla — el mismo motivo por el que lo lleva
// el resto de la wiki.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El roster en datos",
  description:
    "Las fichas de las dos razas piloto —Humanos y Enanos—: sus 4 héroes y sus 8 unidades cada una, construidos en vivo desde razas.md con la anatomía de /dev/personaje.",
};

export default function RosterPage() {
  const catalog = getTraitCatalog();
  const characters = pilotCharacters(getRoster(), catalog);

  return <RosterView characters={characters} catalog={catalog} />;
}
