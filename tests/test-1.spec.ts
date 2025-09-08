import { test, expect } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import path from "path";
import fs from "fs";

const projectName = "赵薇";
const picPath = "pic";
const dataDir = path.resolve(__dirname, "../dataResult", projectName);
const picDir = path.resolve(dataDir, picPath);
const jsonPath = path.resolve(dataDir, "imagePrompts.json");

// Create the pic directory if it doesn't exist
if (!fs.existsSync(picDir)) {
  fs.mkdirSync(picDir, { recursive: true });
}

// Read prompts from JSON file
const promptsData = fs.readFileSync(jsonPath, "utf8");
const prompts = JSON.parse(promptsData);

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

      await page.waitForTimeout(5000);
      await page
        .getByText("%造梦中")
        .waitFor({ state: "hidden", timeout: 50000 });

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

      for (let i = 0; i < 4; i++) {
        // await page.waitForTimeout(3000);
        // 悬停在图片容器上
        if (i == 0) {
          await page.locator(".image-card-container-ULcftx").first().hover();
        } else if (i == 1) {
          await page
            .locator(
              "div:nth-child(2) > .image-record-item-tp_chb > .context-menu-trigger-DlV5bu > .slot-card-container-T_bc2k > .content-container-BaS4t4 > .image-card-container-ULcftx"
            )
            .first()
            .hover();
        } else if (i == 2) {
          await page
            .locator(
              "div:nth-child(3) > .image-record-item-tp_chb > .context-menu-trigger-DlV5bu > .slot-card-container-T_bc2k > .content-container-BaS4t4 > .image-card-container-ULcftx"
            )
            .first()
            .hover();
        } else if (i == 3) {
          await page
            .locator(
              "div:nth-child(4) > .image-record-item-tp_chb > .context-menu-trigger-DlV5bu > .slot-card-container-T_bc2k > .content-container-BaS4t4 > .image-card-container-ULcftx"
            )
            .first()
            .hover();
        }

        await page
          .locator(".button-group-gijUWa")
          .first()
          .waitFor({ state: "visible", timeout: 10000 });
        console.log(`设置下载事件监听...`);
        const downloadPromise = page.waitForEvent("download", {
          timeout: 10000,
        });
        console.log(`点击下载按钮，等待下载事件...`);
        await page
          .locator(".icon-kLbriy > svg")
          .first()
          .click({ timeout: 10000 });
        console.log(`1111111111`);
        const download = await downloadPromise;
        console.log(`下载事件已捕获。`);
        // 构建唯一的图片保存路径
        const sanitizedPrompt = prompt
          .substring(0, 5)
          .replace(/[^a-zA-Z0-9一-龥]/g, "_");
        const picFileName = `${sanitizedPrompt}-${index + 1}-${i + 1}.png`;
        const savePath = path.join(picDir, picFileName);
        await download.saveAs(savePath);
        console.log(`图片已保存至：${savePath}`);
        await page.mouse.move(0, 0);
        await page.waitForTimeout(5000);
      }
    });
  }
});
