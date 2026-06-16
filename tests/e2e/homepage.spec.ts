import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Download Instagram");
  });

  test("has URL input and download button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Instagram URL")).toBeVisible();
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navigates to reel downloader", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Reels" }).first().click();
    await expect(page).toHaveURL(/reel-downloader/);
  });

  test("navigates to FAQ", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Help Center");
  });
});

test.describe("API Health", () => {
  test("health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
