import { test, expect } from '@playwright/test';

// improved dialog wait strategies and proper element visibility checks

test('Rentals Dialog', async ({ page }) => {
    // Navigate to the page where the dialog appears
    await page.goto('/rentals');

    // Wait for the dialog to be visible
    const dialog = page.locator('#rentals-dialog');
    await dialog.waitFor({ state: 'visible' });

    // Check if the dialog is visible
    await expect(dialog).toBeVisible();

    // Interaction within the dialog
    const closeButton = dialog.locator('.close-button');
    await closeButton.waitFor({ state: 'visible' });
    await closeButton.click();

    // Wait for the dialog to be hidden
    await dialog.waitFor({ state: 'hidden' });
});