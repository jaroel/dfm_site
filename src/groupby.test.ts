import { expect, test, vi } from "vitest";
import { groupBy } from "./groupby.ts";

const items = [
  { kind: "a", n: 1 },
  { kind: "b", n: 2 },
  { kind: "a", n: 3 },
];

const byKind = (item: (typeof items)[number]) => item.kind;

test("delegates to the native Map.groupBy when available", () => {
  const native = vi.spyOn(Map, "groupBy");

  const groups = groupBy(items, byKind);

  expect(native).toHaveBeenCalledOnce();
  expect(groups.get("a")?.map((item) => item.n)).toEqual([1, 3]);
  native.mockRestore();
});

test("falls back to a first-seen-order Map when Map.groupBy is missing", () => {
  const native = Map.groupBy;
  Object.defineProperty(Map, "groupBy", {
    value: undefined,
    configurable: true,
  });

  try {
    const groups = groupBy(items, byKind);

    expect([...groups.keys()]).toEqual(["a", "b"]);
    expect(groups.get("a")?.map((item) => item.n)).toEqual([1, 3]);
  } finally {
    Object.defineProperty(Map, "groupBy", {
      value: native,
      configurable: true,
      writable: true,
    });
  }
});
