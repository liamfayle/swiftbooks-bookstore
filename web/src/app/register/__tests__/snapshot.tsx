import { render } from "@/test-utils";
import Page from "../page";

describe("RegisterPage", () => {
  it("renders register page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
