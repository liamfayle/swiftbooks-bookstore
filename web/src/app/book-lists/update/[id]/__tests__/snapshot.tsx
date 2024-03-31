import { render } from "@/test-utils";
import Page from "../page";

describe("BookListsUpdatePage", () => {
  it("renders book lists update page unchanged", () => {
    const { container } = render(<Page params={{ id: "1" }} />);
    expect(container).toMatchSnapshot();
  });
});
