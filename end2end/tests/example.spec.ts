import { test, expect } from "@playwright/test";

test("homepage shows the live player and the uzg link", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Dinxper FM/);
  await expect(page.getByRole("button", { name: /Luister live/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Uitzending gemist/ })).toHaveAttribute(
    "href",
    "/uzg",
  );
});

test("uzg page renders its heading", async ({ page }) => {
  // data comes from the ftp server, so only the static part is asserted here
  await page.goto("/uzg");

  await expect(page.getByRole("heading", { name: "Uitzending gemist" })).toBeVisible();
  await expect(page).toHaveTitle(/gemiste geluid/);
});
