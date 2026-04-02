/**
 * opentool.io site tests — validates all pages render and navigation works.
 * Run: npx playwright test tests/site.spec.ts
 */

import { test, expect } from "@playwright/test";

// Use local file for testing since the site is a single HTML file
const BASE = "http://localhost:8877";

test.setTimeout(15000);

test.describe("Site loads", () => {
  test("home page renders with hero", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".nav")).toBeVisible();
    await expect(page.locator(".hero")).toBeVisible();
    // Check hero headline contains the tagline
    await expect(page.locator(".hero h1")).toBeVisible();
    // Stats bar visible
    await expect(page.locator(".hero-stats")).toBeVisible();
    await page.screenshot({ path: "test-results/site-home.png", fullPage: true });
  });

  test("nav has correct links", async ({ page }) => {
    await page.goto(BASE);
    const links = page.locator(".nav-links a");
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveText("Blog");
    await expect(links.nth(1)).toHaveText("About");
    await expect(links.nth(2)).toHaveText("App");
  });
});

test.describe("Navigation", () => {
  test("Blog page loads", async ({ page }) => {
    await page.goto(`${BASE}/#blog`);
    await page.waitForTimeout(500);
    const blogPage = page.locator("#page-blog");
    await expect(blogPage).toBeVisible();
    await page.screenshot({ path: "test-results/site-blog.png", fullPage: true });
  });

  test("About page loads", async ({ page }) => {
    await page.goto(`${BASE}/#about`);
    await page.waitForTimeout(500);
    const aboutPage = page.locator("#page-about");
    await expect(aboutPage).toBeVisible();
    // Should show Sean Coady
    await expect(page.getByText("Sean Coady")).toBeVisible();
    await page.screenshot({ path: "test-results/site-about.png", fullPage: true });
  });

  test("App page loads", async ({ page }) => {
    await page.goto(`${BASE}/#app`);
    await page.waitForTimeout(500);
    const appPage = page.locator("#page-app");
    await expect(appPage).toBeVisible();
    await page.screenshot({ path: "test-results/site-app.png", fullPage: true });
  });

  test("Blog post page loads", async ({ page }) => {
    await page.goto(`${BASE}/#blog-post-qa`);
    await page.waitForTimeout(500);
    const postPage = page.locator("#page-blog-post-qa");
    await expect(postPage).toBeVisible();
    // Should have back link
    await expect(page.locator(".blog-post-back")).toBeVisible();
    await page.screenshot({ path: "test-results/site-blog-post.png", fullPage: true });
  });
});

test.describe("Navigation flow", () => {
  test("clicking nav links switches pages without errors", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(300);

    // Home should be visible
    await expect(page.locator("#page-home")).toBeVisible();

    // Click Blog
    await page.locator(".nav-links a[href='#blog']").click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-blog")).toBeVisible();
    await expect(page.locator("#page-home")).not.toBeVisible();

    // Click About
    await page.locator(".nav-links a[href='#about']").click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-about")).toBeVisible();
    await expect(page.locator("#page-blog")).not.toBeVisible();

    // Click App
    await page.locator(".nav-links a[href='#app']").click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-app")).toBeVisible();
    await expect(page.locator("#page-about")).not.toBeVisible();

    // Click wordmark to go home
    await page.locator(".nav-wordmark").click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-home")).toBeVisible();
    await expect(page.locator("#page-app")).not.toBeVisible();
  });

  test("blog card click opens blog post", async ({ page }) => {
    await page.goto(`${BASE}/#blog`);
    await page.waitForTimeout(500);
    // Click the blog card
    await page.locator(".blog-card").first().click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-blog-post-qa")).toBeVisible();
  });

  test("back link from blog post returns to blog", async ({ page }) => {
    await page.goto(`${BASE}/#blog-post-qa`);
    await page.waitForTimeout(500);
    await page.locator(".blog-post-back").click();
    await page.waitForTimeout(400);
    await expect(page.locator("#page-blog")).toBeVisible();
  });
});

test.describe("Content verification", () => {
  test("home has featured cards", async ({ page }) => {
    await page.goto(BASE);
    const cards = page.locator(".card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("home has stats", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator(".hero-stats")).toContainText("surfaces");
  });

  test("about has social links", async ({ page }) => {
    await page.goto(`${BASE}/#about`);
    await page.waitForTimeout(500);
    const socials = page.locator(".social-link, .socials a, a[aria-label]");
    const count = await socials.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("no console errors on any page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(BASE);
    await page.waitForTimeout(300);
    await page.goto(`${BASE}/#blog`);
    await page.waitForTimeout(300);
    await page.goto(`${BASE}/#about`);
    await page.waitForTimeout(300);
    await page.goto(`${BASE}/#app`);
    await page.waitForTimeout(300);
    await page.goto(`${BASE}/#blog-post-qa`);
    await page.waitForTimeout(300);

    expect(errors).toEqual([]);
  });
});
