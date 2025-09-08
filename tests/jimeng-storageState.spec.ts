import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://jimeng.jianying.com/ai-tool/home");
  await page.getByText("登录").click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "同意", exact: true }).click();
  const page1 = await page1Promise;
  await page1.getByRole("tab", { name: "验证码授权" }).click();
  await page1.getByRole("textbox", { name: "请输入手机号" }).click();
  await page1
    .getByRole("textbox", { name: "请输入手机号" })
    .fill("18610239072");
  // await page1.getByText("获取验证码").click();
  await page1.getByRole("textbox", { name: "请输入验证码" }).click();
  await page1.getByRole("textbox", { name: "请输入验证码" }).fill("9534");
  await page1.locator(".privacy-check-wrap").click();
  await page1.getByText("抖音授权登录").click();
  await page.waitForTimeout(10 * 1000);
  await page.context().storageState({ path: "user-jimeng.json" });
});
