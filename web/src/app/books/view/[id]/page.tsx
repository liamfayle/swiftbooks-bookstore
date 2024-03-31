import { FC } from "react";

import { ReturnBreadcrumb } from "@/components/return-breadcrumb";
import { BookView } from "@/components/book/book-view";

interface BooksViewPageProps {
  params: { id: string };
}

const BooksViewPage: FC<BooksViewPageProps> = ({ params }) => {
  return (
    <>
      <ReturnBreadcrumb href="/books">Books</ReturnBreadcrumb>
      <BookView id={params.id} />
    </>
  );
};

export default BooksViewPage;
