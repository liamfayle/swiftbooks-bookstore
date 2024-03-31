import { render } from "@/test-utils";
import { AuthBox } from "../auth-box";
import { Login } from "../login";
import { Register } from "../register";
import { OAuthRegister } from "../oauth-register";

describe("Account", () => {
  it("renders auth box unchanged", () => {
    const { container } = render(<AuthBox />);
    expect(container).toMatchSnapshot();
  });

  it("renders login unchanged", () => {
    const { container } = render(<Login />);
    expect(container).toMatchSnapshot();
  });

  it("renders register unchanged", () => {
    const { container } = render(<Register />);
    expect(container).toMatchSnapshot();
  });

  it("renders oauth register unchanged", () => {
    const { container } = render(
      <OAuthRegister email="bob@example.com" name="Bob Bobby" token="abc" />,
    );
    expect(container).toMatchSnapshot();
  });
});
