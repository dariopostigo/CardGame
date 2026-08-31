import type { Metadata } from "next";
import AnimationModule from "@/components/dev/AnimationModule";

// Server Component: solo metadata y montaje. Toda la interacción vive en
// AnimationModule, que es el único "use client" de esta ruta (ARCHITECTURE.md §6).

export const metadata: Metadata = {
  title: "Animación",
  description:
    "El banco donde se decide cómo se siente V3: soltar una carta y que se convierta en ficha, la caída con su polvo, el golpe con su congelado y la baja con su fogonazo.",
};

export default function AnimationPage() {
  return <AnimationModule />;
}
