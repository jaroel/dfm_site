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

test("homepage renders the sponsor wall", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Dinxper FM wordt mede mogelijk gemaakt door")).toBeVisible();

  const sponsors = page.getByTestId("sponsors");
  const links = sponsors.locator("a");
  await expect(links).toHaveCount(7);

  const cards = await sponsors.locator("a").evaluateAll((els) =>
    els.map((el) => {
      const img = el.querySelector("img");
      return {
        href: el.getAttribute("href"),
        src: img?.getAttribute("src") ?? "",
        alt: img?.getAttribute("alt") ?? "",
        lazy: img?.getAttribute("loading") ?? "",
      };
    }),
  );

  for (const card of cards) {
    expect(card.href).toBeTruthy();
    expect(card.src).toMatch(/^\/assets\/sponsors\//);
    expect(card.alt).toBeTruthy();
    expect(card.lazy).toBe("lazy");
  }
});

test("uzg page renders its heading", async ({ page }) => {
  // data comes from the ftp server, so only the static part is asserted here
  await page.goto("/uzg");

  await expect(page.getByRole("heading", { name: "Uitzending gemist" })).toBeVisible();
  await expect(page).toHaveTitle(/gemiste geluid/);
});
