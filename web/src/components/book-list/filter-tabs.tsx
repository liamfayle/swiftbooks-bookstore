"use client";

import { FC, useCallback, useEffect } from "react";
import { Tabs, TabsList, TabsTab } from "@mantine/core";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { tabs } from "./tabs";

import classes from "./filter-tabs.module.css";
import { useAuth } from "@/components/auth/auth-context";

export const FilterTabs: FC = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (
      !params.has("tab") ||
      !tabs.some(({ id }) => id === params.get("tab")) ||
      (!auth.status.isAuthenticated && params.get("tab") === "user")
    ) {
      router.replace(`${pathname}?tab=public`);
    }
  }, [auth.status.isAuthenticated, params, pathname, router]);

  const onTabChange = useCallback(
    (value: string | null) => {
      if (!value) {
        value = "public";
      }

      router.replace(`${pathname}?tab=${value}`);
    },
    [pathname, router],
  );

  const visibleTabs = tabs.filter(({ secure }) => (secure ? auth.status.isAuthenticated : true));

  if (visibleTabs.length === 1) {
    return null;
  }

  return (
    <Tabs value={params.get("tab")} onChange={onTabChange} className={classes.tabs}>
      <TabsList className={classes.list}>
        {visibleTabs.map(({ id, label }) => (
          <TabsTab key={id} value={id} className={classes.tab}>
            {label}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
};
