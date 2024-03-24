import { A, cache, createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";

import { groupBy } from "~/groupby";
import { type Recording, fetchUzgListing } from "~/uzg";

import Controls from "~/components/Controls";
import Player from "~/components/Player";

import { Meta, Title } from "@solidjs/meta";
import logo from "~/assets/logodinxperfm.png?w=128&as=img";

const getUzgListing = cache(async () => {
  return await fetchUzgListing();
}, "students");

export const route = {
  load: () => getUzgListing(),
};

const weekday_long_c = {
  0: "Zondag",
  1: "Maandag",
  2: "Dinsdag",
  3: "Woensdag",
  4: "Donderdag",
  5: "Vrijdag",
  6: "Zaterdag",
};

const month_long_c = {
  0: "Januari",
  1: "Februari",
  2: "Maart",
  3: "April",
  4: "Mei",
  5: "Juni",
  6: "Juli",
  7: "Augustus",
  8: "September",
  9: "Oktober",
  10: "November",
  11: "December",
};

export default function UZG() {
  const recordings = createAsync(() => getUzgListing());
  return (
    <>
      <Title>Dinxper FM - Uitzending gemist</Title>
      <Meta name="description" content="Luister uitzendingen terug" />
      <Meta
        property="og:title"
        content="Dinxper FM - Uitzending gemist"
      />
      <Meta
        property="og:description"
        content="Luister uitzendingen terug"
      />
      <Player />
      <div class="flex justify-evenly">
        <div class="flex flex-auto items-center">
          <div class="mx-12 my-8">
            <A href="/">
              <img
                src={logo.src}
                alt="DinxperFM logo"
                width={logo.w}
                height={logo.h}
                class="mx-auto"
              />
            </A>
            <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
          </div>
          <h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">
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
        <Show when={recordings()}>
          {(accessor) => <Listing recordings={accessor()} />}
        </Show>
      </div>
    </>
  );
}

const massage = (recordings: Recording[]) =>
  recordings.map((item) => ({
    weekday_c: weekday_long_c[item.weekday],
    weekday_l: weekday_long_c[item.weekday].toLowerCase(),
    month_c: month_long_c[item.month],
    month_l: month_long_c[item.month].toLowerCase(),
    ...item,
  }));

const Listing = (props: { recordings: Recording[] }) => (
  <For each={groupBy(massage(props.recordings), (item) => item.year)}>
    {(years) => (
      <>
        <h2 class="text-xl text-gray-800">{years.head.year}</h2>
        <div class="mb-6 ml-4 mt-0.5">
          <For each={groupBy(years.members, (item) => item.month)}>
            {(months) => (
              <>
                <h3 class="text-lg text-gray-800">{months.head.month_c}</h3>
                <div class="mb-6 ml-4 mt-0.5">
                  <ol>
                    <For each={groupBy(months.members, (item) => item.day)}>
                      {(days) => (
                        <li>
                          <div class="flex-start flex items-center pt-3">
                            <div class="-ml-1 mr-3 h-2 w-2 rounded-full bg-gray-400" />
                            <p class="text-l text-gray-800">
                              {`${days.head.weekday_c} ${days.head.day} ${days.head.month_l}`}
                            </p>
                          </div>
                          <div class="ml-4 mt-0.5 flex flex-wrap gap-4">
                            <For each={days.members}>
                              {(entry) => (
                                <div class="flex-row text-center">
                                  <Controls
                                    title={`Uitzending Dinxper FM van ${entry.weekday_l} ${entry.day} ${entry.month_c} ${entry.year} om ${entry.hour} uur`}
                                    label={`${entry.hour}:00`}
                                    src={entry.src}
                                  />
                                  <a
                                    class="text-sm text-gray-800 underline"
                                    href={entry.src}
                                    rel="external"
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
