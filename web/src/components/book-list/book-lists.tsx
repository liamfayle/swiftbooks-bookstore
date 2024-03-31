"use client";

import { FC, Fragment } from "react";
import { Button } from "@mantine/core";
import { IconExclamationCircle, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Alert } from "@mantine/core";

import { Header } from "@/components/header";
import { Hr } from "@/components/hr";
import { FilterTabs } from "./filter-tabs";
import { BookList } from "./book-list";
import { useFilterTab } from "./use-filter-tab";
import { usePublicBookLists, useRecentBookLists, useUserBookLists } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";

import classes from "./book-lists.module.css";

export const BookLists: FC = () => {
  const tab = useFilterTab();
  const auth = useAuth();
  const recentBookListsRes = useRecentBookLists(!auth.status.isAuthenticated && tab === "public");
  const publicBookListsRes = usePublicBookLists(auth.status.isAuthenticated && tab === "public");
  const userBookListRes = useUserBookLists(auth.status.isAuthenticated && tab === "user");

  const {
    data: bookLists,
    isSuccess,
    isLoading,
  } = tab === "public"
    ? auth.status.isAuthenticated
      ? publicBookListsRes
      : recentBookListsRes
    : userBookListRes;

  return (
    <>
      <Header
        action={
          <Button
            leftSection={<IconPlus size="1rem" />}
            component={Link}
            href="/book-lists/create"
            variant="filled"
          >
            CREATE
          </Button>
        }
      >
        Browse {tab === "public" ? "public" : "your"} book lists
      </Header>
      <FilterTabs />
      {(!isLoading && !isSuccess) || bookLists?.length === 0 ? (
        <Alert
          color="orange"
          title={
            tab === "public" ? "No public book lists found" : "No book lists found, create one"
          }
          icon={<IconExclamationCircle />}
          maw="24rem"
        />
      ) : (
        <div className={classes.listContainer}>
          {(bookLists || []).map((bookList, i) => (
            <Fragment key={bookList.id}>
              {i ? <Hr /> : null}
              <BookList data={bookList} tab={tab} />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};
