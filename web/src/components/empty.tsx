import { FC, HTMLAttributes } from "react";
import cx from "clsx";

import classes from "./empty.module.css";

export const Empty: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...rest }) => {
  return (
    <span className={cx(classes.empty, className)} {...rest}>
      {children}
    </span>
  );
};
