import { A } from "@solidjs/router";

import Controls from "~/components/Controls";
import Player from "~/components/Player";

import logo from "~/assets/logodinxperfm.png?w=768&as=img";
import programmering from "~/assets/programmering.jpg?w=1085&as=img";
import programmering_source from "~/assets/programmering.jpg";

// sponsors
import logomakt from "~/assets/sponsors/makt.jpg?w=250&as=img";
import logo13 from "~/assets/sponsors/logo13.jpg?w=250&as=img";
import logo15 from "~/assets/sponsors/logo15.jpg?w=250&as=img";
import logo16 from "~/assets/sponsors/logo16.jpg?w=250&as=img";
import logo23 from "~/assets/sponsors/logo23.jpg?w=250&as=img";
import olddutch from "~/assets/sponsors/olddutch.jpg?w=250&as=img";
import mashops from "~/assets/sponsors/mashops.jpg?w=250&as=img";
import harmtakke from "~/assets/sponsors/logo-harmtakke.jpg?w=250&as=img";
import etenbijrico from "~/assets/sponsors/etenbijrico.jpg?w=250&as=img";
import blauwemeer from "~/assets/sponsors/logo-blauwe-meer.png?w=250&as=img";
import tibatek_logo_web from "~/assets/sponsors/tibatek_logo_web.png?w=250&as=img";
import dedriesprong from "~/assets/sponsors/dedriesprong.jpg?w=250&as=img";

export default function Home() {
  return (
    <>
      <Player />
      <div class="mb-10 mt-10 flex justify-evenly">
        <div class="max-w-sm">
          <img
            src={logo.src}
            width={logo.w}
            height={logo.h}
            alt="De markt van Dinxperlo"
          />
          <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>
      <nav class="flex justify-evenly bg-gray-100">
        <ul class="my-1 flex list-none flex-wrap">
          <li>
            <Controls
              title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!"
              label="Luister live!"
              src="https://stream.dinxperfm.nl/1"
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
        <div style="width: 1085; height: 656">
          <img
            src={programmering.src}
            alt="Programmering vanaf 4 maart 2023 van Dinxperlo FM "
            width={programmering.w}
            height={programmering.h}
          />
        </div>
      </div>
      <div class="text-center">
        <a target="blank" class="text-blue-400" href={programmering_source}>
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
              <img
                src={logomakt.src}
                width={logomakt.w}
                height={logomakt.h}
                alt="Logo van de markt van Dinxperlo"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="http://www.naaiateliermoniqueharmsen.nl/" target="blank">
              <img
                src={logo13.src}
                width={logo13.w}
                height={logo13.h}
                alt="Logo van Naai Atelier Monique Harmsen"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://podesta.nl/" target="blank">
              <img
                src={logo15.src}
                width={logo15.w}
                height={logo15.h}
                alt="Logo van Podesta"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
              target="blank"
            >
              <img
                src={logo16.src}
                width={logo16.w}
                height={logo16.h}
                alt="Logo van Adviesbureau Roenhorst"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="http://www.vvnf.nl/home" target="blank">
              <img
                src={logo23.src}
                width={logo23.w}
                height={logo23.h}
                alt="Logo van VVNF"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://www.olddutchdinxperlo.nl/" target="blank">
              <img
                src={olddutch.src}
                width={olddutch.w}
                height={olddutch.h}
                alt="Logo van Old Dutch"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://www.ma-shops.nl/?ref=dinxperfm" target="blank">
              <img
                src={mashops.src}
                width={mashops.w}
                height={mashops.h}
                alt="Logo van MA-Shops"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://harmtakke.nl" target="blank">
              <img
                src={harmtakke.src}
                width={harmtakke.w}
                height={harmtakke.h}
                alt="Logo van Harm Takke"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://etenbijrico.nl" target="blank">
              <img
                src={etenbijrico.src}
                width={etenbijrico.w}
                height={etenbijrico.h}
                alt="Logo van Eten bij Rico"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://hetblauwemeer.nl" target="blank">
              <img
                src={blauwemeer.src}
                width={blauwemeer.w}
                height={blauwemeer.h}
                alt="Logo van Het Blauwe Meer"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a href="https://tibatek.de" target="blank">
              <img
                style="background-color: white; padding: 4px"
                src={tibatek_logo_web.src}
                width={tibatek_logo_web.w}
                height={tibatek_logo_web.h}
                alt="Logo van Tibatek"
              />
            </a>
          </div>
          <div class="mb-2 p-1">
            <a
              href="https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL"
              target="blank"
            >
              <img
                src={dedriesprong.src}
                width={dedriesprong.w}
                height={dedriesprong.h}
                alt="Logo van Cafetaria de Driesprong"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
