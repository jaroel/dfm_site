/* eslint-disable max-nested-callbacks */

import {type Component, createSignal, createEffect, createResource, Show} from 'solid-js'
import {groupBy} from '../groupby'
import {playerUrl, setPlayerUrl, audioStreamState} from '../stores'
import type {Recording} from '../uzg'
import type {Recordings} from '../pages/uzg/recordings.json'

const fetchRecordings = async () => {
  const response = await fetch('/uzg/recordings.json')
  return response.json() as Promise<Recordings>
}

export const UitzendingGemist: Component = () => {
  const [recordings] = createResource(fetchRecordings)
  return <Show when={recordings()}>
    <ol class='border-l border-gray-400'>
      {groupBy(recordings()!, item => item.year).map(byYear => (
        <li class='hover:text-black'>
          <div class='flex flex-start items-center pt-3'>
            <div class='bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3'></div>
            <p class='text-gray-800 text-xl'>{byYear.head.year}</p>
          </div>
          <div class='mt-0.5 ml-4 mb-6'>

            <ol class='border-l border-gray-400'>
              {groupBy(byYear.members, item => item.monthDisplayLowerCase).map(byMonth => (
                <li>
                  <div class='flex flex-start items-center pt-3'>
                    <div class='bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3'></div>
                    <p class='text-gray-800 text-lg'>{byMonth.head.monthDisplayUpperCase}</p>
                  </div>
                  <div class='mt-0.5 ml-4 mb-6'>

                    {groupBy(byMonth.members, item => item.weekNumber).map(byWeek => (
                      <div class='mb-6'>
                        {groupBy(byWeek.members, item => item.day).map(byDay => (
                          <ol class='border-l border-gray-400'>
                            <li>
                              <div class='flex flex-start items-center pt-3'>
                                <div class='bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3'></div>
                                <p class='text-gray-800 text-l'>{byDay.head.weekdayDisplayUpperCase} {byDay.head.day} {byDay.head.monthDisplayLowerCase}</p>
                              </div>
                              <div class='mt-0.5 ml-4'>
                                {byDay.members.map(recording => <div class='inline-block'>
                                  <Controls {...recording} />
                                  <a class='block ml-4 text-gray-500' href={recording.url} title={`${recording.title} downloaden`} download>Opslaan</a>
                                </div>)}
                              </div>
                            </li>
                          </ol>
                        ))}
                      </div>
                    ))}

                  </div>
                </li>
              ))}
            </ol>

          </div>
        </li>
      ))}
    </ol>
  </Show>
}

const Controls: Component<Recording> = (recording: Recording) => {
  const [icon, setIcon] = createSignal<'stop' | 'loader' | 'play'>('play')
  const icons = {
    loading: 'loader',
    stopped: 'play',
    playing: 'stop',
  } as const

  createEffect(() => {
    const state = audioStreamState()
    setIcon(playerUrl() === recording.url ? icons[state] : 'play')
  })

  return <button
    class='mr-4 rounded-full border border-gray-800 bg-gray-800 text-white hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800 my-1 py-2 px-4 flex items-center'
    title={recording.title}
    onClick={() => {
      setPlayerUrl(playerUrl() === recording.url ? undefined : recording.url)
    }}
  >
    <span class='mr-2'>{recording.hour}:00</span>

    {icon() === 'play'
      && <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        fill='currentColor'
        class='bi bi-play inline'
        viewBox='0 0 16 16'
      >
        <path
          d='M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'
        ></path>
      </svg>
    }

    {icon() === 'stop'
      && <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        fill='currentColor'
        class='bi bi-stop-circle inline'
        viewBox='0 0 16 16'
      >
        <path
          d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'
        ></path>
        <path
          d='M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z'
        ></path>
      </svg>
    }

    {icon() === 'loader'
      && <svg
        id='audio_icon_loading'
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        fill='currentColor'
        class='bi bi-hourglass-split inline'
        viewBox='0 0 16 16'
      >
        <path
          d='M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z'
        ></path>
      </svg>
    }

  </button>
}
