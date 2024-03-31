import { render } from "@/test-utils";
import Page from "../page";

describe("BooksViewPage", () => {
  it("renders books view page unchanged", () => {
    const { container } = render(<Page params={{ id: "abc" }} />);
    expect(container).toMatchSnapshot();
  });
});
