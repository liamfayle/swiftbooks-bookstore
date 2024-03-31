import { FC, useCallback } from "react";
import { Anchor, AppShell, Title } from "@mantine/core";
import Link from "next/link";
import cx from "clsx";
import { usePathname } from "next/navigation";

import { Hr } from "@/components/hr";
import { links } from "./links";
import { useAuth } from "@/components/auth/auth-context";
import { useCurrentUser } from "@/api/api";

import sharedClasses from "./shared.module.css";
import classes from "./navbar.module.css";

interface NavbarProps {
  onClose?: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onClose }) => {
  const pathname = usePathname();
  const auth = useAuth();
  const { data: user } = useCurrentUser(auth.status.isAuthenticated);

  const isAdmin = Boolean(user?.status === "admin");

  const onLinkClick = useCallback(() => onClose?.(), [onClose]);

  return (
    <AppShell.Navbar hiddenFrom="sm" className={classes.container}>
      <Title order={3} className={sharedClasses.title}>
        Swift <span>Books</span>
      </Title>
      <div className={classes.items}>
        <Hr />
        {links
          .filter(({ admin }) => (admin ? isAdmin : true))
          .map(({ href, label, icon }) => (
            <Anchor
              key={href}
              component={Link}
              href={href}
              className={cx(sharedClasses.link, classes.link, {
                [sharedClasses.active]: pathname === href,
              })}
              onClick={onLinkClick}
            >
              {icon} {label}
            </Anchor>
          ))}
      </div>
    </AppShell.Navbar>
  );
};
