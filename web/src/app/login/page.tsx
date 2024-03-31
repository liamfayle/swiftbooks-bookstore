import { Metadata } from "next";
import { FC } from "react";

import { Login } from "@/components/auth/login";

import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Login | Swift Books",
};

const LoginPage: FC = () => {
  return (
    <>
      <div className={classes.container}>
        <Login />
      </div>
    </>
  );
};

export default LoginPage;
