"use client";

import { FC, useCallback } from "react";
import { Alert, Button, Grid, GridCol } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { IconExclamationCircle, IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header } from "@/components/header";
import { BookCatalog } from "@/components/book/book-catalog";
import { Review } from "./review";
import { ReviewForm } from "@/components/book-list/view/review-form";
import {
  useBookList,
  useBookListBooks,
  useBookListPageCount,
  useBookListReviews,
  useCurrentUser,
  useRemoveBookListMutation,
} from "@/api/api";
import { Infos } from "@/components/infos";
import { Empty } from "@/components/empty";

import classes from "./book-list-view.module.css";
import { useAuth } from "@/components/auth/auth-context";

export interface BookListViewProps {
  id: number;
}

export const BookListView: FC<BookListViewProps> = ({ id }) => {
  const router = useRouter();

  const { data: bookList } = useBookList(id);
  const { data: books } = useBookListBooks(id);
  const { data: pages } = useBookListPageCount(id);
  const { data: reviews } = useBookListReviews(id);

  const auth = useAuth();
  const { data: currentUser } = useCurrentUser(auth.status.isAuthenticated);

  const { mutate } = useRemoveBookListMutation();

  useDocumentTitle(bookList ? `${bookList.list_name} | Swift Books` : "");

  const canUpdate =
    auth.status.isAuthenticated &&
    bookList &&
    currentUser &&
    bookList.created_by_id == currentUser.id;

  const onRemoveClick = useCallback(() => {
    if (!bookList) {
      return;
    }

    mutate(bookList.id);
    router.push("/book-lists?tab=user");
  }, [bookList, mutate, router]);

  if (!bookList) {
    return null;
  }

  return (
    <>
      <Header
        noMargin
        action={
          canUpdate ? (
            <div className={classes.headerActions}>
              <Button
                component={Link}
                href={`/book-lists/update/${bookList.id}`}
                variant="light"
                size="xs"
                leftSection={<IconPencil />}
              >
                Update
              </Button>
              <Button
                variant="light"
                color="red"
                size="xs"
                leftSection={<IconTrash />}
                onClick={onRemoveClick}
              >
                Delete
              </Button>
            </div>
          ) : null
        }
      >
        {bookList.list_name}
      </Header>
      <div className={classes.creator}>{bookList.created_by_username}</div>

      <Infos
        infos={[
          { id: "books", label: "Books", value: books?.length },
          { id: "pages", label: "Pages", value: pages, type: "number" },
          { id: "created", label: "Created at", value: bookList.created_at, type: "datetime" },
          { id: "updated", label: "Updated on", value: bookList.updated_at, type: "datetime" },
        ]}
      />

      <div className={classes.description}>{bookList.description}</div>
      <Header order={2}>Books in this list</Header>
      <div className={classes.bookListContainer}>
        {books ? (
          <BookCatalog data={books} notFound={<Empty>No books found in this book list</Empty>} />
        ) : null}
      </div>
      <Header order={2}>Reviews</Header>
      <Grid gutter="1.25rem" className={classes.reviewContainer}>
        {reviews?.length ? (
          reviews.map((review) => (
            <GridCol key={review.id} span={{ base: 12, md: 8, lg: 6 }}>
              <Review data={review} />
            </GridCol>
          ))
        ) : (
          <GridCol>
            <Empty>No reviews found for this book list</Empty>
          </GridCol>
        )}
      </Grid>
      <Header order={2}>Leave a review</Header>
      {auth.status.isAuthenticated ? (
        <ReviewForm listId={bookList.id} />
      ) : (
        <Grid>
          <GridCol span={{ base: 12, md: 8, lg: 6 }}>
            <Alert color="blue" icon={<IconExclamationCircle />} title="Login to leave a review" />
          </GridCol>
        </Grid>
      )}
    </>
  );
};
