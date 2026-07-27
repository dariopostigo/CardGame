import type { Metadata } from "next";
import RepoIndex from "@/components/repository/RepoIndex";

export const metadata: Metadata = {
  title: { absolute: "Repositorio de desarrollo · CardGame" },
  description:
    "Catálogo de los componentes de interfaz de las herramientas de CardGame: botones, campos, selectores, títulos y textos sobre el skin de la wiki.",
};

export default function RepositoryDevIndexPage() {
  return (
    <RepoIndex
      side="dev"
      title="Repositorio de desarrollo"
      intro={
        <>
          <p>
            Los controles con los que están hechas la wiki y los laboratorios. Son{" "}
            <b>PrimeReact 11</b> sobre el skin <code>--wiki-*</code>, así que todo lo de aquí se ve
            en claro y en oscuro: el interruptor de la cabecera es parte de la prueba, no un extra.
          </p>
          <p className="mt-2">
            Esta es la piel <b>sobria</b>, la que vemos nosotros. El tema medieval del jugador vive
            en el repositorio de producción y no comparte ni un token con esta.
          </p>
        </>
      }
    />
  );
}
