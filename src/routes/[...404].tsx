import { ResponsiveImage } from "@responsive-image/solid";
import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import logo from "~/assets/logodinxperfm.png?w=768&format=avif;webp;png&responsive";

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  return (
    <>
      <div class="my-10 flex justify-evenly">
        <div class="max-w-sm">
          <ResponsiveImage
            src={logo}
            alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
          />
          <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>

      <div class="bg-gray-100 p-9 text-black">
        <div class="max-w-7xl px-6 text-center">
          <p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
            404 - Pagina niet gevonden.
          </p>
        </div>
      </div>
    </>
  );
}
