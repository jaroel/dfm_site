import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type { StreamState } from "~/stream";
import Controls from "~/components/controls";
import Picture from "~/components/picture";

import programmering from "../assets/programmering.jpg?w=1085&format=avif;webp;png&as=picture";

import logoDFM from "~/assets/logos/logodinxperfm.png?w=768;384&format=avif;webp;png&as=picture";
import makt from "~/assets/logos/makt.jpg?w=250&format=avif;webp;png&as=picture";
import logo13 from "~/assets/logos/logo13.jpg?w=250&format=avif;webp;png&as=picture";
import logo15 from "~/assets/logos/logo15.jpg?w=250&format=avif;webp;png&as=picture";
import logo16 from "~/assets/logos/logo16.jpg?w=250&format=avif;webp;png&as=picture";
import logo18 from "~/assets/logos/logo18.jpg?w=250&format=avif;webp;png&as=picture";
import logo19 from "~/assets/logos/logo19.jpg?w=250&format=avif;webp;png&as=picture";
import logo22 from "~/assets/logos/logo22.jpg?w=250&format=avif;webp;png&as=picture";
import logo23 from "~/assets/logos/logo23.jpg?w=250&format=avif;webp;png&as=picture";
import jumbo from "~/assets/logos/jumbo.jpg?w=250&format=avif;webp;png&as=picture";
import oldDutch from "~/assets/logos/OldDutch.jpg?w=250&format=avif;webp;png&as=picture";
import mashops from "~/assets/logos/Mashops.jpg?w=250&format=avif;webp;png&as=picture";
import expert from "~/assets/logos/Expert.jpg?w=250&format=avif;webp;png&as=picture";
import alswin from "~/assets/logos/AlswinGr.jpg?w=250&format=avif;webp;png&as=picture";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a day stale
    staleWhileRevalidate: 60 * 60 * 24,
    // Max once every hour, revalidate on the server to get a fresh version of this page
    maxAge: 60 * 60,
  });
};

const sponsors = [
  {
    href: "https://www.facebook.com/markt.dinxperlo/",
    src: makt,
    alt: "De markt van Dinxperlo",
  },
  {
    href: "http://www.naaiateliermoniqueharmsen.nl/",
    src: logo13,
    alt: "Naaiatelier Monique Harmsen",
  },
  {
    href: "https://podesta.nl/",
    src: logo15,
    alt: "Podesta event supplies",
  },
  {
    href: "https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/",
    src: logo16,
    alt: "Adviesbureau Roenhorst Dinxperlo",
  },
  {
    href: "http://www.groentekwekerij-smits.nl/",
    src: logo18,
    alt: "Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit",
  },
  {
    href: "http://www.tegrotenhuisdinxperlo.nl/",
    src: logo19,
    alt: "Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo",
  },
  {
    href: "https://www.tiggelovend-kok.nl/",
    src: logo22,
    alt: "Tiggelovend-Kok B.V.",
  },
  {
    href: "http://www.vvnf.nl/",
    src: logo23,
    alt: "VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo",
  },
  {
    href: "https://www.jumbo.com/content/jumbo-dinxperlo-heelweg/",
    src: jumbo,
    alt: "Jumbo Dinxperlo Leussink",
  },
  {
    href: "https://www.olddutchdinxperlo.nl/",
    src: oldDutch,
    alt: "Old Dutch Dinxperlo",
  },
  {
    href: "https://www.ma-shops.nl/?ref=dinxperfm",
    src: mashops,
    alt: "MA-Shops",
  },
  {
    href: "https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE",
    src: expert,
    alt: "Expert Dinxperlo",
  },
  {
    href: "https://www.dinxperlo.nl",
    src: alswin,
    alt: "Alswin",
  },
];

export default component$(() => {
  const playerUrl = useSignal<string>("");
  const streamState = useSignal<StreamState>("stopped");
  const audioRef = useSignal<HTMLAudioElement>();
  return (
    <>
      <audio
        ref={audioRef}
        onAbort$={() => {
          streamState.value = "stopped";
        }}
      />
      <div class="flex justify-evenly mt-10 mb-10">
        <div class="max-w-sm">
          <Picture {...logoDFM} alt="Logo Dinxper FM" />
          <p class="text-center mt-4">Het swingende geluid van Dinxperlo!</p>
        </div>
      </div>

      <nav class="flex justify-evenly bg-gray-100">
        <ul class="flex flex-wrap list-none my-1">
          <li>
            <Controls
              button={{
                title:
                  "Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!",
                label: "Luister live!",
              }}
              streamUrl="https://stream.dinxperfm.nl/1"
              playerUrl={playerUrl}
              streamState={streamState}
              audio={audioRef.value!}
            />
          </li>

          <li>
            <Link
              class="inline-block mt-3 px-4 no-underline text-blue-700"
              href="/uzg"
              title=""
            >
              Uitzending gemist?
            </Link>
          </li>
        </ul>
      </nav>

      <div class="mt-10 flex justify-center">
        <Picture {...programmering} alt="DinxperFM programmering" />
      </div>
      <div class="text-center">
        <a target="blank" class="text-blue-400" href={programmering.img.src}>
          In nieuwe pagina openen
        </a>
      </div>

      <div class="mt-10 text-center">
        <h2 class="text-2xl">Dinxper FM wordt mede mogelijk gemaakt door</h2>

        <div class="flex flex-row flex-wrap justify-evenly">
          {sponsors.map((sponsor) => (
            <div class="p-1 mb-2" key={sponsor.href}>
              <a
                href={sponsor.href}
                title={sponsor.alt}
                target="_blank"
                rel="noreferrer"
              >
                <Picture {...sponsor.src} alt={sponsor.alt} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Dinxper FM - het swingende geluid van Dinxperlo",
  meta: [
    {
      name: "description",
      content: "Website van Dinxper FM",
    },
  ],
};
