import { render, screen } from "@/test-utils";
import { BookListThumb } from "./book-list-thumb";
import { bookLists } from "@/test-utils/data/book-lists";
import { books } from "@/test-utils/data/books";

describe("BookListThumbs", () => {
  const bookList = bookLists[0];

  it("renders book list thumbnails", () => {
    render(<BookListThumb data={bookList} books={books} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);

    for (let book of books) {
      expect(images.some((image) => image.getAttribute("src") === book.thumbnail)).toBe(true);
    }
  });

  it("defaults to full image when thumbnail url not available", () => {
    render(<BookListThumb data={bookList} books={[{ ...books[0], thumbnail: null }]} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", books[0].fullImage);
  });
});
