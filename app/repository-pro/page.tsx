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
            Los componentes que verá el <b>jugador</b>, con tema medieval: cuero, hierro y sangre,
            con remaches de oro —inspirado en <code>public/assets/UI/example1.jpg</code>—. Ya tiene
            sus dos primeras familias en marcha; el resto sigue siendo la lista de lo que falta por
            construir, que es el mapa del trabajo.
          </p>
          <p className="mt-2">
            Empieza por <b>Fundamentos del tema</b>: hasta que exista la paleta de{" "}
            <code>$game</code> (<code>styles/settings/_game.scss</code>) lo demás son componentes
            sueltos sin tema. Y no es el skin <code>--wiki-*</code> con otros valores: el de las
            herramientas es <i>chrome</i>, conmuta con el claro/oscuro y vive en custom properties;
            este es diegético —forma parte de la ficción del juego, y un cuero curtido no tiene modo
            oscuro— así que es una constante de diseño, como <code>rarity()</code> o{" "}
            <code>terrain()</code>.
          </p>
          <p className="mt-2">
            El marco que estás viendo seguirá siendo sobrio cuando esto se llene: lo medieval va{" "}
            <b>dentro</b> del lienzo de cada especimen. Es la única forma de juzgar un botón de
            hierro sin que la página se lo maquille. Los componentes vivirán en{" "}
            <code>components/game/ui/</code>, junto a{" "}
            <Link
              href="/dev/board"
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
