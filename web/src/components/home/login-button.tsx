"use client";

import { FC } from "react";
import { Button } from "@mantine/core";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-context";
import { IconArrowRight } from "@tabler/icons-react";

export const LoginButton: FC = () => {
  const auth = useAuth();

  if (auth.status.isAuthenticated) {
    return null;
  }

  return (
    <Button
      component={Link}
      variant="filled"
      href="/login"
      rightSection={<IconArrowRight size="1.25rem" />}
      mt="1rem"
    >
      LOGIN
    </Button>
  );
};
