import { render } from "@/test-utils";
import Page from "../page";

describe("HomePage", () => {
  it("renders home page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
