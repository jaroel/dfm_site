import { HttpStatusCode } from "@solidjs/start";
import logo from "~/assets/logodinxperfm.png?w=768&format=avif;webp;png&responsive";
import { ResponsiveImage } from "@responsive-image/solid";

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <div class="mt-10 mb-10 flex justify-evenly">
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
          <p class="mx-auto mt-5 max-w-5xl text-gray-500 text-xl">
            404 - Pagina niet gevonden.
          </p>
        </div>
      </div>
    </>
  );
}
