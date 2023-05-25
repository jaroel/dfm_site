import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { type DocumentHead } from "@builder.io/qwik-city";

import { routeLoader$ } from "@builder.io/qwik-city";
import Uitzendinggemist from "~/components/uitzendinggemist";
import { getRecordings } from "~/uzg";

import logoDFM from "~/assets/logos/logodinxperfm.png";

export const useRecordings = routeLoader$(async () => {
  return await getRecordings();
});

export default component$(() => {
  const recordings = useRecordings();
  return (
    <>
      <div class="flex justify-evenly">
        <div class="flex flex-auto items-center">
          <div class="mx-12 my-8">
            <Link href="/" title="Ga naar: DinxperFM home page">
              <img
                src={logoDFM}
                alt="DinxperFM logo"
                loading="eager"
                decoding="auto"
                width="128"
                height="128"
                class="mx-auto"
              />
            </Link>
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
        <Uitzendinggemist recordings={recordings.value}></Uitzendinggemist>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Dinxper FM - het swingende geluid van Dinxperlo",
  meta: [
    {
      name: "description",
      content: "Uitzending gemist?",
    },
  ],
};
