/* eslint-disable max-nested-callbacks */
import { component$, useSignal } from "@builder.io/qwik";
import { groupBy } from "../groupby";

import type { Recording } from "~/uzg";
import Controls from "./controls";
import type { StreamState } from "~/stream";

export default component$<{ recordings: Recording[] }>((props) => {
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

      <ol class="border-l border-gray-400">
        {groupBy(props.recordings, (item) => item.year).map((byYear) => (
          <li class="hover:text-black" key={byYear.key}>
            <div class="flex flex-start items-center pt-3">
              <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3" />
              <p class="text-gray-800 text-xl">{byYear.head.year}</p>
            </div>
            <div class="mt-0.5 ml-4 mb-6">
              <ol class="border-l border-gray-400">
                {groupBy(
                  byYear.members,
                  (item) => item.monthDisplayLowerCase
                ).map((byMonth) => (
                  <li key={byMonth.key}>
                    <div class="flex flex-start items-center pt-3">
                      <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3" />
                      <p class="text-gray-800 text-lg">
                        {byMonth.head.monthDisplayUpperCase}
                      </p>
                    </div>
                    <div class="mt-0.5 ml-4 mb-6">
                      {groupBy(byMonth.members, (item) => item.weekNumber).map(
                        (byWeek) => (
                          <div class="mb-6" key={byWeek.key}>
                            {groupBy(byWeek.members, (item) => item.day).map(
                              (byDay) => (
                                <ol
                                  class="border-l border-gray-400"
                                  key={byDay.key}
                                >
                                  <li>
                                    <div class="flex flex-start items-center pt-3">
                                      <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3" />
                                      <p class="text-gray-800 text-l">
                                        {byDay.head.weekdayDisplayUpperCase}{" "}
                                        {byDay.head.day}{" "}
                                        {byDay.head.monthDisplayLowerCase}
                                      </p>
                                    </div>
                                    <div class="mt-0.5 ml-4">
                                      {byDay.members.map((recording) => (
                                        <div
                                          class="inline-block"
                                          key={recording.url}
                                        >
                                          <Controls
                                            button={{
                                              title: recording.title,
                                              label: `${recording.hour}:00`,
                                            }}
                                            streamUrl={recording.url}
                                            playerUrl={playerUrl}
                                            streamState={streamState}
                                            audio={audioRef.value!}
                                          />

                                          {playerUrl.value === recording.url &&
                                          streamState.value === "error" ? (
                                            <p class="text-red-800">
                                              Klik nog een keertje op de knop.
                                            </p>
                                          ) : (
                                            <a
                                              class="block ml-4 text-gray-500"
                                              href={recording.url}
                                              title={`${recording.title} downloaden`}
                                              download={recording.filename}
                                            >
                                              Opslaan
                                            </a>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </li>
                                </ol>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
});
