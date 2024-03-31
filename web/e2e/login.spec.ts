import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});

test.describe("Login", () => {
  test("shows error on invalid account", async ({ page }) => {
    await page.getByPlaceholder("Email").fill("invalid@example.com");
    await page.getByPlaceholder("Password").fill("abc");
    await page.getByPlaceholder("Password").press("Enter");

    await expect(page.getByText("Account doesn't exist")).toBeVisible();
  });

  test("logs in", async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("com.swiftbooks.token"));

    await page.getByPlaceholder("Email").fill("user1@example.com");
    await page.getByPlaceholder("Password").fill("password");
    await page.getByPlaceholder("Password").press("Enter");

    await page.waitForFunction(() => Boolean(localStorage.getItem("com.swiftbooks.token")));
  });
});
