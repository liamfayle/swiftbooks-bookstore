import { render } from "@/test-utils";
import Page from "../page";

describe("AdminPage", () => {
  it("renders admin page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
