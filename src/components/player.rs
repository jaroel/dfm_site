use leptos::{html::Audio, *};

#[derive(Clone, PartialEq, Debug, serde::Serialize, serde::Deserialize)]
pub enum PlayerState {
  // The state of the audio element.
  Stopped,
  Loading(String),
  Playing(String),
  Error(String),
}

#[component]
pub fn Player() -> impl IntoView {
  let player_src = RwSignal::new("".to_string());
  provide_context(player_src);
  let player_state = RwSignal::new(PlayerState::Stopped);
  provide_context(player_state);

  let audio_ref = create_node_ref::<Audio>();

  // Maybe we do need this for iOS?
  // create_effect(move |_| {
  //   if player_src.get().is_none() {
  //     let _ = audio_ref.get().is_some_and(|audio| audio.pause().is_ok());
  //     set_player_state(PlayerState::Stopped)
  //   };
  // });

  view! {
    <audio
      autoplay
      _ref=audio_ref
      src=player_src
      on:loadstart=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          player_state.set(PlayerState::Loading(node.src()))
      }

      on:play=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          player_state.set(PlayerState::Playing(node.src()))
      }

      on:error=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          assert!(!node.src().is_empty(), "Empty audio.src.");
          player_state.set(PlayerState::Error(node.src()))
      }

      on:ended=move |_| { player_state.set(PlayerState::Stopped) }
      on:pause=move |_| { player_state.set(PlayerState::Stopped) }
    ></audio>
  }
}
