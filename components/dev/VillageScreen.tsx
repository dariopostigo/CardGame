"use client";

// =========================================================================
// Pantalla del Pueblo (Taberna) — el primer escalón de docs/characters/npcs.md
// §3c: ficha → pantalla propia → un punto interactuable (la entrada) → tienda.
//
// Autocontenida a propósito: sin props de router ni estado global, solo
// `onExit`. El tablero, el héroe y el rng de la sesión siguen vivos debajo —
// esto es un overlay a pantalla completa, no una ruta nueva (ver
// docs/board/board-map.md §3c y el propio TokenLab, que la monta y desmonta).
//
// La tienda real no existe todavía (sin oro, sin inventario): la puerta solo
// abre un panel de aviso. Nada se retira al volver — es un edificio, no
// contenido que se consuma — así que se puede reabrir sin límite.
// =========================================================================

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

type VillageScreenProps = {
  readonly onExit: () => void;
};

export default function VillageScreen({ onExit }: VillageScreenProps) {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <div className="village-screen">
      <button
        type="button"
        className={buttonClass({ variant: "ghost", size: "sm" }, "village-screen__exit")}
        onClick={onExit}
      >
        ← Volver al mapa
      </button>

      <div className="village-screen__scene">
        <svg
          className="village-screen__building"
          viewBox="0 0 200 160"
          role="img"
          aria-label="La Taberna"
        >
          <path className="village-screen__roof" d="M16 72 L100 14 L184 72 Z" />
          <rect className="village-screen__wall" x="32" y="72" width="136" height="78" />
          <g
            className="village-screen__door"
            tabIndex={0}
            role="button"
            aria-label="Entrar a la Taberna"
            onClick={() => setShopOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShopOpen(true);
            }}
          >
            <rect x="84" y="104" width="32" height="46" rx="3" />
          </g>
        </svg>
        <p className="village-screen__hint">Entra a la Taberna</p>
      </div>

      {shopOpen && (
        <div className="village-screen__shop-backdrop" onClick={() => setShopOpen(false)}>
          <div
            className="village-screen__shop-panel"
            role="dialog"
            aria-label="Tienda"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-lg font-semibold text-[var(--wiki-text)]">La Taberna</h2>
            <p className="text-sm text-[var(--wiki-muted)]">
              Aquí se abrirá la tienda: comprar y vender, sin oro ni inventario todavía.
            </p>
            <button
              type="button"
              className={buttonClass({}, "mt-4")}
              onClick={() => setShopOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
