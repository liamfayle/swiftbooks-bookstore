import { useSearchParams } from "next/navigation";

import { Tab } from "./tabs";
import { useAuth } from "@/components/auth/auth-context";

export const useFilterTab = (): Tab => {
  const params = useSearchParams();
  const auth = useAuth();

  const tab = params.get("tab");

  if (
    !params.has("tab") ||
    !tab ||
    (tab !== "public" && tab !== "user") ||
    (tab === "user" && !auth.status.isAuthenticated)
  ) {
    return "public";
  }

  return tab;
};
