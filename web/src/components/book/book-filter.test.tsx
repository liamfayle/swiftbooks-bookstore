import { render, screen } from "@/test-utils";

import { BookFilter } from "./book-filter";

describe("BookFilter", () => {
  it("renders a filter form", () => {
    render(<BookFilter />);

    expect(screen.getByRole("button", { name: "FILTER" })).toHaveAttribute("type", "submit");
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Author")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
  });
});
