import { test, expect } from '@playwright/test';

test.describe('Rentals Management', () => {
  const uniqueId = Date.now().toString();
  const customerName = `Customer ${uniqueId}`;
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/rentals');
  });

  test('should create a new rental agreement', async ({ page }) => {
    await page.getByRole('button', { name: 'New Rental' }).click();
    
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New Rental Agreement' })).toBeVisible();

    // Select a vehicle (assuming at least one AVAILABLE vehicle exists from seeding/previous tests)
    // We might need to ensure an available vehicle first.
    // In a real test env, we'd seed data. Here we hope.
    const vehicleSelect = page.locator('select[name="vehicle_id"]');
    // If no options, this might fail.
    await vehicleSelect.selectOption({ index: 1 }); 

    await page.fill('input[name="customer_name"]', customerName);
    await page.fill('input[name="customer_phone"]', '1234567890');
    
    // Dates
    // Set start date to today
    // Set end date to tomorrow
    // Note: datetime-local input handling in Playwright can be tricky depending on browser.
    // Simplest is usually fill. Format: YYYY-MM-DDTHH:mm
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDateTime = (date: Date) => date.toISOString().slice(0, 16);
    
    await page.fill('input[name="start_at"]', formatDateTime(now));
    await page.fill('input[name="end_at"]', formatDateTime(tomorrow));

    await page.getByRole('button', { name: 'Create Rental' }).click();

    // Verify success
    await expect(page.getByRole('dialog')).toBeHidden();
    
    // Search for the rental
    await page.getByPlaceholder('Search contract or customer...').fill(customerName);
    await expect(page.getByText(customerName)).toBeVisible();
    await expect(page.getByText('ACTIVE')).toBeVisible();
  });
});
