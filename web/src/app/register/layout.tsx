import { FC, ReactNode } from "react";

import { GuestGuard } from "@/components/auth/auth-context";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return <GuestGuard>{children}</GuestGuard>;
};

export default Layout;
