import type { Metadata } from "next";
import type { ReactNode } from "react";
import RepoShell from "@/components/repository/RepoShell";

export const metadata: Metadata = {
  title: { default: "Repositorio de desarrollo", template: "%s · CardGame Repo. dev" },
};

export default function RepositoryDevLayout({ children }: { children: ReactNode }) {
  return <RepoShell side="dev">{children}</RepoShell>;
}
