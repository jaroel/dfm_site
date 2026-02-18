use crate::components::player::{PLAYER_SRC, PLAYER_STATE, PlayerSrc, PlayerState};
use dioxus::prelude::*;

#[derive(PartialEq, Debug, Clone)]
enum ControlsState {
    Stopped,
    Loading,
    Playing,
    Error,
}

impl From<PlayerState> for ControlsState {
    fn from(value: PlayerState) -> Self {
        match  value {
            PlayerState::Error(_) => ControlsState::Error,
            PlayerState::Playing(_) => ControlsState::Playing,
            PlayerState::Loading(_) => ControlsState::Loading,
            PlayerState::Stopped => ControlsState::Stopped,
        }
    }
}

impl From<&PlayerState> for ControlsState {
    fn from(value: &PlayerState) -> Self {
        match  value {
            PlayerState::Error(_) => ControlsState::Error,
            PlayerState::Playing(_) => ControlsState::Playing,
            PlayerState::Loading(_) => ControlsState::Loading,
            PlayerState::Stopped => ControlsState::Stopped,
        }
    }
}

#[component]
pub fn Controls(
    title: String,
    label: String,
    stream_src: PlayerSrc,
) -> Element {

    let local_src = stream_src.clone();

    let controls_state = use_memo(move || {
        let player_state= PLAYER_STATE.read().cloned();
        match player_state {
            PlayerState::Stopped => ControlsState::Stopped,
            PlayerState::Loading(ref url) | PlayerState::Playing(ref url) | PlayerState::Error(ref url) => {
                if url != &stream_src {
                    ControlsState::Stopped
                } else {
                    player_state.into()
                }
            }
        }
    });

    rsx! {
        button {
            r#type: "button",
            title: "{title}",
            class: format!(
                "flex items-center py-2 px-4 my-1 rounded-full border cursor-pointer {}",
                match controls_state.read().cloned() {
                    ControlsState::Error => "bg-red-100 text-red-800 border-red-800",
                    ControlsState::Playing => "bg-green-100 text-green-800 border-green-800",
                    ControlsState::Loading => "bg-blue-100 text-blue-800 border-blue-800",
                    ControlsState::Stopped => {
                        "bg-gray-100 text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
                    }
                },
            ),
            onclick: move |_| {
                match controls_state.read().cloned() {
                    ControlsState::Stopped => *PLAYER_SRC.write() = local_src.clone(),
                    _ => *PLAYER_SRC.write() = PlayerSrc::empty(),
                }
            },

            span { class: "mr-2", "{label}" }

            svg {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                fill: "currentColor",
                class: "inline bi bi-play",
                view_box: "0 0 16 16",

                match controls_state() {
                    ControlsState::Stopped => rsx! {
                        path { d: "M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" }
                    },
                    ControlsState::Error | ControlsState::Playing => rsx! {
                        path { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" }
                        path { d: "M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z" }
                    },
                    ControlsState::Loading => rsx! {
                        path { d: "M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11z" }
                    },
                }
            }
        }
    }
}
