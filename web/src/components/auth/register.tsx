"use client";

import { FC } from "react";
import { PasswordInput, TextInput } from "@mantine/core";

import { AuthBox } from "@/components/auth/auth-box";
import { useFormik } from "formik";
import { useRegisterMutation } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";

import { schema } from "@shared/validation/register";

export const Register: FC = () => {
  const { mutate, isPending } = useRegisterMutation();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: { name: "", email: "", username: "", password: "" },
    validationSchema: schema,
    onSubmit(values) {
      mutate(
        {
          name: values.name,
          email: values.email,
          username: values.username,
          password: values.password,
        },
        {
          onSuccess: (data) => {
            auth.login(data.token);
          },
        },
      );
    },
  });

  return (
    <AuthBox variant="register" loading={isPending} onSubmit={formik.handleSubmit}>
      <TextInput
        placeholder="Full name"
        variant="filled"
        size="md"
        name="name"
        id="register-name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && formik.errors.name}
      />
      <TextInput
        placeholder="Email"
        variant="filled"
        size="md"
        name="email"
        id="register-email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />
      <TextInput
        placeholder="Username"
        variant="filled"
        size="md"
        name="username"
        id="register-username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && formik.errors.username}
      />
      <PasswordInput
        placeholder="Password"
        variant="filled"
        size="md"
        name="password"
        id="register-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />
    </AuthBox>
  );
};
