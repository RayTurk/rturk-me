import { test, expect } from '@playwright/test';

/** Pre-set cookie consent in localStorage so the banner never interferes.
 * The ConsentBanner checks localStorage('cookie-consent') on mount; if it's
 * 'accepted' or 'declined' the banner never renders. Without this, the banner
 * appears after ~800 ms and its Radix Dialog calls hideOthers(), which
 * aria-hides the rest of the page — including the command palette portal. */
async function dismissCookieBanner(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'declined');
  });
}

test('home renders the hero headline', async ({ page }) => {
  await dismissCookieBanner(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ray Turk builds fast');
});

test('command palette opens and shows the search input', async ({ page }) => {
  await dismissCookieBanner(page);
  await page.goto('/');
  // Wait for all client JS bundles (including the lazy palette chunk) to load
  await page.waitForLoadState('networkidle');
  // Trigger via the ⌘K button in the nav, which fires the command-palette:toggle
  // custom event. This avoids keyboard-focus race conditions in headless mode.
  await page.getByRole('button', { name: 'Open command palette' }).click();
  // The Radix Dialog.Content (role=dialog) renders with class="" — no explicit
  // dimensions — while its child Command root uses `fixed inset-0`, which is
  // out-of-flow and doesn't contribute to the parent's layout size.
  // Playwright's toBeVisible() requires non-zero paint area, so we assert
  // data-state="open" on the dialog element and check the search input (which
  // is inside the fixed-positioned child and IS paint-visible) separately.
  await expect(page.locator('[cmdk-dialog]')).toHaveAttribute('data-state', 'open', { timeout: 10_000 });
  await expect(page.getByPlaceholder('Type a command or search…')).toBeVisible();
});

test('core routes resolve', async ({ page }) => {
  for (const path of ['/work', '/writing', '/about', '/colophon', '/contact']) {
    const res = await page.goto(path);
    expect(res?.status(), `GET ${path}`).toBeLessThan(400);
  }
});

test('contact form has the expected fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
});

test('sitemap, robots, and rss are served', async ({ page }) => {
  expect((await page.goto('/sitemap.xml'))?.status()).toBe(200);
  expect((await page.goto('/robots.txt'))?.status()).toBe(200);
  expect((await page.goto('/feed.xml'))?.status()).toBe(200);
});
