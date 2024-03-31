import { FC, useCallback } from "react";
import { Anchor, Button, Indicator, Title } from "@mantine/core";
import Link from "next/link";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import { BookListThumb } from "@/components/book-list/book-list-thumb";
import { ApiBookList } from "@/api/types";
import {
  useBookListBooks,
  useBookListPageCount,
  useCurrentUser,
  useRemoveBookListMutation,
} from "@/api/api";
import { Infos } from "@/components/infos";
import { useAuth } from "@/components/auth/auth-context";
import { Tab } from "@/components/book-list/tabs";

import classes from "./book-list.module.css";

export interface BookListProps {
  data: ApiBookList;
  tab?: Tab;
}

export const BookList: FC<BookListProps> = ({ data, tab }) => {
  const { data: books } = useBookListBooks(data.id);
  const { data: pages } = useBookListPageCount(data.id);
  const auth = useAuth();
  const { data: currentUser, isSuccess } = useCurrentUser(auth.status.isAuthenticated);

  const { mutate } = useRemoveBookListMutation();

  const onRemoveClick = useCallback(() => {
    mutate(data.id);
  }, [data.id, mutate]);

  const canUpdate = isSuccess && data.created_by_id == currentUser.id;

  return (
    <div className={classes.container}>
      {books ? (
        <Indicator
          label={data.is_public ? "public" : undefined}
          size="1.5rem"
          disabled={tab !== "user" || !canUpdate || !data.is_public}
          withBorder
          position="top-start"
          offset={6}
          classNames={{ indicator: classes.indicator }}
        >
          <BookListThumb data={data} books={books} />
        </Indicator>
      ) : null}
      <div className={classes.detailsContainer}>
        <div>
          <div className={classes.creator}>{data.created_by_username}</div>
          <Anchor c="black" component={Link} href={`/book-lists/view/${data.id}`}>
            <Title order={3} className={classes.title}>
              {data.list_name}
            </Title>
          </Anchor>
        </div>

        <Infos
          infos={[
            { id: "books", label: "Books", value: books?.length },
            { id: "pages", label: "Pages", value: pages, type: "number" },
          ]}
          size="sm"
        />

        <div className={classes.buttonContainer}>
          <Button
            component={Link}
            variant="light"
            color="violet"
            size="xs"
            href={`/book-lists/view/${data.id}`}
            className={classes.button}
          >
            VIEW
          </Button>
          {canUpdate ? (
            <>
              <Button
                component={Link}
                href={`/book-lists/update/${data.id}`}
                variant="light"
                size="xs"
                className={classes.iconButton}
              >
                <IconPencil />
              </Button>
              <Button
                color="red"
                variant="light"
                size="xs"
                className={classes.iconButton}
                onClick={onRemoveClick}
              >
                <IconTrash />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
