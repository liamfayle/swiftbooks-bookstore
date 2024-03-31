import { render } from "@/test-utils";
import { Book } from "../book";
import { BookCatalog } from "../book-catalog";
import { BookFilter } from "../book-filter";
import { BookSearch } from "../book-search";
import { BookSmall } from "../book-small";
import { BookView } from "../book-view";
import { books } from "@/test-utils/data/books";

describe("Book", () => {
  it("renders book unchanged", () => {
    const { container } = render(<Book data={books[0]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders book catalog unchanged", () => {
    const { container } = render(<BookCatalog data={books} />);
    expect(container).toMatchSnapshot();
  });

  it("renders book filter unchanged", () => {
    const { container } = render(<BookFilter />);
    expect(container).toMatchSnapshot();
  });

  it("renders book search unchanged", () => {
    const { container } = render(<BookSearch />);
    expect(container).toMatchSnapshot();
  });

  it("renders book small unchanged", () => {
    const { container } = render(<BookSmall data={books[0]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders book view unchanged", () => {
    const { container } = render(<BookView id={books[0].id} />);
    expect(container).toMatchSnapshot();
  });
});
