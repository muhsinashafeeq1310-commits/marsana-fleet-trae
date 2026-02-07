import { test, expect } from '@playwright/test';

test.describe('Vehicles Management', () => {
  test('full vehicle lifecycle (create, edit, delete)', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const plateNo = `TEST-${uniqueId.slice(-4)}`;
    const updatedPlateNo = `${plateNo}-UPD`;

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // --- 1. CREATE ---
    await page.getByRole('button', { name: 'Add Vehicle' }).click();
    
    // Wait for modal to be visible and content to load
    await expect(page.getByRole('heading', { name: 'Add New Vehicle' })).toBeVisible({ timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('input[name="plate_no"]', plateNo);
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Camry');
    await page.fill('input[name="year"]', '2025');
    await page.fill('input[name="mileage"]', '0');
    
    // Selects
    await page.selectOption('select[name="current_status"]', 'AVAILABLE');
    // Select first available branch (skipping placeholder)
    const branchSelect = page.locator('select[name="current_branch_id"]');
    await branchSelect.waitFor({ state: 'visible', timeout: 5000 });
    await branchSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: 'Create Vehicle' }).click();

    // Verify creation - wait for modal to close
    await expect(page.getByRole('heading', { name: 'Add New Vehicle' })).toBeHidden({ timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Search to ensure we find the specific vehicle
    await page.getByPlaceholder('Search by Plate No...').fill(plateNo);
    // Wait for the table to update
    await expect(page.getByText(plateNo)).toBeVisible({ timeout: 5000 });

    // --- 2. EDIT ---
    // Click edit (pencil icon)
    await page.getByTitle('Edit').first().click();
    
    await expect(page.getByRole('heading', { name: 'Edit Vehicle' })).toBeVisible({ timeout: 5000 });

    // Change plate no
    await page.fill('input[name="plate_no"]', updatedPlateNo);
    await page.getByRole('button', { name: 'Update Vehicle' }).click();

    await expect(page.getByRole('heading', { name: 'Edit Vehicle' })).toBeHidden({ timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Verify update
    await page.getByPlaceholder('Search by Plate No...').fill(updatedPlateNo);
    await expect(page.getByText(updatedPlateNo)).toBeVisible({ timeout: 5000 });

    // --- 3. DELETE ---
    // Click delete (trash icon)
    await page.getByTitle('Delete').first().click();
    
    // Confirm modal
    await expect(page.getByRole('heading', { name: 'Delete Vehicle' })).toBeVisible({ timeout: 5000 });
    // Target the "Delete" button inside the modal explicitly to avoid ambiguity with the trash icon in the table row
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

    // Verify gone
    await expect(page.getByText(updatedPlateNo)).toBeHidden({ timeout: 5000 });
  });
});
