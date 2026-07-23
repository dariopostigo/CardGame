import type { Metadata } from "next";
import CardDesignLab from "@/components/design/CardDesignLab";

export const metadata: Metadata = { title: "Diseño de cartas" };

export default function CardDesignPage() {
  return <CardDesignLab />;
}
