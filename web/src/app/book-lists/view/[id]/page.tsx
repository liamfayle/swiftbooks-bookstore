import { FC } from "react";

import { ReturnBreadcrumb } from "@/components/return-breadcrumb";
import { BookListView } from "@/components/book-list/view/book-list-view";

interface BookListsViewProps {
  params: { id: string };
}

const BookListsView: FC<BookListsViewProps> = ({ params }) => {
  return (
    <>
      <ReturnBreadcrumb href="/book-lists">Book lists</ReturnBreadcrumb>
      <BookListView id={Number(params.id)} />
    </>
  );
};

export default BookListsView;
