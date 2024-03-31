import { test, expect } from "@playwright/test";

test("has title + book catalog link", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Swift Books");

  await expect(page.getByRole("link", { name: "book catalog" })).toHaveAttribute("href", "/books");
});
