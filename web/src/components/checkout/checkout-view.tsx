"use client";

import { FC, useEffect } from "react";
import { Grid, GridCol } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

import { Form } from "./form";
import { Summary } from "./summary";
import { useAuth } from "@/components/auth/auth-context";
import { useCart } from "@/api/api";

export const CheckoutView: FC = () => {
  const auth = useAuth();
  const { data: cartItems, isSuccess } = useCart(auth.status.isAuthenticated);
  const router = useRouter();
  const [submitted, { open }] = useDisclosure();

  useEffect(() => {
    if (auth.status.isAuthenticated && !isSuccess) {
      return;
    }

    if (!submitted && (!auth.status.isAuthenticated || !cartItems?.length)) {
      router.replace("/books");
    }
  }, [auth.status.isAuthenticated, cartItems?.length, isSuccess, router, submitted]);

  return (
    <Grid gutter="3.75rem">
      <GridCol span={{ base: 12, sm: 8, md: 6, xl: 4 }} order={{ base: 2, md: 1 }}>
        <Form onSubmit={open} />
      </GridCol>
      <GridCol span={{ base: 12, sm: 8, md: 6, lg: 5, xl: 4 }} order={{ base: 1, md: 2 }}>
        <Summary />
      </GridCol>
    </Grid>
  );
};
