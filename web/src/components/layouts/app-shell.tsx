"use client";

import { FC, ReactNode } from "react";
import { AppShell, Burger, Title } from "@mantine/core";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import Link from "next/link";

import { CartMenu } from "@/components/cart/cart-menu";
import { AccountMenu } from "@/components/account/account-menu";
import { HeaderLinks } from "@/components/layouts/header-links";
import { Navbar } from "@/components/layouts/navbar";

import logo from "@/images/logo.png";

import classes from "./app-shell.module.css";

export const AppShellLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
    >
      <AppShell.Header className={classes.header}>
        <div className={classes.headerInner}>
          <div className={classes.headerBranding}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

            <Link href="/">
              <Image
                src={logo}
                alt="Swift Books logo"
                width={40}
                height={40}
                className={classes.desktopLogo}
              />
            </Link>
            <Title order={3} className={cx(classes.title, classes.headerTitle)}>
              Swift <span>Books</span>
            </Title>
          </div>

          <Link href="/">
            <Image
              src={logo}
              alt="Swift Books logo"
              width={40}
              height={40}
              className={classes.mobileLogo}
            />
          </Link>

          <HeaderLinks className={classes.links} />

          <div className={classes.headerActions}>
            <CartMenu className={classes.headerAction} />

            <AccountMenu className={classes.headerAction} />
          </div>
        </div>
      </AppShell.Header>

      <Navbar onClose={close} />

      <AppShell.Main>
        <div className={classes.container}>{children}</div>
      </AppShell.Main>
    </AppShell>
  );
};
