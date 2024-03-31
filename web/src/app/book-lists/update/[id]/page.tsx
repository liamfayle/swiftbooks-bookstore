import { FC } from "react";

import { BookListForm } from "@/components/book-list/form/book-list-form";
import { ReturnBreadcrumb } from "@/components/return-breadcrumb";

interface BookListsUpdateProps {
  params: { id: string };
}

const BookListsUpdate: FC<BookListsUpdateProps> = ({ params }) => {
  return (
    <>
      <ReturnBreadcrumb href="/book-lists">Book lists</ReturnBreadcrumb>
      <BookListForm update={Number(params.id)} />
    </>
  );
};

export default BookListsUpdate;
