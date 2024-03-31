import { render, screen } from "@/test-utils";
import { BookList } from "./book-list";
import { bookLists } from "@/test-utils/data/book-lists";

describe("BookList", () => {
  const bookList = bookLists[0];

  it("renders a book list", () => {
    render(<BookList data={bookList} />);

    expect(screen.getByText(bookList.list_name)).toBeInTheDocument();
    expect(screen.getByText(bookList.created_by_username)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VIEW" })).toHaveAttribute(
      "href",
      `/book-lists/view/${bookList.id}`,
    );
  });
});
