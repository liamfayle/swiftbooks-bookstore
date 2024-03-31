import { FC } from "react";
import { Anchor } from "@mantine/core";
import Link from "next/link";

import { Header } from "@/components/header";

import classes from "./page.module.css";
import { LoginButton } from "@/components/home/login-button";

const Home: FC = () => {
  return (
    <div className={classes.container}>
      <Header>Welcome to Swift Books!</Header>
      <p>
        At Swift Books, we offer a curated selection of books that caters to every reader&apos;s
        taste. Whether you&apos;re a fan of thrilling mysteries, heartwarming romance, or
        mind-expanding non-fiction, we have something for everyone.
      </p>
      <p>Explore our user-friendly platform to:</p>
      <ul>
        <li>
          <strong>Purchase Books:</strong> Easily browse and buy your favorite titles with just a
          few clicks.
        </li>
        <li>
          <strong>Create Book Lists:</strong> Organize your reading preferences by creating
          personalized book lists.
        </li>
        <li>
          <strong>Leave Reviews:</strong> Share your insights and recommendations by leaving reviews
          on books and book lists.
        </li>
      </ul>
      <p>
        Explore our{" "}
        <Anchor component={Link} c="violet" href="/books" className={classes.link}>
          book catalog
        </Anchor>{" "}
        or view{" "}
        <Anchor component={Link} c="violet" href="/book-lists" className={classes.link}>
          book lists
        </Anchor>{" "}
        to get started.
      </p>
      <LoginButton />
    </div>
  );
};

export default Home;
