import { render } from "@/test-utils";
import Page from "../page";

describe("BookListsPage", () => {
  it("renders book lists page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
