import { render } from "@/test-utils";
import { Empty } from "../empty";
import { Header } from "../header";
import { Hr } from "../hr";
import { Infos } from "../infos";
import { ReturnBreadcrumb } from "../return-breadcrumb";

describe("Components", () => {
  it("renders empty unchanged", () => {
    const { container } = render(<Empty>Not found</Empty>);
    expect(container).toMatchSnapshot();
  });

  it("renders header unchanged", () => {
    const { container } = render(<Header>Title</Header>);
    expect(container).toMatchSnapshot();
  });

  it("renders hr unchanged", () => {
    const { container } = render(<Hr />);
    expect(container).toMatchSnapshot();
  });

  it("renders infos unchanged", () => {
    const { container } = render(
      <Infos
        infos={[
          { id: "one", label: "One", value: 1 },
          { id: "two", label: "Two", value: 2 },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders return breadcrumb unchanged", () => {
    const { container } = render(<ReturnBreadcrumb href="/home" />);
    expect(container).toMatchSnapshot();
  });
});
