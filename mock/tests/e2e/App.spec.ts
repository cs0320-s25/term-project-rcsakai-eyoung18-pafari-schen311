import { expect, test } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";

// Setup
const validUser = { identifier: "shouldwork@brown.edu", password: "Shouldwork" };
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await clerk.signIn({ 
    page, 
    signInParams: { 
      strategy: "password", 
      identifier: validUser.identifier, 
      password: validUser.password 
    } 
  });
});

test('All major inputs and buttons are visible', async ({ page }) => {
  await expect(page.getByLabel('calorie input')).toBeVisible();
  await expect(page.getByLabel('carb input')).toBeVisible();
  await expect(page.getByLabel('sugar input')).toBeVisible();
  await expect(page.getByLabel('protein input')).toBeVisible();
  await expect(page.getByLabel('search input')).toBeVisible();
  await expect(page.getByLabel('save-info')).toBeVisible();
});

test('Search query for protein returns expected response', async ({ page }) => {
  const input = page.getByLabel('search input');
  const button = page.getByRole('button', { name: 'Search' });

  await input.fill('how much protein does beef have');
  await button.click();

  // Wait for result to be rendered and assert part of the expected text
  await expect(page.getByText(/cooked lean ground beef/i)).toBeVisible();
  await expect(page.getByText(/26 grams of protein/i)).toBeVisible();
});
test('Home tab renders homepage content', async ({ page }) => {
  await page.getByText('Home').click();
  await expect(page.getByLabel("homepage-greeting")).toBeVisible();
});

test('Progress tab renders compared progress content', async ({ page }) => {
  await page.getByText('Progress').click();
  await expect(page.getByText("Select Nutrient")).toBeVisible();
});

test('Personal Graphs tab renders progress content', async ({ page }) => {
  await page.getByText('Personal Graphs').click();
  await expect(page.getByText("Select Nutrient")).toBeVisible();
});

test('Feedback tab renders feedback content', async ({ page }) => {
  await page.getByText('Feedback').click();
  await expect(page.getByText("calories intake is on target")).toBeVisible();
});

test('Profile tab renders profile content', async ({ page }) => {
  await page.getByText('Profile').click();
  await expect(page.getByLabel("profile-object")).toBeVisible();
});
