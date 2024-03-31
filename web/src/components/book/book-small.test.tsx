import { render, screen } from "@/test-utils";
import { books } from "@/test-utils/data/books";

import { BookSmall } from "./book-small";

describe("BookSmall", () => {
  const book = books[0];

  it("renders a small book", () => {
    render(<BookSmall data={book} />);

    expect(screen.getByText(book.title!)).toBeInTheDocument();
    expect(screen.getByText(book.authors![0])).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "REMOVE" })).toBeInTheDocument();
  });

  it("renders a small cart book", () => {
    render(<BookSmall data={book} variant="cart" />);

    expect(screen.getByText(book.title!)).toBeInTheDocument();
    expect(screen.getByText(book.authors![0])).toBeInTheDocument();
  });
});
