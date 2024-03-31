import { render, screen } from "@/test-utils";
import { Review } from "./review";
import { reviews } from "@/test-utils/data/reviews";

describe("Review", () => {
  const review = reviews[0];

  it("renders a review", () => {
    render(<Review data={review} />);

    expect(screen.getByText(review.username)).toBeInTheDocument();
    expect(screen.getByText(review.content)).toBeInTheDocument();
  });
});
