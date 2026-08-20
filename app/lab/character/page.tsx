import type { Metadata } from "next";
import CharacterLab from "@/components/lab/CharacterLab";

export const metadata: Metadata = {
  title: "Personaje 3D",
  description:
    "Modelo .glb con esqueleto y animaciones dentro, reproducido en el navegador: la alternativa a hornear una lámina de sprites.",
};

export default function CharacterLabPage() {
  return <CharacterLab />;
}
