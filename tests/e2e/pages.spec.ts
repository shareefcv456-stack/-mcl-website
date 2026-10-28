import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

test.describe("every original route", () => {
  for (const path of ROUTES) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const errors: string[] = [];
      const failedAssets: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => r.status() >= 400 && failedAssets.push(`${r.status()} ${r.url()}`));

      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page).toHaveTitle(/MCL – Meem Continental Logistics/);

      // Force every image (including lazy and hidden-drawer ones) to load, then check none are broken.
      const broken = await page.evaluate(async () => {
        const imgs = [...document.images];
        imgs.forEach((i) => (i.loading = "eager"));
        await Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
        return imgs.filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      });
      expect(broken, "broken images").toEqual([]);
      expect(failedAssets, "failed requests").toEqual([]);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(0);
      expect(errors, "console errors").toEqual([]);
    });
  }
});

test.describe("routing rules", () => {
  test("support and reviews aliases, trailing slashes and unknown pages", async ({ request }) => {
    const r = (path: string) => request.get(path, { maxRedirects: 0 });
    expect((await r("/support")).headers().location).toBe("/contact");
    expect((await r("/support")).status()).toBe(308);
    expect((await r("/reviews")).headers().location).toBe("/review");
    expect((await r("/about/")).status()).toBe(308);
    for (const missing of ["/nope", "/service/nope", "/blog/detail/nope", "/career/detail/nope"]) {
      expect((await r(missing)).status(), missing).toBe(404);
    }
  });

  test("security headers, sitemap and robots", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
    expect(res.headers()["x-powered-by"]).toBeUndefined();
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ROUTES.filter((p) => p !== "/design-system")) expect(sitemap).toContain(`${path === "/" ? "" : path}</loc>`);
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /api/");
  });

  test("pages declare canonical URLs and Open Graph data", async ({ page }) => {
    await page.goto("/service/ocean-freight");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/service\/ocean-freight$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Sea Cargo Services/);
    await page.goto("/design-system");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test("every internal link resolves", async ({ page, request }, info) => {
  test.skip(info.project.name !== "desktop", "link crawl runs once");
  const hrefs = new Set<string>();
  for (const path of ROUTES) {
    await page.goto(path);
    for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!))) hrefs.add(href);
  }
  const failures: string[] = [];
  for (const href of hrefs) {
    const status = (await request.get(href)).status();
    if (status >= 400) failures.push(`${status} ${href}`);
  }
  expect(failures).toEqual([]);
  // Every public page is reachable through site links (design system is intentionally unlinked).
  const linked = [...hrefs].map((h) => h.split(/[?#]/)[0]);
  for (const path of ROUTES.filter((p) => p !== "/design-system")) expect(linked, path).toContain(path);
});
