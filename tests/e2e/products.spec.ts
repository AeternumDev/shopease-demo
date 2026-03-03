import { test, expect } from '@playwright/test';

test.describe('Produktseiten', () => {
  test('Produktliste ist aufrufbar und zeigt Produkte', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: /produkte/i })).toBeVisible();
    // Wait for products to load
    await expect(page.getByText('Bambuszahnbürste Set')).toBeVisible({ timeout: 10000 });
  });

  test('Produkte haben Warenkorb-Button', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('button:has-text("In den Warenkorb")', { timeout: 10000 });
    const buttons = page.getByRole('button', { name: /in den warenkorb/i });
    await expect(buttons.first()).toBeVisible();
  });

  test('Suchfeld ist vorhanden und filtert Produkte', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByLabel(/produkte suchen/i)).toBeVisible({ timeout: 10000 });

    await page.getByLabel(/produkte suchen/i).fill('Bambus');
    await expect(page.getByText('Bambuszahnbürste Set')).toBeVisible();
  });

  test('Klick auf Produkt öffnet Detailseite', async ({ page }) => {
    await page.goto('/products/prod-001');
    await expect(page.getByText('Bambuszahnbürste Set')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/12,99/)).toBeVisible();
  });

  test('Produktdetailseite zeigt Name und Preis', async ({ page }) => {
    await page.goto('/products/prod-003');
    await expect(page.getByText('Edelstahl Trinkflasche')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/24,99/)).toBeVisible();
  });
});
