"use client";

import { FC } from "react";
import { PasswordInput, TextInput } from "@mantine/core";
import { useFormik } from "formik";

import { AuthBox } from "@/components/auth/auth-box";
import { ServerError, useLoginMutation } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";
import { schema } from "@shared/validation/login";

export const Login: FC = () => {
  const { mutate, isPending, isError, error } = useLoginMutation();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit(values) {
      mutate(
        { email: values.email, password: values.password },
        {
          onSuccess: (data) => {
            auth.login(data.token);
          },
        },
      );
    },
  });

  const errorMessage = isError && error instanceof ServerError ? error.message : undefined;

  return (
    <AuthBox
      variant="login"
      loading={isPending}
      onSubmit={formik.handleSubmit}
      error={errorMessage}
    >
      <TextInput
        placeholder="Email"
        name="email"
        id="login-email"
        variant="filled"
        size="md"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />
      <PasswordInput
        placeholder="Password"
        name="password"
        id="login-password"
        variant="filled"
        size="md"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />
    </AuthBox>
  );
};
