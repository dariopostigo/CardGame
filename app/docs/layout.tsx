import type { ReactNode } from "react";
import { getNavTree } from "@/lib/docs";
import Shell from "@/components/wiki/Shell";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const nav = getNavTree();
  return <Shell nav={nav}>{children}</Shell>;
}
