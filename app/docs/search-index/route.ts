import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/docs";

// Igual que app/docs/[[...slug]]/page.tsx: el índice se genera leyendo docs/*.md
// del disco, así que tiene que recalcularse en cada request, no quedar congelado.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getSearchIndex());
}
