import { FC } from "react";
import { Metadata } from "next";

import { BookLists } from "@/components/book-list/book-lists";

export const metadata: Metadata = {
  title: "Book lists | Swift Books",
};

const BookListsPage: FC = () => {
  return <BookLists />;
};

export default BookListsPage;
