import type { Metadata } from "next";
import { GroupHeader } from "@/components/repository/Showcase";
import FormShowcase from "@/components/repository/dev/FormShowcase";
import { groupBySlug } from "@/lib/repository";

// La página es de servidor (aquí vive la metadata) y el catálogo entero es la
// isla de cliente: los controles hay que poder usarlos para juzgarlos.

const group = groupBySlug("dev", "forms")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function FormulariosPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />
      <FormShowcase />
    </div>
  );
}
