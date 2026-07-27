import type { Metadata } from "next";
import type { ReactNode } from "react";
import RepoShell from "@/components/repository/RepoShell";

export const metadata: Metadata = {
  title: { default: "Repositorio de producción", template: "%s · CardGame Repo. pro" },
};

export default function RepositoryProLayout({ children }: { children: ReactNode }) {
  return <RepoShell side="pro">{children}</RepoShell>;
}
