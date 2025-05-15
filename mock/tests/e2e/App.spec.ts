import { expect, test } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";


const validUser = { identifier: "shouldwork@brown.edu", password: "Shouldwork" };

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
  await expect(page.getByLabel("save-button")).toBeVisible();
});

test("submit nutrient information after login", async ({ page }) => {

  const today = new Date().toISOString().split("T")[0];

  await page.fill("#log-date", today);
  await page.fill('[aria-label="calorie input"]', "2000");
  await page.fill('[aria-label="carb input"]', "250");
  await page.fill('[aria-label="sugar input"]', "30");
  await page.fill('[aria-label="protein input"]', "80");

  await page.click('[aria-label="save-button"]');

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
  });})
test('Home tab renders homepage content', async ({ page }) => {
    await page.getByText('Home').click();
    await expect(page.getByText('Track Your Daily Diet:')).toBeVisible();
  });

test('Progress tab renders compared progress content', async ({ page }) => {
    await page.getByText('Progress').click();
    // Adjust based on what is actually visible inside <ComparedProgress />
    await expect(page.getByText("Select Nutrient")).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });

test('Personal Graphs tab renders progress content', async ({ page }) => {
    await page.getByText('Personal Graphs').click();
    // Adjust based on visible content in <Progress />
    await expect(page.getByText("Select Nutrient")).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });

test('Feedback tab renders feedback content', async ({ page }) => {
    await page.getByText('Feedback').click();
    await expect(page.getByText("Average Intake: 96.67")).toBeVisible();
  });

test('Profile tab renders profile content', async ({ page }) => {
    await page.getByText('Profile').click();
    // Look for form or content unique to <Profile />
    await expect(page.getByText("Edit Information")).toBeVisible();
  });