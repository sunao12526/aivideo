import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const text =
  "这第一个支撑就是我前面提到的外国资本的介入，不仅是为阿里早期的发展供了血，更重要的是引入了现代欧美的企业股权和管理制度，这个是非常关键的。另外一个更关键的支撑就是红色资本的介入。在中国这样的环境中，任何一个企业你想要做大做强，没有权利的庇护和背书，那几乎是不可能的。而阿里在成长为资本巨鳄的过程中也不例外。";
test("test", async ({ page }) => {
  await page.goto("https://www.tts-free.online/zh");
  await page.getByRole("link", { name: "立即试用" }).click();
  await page.getByRole("button", { name: "Xiaoxiao" }).click();
  await page.getByRole("option", { name: "Yunyang 男声" }).click();
  await page.getByRole("textbox", { name: "输入文字" }).click();
  await page.getByRole("textbox", { name: "输入文字" }).fill(text);
  await page.getByRole("button", { name: "生成语音" }).click();
  await page.waitForLoadState("networkidle");
  // 下载音频文件
  const downloadDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载 MP3" }).click();
  const download = await downloadPromise;
  const savePath = path.join(downloadDir, download.suggestedFilename());
  await download.saveAs(savePath);
  console.log(`音频已保存至：${savePath}`);
});
