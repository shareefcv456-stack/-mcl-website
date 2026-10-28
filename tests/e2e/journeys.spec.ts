import { expect, test, type Page } from "@playwright/test";

const quoteDialog = (page: Page) => page.getByRole("dialog", { name: "Get a Quote" });

test.describe("Get a Quote dialog", () => {
  test("opens from the header, traps focus, closes on Escape and returns focus", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "header quote button is hidden on small phones (drawer covers it)");
    await page.goto("/");
    const trigger = page.getByRole("banner").getByRole("link", { name: /get a quote/i });
    await trigger.click();
    const dialog = quoteDialog(page);
    await expect(dialog).toBeVisible();
    // Focus moves into the dialog; tabbing never reaches the page behind it. (Chrome lets Tab pass
    // through its own UI — activeElement is <body> then — before cycling back into the dialog.)
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const where = await dialog.evaluate((d) => (d.contains(document.activeElement) ? "dialog" : document.activeElement?.tagName));
      expect(["dialog", "BODY"]).toContain(where);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("shipment category tiles prefill the subject", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Medicine and Pharma/ }).click();
    await expect(quoteDialog(page).getByLabel("Subject")).toHaveValue("Quote: Medicine and Pharma");
  });

  test("validates, then honestly reports that nothing was sent", async ({ page }) => {
    await page.goto("/services");
    await page.getByRole("link", { name: /request a quote/i }).first().click();
    const dialog = quoteDialog(page);
    await dialog.getByRole("button", { name: /send message/i }).click();
    await expect(dialog.getByText("Please enter your first name.")).toBeVisible();
    await expect(dialog.getByLabel("First name")).toBeFocused();

    await dialog.getByLabel("First name").fill("E2E Test");
    await dialog.getByLabel("Email").fill("e2e@example.com");
    await dialog.getByLabel("Subject").fill("Test quote");
    await dialog.getByLabel("Phone number").fill("+91 6238399011");
    await dialog.getByLabel("Message").fill("Automated test — please ignore.");
    await dialog.getByRole("button", { name: /send message/i }).click();
    await expect(dialog.getByText("Not sent — online delivery isn't set up yet.")).toBeVisible();
    await expect(dialog.getByText(/has been sent/)).toHaveCount(0);
  });
});

test.describe("volume calculator", () => {
  test("50 × 40 × 30 cm = 12.00 kg and invalid input is explained", async ({ page }) => {
    await page.goto("/#volume");
    const calc = page.getByRole("form", { name: "Volumetric weight calculator" });
    await calc.getByLabel("Length (cm)").fill("50");
    await calc.getByLabel("Width (cm)").fill("40");
    await calc.getByLabel("Height (cm)").fill("30");
    await calc.getByRole("button", { name: "Calculate" }).click();
    await expect(calc.locator("output")).toHaveText("12.00 kg");

    await calc.getByLabel("Height (cm)").fill("-3");
    await calc.getByRole("button", { name: "Calculate" }).click();
    await expect(calc.getByText("Use numbers only, e.g. 42.5")).toBeVisible();
    await expect(calc.locator("output")).toHaveText("—");
  });
});

test.describe("tracking", () => {
  test("hero form validates, then shows the honest not-connected state", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Shipment / AWB tracking number");
    await input.fill("ab");
    await page.getByRole("button", { name: "Track Order", exact: true }).click();
    await expect(page.getByText("Use letters, numbers or hyphens (at least 3 characters).")).toBeVisible();
    await expect(input).toHaveAttribute("aria-invalid", "true");

    await input.fill("MCL-12345");
    await page.getByRole("button", { name: "Track Order", exact: true }).click();
    await expect(page).toHaveURL(/\/tracking\?tracking_id=MCL-12345$/);
    await expect(page.getByText("Tracking number received: MCL-12345")).toBeVisible();
    await expect(page.getByText(/isn't connected to this website yet/)).toBeVisible();
  });

  test("the live site's GET URL still works and invalid IDs are rejected server-side", async ({ page }) => {
    await page.goto("/tracking?tracking_id=%3Cscript%3E");
    await expect(page.getByText("That tracking number doesn't look right.")).toBeVisible();
    await expect(page.getByLabel(/tracking number/i)).toHaveValue("<script>");
  });
});

test.describe("navigation", () => {
  test("mobile drawer opens, closes on Escape and navigates", async ({ page }, info) => {
    test.skip(info.project.name === "desktop", "drawer is for tablet and mobile");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await drawer.getByRole("link", { name: "Careers" }).click();
    await expect(page).toHaveURL(/\/career$/);
    await expect(drawer).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(drawer.getByRole("link", { name: "Careers" })).toHaveAttribute("aria-current", "page");
  });

  test("desktop nav marks the current section, including detail pages", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop bar only");
    await page.goto("/service/ocean-freight");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Blogs" }).click();
    await expect(page).toHaveURL(/\/blogs$/);
    await page.getByRole("link", { name: /Advantage of Air Cargo/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Advantage of Air Cargo Transportation");
  });

  test("skip link is the first tab stop", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "keyboard check once");
    await page.goto("/about");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
});

test.describe("other forms", () => {
  test("career application rejects a non-CV file", async ({ page }) => {
    await page.goto("/career/detail/python-develper");
    const form = page.locator("#apply");
    await form.getByLabel("Applicant name").fill("E2E Test");
    await form.getByLabel("Email").fill("e2e@example.com");
    await form.getByLabel("Phone").fill("9895258623");
    await form.getByLabel("CV").setInputFiles({ name: "cv.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
    await form.getByRole("button", { name: "Submit" }).click();
    await expect(form.getByText("Upload your CV as a PDF, DOC or DOCX file.")).toBeVisible();
  });

  test("review form validates email", async ({ page }) => {
    await page.goto("/review");
    const main = page.getByRole("main"); // the closed quote dialog has its own Name/Email fields
    await main.getByLabel("Name").fill("E2E Test");
    await main.getByLabel("Email").fill("not-an-email");
    await main.getByLabel("Your comment").fill("Great");
    await main.getByRole("button", { name: /send your feedback/i }).click();
    await expect(main.getByText("Enter a valid email address, e.g. name@example.com.")).toBeVisible();
  });
});
