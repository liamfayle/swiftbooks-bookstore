import React, { AnchorHTMLAttributes, FC, ReactNode } from "react";
import cx from "clsx";
import Link, { LinkProps } from "next/link";
import { Anchor } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import classes from "./return-breadcrumb.module.css";

export const ReturnBreadcrumb: FC<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: ReactNode;
    }
> = ({ children, className, ...rest }) => {
  return (
    <Anchor component={Link} c="violet" className={cx(classes.breadcrumb, className)} {...rest}>
      <IconArrowLeft />
      {children}
    </Anchor>
  );
};
