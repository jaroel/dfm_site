import { A, useRouteData } from "solid-start";
import { HttpHeader, createServerData$ } from "solid-start/server";

import Controls from "~/components/Controls";

import logo from "~/assets/logodinxperfm.png?as=img&w=128";
import { getUzgListing } from "~/uzg";
import { For, Show } from "solid-js";
import { groupBy } from "~/groupby";

export function routeData() {
  return createServerData$(() => getUzgListing());
}

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
  const entries = useRouteData<typeof routeData>();
  return (
    <>
      <HttpHeader name="Cache-Control" value="max-age=3600" />
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
            <p class="text-center mt-4">Het swingende geluid van Dinxperlo!</p>
          </div>
          <h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">
            Uitzending gemist
          </h1>
        </div>
      </div>
      <div class="bg-gray-100 text-black p-9">
        <div class="max-w-7xl px-6 text-center">
          <p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
            Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
            de speler om de uitzending terug te luisteren of klik de link om de
            uitzending op te slaan.
          </p>
        </div>
        <hr class="my-8" />
        <Show when={entries()}>
          <For each={groupBy(entries()!, (item) => item.year)}>
            {(byYear) => (
              <>
                <h2 class="text-gray-800 text-xl">{byYear.key}</h2>
                <div class="mt-0.5 ml-4 mb-6">
                  <For each={groupBy(byYear.members, (item) => item.month)}>
                    {(byMonth) => {
                      const month = month_long_c[byMonth.head.month];
                      return (
                        <>
                          <h3 class="text-gray-800 text-lg">{month}</h3>
                          <div class="mt-0.5 ml-4 mb-6">
                            <ol>
                              <For
                                each={groupBy(
                                  byMonth.members,
                                  (item) => item.day
                                )}
                              >
                                {(byDay) => {
                                  const weekday =
                                    weekday_long_c[byDay.head.weekday];
                                  return (
                                    <li>
                                      <div class="flex flex-start items-center pt-3">
                                        <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3"></div>
                                        <p class="text-gray-800 text-l">{`${weekday} ${byDay.head.day} ${month}`}</p>
                                      </div>
                                      <div class="mt-0.5 ml-4 flex flex-wrap gap-2">
                                        {byDay.members.map((recording) => {
                                          return (
                                            <Controls
                                              title={`Uitzending Dinxper FM van ${weekday} ${recording.day} ${month} ${recording.year} om ${recording.hour} uur`}
                                              label={`${recording.hour}:00`}
                                              src={recording.src}
                                            />
                                          );
                                        })}
                                      </div>
                                    </li>
                                  );
                                }}
                              </For>
                            </ol>
                          </div>
                        </>
                      );
                    }}
                  </For>
                </div>
              </>
            )}
          </For>
        </Show>
      </div>
    </>
  );
}
