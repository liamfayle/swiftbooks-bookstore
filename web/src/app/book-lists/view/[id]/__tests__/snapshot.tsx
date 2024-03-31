import { render } from "@/test-utils";
import Page from "../page";

describe("BookListsViewPage", () => {
  it("renders book lists view page unchanged", () => {
    const { container } = render(<Page params={{ id: "1" }} />);
    expect(container).toMatchSnapshot();
  });
});
