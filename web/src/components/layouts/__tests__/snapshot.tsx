import { render } from "@/test-utils";
import { AppShellLayout } from "../app-shell";

describe("Layouts", () => {
  it("renders app shell layout unchanged", () => {
    const { container } = render(
      <AppShellLayout>
        <span>Content</span>
      </AppShellLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
