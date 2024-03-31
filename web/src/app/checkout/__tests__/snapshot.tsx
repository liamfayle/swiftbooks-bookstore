import { render } from "@/test-utils";
import Page from "../page";

describe("CheckoutPage", () => {
  it("renders checkout page unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
