import { render } from "@/test-utils";
import { BookList } from "../book-list";
import { BookListThumb } from "../book-list-thumb";
import { BookLists } from "../book-lists";
import { FilterTabs } from "../filter-tabs";
import { bookLists } from "@/test-utils/data/book-lists";
import { books } from "@/test-utils/data/books";

describe("BookList", () => {
  it("renders book list unchanged", () => {
    const { container } = render(<BookList data={bookLists[0]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders book list thumbs unchanged", () => {
    const { container } = render(<BookListThumb data={bookLists[0]} books={books} />);
    expect(container).toMatchSnapshot();
  });

  it("renders book lists unchanged", () => {
    const { container } = render(<BookLists />);
    expect(container).toMatchSnapshot();
  });

  it("renders filter tabs unchanged", () => {
    const { container } = render(<FilterTabs />);
    expect(container).toMatchSnapshot();
  });
});
