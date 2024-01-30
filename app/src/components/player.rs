use leptos::{html::Audio, *};

#[derive(Clone)]
pub enum PlayerState {
    Stopped,
    Loading,
    Playing,
    Error,
}

#[derive(Clone)]
pub struct PlayerCtx {
    pub src: RwSignal<String>,
    pub state: RwSignal<PlayerState>,
}

#[island]
pub fn Player(children: Children) -> impl IntoView {
    provide_context(PlayerCtx {
        src: RwSignal::new("".to_string()),
        state: RwSignal::new(PlayerState::Stopped),
    });
    let player_ctx = expect_context::<PlayerCtx>();
    let audio_ref = create_node_ref::<Audio>();
    view! {
        <audio
            _ref=audio_ref
            preload="none"
            autoplay=move || !player_ctx.src.get().is_empty()
            src=player_ctx.src
            on:playing=move |_| player_ctx.state.set(PlayerState::Playing)
            on:abort=move |_| player_ctx.state.set(PlayerState::Stopped)
            on:error=move |_| {
                if !audio_ref.get().unwrap().current_src().is_empty() {
                    player_ctx.state.set(PlayerState::Error)
                }
            }

            on:loadstart=move |_| player_ctx.state.set(PlayerState::Loading)
        ></audio>

        {children()}
    }
}
