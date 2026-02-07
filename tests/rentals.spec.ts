import { test, expect } from '@playwright/test';

test.describe('Rentals Management', () => {
  const uniqueId = Date.now().toString();
  const customerName = `Customer ${uniqueId}`;
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/rentals');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new rental agreement', async ({ page }) => {
    // Click the "New Rental" button
    await page.getByRole('button', { name: 'New Rental' }).click();
    
    // Wait for the dialog to appear with increased timeout
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('heading', { name: 'New Rental Agreement' })).toBeVisible({ timeout: 5000 });

    // Wait for select to be populated
    const vehicleSelect = page.locator('select[name="vehicle_id"]');
    await vehicleSelect.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if there are available options
    const options = await vehicleSelect.locator('option').count();
    if (options > 1) {
      await vehicleSelect.selectOption({ index: 1 });
    } else {
      // Skip test if no vehicles available
      test.skip();
    }

    await page.fill('input[name="customer_name"]', customerName);
    await page.fill('input[name="customer_phone"]', '1234567890');
    
    // Dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDateTime = (date: Date) => date.toISOString().slice(0, 16);
    
    await page.fill('input[name="start_at"]', formatDateTime(now));
    await page.fill('input[name="end_at"]', formatDateTime(tomorrow));

    await page.getByRole('button', { name: 'Create Rental' }).click();

    // Verify success - wait for dialog to close
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 5000 });
    
    // Wait for page to update
    await page.waitForLoadState('networkidle');
    
    // Search for the rental
    await page.getByPlaceholder('Search contract or customer...').fill(customerName);
    await expect(page.getByText(customerName)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('ACTIVE')).toBeVisible({ timeout: 5000 });
  });
});
