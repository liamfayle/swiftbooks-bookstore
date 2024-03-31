"use client";

import { FC, useState } from "react";

import { BookFilter } from "@/components/book/book-filter";
import { BookCatalog } from "@/components/book/book-catalog";
import { useBookSearch } from "@/api/api";
import { ApiSearchBookInput } from "@/api/types";

export const BookSearch: FC = () => {
  const [filters, setFilters] = useState<ApiSearchBookInput>({ title: "", author: "" });
  const { data, isFetching } = useBookSearch(filters);

  return (
    <>
      <BookFilter onSubmit={setFilters} loading={isFetching} />
      {data ? <BookCatalog data={data} /> : null}
    </>
  );
};
