"use client";

import { useEffect, useRef, useState } from "react";

const SKINS = [
  { key: "moderno", label: "Pergamino", icon: "pi pi-book" },
  { key: "moderno", label: "Moderno", icon: "pi pi-th-large" },
  { key: "gamer", label: "Gamer", icon: "pi pi-bolt" },
];

const btn =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]";

export default function ThemeControls() {
  const [dark, setDark] = useState(false);
  const [skin, setSkin] = useState("moderno");
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.documentElement;
    setDark(el.classList.contains("dark"));
    setSkin(el.getAttribute("data-skin") || "moderno");
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    localStorage.setItem("wiki-theme", next ? "dark" : "light");
    setDark(next);
  };

  const chooseSkin = (k: string) => {
    document.documentElement.setAttribute("data-skin", k);
    localStorage.setItem("wiki-skin", k);
    setSkin(k);
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative" ref={ref}>
        <button
          className={btn}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Estilo visual"
          title="Estilo visual"
        >
          <i className="pi pi-palette" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-44 rounded-lg border border-[var(--wiki-border)] bg-[var(--wiki-surface)] p-1 shadow-lg">
            {SKINS.map((s) => (
              <button
                key={s.key}
                onClick={() => chooseSkin(s.key)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  skin === s.key
                    ? "bg-[var(--wiki-accent-soft)] text-[var(--wiki-accent)]"
                    : "hover:bg-[var(--wiki-surface-2)]"
                }`}
              >
                <i className={s.icon} />
                <span>{s.label}</span>
                {skin === s.key && <i className="pi pi-check ml-auto text-xs" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className={btn} onClick={toggleDark} aria-label="Claro / oscuro" title="Claro / oscuro">
        <i className={dark ? "pi pi-sun" : "pi pi-moon"} />
      </button>
    </div>
  );
}
