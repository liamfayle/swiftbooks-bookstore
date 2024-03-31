import { FC } from "react";
import { Metadata } from "next";

import { Header } from "@/components/header";
import { UserTable } from "@/components/user-table/user-table";

export const metadata: Metadata = {
  title: "Users | Swift Books",
};

const Users: FC = () => {
  return (
    <>
      <Header>Users</Header>
      <UserTable />
    </>
  );
};

export default Users;
