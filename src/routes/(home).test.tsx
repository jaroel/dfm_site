import { render } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import Home from "./(home).tsx";

test("renders", async () => {
  const { getByRole, getByText } = render(() => <Home />);
  const playButton = getByRole("button");
  expect(playButton.title).toBe(
    "Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!",
  );

  const uzgLink = getByText("Uitzending gemist?");
  expect(uzgLink.title).toBe("Uitzending gemist? Luister ze terug!");

  expect(getByText("Het swingende geluid van Dinxperlo!")).to.exist;
});

test("renders programmering", async () => {
  const { getByText, getByAltText } = render(() => <Home />);
  expect(
    getByAltText("Programmering van Dinxperlo FM").getAttribute(
      "fetchpriority",
    ),
  ).toBe("high");

  const link = getByText("In nieuwe pagina openen");
  expect(link.getAttribute("target")).toBe("blank");
  expect(link.getAttribute("href")).not.empty;
});

test("renders sponsors", async () => {
  const { getByText, getByTestId } = render(() => <Home />);
  expect(getByText("Dinxper FM wordt mede mogelijk gemaakt door")).to.exist;

  const container = getByTestId("sponsors");
  const links = container.getElementsByTagName("a");
  // Should have some sponsors
  expect(links.length).toBeGreaterThan(0);

  // Link href
  expect(
    [...links].map((item) => item.getAttribute("href")).filter(Boolean).length,
  ).to.equal(links.length);
  const images = container.getElementsByTagName("img");

  // Image src
  expect(
    [...images].map((item) => item.getAttribute("src")).filter(Boolean).length,
  ).to.equal(links.length);

  // Image alt text
  expect(
    [...images].map((item) => item.getAttribute("alt")).filter(Boolean).length,
  ).to.equal(links.length);
});
