import { render } from "@/test-utils";
import { CheckoutView } from "../checkout-view";
import { Form } from "../form";
import { Summary } from "../summary";

describe("Checkout", () => {
  it("renders checkout unchanged", () => {
    const { container } = render(<CheckoutView />);
    expect(container).toMatchSnapshot();
  });

  it("renders checkout form unchanged", () => {
    const { container } = render(<Form />);
    expect(container).toMatchSnapshot();
  });

  it("renders summary unchanged", () => {
    const { container } = render(<Summary />);
    expect(container).toMatchSnapshot();
  });
});
