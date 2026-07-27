import Link from "next/link";
import type { Metadata } from "next";
import RepoIndex from "@/components/repository/RepoIndex";

export const metadata: Metadata = {
  title: { absolute: "Repositorio de producción · CardGame" },
  description:
    "Catálogo de los componentes de interfaz del juego, con tema medieval. Por construir: hoy es el índice de las familias que hará falta.",
};

export default function RepositoryProIndexPage() {
  return (
    <RepoIndex
      side="pro"
      title="Repositorio de producción"
      intro={
        <>
          <p>
            Los componentes que verá el <b>jugador</b>, con tema medieval: pergamino, hierro, madera
            y sangre. Está <b>vacío a propósito</b> —no hay ni un componente de producción todavía—
            y lo que sí hay es la lista completa de familias por construir, que es el mapa del
            trabajo.
          </p>
          <p className="mt-2">
            Empieza por <b>Fundamentos del tema</b>: hasta que existan los tokens{" "}
            <code>--game-*</code> lo demás son componentes sueltos sin tema. Y no son los{" "}
            <code>--wiki-*</code> con otros valores: el skin de las herramientas es{" "}
            <i>chrome</i> con modo claro y oscuro, y este es diegético —forma parte de la ficción, y
            un pergamino no tiene modo oscuro.
          </p>
          <p className="mt-2">
            El marco que estás viendo seguirá siendo sobrio cuando esto se llene: lo medieval va{" "}
            <b>dentro</b> del lienzo de cada especimen. Es la única forma de juzgar un botón de
            hierro sin que la página se lo maquille. Los componentes vivirán en{" "}
            <code>components/game/ui/</code>, junto a{" "}
            <Link
              href="/dev/tablero"
              className="text-[var(--wiki-accent)] underline decoration-dotted"
            >
              los que ya prueban los laboratorios
            </Link>
            .
          </p>
        </>
      }
    />
  );
}
