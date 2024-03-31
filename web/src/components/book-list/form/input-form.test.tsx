import { render, screen } from "@/test-utils";
import { InputForm } from "./input-form";

describe("BookListInputForm", () => {
  it("renders an input form", () => {
    render(<InputForm />);

    expect(screen.getByRole("button", { name: "CREATE" })).toHaveAttribute("type", "submit");
    expect(screen.getByPlaceholderText("Book list name *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Book list description")).toBeInTheDocument();
    expect(screen.getByLabelText("Public")).toBeInTheDocument();
  });
});
