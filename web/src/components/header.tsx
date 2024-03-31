import { FC, ReactNode } from "react";
import { Title } from "@mantine/core";
import cx from "clsx";

import classes from "./header.module.css";

export interface HeaderProps {
  order?: 1 | 2;
  noMargin?: boolean;
  action?: ReactNode;
  children: ReactNode;
}

export const Header: FC<HeaderProps> = ({ order = 1, noMargin = false, children, action }) => {
  return (
    <div
      className={cx(classes.container, {
        [classes.margin]: !noMargin && order === 1,
        [classes.margin2]: !noMargin && order === 2,
      })}
    >
      <Title
        order={order}
        className={cx({ [classes.header]: order === 1, [classes.header2]: order === 2 })}
      >
        {children}
      </Title>
      <div>{action}</div>
    </div>
  );
};
