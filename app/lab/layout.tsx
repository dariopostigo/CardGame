import type { Metadata } from "next";
import type { ReactNode } from "react";
import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: { default: "Lab", template: "%s · CardGame Lab" },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return <LabShell>{children}</LabShell>;
}
