import { render } from "@/test-utils";
import Page from "../page";

describe("BookListsCreatePage", () => {
  it("renders book lists create page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
