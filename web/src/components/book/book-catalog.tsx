import { FC, ReactNode } from "react";

import { Alert } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import { Book } from "@/components/book/book";
import { ApiBook } from "@/api/types";

import classes from "./book-catalog.module.css";

interface BookCatalogProps {
  data: ApiBook[];
  notFound?: ReactNode;
}

export const BookCatalog: FC<BookCatalogProps> = ({ data, notFound }) => {
  if (!data.length) {
    if (notFound) {
      return notFound;
    }

    return (
      <Alert color="orange" title="No books found" icon={<IconExclamationCircle />} maw="24rem" />
    );
  }

  return (
    <div className={classes.list}>
      {data.map((book) => (
        <Book key={book.id} data={book} />
      ))}
    </div>
  );
};
