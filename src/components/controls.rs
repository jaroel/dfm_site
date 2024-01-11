use crate::components::player::PlayerState;
use leptos::*;

#[derive(PartialEq)]
enum ControlsState {
    // The state of the specific controls component
    Stopped,
    Loading,
    Playing,
    Error,
}

#[component]
pub fn Controls(title: String, label: String, src: String) -> impl IntoView {
    let player_src = expect_context::<RwSignal<String>>();
    let player_state = expect_context::<RwSignal<PlayerState>>();
    let local_src = RwSignal::new(src);
    let controls_state = move || {
        let player_state_ = player_state.get();
        match &player_state_ {
            PlayerState::Stopped => ControlsState::Stopped,
            PlayerState::Loading(url)
            | PlayerState::Playing(url)
            | PlayerState::Error(url) => {
                if *url != local_src() {
                    return ControlsState::Stopped;
                }
                match &player_state_ {
                    PlayerState::Loading(_) => ControlsState::Loading,
                    PlayerState::Playing(_) => ControlsState::Playing,
                    PlayerState::Error(_) => ControlsState::Error,
                    PlayerState::Stopped => ControlsState::Stopped,
                }
            }
        }
    };

    view! {
        <button
            title=title
            on:click=move |_| {
                match controls_state() {
                    ControlsState::Playing | ControlsState::Error => player_src.set("".to_string()),
                    ControlsState::Stopped | ControlsState::Loading => {
                        player_src.set(local_src.get())
                    }
                };
            }

            class=move || {
                let specifics = match controls_state() {
                    ControlsState::Error => "bg-red-100 text-red-800 border-red-800",
                    ControlsState::Playing => "bg-green-100 text-green-800 border-green-800",
                    ControlsState::Loading => "bg-blue-100 text-blue-800 border-blue-800",
                    ControlsState::Stopped => {
                        "bg-gray-100 text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
                    }
                };
                format!("rounded-full border my-1 py-2 px-4 flex items-center {}", specifics)
            }
        >

            <span class="mr-2">{label}</span>
            {move || match controls_state() {
                ControlsState::Stopped => {
                    view! {
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
                    }
                }
                ControlsState::Error | ControlsState::Playing => {
                    view! {
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
                    }
                }
                ControlsState::Loading => {
                    view! {
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-hourglass-split inline"
                            viewBox="0 0 16 16"
                        >
                            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"></path>
                        </svg>
                    }
                }
            }}

        </button>
    }
}
