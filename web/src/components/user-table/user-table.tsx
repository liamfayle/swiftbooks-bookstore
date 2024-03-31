"use client";

import { FC } from "react";
import { Checkbox, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import cx from "clsx";

import { useUserActiveMutation, useUsers, useUserStatusMutation } from "@/api/api";

import classes from "./user-table.module.css";

export const UserTable: FC = () => {
  const { data: users } = useUsers();
  const { mutate: statusMutate } = useUserStatusMutation();
  const { mutate: activeMutate } = useUserActiveMutation();

  const onManagerUpdate = (userId: number, manager: boolean) => {
    statusMutate({ user_id: userId, status_string: manager ? "manager" : "user" });
  };

  const onActiveUpdate = (userId: number, active: boolean) => {
    activeMutate({ user_id: userId, active });
  };

  const rows = !users
    ? null
    : users.map(({ id, username, email, status, active }) => (
        <TableTr key={id} className={cx({ [classes.disabled]: status === "admin" })}>
          <TableTd>{username}</TableTd>
          <TableTd>{email}</TableTd>
          <TableTd>
            <div className={classes.center}>
              <Checkbox
                checked={status === "manager" || status === "admin"}
                name="manager"
                disabled={status === "admin"}
                onChange={() => onManagerUpdate(id, status !== "manager")}
              />
            </div>
          </TableTd>
          <TableTd>
            <div className={classes.center}>
              <Checkbox
                checked={active}
                name="active"
                disabled={status === "admin"}
                onChange={() => onActiveUpdate(id, !active)}
              />
            </div>
          </TableTd>
        </TableTr>
      ));

  return (
    <Table className={classes.table} highlightOnHover highlightOnHoverColor="gray.0">
      <TableThead className={classes.header}>
        <TableTr>
          <TableTh>Name</TableTh>
          <TableTh>Email</TableTh>
          <TableTh>
            <div className={classes.center}>Manager</div>
          </TableTh>
          <TableTh>
            <div className={classes.center}>Active</div>
          </TableTh>
        </TableTr>
      </TableThead>
      <TableTbody className={classes.body}>{rows}</TableTbody>
    </Table>
  );
};
