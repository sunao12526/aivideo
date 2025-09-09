import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const videoName = process.env.videoName!;
const baseDir = process.cwd();
const audioPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'audio');
if (!fs.existsSync(audioPath)) {
  fs.mkdirSync(audioPath, { recursive: true });
}
const contentPath = path.join(baseDir, 'public', 'data', 'videos', videoName, 'content.txt');
const text = fs.readFileSync(contentPath, "utf8");
 
test("test", async ({ page }) => {
  await page.goto("https://www.tts-free.online/zh");
  await page.getByRole("link", { name: "立即试用" }).click();
  await page.getByRole("button", { name: "Xiaoxiao" }).click();
  await page.getByRole("option", { name: "Yunyang 男声" }).click();
  await page.getByRole("textbox", { name: "输入文字" }).click();
  await page.getByRole("textbox", { name: "输入文字" }).fill(text);
  await page.getByRole("button", { name: "生成语音" }).click();
  await page.waitForLoadState("networkidle");
 
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载 MP3" }).click();
  const download = await downloadPromise;
  const savePath = path.join(audioPath, download.suggestedFilename());
  await download.saveAs(savePath);
  console.log(`音频已保存至：${savePath}`);
});
