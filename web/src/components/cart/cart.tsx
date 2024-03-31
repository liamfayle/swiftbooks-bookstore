"use client";

import { FC, Fragment } from "react";
import { Button, Card } from "@mantine/core";
import Link from "next/link";

import { Book } from "@/components/book/book";
import { Hr } from "@/components/hr";
import { useCart, useCartBooks, useCartTotal } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";
import { useCurrencyFormat } from "@/utils";
import { Empty } from "@/components/empty";

import classes from "./cart.module.css";

export interface CartProps {
  onClose?: () => void;
}

export const Cart: FC<CartProps> = ({ onClose }) => {
  const auth = useAuth();
  const { data: cartItems } = useCart(auth.status.isAuthenticated);
  const { data: books, isSuccess } = useCartBooks(auth.status.isAuthenticated);
  const { data: total } = useCartTotal(auth.status.isAuthenticated);

  const currencyFormat = useCurrencyFormat();

  if (!isSuccess || !books.length) {
    return (
      <Card className={classes.container}>
        <Empty>Empty shopping cart, add some books</Empty>
      </Card>
    );
  }

  return (
    <Card className={classes.container}>
      {(books || []).map((book, i) => (
        <Fragment key={book.id}>
          {i ? <Hr /> : null}
          <Book
            variant="cart"
            data={book}
            quantity={cartItems?.find((item) => item.book_id === book.id)?.quantity}
            onNavigate={onClose}
          />
        </Fragment>
      ))}
      <div className={classes.spacer}></div>
      <div className={classes.total}>Total cost: {currencyFormat.format(total ?? 0)}</div>
      <Button
        component={Link}
        variant="filled"
        className={classes.button}
        href="/checkout"
        onClick={onClose}
      >
        CHECKOUT
      </Button>
    </Card>
  );
};
