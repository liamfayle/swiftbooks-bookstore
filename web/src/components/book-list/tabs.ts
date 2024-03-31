import { ReactNode } from "react";

export type Tab = "public" | "user";

export const tabs: { id: Tab; label: ReactNode; secure?: boolean }[] = [
  { id: "public", label: "Public" },
  { id: "user", label: "Yours", secure: true },
];
