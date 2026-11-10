import type { ImageData } from "@responsive-image/core";
import { ResponsiveImage } from "@responsive-image/solid";
import { For } from "solid-js";
import logo from "~/assets/logodinxperfm.png?w=384;768&format=avif;webp;png&responsive";
import programmering from "~/assets/programmering.jpg?w=1084&format=avif;webp;jpeg&lqip=color&responsive";
import Controls from "~/components/Controls.tsx";
import Player from "~/components/Player.tsx";

const sponsors = import.meta.glob<ImageData>("~/assets/sponsors/*", {
  eager: true,
  import: "default",
  query: "w=500&format=avif;webp;png&lqip=inline&responsive",
});

const SPONSORS = [
  {
    href: "https://www.facebook.com/markt.dinxperlo/",
    alt: "Logo van de markt van Dinxperlo",
    image: sponsors["/src/assets/sponsors/makt.jpg"],
  },
  {
    href: "https://podesta.nl/",
    alt: "Logo van Podesta",
    image: sponsors["/src/assets/sponsors/logo15.jpg"],
  },
  {
    href: "https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/",
    alt: "Logo van Adviesbureau Roenhorst",
    image: sponsors["/src/assets/sponsors/logo16.jpg"],
  },
  {
    href: "http://www.vvnf.nl/home",
    alt: "Logo van VVNF",
    image: sponsors["/src/assets/sponsors/logo23.jpg"],
  },
  {
    href: "https://harmtakke.nl",
    alt: "Logo van Harm Takke",
    image: sponsors["/src/assets/sponsors/logo-harmtakke.jpg"],
  },
  {
    href: "https://tibatek.de",
    alt: "Logo van Tibatek",
    image: sponsors["/src/assets/sponsors/tibatek_logo_web.png"],
    class: "bg-white p-2",
  },
  {
    href: "https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL",
    alt: "Logo van Cafetaria de Driesprong",
    image: sponsors["/src/assets/sponsors/dedriesprong.jpg"],
  },
];

export default function Home() {
  return (
    <>
      <Player />
      <div class="my-10 flex justify-evenly">
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
          target="_blank"
          rel="noopener noreferrer"
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
          <For each={SPONSORS}>
            {(sponsor) => (
              <div class="mb-2 p-1">
                <a
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ResponsiveImage
                    src={sponsor.image}
                    alt={sponsor.alt}
                    loading="lazy"
                    width={250}
                    class={sponsor.class}
                  />
                </a>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
