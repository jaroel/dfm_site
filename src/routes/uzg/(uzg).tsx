import { Meta, Title } from "@solidjs/meta";
import { query, type RouteDefinition } from "@solidjs/router";
import { ResponsiveImage } from "@responsive-image/solid";
import { createMemo, For, Loading, Show } from "solid-js";
import logo from "~/assets/logodinxperfm.png?w=128;256&format=avif;webp;png&responsive";
import Controls from "~/components/Controls.tsx";
import Player from "~/components/Player.tsx";
import { fetchUzgListing } from "~/uzg.ts";
import { groupRecordings, toRecordings, type Recording } from "~/recordings.ts";

const getUzgListing = query(fetchUzgListing, "uzglisting");

export const route = {
  preload: () => void getUzgListing(),
} satisfies RouteDefinition;

export default function UZG() {
  const recordings = createMemo(async () =>
    toRecordings(await getUzgListing()),
  );
  return (
    <>
      <Title>Dinxper FM - Uitzending gemist</Title>
      <Meta name="description" content="Luister uitzendingen terug" />
      <Meta property="og:title" content="Dinxper FM - Uitzending gemist" />
      <Meta property="og:description" content="Luister uitzendingen terug" />
      <Player />
      <div class="my-8">
        <div class="flex flex-auto flex-wrap items-center justify-center gap-y-4">
          <a href="/" title="Terug naar homepage">
            <ResponsiveImage
              src={logo}
              alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
              width={128}
              loading="eager"
              class="max-w-32"
            />

            <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
          </a>
          <h1 class="mx-12 text-4xl font-bold text-gray-100 lg:text-6xl">
            Uitzending gemist
          </h1>
        </div>
      </div>
      <div class="bg-gray-100 p-9 text-black">
        <div class="max-w-7xl px-6 text-center">
          <p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
            Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
            de speler om de uitzending terug te luisteren of klik de link om de
            uitzending op te slaan.
          </p>
        </div>
        <hr class="my-8" />
        <Loading fallback={<p>Uitzendingen worden opgehaald.</p>}>
          <Show
            when={recordings().length}
            fallback={
              <p>Op dit moment zijn er geen uitzendingen beschikbaar.</p>
            }
          >
            <Listing recordings={recordings()} />
          </Show>
        </Loading>
      </div>
    </>
  );
}

function Listing(props: { recordings: Recording[] }) {
  return (
    <For each={groupRecordings(props.recordings)}>
      {(year) => (
        <>
          <h2 class="text-xl text-gray-800">{year.year}</h2>
          <div class="mt-0.5 mb-6 ml-4">
            <For each={year.months}>
              {(month) => (
                <>
                  <h3 class="text-lg text-gray-800">{month.label}</h3>
                  <div class="mt-0.5 mb-6 ml-4">
                    <ol>
                      <For each={month.days}>
                        {(day) => (
                          <li>
                            <div class="flex-start flex items-center pt-3">
                              <div class="mr-3 -ml-1 size-2 rounded-full bg-gray-400" />
                              <p class="text-gray-800">{day.label}</p>
                            </div>
                            <div class="mt-0.5 ml-4 flex flex-wrap gap-4">
                              <For each={day.recordings}>
                                {(entry) => (
                                  <div class="flex-row text-center">
                                    <Controls
                                      title={`Uitzending Dinxper FM van ${entry.weekdayLabel} ${entry.day} ${entry.monthLabel} ${entry.year} om ${entry.time} uur`}
                                      label={entry.time}
                                      src={entry.src}
                                    />
                                    <a
                                      class="text-sm text-gray-800 underline"
                                      href={entry.src}
                                      rel="external"
                                      data-key={entry.key}
                                    >
                                      download
                                    </a>
                                  </div>
                                )}
                              </For>
                            </div>
                          </li>
                        )}
                      </For>
                    </ol>
                  </div>
                </>
              )}
            </For>
          </div>
        </>
      )}
    </For>
  );
}
