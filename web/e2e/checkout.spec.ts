import { test, expect } from "@playwright/test";

test("Adds books to shopping cart, performs successful checkout", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill("user1@example.com");
  await page.getByPlaceholder("Password").fill("password");
  await page.getByPlaceholder("Password").press("Enter");

  await page.waitForURL("/books");

  const addToCartButtons = page.getByRole("button", { name: "ADD TO CART" });

  await addToCartButtons.nth(0).click();

  await page.waitForResponse("http://localhost:3001/api/secure/add-book-to-cart");

  await addToCartButtons.nth(1).click();

  await page.waitForResponse("http://localhost:3001/api/secure/add-book-to-cart");

  await addToCartButtons.nth(2).click();

  await page.waitForResponse("http://localhost:3001/api/secure/add-book-to-cart");

  await page.goto("/checkout");

  const fields = [
    "First name",
    "Last name",
    "Phone number",
    "Address line 1",
    "Country",
    "Province",
    "City",
    "Postal code",
    "Name on card",
    ["Card number", "378282246310005"],
    ["Card expiry date (DDMMYY)", "121229"],
    ["CVC", "123"],
  ];

  for (let field of fields) {
    if (Array.isArray(field)) {
      await page.getByPlaceholder(field[0]).fill(field[1]);
    } else {
      await page.getByPlaceholder(field).fill("abc");
    }
  }

  await page.getByRole("button", { name: "SUBMIT" }).click();

  await expect(page.getByText(/Your order with id \d+ as been placed/)).toBeVisible();
});
