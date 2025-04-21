import { HttpStatusCode } from "@solidjs/start";
import logo from "~/assets/logodinxperfm.png?w=768&format=avif;webp;png&as=picture";
import Picture from "~/components/Picture";

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <div class="mb-10 mt-10 flex justify-evenly">
        <div class="max-w-sm">
          <Picture
            logo={logo}
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
