import { component$, Slot } from "@builder.io/qwik";
import Contactbar from "~/components/contactbar";

export default component$(() => {
  return (
    <>
      <Slot />
      <Contactbar />
    </>
  );
});
