import { render } from "@/test-utils";
import Page from "../page";

describe("LoginPage", () => {
  it("renders login page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
