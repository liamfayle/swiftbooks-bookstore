import { FC } from "react";
import cx from "clsx";
import Link from "next/link";
import { Anchor } from "@mantine/core";

import { ApiBookList, ApiInfoBook } from "@/api/types";

import classes from "./book-list-thumb.module.css";

export interface BookListThumbProps {
  data: ApiBookList;
  books: ApiInfoBook[];
}

export const BookListThumb: FC<BookListThumbProps> = ({ data, books }) => {
  const images = books
    .map((book) => book.thumbnail || book.fullImage!)
    .filter((image) => Boolean(image));

  if (!images.length) {
    return null;
  }

  return (
    <Anchor c="black" component={Link} href={`/book-lists/view/${data.id}`}>
      <div className={classes.container}>
        <div className={classes.column}>
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt="Book cover"
              width={150}
              height={150}
              className={cx(classes.image, classes.imageLarge)}
            />
          ) : null}
        </div>
        <div className={classes.column}>
          {images.length > 1 ? (
            <img
              src={images[1]}
              alt="Book cover"
              width={75}
              height={75}
              className={cx(classes.image, classes.imageSmall)}
            />
          ) : null}
          {images.length > 2 ? (
            <img
              src={images[2]}
              alt="Book cover"
              width={75}
              height={75}
              className={cx(classes.image, classes.imageSmall)}
            />
          ) : null}
        </div>
      </div>
    </Anchor>
  );
};
