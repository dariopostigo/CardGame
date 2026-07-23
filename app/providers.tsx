"use client";

import { PrimeReactProvider } from "@primereact/core/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { useLayoutEffect, type ReactNode } from "react";

// PrimeReact v11 comprueba una licencia PRO al montar el provider, aunque
// solo se usen componentes community (gratuitos, los únicos que usa esta
// wiki). Sin clave configurada, imprime un console.warn "[PrimeUI] ..." y
// además inyecta un banner fijo "Invalid PrimeUI License" en la esquina de
// la página, dentro de un shadow DOM cerrado pensado para resistir el
// ocultado por CSS (ver node_modules/@primereact/core/license). No usamos
// ningún componente PRO, así que es puro ruido de nag: lo neutralizamos aquí
// sin tocar node_modules (un patch ahí se perdería al reinstalar deps).
type WarnFn = typeof console.warn;
const PATCHED = Symbol("primeui-warn-patched");
if (!(console.warn as WarnFn & { [PATCHED]?: true })[PATCHED]) {
  const originalWarn = console.warn.bind(console);
  const patchedWarn: WarnFn & { [PATCHED]?: true } = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("[PrimeUI]")) return;
    originalWarn(...args);
  };
  patchedWarn[PATCHED] = true;
  console.warn = patchedWarn;
}

function useHidePrimeUILicenseBanner() {
  useLayoutEffect(() => {
    const remove = () => document.getElementById("p-license-host")?.remove();
    remove();
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);
}

// Preset de PrimeReact basado en Aura con acento ámbar/oro (coherente con el
// juego de cartas de fantasía). El grueso de la identidad visual vive en las
// variables CSS de globals.css; esto solo tiñe los componentes de PrimeReact.
const WikiPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{amber.50}",
      100: "{amber.100}",
      200: "{amber.200}",
      300: "{amber.300}",
      400: "{amber.400}",
      500: "{amber.500}",
      600: "{amber.600}",
      700: "{amber.700}",
      800: "{amber.800}",
      900: "{amber.900}",
      950: "{amber.950}",
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  useHidePrimeUILicenseBanner();
  return (
    <PrimeReactProvider
      ripple
      theme={{
        preset: WikiPreset,
        options: {
          darkModeSelector: ".dark",
          cssLayer: {
            name: "primereact",
            order: "theme, base, primereact, components, utilities",
          },
        },
      }}
    >
      {children}
    </PrimeReactProvider>
  );
}
