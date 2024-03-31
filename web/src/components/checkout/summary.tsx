"use client";

import { FC } from "react";

import { Hr } from "@/components/hr";
import { BookSmall } from "@/components/book/book-small";
import { useCartBooks, useCartTotal } from "@/api/api";
import { useCurrencyFormat } from "@/utils";

import classes from "./summary.module.css";

export const Summary: FC = () => {
  const { data: total } = useCartTotal();
  const { data: books, isSuccess } = useCartBooks();

  const currencyFormat = useCurrencyFormat();

  if (!isSuccess || !books.length) {
    return null;
  }

  return (
    <div>
      <div className={classes.header}>Summary</div>
      <div className={classes.rowContainer}>
        <div className={classes.row}>
          <div>Total cost</div>
          <div>{currencyFormat.format(total ?? 0)}</div>
        </div>
        <div className={classes.row}>
          <div>Shipping</div>
          <div className={classes.free}>FREE</div>
        </div>
        <Hr />
        <div className={classes.row}>
          <div>Total</div>
          <div>{currencyFormat.format(total ?? 0)}</div>
        </div>
        <Hr />
        {books?.map((book) => <BookSmall key={book.id} data={book} variant="cart" />)}
      </div>
    </div>
  );
};
