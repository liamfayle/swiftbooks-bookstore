import { render } from "@/test-utils";
import { Cart } from "../cart";
import { CartMenu } from "../cart-menu";

describe("Cart", () => {
  it("renders cart unchanged", () => {
    const { container } = render(<Cart />);
    expect(container).toMatchSnapshot();
  });

  it("renders cart menu unchanged", () => {
    const { container } = render(<CartMenu />);
    expect(container).toMatchSnapshot();
  });
});
