import { render } from "@/test-utils";
import Page from "../page";

describe("BooksPage", () => {
  it("renders books page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
