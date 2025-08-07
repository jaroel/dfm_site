// import userEvent from "@testing-library/user-event";
import { render } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import Picture from "./Picture";
// const user = userEvent.setup();

import logo1 from "~/assets/logodinxperfm.png?w=200&as=picture";
test("minimal", async () => {
  const { getByAltText } = render(() => (
    <Picture alt="some text" logo={logo1} />
  ));
  const img = getByAltText("some text") as HTMLImageElement;
  expect(img.src.endsWith(logo1.img.src)).toBeTruthy;
  expect(img.width).toBe(logo1.img.w);
  expect(img.height).toBe(logo1.img.h);
  expect(img.alt).toBe("some text");
});
test("full", async () => {
  const { container, getByAltText } = render(() => (
    <Picture
      alt="some text"
      logo={logo1}
      class="myClass"
      style="color: red"
      fetchpriority="high"
    />
  ));
  // expect(baseElement.className).toBe("myClass");
  const pictures = container.getElementsByTagName("picture");
  expect(pictures.length).toBe(1);
  const picture = pictures[0];
  expect(picture.className).toBe("inline-block myClass");
  expect(picture.getAttribute("style")).toBe("color: red;");
  const img = getByAltText("some text") as HTMLImageElement;
  expect(img.getAttribute("fetchPriority")).toBe("high");
});

import logo2 from "~/assets/logodinxperfm.png?w=100&format=avif;png&as=picture";
test("sources", async () => {
  const { container } = render(() => <Picture alt="some text" logo={logo2} />);
  const sources = container.getElementsByTagName("source");
  expect(sources.length).toBe(1);
});
