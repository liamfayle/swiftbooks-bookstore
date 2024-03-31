import { FC } from "react";
import { Button, Card } from "@mantine/core";
import { TextInput } from "@mantine/core";
import * as yup from "yup";
import { useFormik } from "formik";

import { Header } from "@/components/header";
import { useOAuthRegisterMutation } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";

import classes from "@/components/auth/auth-box.module.css";

const schema = yup.object({
  username: yup.string().required("Username is required"),
});

export interface OauthRegisterProps {
  name: string;
  email: string;
  token: string;
  onSubmit?: () => void;
}

export const OAuthRegister: FC<OauthRegisterProps> = ({ name, email, token }) => {
  const { mutate } = useOAuthRegisterMutation();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: schema,
    onSubmit(values) {
      mutate(
        { username: values.username, token },
        {
          onSuccess: (data) => {
            auth.login(data.token);
          },
        },
      );
    },
  });

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className={classes.container}>
      <Header>Register</Header>
      <form
        className={classes.sectionContainer}
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        <div className={classes.inputContainer}>
          <TextInput
            placeholder="Name"
            name="name"
            id="oauth-reigster-name"
            variant="filled"
            size="md"
            value={name}
            disabled
          />
          <TextInput
            placeholder="Email"
            name="email"
            id="oauth-reigster-email"
            variant="filled"
            size="md"
            value={email}
            disabled
          />
          <TextInput
            placeholder="Username"
            name="username"
            id="oauth-reigster-username"
            variant="filled"
            size="md"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />
        </div>
        <Button type="submit" variant="filled">
          REGISTER
        </Button>
      </form>
    </Card>
  );
};
