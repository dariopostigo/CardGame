// =========================================================================
// Los nueve estados de docs/v3/effects.md §5, leídos del documento
//
// SE PARSEA, NO SE COPIA, por lo mismo que las 41 Características de
// `traits.ts` (ARCHITECTURE.md §7): el catálogo está escrito y cerrado en un
// markdown que se edita a mano, y una segunda copia en TypeScript se despega el
// día que alguien afine una duración. Si la tabla cambia de forma, esto revienta
// con el archivo y la línea, que es lo que hay que hacer en el borde.
//
// ESTO NO ES EL MÓDULO «Estados y efectos», que es el 8 de la cadena y va
// después del motor de combate: allí vive lo que un estado HACE —el tic de daño,
// la expiración, las pilas—. Aquí solo está el catálogo, o sea el nombre, el
// glifo y las cifras que el documento ya trae; es lo que hace falta para pintar
// tres chapas en una ficha y saber que son las de verdad. Cuando el módulo 8
// exista, importará esto en vez de escribir su propia lista.
//
// Puro: sin `node:fs`. Quien lee el archivo es `effects-catalog.ts`.
// =========================================================================

export type EffectFamily = "dano" | "control";

export type Effect = {
  /** Slug del nombre, sin tildes: `quemadura`, `envenenamiento`… */
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly what: string;
  /** Porcentaje de daño al final de cada turno, o null si no hace daño. */
  readonly damagePerTurn: number | null;
  /** Turnos que dura. */
  readonly duration: number;
  /** Pilas que admite, o null si no acumula. */
  readonly stacks: number | null;
  /** Qué lo aplica: Características o disparadores, tal cual los nombra la tabla. */
  readonly appliedBy: readonly string[];
  readonly family: EffectFamily;
};

/** Sin tildes y en minúsculas, para comparar y para hacer slugs. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function slug(label: string): string {
  return norm(label)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** El énfasis del markdown fuera: la tabla usa negrita para resaltar cifras. */
function plain(cell: string): string {
  return cell.replace(/\*\*/g, "").trim();
}

const SECTION = "5. el catalogo";

/** `| 🔥 **Quemadura** | … |` — el glifo y el nombre en negrita, en la primera celda. */
const NAME_CELL = /^(\S+)\s+\*\*(.+?)\*\*$/u;

export function parseEffects(md: string, source = "effects.md"): readonly Effect[] {
  const lines = md.split(/\r?\n/);

  // El §5 y no cualquier tabla: el documento tiene otra en el §4 (acumulación)
  // con dos columnas, y el §6 habla de inmunidades.
  const start = lines.findIndex((l) => /^##\s+/.test(l) && norm(l.replace(/^#+\s*/, "")) === SECTION);
  if (start === -1) {
    throw new Error(`${source}: no se encuentra la sección «## 5. El catálogo».`);
  }
  const end = lines.findIndex((l, i) => i > start && /^##\s+/.test(l));
  const body = lines.slice(start + 1, end === -1 ? lines.length : end);

  const effects: Effect[] = [];
  const seen = new Set<string>();

  body.forEach((line, offset) => {
    const at = `${source}:${start + 2 + offset}`;
    if (!line.trimStart().startsWith("|")) return;

    const cells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

    // La cabecera y la línea de guiones de la tabla.
    if (/^-+$/.test(cells[0].replace(/[\s:]/g, ""))) return;
    if (norm(cells[0]) === "estado") return;

    if (cells.length !== 6) {
      throw new Error(
        `${at}: la fila del catálogo tiene ${cells.length} columnas y la tabla declara 6.\n  ${line.trim()}`,
      );
    }

    const [nameCell, whatCell, damageCell, durationCell, stacksCell, sourceCell] = cells;
    const name = NAME_CELL.exec(nameCell);
    if (!name) {
      throw new Error(
        `${at}: la primera celda no es «<glifo> **Nombre**».\n  ${nameCell}`,
      );
    }
    const [, icon, label] = name;

    const damageText = plain(damageCell);
    const damagePerTurn = damageText === "—" ? null : Number.parseInt(damageText, 10);
    if (damagePerTurn !== null && Number.isNaN(damagePerTurn)) {
      throw new Error(`${at}: «${damageText}» no es un porcentaje ni un guion.`);
    }

    const duration = Number.parseInt(plain(durationCell), 10);
    if (Number.isNaN(duration)) {
      throw new Error(`${at}: «${plain(durationCell)}» no es una duración en turnos.`);
    }

    // `no` o `sí (3)`: las pilas van entre paréntesis cuando las hay.
    const stacksText = norm(plain(stacksCell));
    const stacksMatch = /\((\d+)\)/.exec(stacksText);
    const stacks = stacksMatch ? Number.parseInt(stacksMatch[1], 10) : null;
    if (stacks === null && !stacksText.startsWith("no")) {
      throw new Error(`${at}: «${plain(stacksCell)}» no dice ni «no» ni «sí (n)».`);
    }

    const id = slug(label);
    if (seen.has(id)) throw new Error(`${at}: el estado «${label}» está dos veces.`);
    seen.add(id);

    effects.push({
      id,
      icon,
      label,
      what: plain(whatCell),
      damagePerTurn,
      duration,
      stacks,
      // §4 parte el catálogo en dos familias por lo que hacen, y la línea que
      // las separa es exactamente si hacen daño por turno.
      family: damagePerTurn === null ? "control" : "dano",
      appliedBy: plain(sourceCell)
        .split("·")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    });
  });

  if (effects.length === 0) {
    throw new Error(`${source}: la sección «5. El catálogo» no tiene ni una fila de estado.`);
  }

  return effects;
}
