"use client";

import { FC, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/header";
import { BookSmall } from "@/components/book/book-small";
import { InputForm, Values } from "./input-form";
import { BookDropdown } from "./book-dropdown";
import {
  useAddBookListBookMutation,
  useBookList,
  useBookListBookIds,
  useBooks,
  useCreateBookListMutation,
  useRemoveBookListBookMutation,
  useUpdateBookListMutation,
} from "@/api/api";
import { ApiBookList } from "@/api/types";

import classes from "./book-list-form.module.css";

type BookListFormContentProps =
  | {
      isUpdating?: false;
      bookList?: undefined;
      bookIds?: undefined;
    }
  | {
      isUpdating: true;
      bookList: ApiBookList;
      bookIds: string[];
    };

const BookListFormContent: FC<BookListFormContentProps> = ({ isUpdating, bookList, bookIds }) => {
  const router = useRouter();

  const { mutateAsync: createBookListMutate } = useCreateBookListMutation();
  const { mutateAsync: updateBookListMutate } = useUpdateBookListMutation();
  const { mutateAsync: addBookListBookMutate } = useAddBookListBookMutation();
  const { mutateAsync: removeBookListBookMutate } = useRemoveBookListBookMutation();

  const [updateBookIds, setUpdateBookIds] = useState<string[]>(isUpdating ? bookIds : []);

  const [loading, setLoading] = useState(false);

  const { data: books } = useBooks(updateBookIds, true);

  const onBookAdd = useCallback(
    (id: string) => {
      setUpdateBookIds([...updateBookIds, id]);
    },
    [updateBookIds],
  );

  const onBookRemove = useCallback(
    (id: string) => {
      setUpdateBookIds(updateBookIds.filter((bookId) => bookId !== id));
    },
    [updateBookIds],
  );

  const onFormSubmit = useCallback(
    async (values: Values) => {
      setLoading(true);

      if (isUpdating) {
        await updateBookListMutate({
          list_id: bookList.id,
          name: values.name,
          description: values.description,
          publicity: values.isPublic,
        });

        for (let bookId of updateBookIds.filter((id) => !bookIds.includes(id))) {
          await addBookListBookMutate({ list_id: bookList.id, book_id: bookId });
        }

        for (let bookId of bookIds.filter((id) => !updateBookIds.includes(id))) {
          await removeBookListBookMutate({ list_id: bookList.id, book_id: bookId });
        }
      } else {
        const { id } = await createBookListMutate({
          list_name: values.name,
          description: values.description,
          is_public: values.isPublic,
        });
        for (let bookId of updateBookIds) {
          await addBookListBookMutate({ list_id: id, book_id: bookId });
        }
      }
      setLoading(false);
      router.push("/book-lists?tab=user");
    },
    [
      addBookListBookMutate,
      bookIds,
      bookList,
      createBookListMutate,
      isUpdating,
      removeBookListBookMutate,
      router,
      updateBookIds,
      updateBookListMutate,
    ],
  );

  return (
    <>
      <InputForm onSubmit={onFormSubmit} loading={loading} data={bookList} />
      <Header order={2}>Books in this list</Header>
      <BookDropdown onSubmit={onBookAdd} excludeIds={updateBookIds} />
      <div className={classes.bookList}>
        {books?.length
          ? books.map((book) => (
              <BookSmall key={book.id} data={book} onRemove={() => onBookRemove(book.id)} />
            ))
          : null}
      </div>
    </>
  );
};

export interface BookListFormProps {
  update?: number;
}

export const BookListForm: FC<BookListFormProps> = ({ update }) => {
  const isUpdating = update != null;

  const { data: bookList, isSuccess: isBookListSuccess } = useBookList(update ?? 0, isUpdating);
  const { data: bookIds, isSuccess: isBookIdsSuccess } = useBookListBookIds(
    update ?? 0,
    isUpdating,
  );

  return (
    <>
      <Header>{isUpdating ? "Update book list" : "Create a book list"}</Header>
      {isUpdating ? (
        isBookListSuccess && isBookIdsSuccess ? (
          <BookListFormContent
            isUpdating={true}
            bookList={bookList}
            bookIds={bookIds.map(({ id }) => id)}
          />
        ) : null
      ) : (
        <BookListFormContent />
      )}
    </>
  );
};
