import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wiki-prose prose">
      <h1>Documento no encontrado</h1>
      <p>
        La página que buscas no existe. Vuelve al{" "}
        <Link href="/docs">índice de la wiki</Link>.
      </p>
    </div>
  );
}
