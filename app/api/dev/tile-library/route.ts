// =========================================================================
// Guardar la biblioteca de losetas — solo en desarrollo
//
// El laboratorio de /dev/losetas edita data/tile-library.json y esta ruta es la
// que lo escribe. Existe porque la alternativa era copiar y pegar literales a
// mano: dibujar veinte hexágonos y luego trasladarlos al código es donde se
// colaban los errores.
//
// EN PRODUCCIÓN NO EXISTE: responde 404. Un endpoint que escribe en el
// repositorio no tiene nada que hacer en un servidor desplegado, y no basta con
// no enlazarlo. Por lo mismo escribe un único fichero, cuya ruta se fija aquí:
// nada de lo que llegue en la petición decide dónde se escribe.
//
// Guardar VALIDA primero, con la misma función que valida al arrancar: si el
// editor manda una biblioteca rota, la respuesta es la lista de problemas y el
// fichero se queda como estaba. Una biblioteca inválida en disco tiraría la
// aplicación entera en el siguiente arranque.
// =========================================================================

import { NextResponse } from "next/server";
import { parseLibrary, toStoredLibrary, validateTileTypes } from "@/lib/rules/tiles";
import { readLibraryFile, writeLibraryFile } from "@/lib/tile-library-file";

// Lee del disco en cada petición: lo que devuelva tiene que ser lo que hay ahora.
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV !== "production";

const notFound = () => new NextResponse("Not Found", { status: 404 });

export async function GET() {
  if (!isDev) return notFound();
  return NextResponse.json(await readLibraryFile());
}

export async function PUT(request: Request) {
  if (!isDev) return notFound();

  let types;
  try {
    types = parseLibrary(await request.json());
  } catch (error) {
    // Ni siquiera se puede leer como biblioteca: el mensaje del parser dice dónde.
    return NextResponse.json({ problems: [message(error)] }, { status: 400 });
  }

  const problems = validateTileTypes(types);
  if (problems.length > 0) {
    return NextResponse.json({ problems }, { status: 400 });
  }

  // Se escribe lo que ha salido del parseo, no lo que llegó: así el fichero
  // queda siempre en forma canónica, con los campos que toca y sin nada de más.
  const library = toStoredLibrary(types);
  try {
    await writeLibraryFile(library);
  } catch (error) {
    return NextResponse.json({ problems: [message(error)] }, { status: 500 });
  }

  return NextResponse.json({ library });
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
