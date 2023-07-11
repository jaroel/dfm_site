import { Slot, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type { StreamState } from "~/stream";
import Controls from "~/components/controls";

// Can't ts-ignore the whole block.
// @ts-ignore
import Programmering from "~/assets/programmering.jpg?jsx&w=1085";
// @ts-ignore
import programmeringRaw from "~/assets/programmering.jpg?w=1085";
// @ts-ignore
import LogoDFM from "~/assets/logos/logodinxperfm.png?jsx&w=768;384";
// @ts-ignore
import Makt from "~/assets/logos/makt.jpg?jsx&w=250";
// @ts-ignore
import Logo13 from "~/assets/logos/Logo13.jpg?jsx&w=250";
// @ts-ignore
import Logo15 from "~/assets/logos/Logo15.jpg?jsx&w=250";
// @ts-ignore
import Logo16 from "~/assets/logos/Logo16.jpg?jsx&w=250";
// @ts-ignore
import Logo18 from "~/assets/logos/Logo18.jpg?jsx&w=250";
// @ts-ignore
import Logo19 from "~/assets/logos/Logo19.jpg?jsx&w=250";
// @ts-ignore
import Logo22 from "~/assets/logos/Logo22.jpg?jsx&w=250";
// @ts-ignore
import Logo23 from "~/assets/logos/Logo23.jpg?jsx&w=250";
// @ts-ignore
import Jumbo from "~/assets/logos/jumbo.jpg?jsx&w=250";
// @ts-ignore
import OldDutch from "~/assets/logos/OldDutch.jpg?jsx&w=250";
// @ts-ignore
import Mashops from "~/assets/logos/Mashops.jpg?jsx&w=250";
// @ts-ignore
import Expert from "~/assets/logos/Expert.jpg?jsx&w=250";
// @ts-ignore
import Alswin from "~/assets/logos/AlswinGr.jpg?jsx&w=250";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    // Always serve a cached response by default, up to a day stale
    staleWhileRevalidate: 60 * 60 * 24,
    // Max once every hour, revalidate on the server to get a fresh version of this page
    maxAge: 60 * 60,
  });
};

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
          <LogoDFM alt="Logo Dinxper FM" />
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
        <Programmering alt="DinxperFM programmering"></Programmering>
      </div>
      <div class="text-center">
        <a target="blank" class="text-blue-400" href={programmeringRaw}>
          In nieuwe pagina openen
        </a>
      </div>

      <div class="mt-10 text-center">
        <h2 class="text-2xl">Dinxper FM wordt mede mogelijk gemaakt door</h2>

        <div class="flex flex-row flex-wrap justify-evenly">
          <Sponsor
            href="https://www.facebook.com/markt.dinxperlo/"
            title="De markt van Dinxperlo"
          >
            <Makt alt="De markt van Dinxperlo" />
          </Sponsor>

          <Sponsor
            href="http://www.naaiateliermoniqueharmsen.nl/"
            title="Naaiatelier Monique Harmsen"
          >
            <Logo13 alt="Naaiatelier Monique Harmsen" />
          </Sponsor>
          <Sponsor href="https://podesta.nl/" title="Podesta event supplies">
            <Logo15 alt="Podesta event supplies" />
          </Sponsor>
          <Sponsor
            href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/"
            title="Adviesbureau Roenhorst Dinxperlo"
          >
            <Logo16 alt="Adviesbureau Roenhorst Dinxperlo" />
          </Sponsor>
          <Sponsor
            href="http://www.groentekwekerij-smits.nl/"
            title="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit"
          >
            <Logo18 alt="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit" />
          </Sponsor>
          <Sponsor
            href="http://www.tegrotenhuisdinxperlo.nl/"
            title="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo"
          >
            <Logo19 alt="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo" />
          </Sponsor>
          <Sponsor
            href="https://www.tiggelovend-kok.nl/"
            title="Tiggelovend-Kok B.V."
          >
            <Logo22 alt="Tiggelovend-Kok B.V." />
          </Sponsor>
          <Sponsor
            href="http://www.vvnf.nl/"
            title="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo"
          >
            <Logo23 alt="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo" />
          </Sponsor>
          <Sponsor
            href="https://www.jumbo.com/content/jumbo-dinxperlo-heelweg/"
            title="Jumbo Dinxperlo Leussink"
          >
            <Jumbo alt="Jumbo Dinxperlo Leussink"></Jumbo>
          </Sponsor>
          <Sponsor
            href="https://www.olddutchdinxperlo.nl/"
            title="Old Dutch Dinxperlo"
          >
            <OldDutch alt="Old Dutch Dinxperlo"></OldDutch>
          </Sponsor>
          <Sponsor
            href="https://www.ma-shops.nl/?ref=dinxperfm"
            title="MA-Shops"
          >
            <Mashops alt="MA-Shops"></Mashops>
          </Sponsor>
          <Sponsor
            href="https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE"
            title="Expert Dinxperlo"
          >
            <Expert alt="Expert Dinxperlo"></Expert>
          </Sponsor>
          <Sponsor href="https://www.dinxperlo.nl" title="Alswin">
            <Alswin alt="Alswin"></Alswin>
          </Sponsor>
        </div>
      </div>
    </>
  );
});

const Sponsor = component$((sponsor: { href: string; title: string }) => {
  return (
    <div class="p-1 mb-2 w-[250]">
      <a
        href={sponsor.href}
        title={sponsor.title}
        target="_blank"
        rel="noreferrer"
      >
        <Slot></Slot>
      </a>
    </div>
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
