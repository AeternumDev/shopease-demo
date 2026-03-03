import { test, expect } from '@playwright/test';

test.describe('Authentifizierung', () => {
  test('Login-Seite ist erreichbar und zeigt Formular', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /anmelden/i })).toBeVisible();
  });

  test('Login-Formular hat E-Mail- und Passwortfelder', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/e-mail/i)).toBeVisible();
    await expect(page.getByLabel(/passwort/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /anmelden/i })).toBeVisible();
  });

  test('zeigt Fehlermeldung bei ungültiger Anmeldung', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-mail/i).fill('falsch@example.com');
    await page.getByLabel(/passwort/i).fill('falschesPasswort');
    await page.getByRole('button', { name: /anmelden/i }).click();
    // Use locator('p[role="alert"]') to avoid matching the Next.js route announcer <div role="alert">
    await expect(page.locator('p[role="alert"]')).toBeVisible();
  });

  test('erfolgreiche Anmeldung mit Testuser', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/e-mail/i).fill('kunde@shopease.de');
    await page.getByLabel(/passwort/i).fill('testpasswort123');
    await page.getByRole('button', { name: /anmelden/i }).click();
    // Should redirect away from login
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 5000 });
  });

  test('/orders leitet zur Login-Seite um (Middleware)', async ({ page }) => {
    await page.goto('/orders');
    // Middleware should redirect to /login
    await expect(page).toHaveURL(/login/);
  });
});
