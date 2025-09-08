import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import path from "path";
import fs from "fs";


// const videoName = process.env.videoName!;
const videoName = "光绪为啥干不过慈禧";
const baseDir = process.cwd();
const imagesPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'images');
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}
const jsonPath =path.join(baseDir, 'public', 'data', 'videos', videoName, 'imagePrompts.json');

// Read prompts from JSON file
const promptsData = fs.readFileSync(jsonPath, "utf8");
// const prompts = JSON.parse(promptsData);
const prompts = [
  "2个美女打篮球"
]

// 辅助函数：下载并保存图片
async function downloadImage(page: any, prompt: string, testIndex: number, imageIndex: number) {
  const sanitizedPrompt = prompt.substring(0, 5).replace(/[^a-zA-Z0-9一-龥]/g, "_");
  const picFileName = `${sanitizedPrompt}-${testIndex + 1}-${imageIndex + 1}.png`;
  const savePath = path.join(imagesPath, picFileName);

  // 根据 imageIndex 选择不同的图片元素
  const imageLocator = imageIndex === 0 
    ? page.locator(".image-card-container-ULcftx").first() 
    : page.locator(".image-card-container-ULcftx").nth(imageIndex);
  await imageLocator.hover();
  await page.locator(".button-group-gijUWa").first().waitFor({ state: "visible", timeout: 10000 });
  const downloadPromise = page.waitForEvent("download", { timeout: 10000 });
  await page.locator(".icon-kLbriy > svg").first().click({ timeout: 10000 });
  const download = await downloadPromise;
  await download.saveAs(savePath);
  console.log(`图片已保存至：${savePath}`);
  if (imageIndex < 3) { // 重新编辑操作只在前三张图片下载后执行
    await page.locator("div").filter({ hasText: /^重新编辑$/ }).first().hover();
    await page.locator(".button-group-gijUWa").first().waitFor({ state: "hidden", timeout: 10000 });
  }
}

async function downloadImageLittle(page: any, prompt: string, testIndex: number, imageIndex: number) {
  
}

// Process each prompt sequentially
test.describe.serial("Image Generation Tests", () => {
  for (const [index, prompt] of prompts.entries()) {
    test(`test-${index}`, async ({ page }) => {
      await page.goto("https://jimeng.jianying.com/ai-tool/home", {
        timeout: 10000,
      });
      await page.locator(".lv-select-view").first().click();
      await page.getByRole("option", { name: "图片生成" }).click();

      await page
        .getByRole("button", { name: ":1 标清 1K" })
        .first()
        .click({ timeout: 10000 });
      // 选择图片比例：支持环境变量控制或随机选择
      let aspectRatio = process.env.ASPECT_RATIO; // 可以通过环境变量指定比例
      if (!aspectRatio) {
        aspectRatio = true ? "9:16" : "16:9";
      }

      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${aspectRatio}$`) })
        .nth(1)
        .waitFor({ state: "visible", timeout: 10000 });
      await page
        .locator("div")
        .filter({ hasText: new RegExp(`^${aspectRatio}$`) })
        .nth(1)
        .click({ timeout: 10000 });
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
        .filter({
          hasText: new RegExp(`^图片生成图片 3\.1${aspectRatio}标清 1K1$`),
        })
        .getByRole("button")
        .nth(2)
        .click({ timeout: 10000 });

      await page.waitForTimeout(10000);
      await page
        .getByText("排队中...")
        .waitFor({ state: "hidden", timeout: 50000 });
      await page
        .getByText("%造梦中")
        .waitFor({ state: "hidden", timeout: 50000 });

        // 下载四张图片
      for (let i = 0; i < 4; i++) {
        await downloadImage(page, prompt, index, i);
      }
      // const pics = page.locator(".image-card-container-ULcftx img");
      // for (let i = 0; i < 4; i++) {
      //   await pics.nth(i).hover();
      //   await page
      //     .locator(".button-group-gijUWa")
      //     .first()
      //     .waitFor({ state: "visible", timeout: 10000 });
      //   console.log(`设置下载事件监听...`);
      //   const downloadPromise = page.waitForEvent("download", {
      //     timeout: 10000,
      //   });
      //   console.log(`点击下载按钮，等待下载事件...`);
      //   await page
      //     .locator(".icon-kLbriy > svg")
      //     .first()
      //     .click({ timeout: 10000 });
      //   console.log(`1111111111`);
      //   const download = await downloadPromise;
      //   console.log(`下载事件已捕获。`);
      //   // 构建唯一的图片保存路径
      //   const sanitizedPrompt = prompt
      //     .substring(0, 5)
      //     .replace(/[^a-zA-Z0-9一-龥]/g, "_");
      //   const picFileName = `${sanitizedPrompt}-${index + 1}-${i + 1}.png`;
      //   const savePath = path.join(picDir, picFileName);
      //   await download.saveAs(savePath);
      //   console.log(`图片已保存至：${savePath}`);
      //   await page.mouse.move(0, 0);
      //   await page.waitForTimeout(5000);
      // }
 
    });
  }
});
