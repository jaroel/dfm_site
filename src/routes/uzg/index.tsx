import Controls from "~/components/Controls";
// @ts-ignore
import logo from "~/assets/logodinxperfm.png?as=img&w=128";
import { getUzgListing } from "~/uzg";
import { groupBy } from "~/groupby";
import { component$ } from "@builder.io/qwik";
import { DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city";

export const useRecordings = routeLoader$(async () => {
  return await getUzgListing();
});

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

export default component$(() => {
  const entries = useRecordings();
  return (
    <>
      <div class="flex justify-evenly">
        <div class="flex flex-auto items-center">
          <div class="mx-12 my-8">
            <Link href="/">
              <img
                src={logo.src}
                alt="DinxperFM logo"
                width={logo.w}
                height={logo.h}
                class="mx-auto"
              />
            </Link>
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

        {entries.value.length == 0 && (
          <p>Helaas zijn de opnames op dit moment niet beschikbaar.</p>
        )}

        {groupBy(entries.value, (item) => item.year).map((byYear) => (
          <>
            <h2 class="text-xl text-gray-800">{byYear.key}</h2>
            <div class="mb-6 ml-4 mt-0.5">
              {groupBy(byYear.members, (item) => item.month).map((byMonth) => {
                const month = month_long_c[byMonth.head.month];
                return (
                  <>
                    <h3 class="text-lg text-gray-800">{month}</h3>
                    <div class="mb-6 ml-4 mt-0.5">
                      <ol>
                        {groupBy(byMonth.members, (item) => item.day).map(
                          (byDay) => {
                            const weekday = weekday_long_c[byDay.head.weekday];
                            return (
                              <li key={byDay.head.key}>
                                <div class="flex-start flex items-center pt-3">
                                  <div class="-ml-1 mr-3 h-2 w-2 rounded-full bg-gray-400"></div>
                                  <p class="text-l text-gray-800">{`${weekday} ${byDay.head.day} ${month}`}</p>
                                </div>
                                <div class="ml-4 mt-0.5 flex flex-wrap gap-2">
                                  {byDay.members.map((recording) => {
                                    return (
                                      <Controls
                                        key={recording.key}
                                        title={`Uitzending Dinxper FM van ${weekday} ${recording.day} ${month} ${recording.year} om ${recording.hour} uur`}
                                        label={`${recording.hour}:00`}
                                        src={recording.src}
                                      />
                                    );
                                  })}
                                </div>
                              </li>
                            );
                          },
                        )}
                      </ol>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Uitzending gemist - Dinxper FM - het swingende geluid van Dinxperlo",
  meta: [
    {
      name: "description",
      content: "Dit zijn opnames van uitzendingen op de Dinxper FM stream.",
    },
  ],
};
