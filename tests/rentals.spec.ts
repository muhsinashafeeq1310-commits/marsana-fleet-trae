// Updated test file with proper wait times and retry logic.

import { expect } from 'chai';
import { Page } from 'playwright';

describe('Rentals', function() {
    let page: Page;

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('should check dialog visibility after navigation', async () => {
        await page.goto('your-navigation-url-here');
        await page.waitForLoadState('networkidle'); // Ensures all network requests are finished
        await page.waitForSelector('selector-for-your-dialog', { timeout: 5000 }); // Wait for dialog to be present

        const checkDialogVisibility = async (maxRetries = 3, delay = 1000) => {
            for (let i = 0; i < maxRetries; i++) {
                const isVisible = await page.isVisible('selector-for-your-dialog');
                if (isVisible) return;
                await new Promise(resolve => setTimeout(resolve, delay)); // Delay before retry
            }
            throw new Error('Dialog not visible after retries.');
        };

        await checkDialogVisibility(); // Call the retry logic for checking dialog visibility
        expect(await page.isVisible('selector-for-your-dialog')).to.be.true;
    });
});
