// import userEvent from "@testing-library/user-event";
import { render } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import Picture from "./Picture";

import logo from "~/assets/logodinxperfm.png?as=picture";

// const user = userEvent.setup();

test("increments value", async () => {
  const { getByAltText } = render(() => (
    <Picture alt="some text" logo={logo} />
  ));
  const img = getByAltText("some text");
  expect(img).to.exist;
});
