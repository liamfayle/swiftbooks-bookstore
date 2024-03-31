import { FC } from "react";
import { Metadata } from "next";

import { Header } from "@/components/header";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Swift Books",
};

const Checkout: FC = () => {
  return (
    <>
      <Header>Checkout</Header>
      <CheckoutView />
    </>
  );
};

export default Checkout;
