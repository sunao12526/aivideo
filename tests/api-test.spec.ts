// import { test, expect } from '@playwright/test';
// import path from 'path';

// test('API test example', async ({ page }) => {
//   // This test is run via the API
//   // You can access passed parameters via process.env
//   const videoName = process.env.videoName!;
//   console.log(videoName);
//   console.log('111111');

//    const baseDir = process.cwd();
//    const imagePromptsPath = path.join(baseDir, 'public', 'data', 'videos', videoName);
//    console.log(imagePromptsPath);

//   // Your test logic here
//   await page.goto('https://playwright.dev/');
//   const title = page.locator('.navbar__inner .navbar__title');
//   await expect(title).toHaveText('Playwright');
// });