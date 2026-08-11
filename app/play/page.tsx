import type { Metadata } from "next";
import Hub from "@/components/game/hub/Hub";

// Antes esta ruta redirigía a /dev/board (resto del prototipo, previo a que
// existiera /dev). Ahora que hay hub real, ese acceso rápido al tablero
// sigue disponible tal cual desde /dev — no se ha escondido, solo ha dejado
// de vivir aquí.

export const metadata: Metadata = {
  title: "CardGame",
};

export default function HubPage() {
  return <Hub />;
}
