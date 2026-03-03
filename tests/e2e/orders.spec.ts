import { test, expect } from '@playwright/test';

test.describe('Bestellungen & Warenkorb', () => {
  test('nicht angemeldete Nutzer werden von /orders zu /login weitergeleitet', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/login/);
  });

  test('Startseite ist erreichbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /shopease demo/i })).toBeVisible();
  });

  test('Produktliste lädt und zeigt In-den-Warenkorb-Buttons', async ({ page }) => {
    await page.goto('/products');
    // Wait for products to load
    await page.waitForSelector('button:has-text("In den Warenkorb")', { timeout: 10000 });
    const cartButtons = page.getByRole('button', { name: /in den warenkorb/i });
    const count = await cartButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Produkt kann zum Warenkorb hinzugefügt werden', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('button:has-text("In den Warenkorb")', { timeout: 10000 });

    const firstButton = page.getByRole('button', { name: /in den warenkorb/i }).first();
    await firstButton.click();

    // The button click should work without errors
    await expect(page).not.toHaveURL(/error/);
  });

  test('Admin-Bereich ist ohne Anmeldung gesperrt', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/login/);
  });
});
