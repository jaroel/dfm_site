use leptos::prelude::*;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub enum PlayerState {
    Error(String),
    Playing(String),
    Loading(String),
    Stopped,
}

#[component]
pub fn Player(audio_src: RwSignal<String>, player_state: RwSignal<PlayerState>) -> impl IntoView {
    view! {
        <audio
            autoplay=move || !audio_src.get().is_empty()
            src=move || audio_src.get()
            on:loadstart=move |_| player_state.set(PlayerState::Loading(audio_src.get()))
            on:load=move |_| player_state.set(PlayerState::Loading(audio_src.get()))
            on:play=move |_| player_state.set(PlayerState::Playing(audio_src.get()))
            on:error=move |_| { player_state.set(PlayerState::Error(audio_src.get())) }
            on:ended=move |_| { player_state.set(PlayerState::Stopped) }
            on:pause=move |_| { player_state.set(PlayerState::Stopped) }
        />
    }
}
