import { render } from "@/test-utils";
import { BookListView } from "../book-list-view";
import { Review } from "../review";
import { ReviewForm } from "../review-form";
import { bookLists } from "@/test-utils/data/book-lists";
import { reviews } from "@/test-utils/data/reviews";

describe("BookListView", () => {
  it("renders book list view unchanged", () => {
    const { container } = render(<BookListView id={bookLists[0].id} />);
    expect(container).toMatchSnapshot();
  });

  it("renders review unchanged", () => {
    const { container } = render(<Review data={reviews[0]} />);
    expect(container).toMatchSnapshot();
  });

  it("renders review form unchanged", () => {
    const { container } = render(<ReviewForm listId={bookLists[0].id} />);
    expect(container).toMatchSnapshot();
  });
});
