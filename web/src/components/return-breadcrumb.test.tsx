import { render, screen } from "@/test-utils";

import { ReturnBreadcrumb } from "./return-breadcrumb";

describe("BookList", () => {
  it("renders a book list", () => {
    render(<ReturnBreadcrumb href="/page-1">Page 1</ReturnBreadcrumb>);

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Page 1");
    expect(link).toHaveAttribute("href", "/page-1");
  });
});
