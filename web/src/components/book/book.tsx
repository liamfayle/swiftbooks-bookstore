import { Anchor, Button, Select, Title } from "@mantine/core";
import { FC, useCallback } from "react";
import Link from "next/link";

import { ApiBook } from "@/api/types";
import { useAddCartBookMutation, useRemoveCartBookMutation } from "@/api/api";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useCurrencyFormat } from "@/utils";

import classes from "./book.module.css";

const maxQuantity = 10;

const quantities = Array(maxQuantity)
  .fill(0)
  .map((_, i) => String(i + 1));

export interface BookProps {
  variant?: "default" | "cart";
  quantity?: number;
  data: ApiBook;
  onNavigate?: () => void;
}

export const Book: FC<BookProps> = ({ variant = "default", quantity, data, onNavigate }) => {
  const currencyFormat = useCurrencyFormat();

  const addCartBookMutation = useAddCartBookMutation();
  const removeCartBookMutation = useRemoveCartBookMutation();

  const onNavigateClick = useCallback(() => onNavigate?.(), [onNavigate]);

  const onQuantityChange = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }

      addCartBookMutation.mutate({ book_id: data.id, quantity: Number(value) });
    },
    [addCartBookMutation, data.id],
  );

  const onRemove = useCallback(() => {
    removeCartBookMutation.mutate({ book_id: data.id });
  }, [removeCartBookMutation, data.id]);

  return (
    <div className={classes.container}>
      {data.thumbnail ? (
        <Anchor component={Link} href={`/books/view/${data.id}`} onClick={onNavigateClick}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.thumbnail}
            alt="Book cover 1"
            width="150"
            height="150"
            className={classes.image}
          />
        </Anchor>
      ) : null}
      <div className={classes.details}>
        {data.authors?.length ? <div className={classes.author}>{data.authors[0]}</div> : null}
        {data.title ? (
          <Anchor
            c="black"
            component={Link}
            href={`/books/view/${data.id}`}
            onClick={onNavigateClick}
          >
            <Title order={4} className={classes.title}>
              {data.title}
            </Title>
          </Anchor>
        ) : null}
        {variant === "cart" ? (
          <div className={classes.quantityContainer}>
            <div className={classes.price}>
              {currencyFormat.format((data.price ?? 0) * (quantity ?? 0))}
            </div>
            <Select
              withCheckIcon={false}
              value={String(Math.min(maxQuantity, quantity ?? 1))}
              variant="filled"
              size="xs"
              data={quantities}
              className={classes.quantitySelect}
              comboboxProps={{ withinPortal: false }}
              onChange={onQuantityChange}
            />
          </div>
        ) : data.price != null ? (
          <div className={classes.price}>{currencyFormat.format(data.price)}</div>
        ) : null}
        {variant === "cart" ? (
          <Button
            variant="light"
            color="red"
            size="xs"
            className={classes.button}
            onClick={onRemove}
          >
            REMOVE
          </Button>
        ) : data.price != null ? (
          <AddToCartButton id={data.id} className={classes.button} />
        ) : (
          <Button variant="light" color="red" size="xs" className={classes.button} disabled>
            SOLD OUT
          </Button>
        )}
      </div>
    </div>
  );
};
