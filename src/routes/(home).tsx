import { A } from "@solidjs/router";
import Controls from "~/components/Controls";
import Player from "~/components/Player";
import Picture, { TPicture } from "~/components/Picture";

import logo from "~/assets/logodinxperfm.png?w=768&format=avif;webp;png&as=picture";
import programmering from "~/assets/programmering.jpg?w=1084&format=avif;webp;jpeg&as=picture";
import tibatek_logo_web from "~/assets/sponsors/tibatek_logo_web.png?w=242&format=avif;webp;png&as=picture";
const sponsors = import.meta.glob<TPicture>("~/assets/sponsors/*", {
  eager: true,
  import: "default",
  query: "w=250&format=avif;webp;png&as=picture",
});

export default function Home() {
  return (
    <>
      <Player />
      <div class="mb-10 mt-10 flex justify-evenly">
        <div class="max-w-sm">
          <Picture
            logo={logo}
            alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
          ></Picture>
          <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>
      <nav class="flex justify-evenly bg-gray-100">
        <ul class="my-1 flex list-none flex-wrap">
          <li>
            <Controls
              title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!"
              label="Luister live!"
              src="https://stream-dinxperfm-nl.toffe.site/1"
            />
          </li>
          <li>
            <A
              class="inline-block px-4 py-3 text-blue-700 no-underline"
              href="/uzg"
            >
              Uitzending gemist?
            </A>
          </li>
        </ul>
      </nav>
      <div class="mt-10 flex justify-center">
        <Picture
          logo={programmering}
          alt="Programmering van Dinxperlo FM"
        ></Picture>
      </div>
      <div class="text-center">
        <a target="blank" class="text-blue-400" href={programmering.img.src}>
          In nieuwe pagina openen
        </a>
      </div>
      <div class="mt-10 text-center">
        <h2 class="mb-8 text-2xl">
          Dinxper FM wordt mede mogelijk gemaakt door
        </h2>
        <div class="flex flex-row flex-wrap justify-evenly">
          <div class="mb-2 p-1">
            <a href="https://www.facebook.com/markt.dinxperlo/" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/makt.jpg"]}
                alt="Logo van de markt van Dinxperlo"
              ></Picture>
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="http://www.naaiateliermoniqueharmsen.nl/" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/logo13.jpg"]}
                alt="Logo van Naai Atelier Monique Harmsen"
              ></Picture>
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://podesta.nl/" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/logo15.jpg"]}
                alt="Logo van Podesta"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
              target="blank"
            >
              <Picture
                logo={sponsors["/src/assets/sponsors/logo16.jpg"]}
                alt="Logo van Adviesbureau Roenhorst"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="http://www.vvnf.nl/home" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/logo23.jpg"]}
                alt="Logo van VVNF"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://www.olddutchdinxperlo.nl/" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/olddutch.jpg"]}
                alt="Logo van Old Dutch"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://www.ma-shops.nl/?ref=dinxperfm" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/mashops.jpg"]}
                alt="Logo van MA-Shops"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://harmtakke.nl" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/logo-harmtakke.jpg"]}
                alt="Logo van Harm Takke"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://etenbijrico.nl" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/etenbijrico.jpg"]}
                alt="Logo van Eten bij Rico"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://hetblauwemeer.nl" target="blank">
              <Picture
                logo={sponsors["/src/assets/sponsors/logo-blauwe-meer.png"]}
                alt="Logo van Het Blauwe Meer"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://tibatek.de" target="blank">
              <Picture
                logo={tibatek_logo_web}
                alt="Logo van Tibatek"
                class="bg-white p-[4px]"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL"
              target="blank"
            >
              <Picture
                logo={sponsors["/src/assets/sponsors/dedriesprong.jpg"]}
                alt="Logo van Cafetaria de Driesprong"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
