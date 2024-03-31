import { FC, ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-context";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default Layout;
