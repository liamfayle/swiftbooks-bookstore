import { FC, ReactNode } from "react";
import { DateTime } from "luxon";
import cx from "clsx";

import { useNumberFormat } from "@/utils";

import classes from "./infos.module.css";

const dateFormat = (value: ReactNode) => {
  if (typeof value != "string") {
    return value;
  }

  const dateTime = DateTime.fromISO(value);

  if (!dateTime.isValid) {
    return value;
  }

  return dateTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
};

export interface Info {
  value: ReactNode;
  label: ReactNode;
  id: string;
  type?: "default" | "datetime" | "tags" | "number";
}

export interface InfosProps {
  infos: Info[];
  size?: "default" | "sm";
}

export const Infos: FC<InfosProps> = ({ infos, size = "default" }) => {
  const validInfos = infos.filter(({ value, type }) =>
    type === "tags" ? Array.isArray(value) && value.length : value != null,
  );

  const numberFormat = useNumberFormat();

  return (
    <div className={cx(classes.infoContainer, { [classes.sm]: size === "sm" })}>
      {validInfos.map(({ id, label, value, type }) => (
        <div key={id} className={cx(classes.infoRow, { [classes.double]: type === "tags" })}>
          <div className={classes.label}>{label}:</div>
          <div className={classes.value}>
            {type === "datetime"
              ? dateFormat(value)
              : type === "number" && typeof value === "number"
                ? numberFormat.format(value)
                : value}
          </div>
        </div>
      ))}
    </div>
  );
};
