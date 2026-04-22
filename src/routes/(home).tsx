import logo from "~/assets/logodinxperfm.png?w=384;768&format=avif;webp;png&responsive";
import programmering from "~/assets/programmering.jpg?w=1084&format=avif;webp;jpeg&lqip=inline&responsive";
import tibatek_logo_web from "~/assets/sponsors/tibatek_logo_web.png?w=242&format=avif;webp;png&lqip=inline&responsive";
import Controls from "~/components/Controls.tsx";
import { ResponsiveImage } from "@responsive-image/solid";
import type { ImageData } from '@responsive-image/core';
import Player from "~/components/Player.tsx";

const sponsors = import.meta.glob<ImageData>("~/assets/sponsors/*", {
  eager: true,
  import: "default",
  query: "w=500&format=avif;webp;png&lqip=inline&responsive",
});

export default function Home() {
  return (
    <>
      <Player />
      <div class="mt-10 mb-10 flex justify-evenly">
        <div class="max-w-xs md:max-w-sm">
          <ResponsiveImage
            src={logo}
            alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
            fetchpriority="high"
            width={384}
          />
          <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>
      <nav class="flex justify-evenly bg-gray-100">
        <ul class="my-1 flex list-none flex-wrap gap-4">
          <li>
            <Controls
              title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!"
              label="Luister live!"
              src="https://stream.dinxperfm.nl/1"
            />
          </li>
          <li>
            <a
              class="my-1 flex cursor-pointer items-center rounded-full border border-gray-800 bg-gray-100 px-4 py-2 text-gray-800 no-underline hover:bg-gray-800 hover:text-white"
              href="/uzg/"
              title="Uitzending gemist? Luister ze terug!"
            >
              Uitzending gemist?
            </a>
          </li>
        </ul>
      </nav>
      <div class="mt-10 flex justify-center">
        <ResponsiveImage
          src={programmering}
          alt="Programmering van Dinxperlo FM"
          fetchpriority="high"
          loading="eager"
          width={1084}
        />
      </div>
      <div class="text-center">
        <a
          target="blank"
          class="text-blue-400"
          href={programmering.imageUrlFor(1084)}
          title="Bekijk het programma in een nieuw scherm"
        >
          In nieuwe pagina openen
        </a>
      </div>
      <div class="mt-10 text-center">
        <h2 class="mb-8 text-2xl">
          Dinxper FM wordt mede mogelijk gemaakt door
        </h2>
        <div
          class="flex flex-row flex-wrap justify-evenly"
          data-testid="sponsors"
        >
          <div class="mb-2 p-1">
            <a href="https://www.facebook.com/markt.dinxperlo/" target="blank">
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/makt.jpg"]}
                alt="Logo van de markt van Dinxperlo"
                loading="eager"
                width={250}
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://podesta.nl/" target="blank">
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/logo15.jpg"]}
                alt="Logo van Podesta"
                width={250}
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
              target="blank"
            >
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/logo16.jpg"]}
                alt="Logo van Adviesbureau Roenhorst"
                width={250}
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="http://www.vvnf.nl/home" target="blank">
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/logo23.jpg"]}
                alt="Logo van VVNF"
                width={250}
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://harmtakke.nl" target="blank">
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/logo-harmtakke.jpg"]}
                alt="Logo van Harm Takke"
                width={250}
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://tibatek.de" target="blank">
              <ResponsiveImage
                src={tibatek_logo_web}
                alt="Logo van Tibatek"
                width={250}
                class="bg-white p-2"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL"
              target="blank"
            >
              <ResponsiveImage
                src={sponsors["/src/assets/sponsors/dedriesprong.jpg"]}
                alt="Logo van Cafetaria de Driesprong"
                width={250}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
