import { test, expect } from '@playwright/test';

test.describe('Vehicles Management', () => {
  test('full vehicle lifecycle (create, edit, delete)', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const plateNo = `TEST-${uniqueId.slice(-4)}`;
    const updatedPlateNo = `${plateNo}-UPD`;

    await page.goto('/vehicles');

    // --- 1. CREATE ---
    await page.getByRole('button', { name: 'Add Vehicle' }).click();
    
    // Wait for content inside the modal to be sure it's fully rendered
    await expect(page.getByRole('heading', { name: 'Add New Vehicle' })).toBeVisible();

    // Fill form
    await page.fill('input[name="plate_no"]', plateNo);
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Camry');
    await page.fill('input[name="year"]', '2025');
    await page.fill('input[name="mileage"]', '0');
    
    // Selects
    await page.selectOption('select[name="current_status"]', 'AVAILABLE');
    // Select first available branch (skipping placeholder)
    await page.locator('select[name="current_branch_id"]').selectOption({ index: 1 });

    await page.getByRole('button', { name: 'Create Vehicle' }).click();

    // Verify creation
    await expect(page.getByRole('heading', { name: 'Add New Vehicle' })).toBeHidden();
    
    // Search to ensure we find the specific vehicle
    await page.getByPlaceholder('Search by Plate No...').fill(plateNo);
    // Wait for the table to update
    await expect(page.getByText(plateNo)).toBeVisible();

    // --- 2. EDIT ---
    // Click edit (pencil icon)
    await page.getByTitle('Edit').first().click();
    
    await expect(page.getByRole('heading', { name: 'Edit Vehicle' })).toBeVisible();

    // Change plate no
    await page.fill('input[name="plate_no"]', updatedPlateNo);
    await page.getByRole('button', { name: 'Update Vehicle' }).click();

    await expect(page.getByRole('heading', { name: 'Edit Vehicle' })).toBeHidden();
    
    // Verify update
    await page.getByPlaceholder('Search by Plate No...').fill(updatedPlateNo);
    await expect(page.getByText(updatedPlateNo)).toBeVisible();

    // --- 3. DELETE ---
    // Click delete (trash icon)
    await page.getByTitle('Delete').first().click();
    
    // Confirm modal
    await expect(page.getByRole('heading', { name: 'Delete Vehicle' })).toBeVisible();
    // Target the "Delete" button inside the modal explicitly to avoid ambiguity with the trash icon in the table row
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

    // Verify gone
    await expect(page.getByText(updatedPlateNo)).toBeHidden();
  });
});
