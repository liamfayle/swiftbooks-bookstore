"use client";

import { FC } from "react";
import { Alert, Button, Grid, GridCol, TextInput } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useFormik } from "formik";

import { useCart, useCheckoutMutation, useCurrentUser } from "@/api/api";
import { ApiCheckoutInput } from "@/api/types";
import { schema } from "@shared/validation/checkout";
import { useAuth } from "@/components/auth/auth-context";

import classes from "./form.module.css";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  country: "",
  province: "",
  city: "",
  postalCode: "",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

interface Field {
  name: keyof typeof initialValues;
  label: string;
  full?: boolean;
}

interface Section {
  name: string;
  fields: Field[];
}

const sections: Section[] = [
  {
    name: "Contact information",
    fields: [
      { name: "firstName", label: "First name" },
      { name: "lastName", label: "Last name" },
      { name: "email", label: "Email address" },
      { name: "phone", label: "Phone number" },
    ],
  },
  {
    name: "Shipping address",
    fields: [
      { name: "address1", label: "Address line 1", full: true },
      { name: "address2", label: "Address line 2", full: true },
      { name: "country", label: "Country" },
      { name: "province", label: "Province" },
      { name: "city", label: "City" },
      { name: "postalCode", label: "Postal code" },
    ],
  },
  {
    name: "Credit card",
    fields: [
      { name: "cardName", label: "Name on card" },
      { name: "cardNumber", label: "Card number" },
      { name: "cardExpiry", label: "Card expiry date (DDMMYY)" },
      { name: "cardCvc", label: "CVC" },
    ],
  },
];

export interface FormProps {
  onSubmit?: () => void;
}

export const Form: FC<FormProps> = ({ onSubmit }) => {
  const { data: cartItems } = useCart();
  const { mutate, isPending, isSuccess, data } = useCheckoutMutation();
  const auth = useAuth();
  const { data: currentUser, isSuccess: isCurrentUserSuccess } = useCurrentUser(
    auth.status.isAuthenticated,
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
      ...(isCurrentUserSuccess ? { email: currentUser.email } : {}),
    },
    validationSchema: schema,
    onSubmit(values) {
      if (!cartItems) {
        return;
      }

      const input: ApiCheckoutInput = {
        address: values.address1,
        cart_details: cartItems.map(({ book_id, quantity }) => ({ book_id, price: 99, quantity })),
        city: values.city,
        country: values.country,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        postal_code: values.postalCode,
        province: values.province,
        total_price: 99,
      };

      mutate(input, { onSuccess: () => onSubmit?.() });
    },
  });

  if (isSuccess) {
    return (
      <Alert color="teal" title="Order submitted" icon={<IconCircleCheck />} maw="24rem">
        Your order with id {data.order_id} as been placed
      </Alert>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
      <div className={classes.sectionContainer}>
        {sections.map(({ name, fields }, i) => (
          <Grid key={i}>
            <GridCol className={classes.header}>{name}</GridCol>
            {fields.map(({ name, label, full }) => (
              <GridCol key={name} span={{ base: full ? 12 : 6 }}>
                <TextInput
                  placeholder={label}
                  variant="filled"
                  name={name}
                  id={`checkout-${name}`}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[name] && formik.errors[name]}
                />
              </GridCol>
            ))}
          </Grid>
        ))}
      </div>
      <div className={classes.submitContainer}>
        <Button variant="filled" type="submit" size="md" loading={isPending}>
          SUBMIT
        </Button>
      </div>
    </form>
  );
};
