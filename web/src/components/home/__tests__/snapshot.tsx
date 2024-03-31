import { render } from "@/test-utils";
import { LoginButton } from "../login-button";

describe("Home", () => {
  it("renders login button unchanged", () => {
    const { container } = render(<LoginButton />);
    expect(container).toMatchSnapshot();
  });
});
