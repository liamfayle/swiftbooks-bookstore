import { render } from "@/test-utils";
import { InputForm } from "../input-form";
import { BookListForm } from "../book-list-form";
import { BookDropdown } from "../book-dropdown";

describe("BookListForm", () => {
  it("renders input form unchanged", () => {
    const { container } = render(<InputForm />);
    expect(container).toMatchSnapshot();
  });

  it("renders book dropdown unchanged", () => {
    const { container } = render(<BookDropdown />);
    expect(container).toMatchSnapshot();
  });

  it("renders book list form unchanged", () => {
    const { container } = render(<BookListForm />);
    expect(container).toMatchSnapshot();
  });
});
