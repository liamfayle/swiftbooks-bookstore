import { render, screen } from "@/test-utils";
import { books } from "@/test-utils/data/books";

import { Book } from "./book";

describe("Book", () => {
  const book = books[0];

  it("renders a book", () => {
    render(<Book data={book} />);

    const links = screen.getAllByRole("link");
    expect(links).not.toHaveLength(0);
    expect(links.some((link) => link.getAttribute("href") === "/books/view/abc")).toBe(true);

    expect(screen.getByText(book.title!)).toBeInTheDocument();
    expect(screen.getByText(book.authors![0])).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${book.price}`))).toBeInTheDocument();
  });

  it("renders a cart book", () => {
    const total = /\$199.90/;

    render(<Book data={book} variant="cart" quantity={10} />);

    expect(screen.getByText(book.title!)).toBeInTheDocument();
    expect(screen.getByText(book.authors![0])).toBeInTheDocument();
    expect(screen.getByText(total)).toBeInTheDocument();
  });
});
