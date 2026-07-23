"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import type { SearchDoc } from "@/lib/docs";

type Result = { href: string; title: string; group: string; sub?: string };

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function SearchBox() {
  const router = useRouter();
  const { control, watch, reset } = useForm<{ q: string }>({ defaultValues: { q: "" } });
  const q = watch("q");
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (index) return;
    try {
      const res = await fetch("/docs/search-index");
      setIndex((await res.json()) as SearchDoc[]);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    const query = norm((q || "").trim());
    if (!index || query.length < 2) {
      setResults([]);
      return;
    }
    const scored: (Result & { score: number })[] = [];
    for (const d of index) {
      let score = 0;
      let sub: string | undefined;
      if (norm(d.title).includes(query)) score += 100;
      const h = d.headings.find((x) => norm(x.text).includes(query));
      if (h) {
        score += 40;
        sub = h.text;
      }
      if (!score && norm(d.text).includes(query)) score += 10;
      if (score) {
        scored.push({
          href: h ? `${d.href}#${h.id}` : d.href,
          title: d.title,
          group: d.group,
          sub,
          score,
        });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 8));
    setActive(0);
  }, [q, index]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (r?: Result) => {
    const target = r ?? results[active];
    if (!target) return;
    router.push(target.href);
    setOpen(false);
    reset({ q: "" });
  };

  return (
    <div className="relative" ref={boxRef}>
      <span className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-[var(--wiki-muted)]">
        <i className="pi pi-search text-sm" />
      </span>
      <Controller
        name="q"
        control={control}
        render={({ field }) => (
          <InputText
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            onFocus={() => {
              load();
              setOpen(true);
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go();
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Buscar…"
            className="w-40 pl-8 sm:w-56"
          />
        )}
      />
      {open && results.length > 0 && (
        <ul className="absolute right-0 z-40 mt-1 max-h-96 w-[min(24rem,90vw)] overflow-auto rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-1 shadow-xl">
          {results.map((r, i) => (
            <li key={r.href}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full flex-col items-start rounded-md px-3 py-2 text-left ${
                  i === active ? "bg-[var(--wiki-accent-soft)]" : "hover:bg-[var(--wiki-surface-2)]"
                }`}
              >
                <span className="text-sm font-medium">{r.title}</span>
                <span className="text-xs text-[var(--wiki-muted)]">
                  {r.group}
                  {r.sub ? ` · ${r.sub}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
