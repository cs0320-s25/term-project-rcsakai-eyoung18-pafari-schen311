import { expect, test } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";


const validUser = { identifier: "shouldwork@brown.edu", password: "shouldworkshouldwork" };

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password", 
      identifier: validUser.identifier,
      password: validUser.password,
    },
  });
});

test("homepage elements visible after login", async ({ page }) => {
  await expect(page.locator(".homepage-header")).toHaveText("Track Your Daily Diet:");
  await expect(page.getByLabel("calorie input")).toBeVisible();
  await expect(page.getByLabel("carb input")).toBeVisible();
  await expect(page.getByLabel("sugar input")).toBeVisible();
  await expect(page.getByLabel("protein input")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Information" })).toBeVisible();
});

test("submit nutrient information after login", async ({ page }) => {
  await page.route("http://localhost:3232/add-daily*", async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("Calories")).toBe("2000");
    expect(url.searchParams.get("Carbs")).toBe("250");
    expect(url.searchParams.get("Sugar")).toBe("30");
    expect(url.searchParams.get("Protein")).toBe("80");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ response_type: "success" }),
    });
  });

  const today = new Date().toISOString().split("T")[0];

  await page.fill("#log-date", today);
  await page.fill('[aria-label="calorie input"]', "2000");
  await page.fill('[aria-label="carb input"]', "250");
  await page.fill('[aria-label="sugar input"]', "30");
  await page.fill('[aria-label="protein input"]', "80");

  await page.click('[aria-label="save-info"]');
});