import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import path from "path";
import fs from "fs";


const videoName = process.env.videoName!;
const baseDir = process.cwd();
const imagesPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'images');
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}
const jsonPath =path.join(baseDir, 'public', 'data', 'videos', videoName, 'imagePrompts.json');

// Read prompts from JSON file
const promptsData = fs.readFileSync(jsonPath, "utf8");
const prompts = JSON.parse(promptsData);

// Process each prompt sequentially
test.describe.serial("Image Generation Tests", () => {
  for (const [index, prompt] of prompts.entries()) {
    test(`test-${index}`, async ({ page }) => {
      await page.goto("https://jimeng.jianying.com/ai-tool/home", {
        timeout: 30000,
      });
      await page
        .getByRole("button", { name: ":1 标清 1K" })
        .first()
        .click({ timeout: 30000 });

      // 选择图片比例：支持环境变量控制或随机选择
      let aspectRatio = process.env.ASPECT_RATIO; // 可以通过环境变量指定比例
      if (!aspectRatio) {
        aspectRatio = true ? "9:16" : "16:9";
      }
      console.log(`选择图片比例: ${aspectRatio}`);

      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${aspectRatio}$`) })
        .nth(1)
        .waitFor({ state: "visible", timeout: 30000 });
      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${aspectRatio}$`) })
        .nth(1)
        .waitFor({ state: "attached", timeout: 30000 });
      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${aspectRatio}$`) })
        .nth(1)
        .click({ timeout: 30000 });
      await page
        .getByRole("textbox", {
          name: "请输入图片生成的提示词，例如：做一张“情人节”海报",
        })
        .first()
        .click();
      await page
        .getByRole("textbox", {
          name: "请输入图片生成的提示词，例如：做一张“情人节”海报",
        })
        .first()
        .fill(prompt);
      await page
        .locator("div")
        // .filter({ hasText: /^图片生成图片 3\.19:16标清 1K1$/ })
        .filter({
          hasText: new RegExp(`^图片生成图片 3\.1${aspectRatio}标清 1K1$`),
        })
        .getByRole("button")
        .nth(3)
        .click();
      await page.waitForTimeout(40000);

      // 更准确地定位图片元素（应该是img标签而不是容器）
      const pics = page.locator(".image-card-container-ULcftx img");
      for (let i = 0; i < 4; i++) {
        console.log(pics.nth(i));
        const picUrl = await pics.nth(i).getAttribute("src");
        console.log(`Attempting to get: ${picUrl}`);
        const response = await page.request.get(picUrl!);
        // Use first 10 characters of prompt for filename
        const sanitizedPrompt = prompt
          .substring(0, 10)
          .replace(/[^a-zA-Z0-9一-龥]/g, "_");
        const picFileName = `${sanitizedPrompt}-${aspectRatio.replace(
          ":",
          "-"
        )}-${index}-${i + 1}.png`;
 
        const savePath = path.join(imagesPath, picFileName);
        console.log(`图片已保存至：${savePath}`);
        await writeFile(savePath, await response.body());
      }
    });
  }
});
