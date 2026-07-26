import type { Metadata } from "next";
import type { ReactNode } from "react";
import DevShell from "@/components/dev/DevShell";

export const metadata: Metadata = {
  title: { default: "Dev", template: "%s · CardGame Dev" },
};

export default function DevLayout({ children }: { children: ReactNode }) {
  return <DevShell>{children}</DevShell>;
}
