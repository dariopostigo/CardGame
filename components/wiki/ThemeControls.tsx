"use client";

import { useEffect, useState } from "react";

const btn =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--wiki-text)] hover:bg-[var(--wiki-surface-2)]";

export default function ThemeControls() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    localStorage.setItem("wiki-theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button className={btn} onClick={toggleDark} aria-label="Claro / oscuro" title="Claro / oscuro">
      <i className={dark ? "pi pi-sun" : "pi pi-moon"} />
    </button>
  );
}
