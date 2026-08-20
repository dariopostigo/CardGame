import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wiki-prose prose">
      <h1>Documento no encontrado</h1>
      <p>
        La página que buscas no existe. Vuelve a la{" "}
        <Link href="/docs/v3">wiki V3</Link>, o mira si está en la{" "}
        <Link href="/docs/v2">v2 congelada</Link> — al partir el diseño en dos
        versiones, varios documentos cambiaron de sitio y otros no se han
        reescrito todavía.
      </p>
    </div>
  );
}
