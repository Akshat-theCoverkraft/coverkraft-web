import { expect, test } from "@playwright/test";

test.describe("public pages", () => {
  test("home page renders without a runtime crash", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#root")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      /failed to fetch dynamically imported module|uncaught/i
    );
  });

  test("login validation is visible on invalid submit", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Enter Your Number").fill("123");

    await expect(
      page.getByText(/please enter a valid 10-digit mobile number/i)
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  test("unknown routes show the not found page", async ({ page }) => {
    await page.goto("/route-that-does-not-exist");

    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByRole("link", { name: /go back home/i })).toBeVisible();
  });
});
