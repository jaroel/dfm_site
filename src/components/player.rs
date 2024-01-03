use leptos::{html::Audio, *};

#[derive(Clone, PartialEq)]
pub(crate) enum PlayerState {
  // The state of the audio element.
  Stopped,
  Loading(String),
  Playing(String),
  Error(String),
}

#[component]
pub(crate) fn Player(
  player_src: ReadSignal<Option<String>>,
  set_player_state: WriteSignal<PlayerState>,
) -> impl IntoView {
  let audio_ref = create_node_ref::<Audio>();

  create_effect(move |_| {
    if player_src.get().is_none() {
      let _ = audio_ref.get().is_some_and(|audio| audio.pause().is_ok());
      set_player_state(PlayerState::Stopped)
    };
  });

  view! {
    <audio
      autoplay
      _ref=audio_ref
      src=player_src
      on:loadstart=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Loading(node.src()))
      }

      on:play=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Playing(node.src()))
      }

      on:error=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          assert!(! node.src().is_empty(), "Empty audio.src.");
          set_player_state.set(PlayerState::Error(node.src()))
      }

      on:ended=move |_| { set_player_state.set(PlayerState::Stopped) }
      on:pause=move |_| { set_player_state.set(PlayerState::Stopped) }
    ></audio>
  }
}
