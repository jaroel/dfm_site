import { Show } from "solid-js";
import { appState, setAppState } from "../stores";

interface ButtonProps {
  title: string;
  label: string;
}

export default function VideoButton(props: ButtonProps) {
  return (
    <button
      class="rounded-full border border-gray-600 bg-gray-600 text-white hover:bg-gray-100 hover:text-gray-600 hover:border-gray-600  my-1 py-2 px-4"
      title={props.title}
      onClick={() => setAppState({ video: !appState.video })}
    >
      <span class="mr-2">{props.label}</span>
      <Show when={appState.video === false}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-play inline"
          viewBox="0 0 16 16"
        >
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"></path>
        </svg>
      </Show>

      <Show when={appState.video === true}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-stop-circle inline"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
          <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z"></path>
        </svg>
      </Show>
    </button>
  );
}
