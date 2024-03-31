import { FC } from "react";
import { Metadata } from "next";

import { Header } from "@/components/header";
import { BookSearch } from "@/components/book/book-search";

export const metadata: Metadata = {
  title: "Book catalog | Swift Books",
};

const Books: FC = () => {
  return (
    <>
      <Header>Browse our catalog of books</Header>
      <BookSearch />
    </>
  );
};

export default Books;
