import { IconBook2, IconBooks, IconUsers } from "@tabler/icons-react";

export const links = [
  { href: "/books", label: "Books", icon: <IconBook2 /> },
  { href: "/book-lists", label: "Book lists", icon: <IconBooks /> },
  { href: "/admin", label: "Admin", icon: <IconUsers />, admin: true },
];
