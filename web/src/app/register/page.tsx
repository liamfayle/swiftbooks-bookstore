import { Metadata } from "next";
import { FC } from "react";

import { Register } from "@/components/auth/register";

import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Register | Swift Books",
};

const RegisterPage: FC = () => {
  return (
    <>
      <div className={classes.container}>
        <Register />
      </div>
    </>
  );
};

export default RegisterPage;
