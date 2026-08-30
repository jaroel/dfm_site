import { render, waitFor } from "@solidjs/testing-library";
import { beforeEach, expect, test, vi } from "vitest";
import UZG from "./(uzg).tsx";

const mockFetchUzgListing = vi.hoisted(() => vi.fn());

vi.mock("~/uzg", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/uzg")>();
  return {
    ...actual,
    fetchUzgListing: mockFetchUzgListing,
  };
});

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    // Bypass the query cache: resolve the read straight through the mocked
    // server function.
    query: <T,>(fn: T) => fn,
  };
});

beforeEach(() => {
  mockFetchUzgListing.mockReset();
});

test("renders header elements", async () => {
  mockFetchUzgListing.mockResolvedValue([]);

  const { getByRole, getByText, getByTitle, getByAltText } = render(() => (
    <UZG />
  ));

  await waitFor(() => {
    expect(getByRole("heading", { name: "Uitzending gemist" })).toBeTruthy();
  });

  const backLink = getByTitle("Terug naar homepage");
  expect(backLink.getAttribute("href")).toBe("/");

  expect(
    getByAltText("Dinxper FM - Het swingende geluid van Dinxperlo!"),
  ).toBeTruthy();
  expect(getByText("Het swingende geluid van Dinxperlo!")).toBeTruthy();
  await waitFor(() => {
    expect(
      getByText(
        "Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik de speler om de uitzending terug te luisteren of klik de link om de uitzending op te slaan.",
      ),
    ).toBeTruthy();
  });
});

test("renders recordings", async () => {
  mockFetchUzgListing.mockResolvedValue([
    new Date("2024-01-15T10:00:00").getTime(),
    new Date("2024-01-15T11:00:00").getTime(),
    new Date("2024-01-15T12:00:00").getTime(),
  ]);

  const { getAllByRole, container } = render(() => <UZG />);

  await waitFor(() => {
    const buttons = getAllByRole("button");
    expect(buttons.length).toBe(3);

    buttons.forEach((button, index) => {
      const hour = 10 + index;
      expect(button.title).toContain(`${hour} uur`);
    });
  });

  await waitFor(() => {
    const links = container.querySelectorAll('a[rel="external"]');
    expect(
      [...links].map((link) => ({
        href: link.getAttribute("href"),
        text: link.textContent,
      })),
    ).toEqual([
      {
        href: "/uzg/15-01-2024-10-00.mp3",
        text: "download",
      },
      {
        href: "/uzg/15-01-2024-11-00.mp3",
        text: "download",
      },
      {
        href: "/uzg/15-01-2024-12-00.mp3",
        text: "download",
      },
    ]);
  });
});

test("renders empty state", async () => {
  mockFetchUzgListing.mockResolvedValue([]);

  const { getByText } = render(() => <UZG />);

  await waitFor(() => {
    expect(
      getByText("Op dit moment zijn er geen uitzendingen beschikbaar."),
    ).toBeTruthy();
  });
});
