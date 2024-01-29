use leptos::{html::Audio, *};

#[derive(Clone, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
pub enum PlayerState {
    // The state of the audio element.
    Stopped,
    Loading(String),
    Playing(String),
    Error(String),
}

#[island]
pub fn Player(children: Children) -> impl IntoView {
    let player_src: RwSignal<Option<String>> = RwSignal::new(None);
    provide_context(player_src);
    let player_state = RwSignal::new(PlayerState::Stopped);
    provide_context(player_state);

    let audio_ref = create_node_ref::<Audio>();

    // iOS
    create_effect(move |_| {
        audio_ref.get().is_some_and(|audio| audio.pause().is_ok())
    });

    view! {
        <audio
            _ref=audio_ref
            preload="none"
            autoplay=move || player_src.get().is_some()
            src=move || player_src.get().unwrap_or("".to_string())
            on:playing=move |_| {
                let node = audio_ref.get().unwrap();
                player_state.set(PlayerState::Playing(node.current_src()))
            }

            on:abort=move |_| { player_state.set(PlayerState::Stopped) }

            on:error=move |_| {
                let node = audio_ref.get().unwrap();
                if !node.current_src().is_empty() {
                    player_state
                        .set(
                            match player_src.get() {
                                Some(src) if node.current_src() == src => PlayerState::Error(src),
                                Some(_) => PlayerState::Stopped,
                                None => PlayerState::Error(node.current_src()),
                            },
                        )
                }
                player_state.set(PlayerState::Stopped)
            }

            on:loadstart=move |_| {
                let node = audio_ref.get().unwrap();
                if !node.current_src().is_empty() {
                    player_state.set(PlayerState::Loading(node.current_src()))
                }
            }
        >
        </audio>

        {children()}
    }
}
