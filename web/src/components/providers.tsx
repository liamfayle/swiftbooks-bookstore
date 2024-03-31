"use client";

import { FC, ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { client } from "@/api/api";
import { AuthProvider, InitGuard } from "@/components/auth/auth-context";

export interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <InitGuard>{children}</InitGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
};
