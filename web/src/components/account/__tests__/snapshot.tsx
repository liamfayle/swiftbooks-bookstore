import { render } from "@/test-utils";
import { AccountMenu } from "../account-menu";

describe("Account", () => {
  it("renders account menu unchanged", () => {
    const { container } = render(<AccountMenu />);
    expect(container).toMatchSnapshot();
  });
});
