import { A } from "solid-start";

import Controls from "~/components/Controls";

import logo from "~/assets/logodinxperfm.png?as=img&w=768";
import programmering from "~/assets/programmering.jpg?as=img&w=1085";
import programmering_source from "~/assets/programmering.jpg";

// sponsors
import logomakt from "~/assets/sponsors/makt.jpg?as=img&w=250";
import logo13 from "~/assets/sponsors/logo13.jpg?as=img&w=250";
import logo15 from "~/assets/sponsors/logo15.jpg?as=img&w=250";
import logo16 from "~/assets/sponsors/logo16.jpg?as=img&w=250";
import logo23 from "~/assets/sponsors/logo23.jpg?as=img&w=250";
import olddutch from "~/assets/sponsors/olddutch.jpg?as=img&w=250";
import mashops from "~/assets/sponsors/mashops.jpg?as=img&w=250";
import harmtakke from "~/assets/sponsors/logo-harmtakke.jpg?as=img&w=250";
import etenbijrico from "~/assets/sponsors/etenbijrico.jpg?as=img&w=250";
import blauwemeer from "~/assets/sponsors/logo-blauwe-meer.png?as=img&w=250";
import tibatek_logo_web from "~/assets/sponsors/tibatek_logo_web.png?as=img&w=250";
import dedriesprong from "~/assets/sponsors/dedriesprong.jpg?as=img&w=250";

export default function Home() {
  return (
    <>
      <div class="flex justify-evenly mt-10 mb-10">
        <div class="max-w-sm">
          <img
            src={logo.src}
            width={logo.w}
            height={logo.h}
            alt="De markt van Dinxperlo"
          />
          <p class="text-center mt-4">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>
      <nav class="flex justify-evenly bg-gray-100">
        <ul class="flex flex-wrap list-none my-1">
          <li>
            <Controls
              title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!"
              label="Luister live!"
              src="https://stream.dinxperfm.nl/1"
            />
          </li>
          <li>
            <A
              class="inline-block mt-3 px-4 no-underline text-blue-700"
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
        <h2 class="text-2xl mb-8">
          Dinxper FM wordt mede mogelijk gemaakt door
        </h2>
        <div class="flex flex-row flex-wrap justify-evenly">
          <div class="p-1 mb-2">
            <a href="https://www.facebook.com/markt.dinxperlo/" target="blank">
              <img src={logomakt.src} width={logomakt.w} height={logomakt.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="http://www.naaiateliermoniqueharmsen.nl/" target="blank">
              <img src={logo13.src} width={logo13.w} height={logo13.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://podesta.nl/" target="blank">
              <img src={logo15.src} width={logo15.w} height={logo15.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a
              href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
              target="blank"
            >
              <img src={logo16.src} width={logo16.w} height={logo16.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="http://www.vvnf.nl/home" target="blank">
              <img src={logo23.src} width={logo23.w} height={logo23.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://www.olddutchdinxperlo.nl/" target="blank">
              <img src={olddutch.src} width={olddutch.w} height={olddutch.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://www.ma-shops.nl/?ref=dinxperfm" target="blank">
              <img src={mashops.src} width={mashops.w} height={mashops.h} />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://harmtakke.nl" target="blank">
              <img
                src={harmtakke.src}
                width={harmtakke.w}
                height={harmtakke.h}
              />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://etenbijrico.nl" target="blank">
              <img
                src={etenbijrico.src}
                width={etenbijrico.w}
                height={etenbijrico.h}
              />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://hetblauwemeer.nl" target="blank">
              <img
                src={blauwemeer.src}
                width={blauwemeer.w}
                height={blauwemeer.h}
              />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a href="https://tibatek.de" target="blank">
              <img
                style="background-color: white; padding: 4px"
                src={tibatek_logo_web.src}
                width={tibatek_logo_web.w}
                height={tibatek_logo_web.h}
              />
            </a>
          </div>
          <div class="p-1 mb-2">
            <a
              href="https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL"
              target="blank"
            >
              <img
                src={dedriesprong.src}
                width={dedriesprong.w}
                height={dedriesprong.h}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
