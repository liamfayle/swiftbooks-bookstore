import { render, screen } from "@/test-utils";
import { books } from "@/test-utils/data/books";

import { BookCatalog } from "./book-catalog";

describe("BookCatalog", () => {
  it("renders a catalog of books", () => {
    render(<BookCatalog data={books} />);

    const links = screen.getAllByRole("link");
    expect(links).not.toHaveLength(0);

    for (let book of books) {
      expect(links.some((link) => link.getAttribute("href") === `/books/view/${book.id}`)).toBe(
        true,
      );

      expect(screen.getByText(book.title!)).toBeInTheDocument();
      expect(screen.getByText(book.authors![0])).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${book.price}`))).toBeInTheDocument();
    }
  });

  it("renders a not found error", () => {
    render(<BookCatalog data={[]} />);

    expect(screen.getByText("No books found")).toBeInTheDocument();
  });

  it("renders a custom not found error", () => {
    render(<BookCatalog data={[]} notFound="Books not found" />);

    expect(screen.getByText("Books not found")).toBeInTheDocument();
  });

  it("doesn't render custom not found error when books exist", () => {
    render(<BookCatalog data={books} notFound="Books not found" />);

    expect(screen.queryByText("Books not found")).not.toBeInTheDocument();
  });
});
