import { ReactNode } from "react";
import { render as testingLibraryRender } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";

import { theme } from "@/theme";
import { client } from "@/api/api";
import { AuthProvider, InitGuard } from "@/components/auth/auth-context";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

export function render(ui: ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MantineProvider theme={theme}>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <InitGuard>{children}</InitGuard>
          </AuthProvider>
        </QueryClientProvider>
      </MantineProvider>
    ),
  });
}
