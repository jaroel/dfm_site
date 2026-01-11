import { Meta, Title } from "@solidjs/meta";
import { createAsync, query } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import logo from "~/assets/logodinxperfm.png?w=128;256&format=avif;webp;png&as=picture";
import Controls from "~/components/Controls";
import Picture from "~/components/Picture";
import Player from "~/components/Player";
import { groupBy } from "~/groupby";
import { fetchUzgListing, toRecordings, type Recording } from "~/uzg";

const getUzgListing = query(async () => {
  return await fetchUzgListing();
}, "uzglisting");

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
  const recordings = createAsync(async () => toRecordings(await getUzgListing()), { initialValue: [] });
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
              <Picture
                logo={logo}
                alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
                class="max-w-32"
                />
                            
            <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
          </a>
          <h1 class="mx-12 font-bold text-4xl text-gray-100 lg:text-6xl">
            Uitzending gemist
          </h1>
        </div>
      </div>
      <div class="bg-gray-100 p-9 text-black">
        <div class="max-w-7xl px-6 text-center">
          <p class="mx-auto mt-5 max-w-5xl text-gray-500 text-xl">
            Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
            de speler om de uitzending terug te luisteren of klik de link om de
            uitzending op te slaan.
          </p>
        </div>
        <hr class="my-8" />
        <Suspense fallback={<p>Uitzendingen worden opgehaald.</p>}>
          <Show
            when={recordings().length}
            fallback={
              <p>Op dit moment zijn er geen uitzendingen beschikbaar.</p>
            }
          >
            {<Listing recordings={recordings()} />}
          </Show>
        </Suspense>
      </div>
    </>
  );
}

function massage(recordings: Recording[]) {
  return recordings.map((item) => ({
    weekday_c: weekday_long_c[item.weekday],
    weekday_l: weekday_long_c[item.weekday].toLowerCase(),
    month_c: month_long_c[item.month],
    month_l: month_long_c[item.month].toLowerCase(),
    ...item,
  }));
}

function Listing(props: { recordings: Recording[] }) {
  return (
    <For each={groupBy(massage(props.recordings), (item) => item.year)}>
      {(years) => (
        <>
          <h2 class="text-gray-800 text-xl">{years.head.year}</h2>
          <div class="mt-0.5 mb-6 ml-4">
            <For each={groupBy(years.members, (item) => item.month)}>
              {(months) => (
                <>
                  <h3 class="text-gray-800 text-lg">{months.head.month_c}</h3>
                  <div class="mt-0.5 mb-6 ml-4">
                    <ol>
                      <For each={groupBy(months.members, (item) => item.day)}>
                        {(days) => (
                          <li>
                            <div class="flex flex-start items-center pt-3">
                              <div class="mr-3 -ml-1 h-2 w-2 rounded-full bg-gray-400" />
                              <p class="text-gray-800 text-l">
                                {`${days.head.weekday_c} ${days.head.day} ${days.head.month_l}`}
                              </p>
                            </div>
                            <div class="mt-0.5 ml-4 flex flex-wrap gap-4">
                              <For each={days.members}>
                                {(entry) => (
                                  <div class="flex-row text-center">
                                    <Controls
                                      title={`Uitzending Dinxper FM van ${entry.weekday_l} ${entry.day} ${entry.month_c} ${entry.year} om ${entry.hour} uur`}
                                      label={`${entry.hour}:00`}
                                      src={entry.src}
                                    />
                                    <a
                                      class="text-gray-800 text-sm underline"
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
}
