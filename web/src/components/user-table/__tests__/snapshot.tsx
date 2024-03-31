import { render } from "@/test-utils";
import { UserTable } from "../user-table";

describe("UserTable", () => {
  it("renders user table unchanged", () => {
    const { container } = render(<UserTable />);
    expect(container).toMatchSnapshot();
  });
});
