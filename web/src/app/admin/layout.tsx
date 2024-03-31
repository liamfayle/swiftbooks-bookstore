import { FC, ReactNode } from "react";

import { AdminGuard, AuthGuard } from "@/components/auth/auth-context";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthGuard>
      <AdminGuard>{children}</AdminGuard>
    </AuthGuard>
  );
};

export default Layout;
