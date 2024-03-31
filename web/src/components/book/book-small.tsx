import { FC } from "react";
import { Button, Title } from "@mantine/core";

import { ApiBook } from "@/api/types";
import { useCart } from "@/api/api";
import { useCurrencyFormat } from "@/utils";

import classes from "./book-small.module.css";

export interface BookSmallProps {
  variant?: "default" | "cart";
  data: ApiBook;
  onRemove?: () => void;
}

export const BookSmall: FC<BookSmallProps> = ({ variant = "default", data, onRemove }) => {
  const { data: cartItems } = useCart();

  const currencyFormat = useCurrencyFormat();

  return (
    <div className={classes.container}>
      {data.thumbnail ? (
        <div>
          <img
            src={data.thumbnail}
            alt="Book cover 1"
            width={75}
            height={75}
            className={classes.image}
          />
        </div>
      ) : null}
      <div className={classes.details}>
        {data.authors?.length ? <div className={classes.author}>{data.authors[0]}</div> : null}
        {data.title ? (
          <Title order={4} className={classes.title}>
            {data.title}
          </Title>
        ) : null}
        {variant === "cart" ? (
          cartItems ? (
            <div className={classes.price}>
              {cartItems?.find((item) => item.book_id === data.id)?.quantity ?? 0} x{" "}
              {currencyFormat.format(data.price ?? 0)}
            </div>
          ) : null
        ) : (
          <Button variant="light" color="red" size="compact-xs" onClick={onRemove}>
            REMOVE
          </Button>
        )}
      </div>
    </div>
  );
};
