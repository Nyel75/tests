import { test, expect } from '@playwright/test';

test('Create New Client Template', async ({ page }) => {
  // Open your application
  await page.goto('http://172.20.0.121:8001/template-manager');

  // Verify page loaded
  await expect(page.getByText('Template Manager')).toBeVisible();

  // Click Upload / Merge tab
  await page.getByRole('tab', { name: 'Upload / Merge' }).click();

  // Click Add New Client
  await page.getByRole('button', { name: '+ Add New Client' }).click();

  // Select Document Type
  await page.locator('select').selectOption({ index: 1 });

  // Fill Client Folder Name
  await page.getByPlaceholder('Enter a unique client folder name')
    .fill('Playwright Client');

  // Fill DL Type Name
  await page.getByPlaceholder(/dl1|CA_Installment/i)
    .fill('DL_TEST');

  // Fill Template Name
  await page.getByPlaceholder('e.g. CLIENTNAME_dl1.docx')
    .fill('CLIENT_TEST.docx');

  // Fill Notes
  await page.getByPlaceholder('Add context for this client and template')
    .fill('Created by Playwright');

  // Verify Create button exists
  await expect(
    page.getByRole('button', { name: /Create & Merge/i })
  ).toBeVisible();
});