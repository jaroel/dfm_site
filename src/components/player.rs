use dioxus::{prelude::*};


#[derive(Clone, PartialEq)]
pub struct PlayerSrc(String);

impl PlayerSrc {    
    pub fn empty() -> Self {
        Self(String::new())
    }
}

impl From<String> for PlayerSrc{
    fn from(value: String) -> Self {
        Self(value)
    }
}

impl From<&str> for PlayerSrc{
    fn from(value: &str) -> Self {
        Self(value.into())
    }
}

#[derive(Clone)]
pub enum PlayerState {
    Error(PlayerSrc),
    Playing(PlayerSrc),
    Loading(PlayerSrc),
    Stopped,
}

pub static PLAYER_SRC: GlobalSignal<PlayerSrc> = Signal::global(|| PlayerSrc::empty());
pub static PLAYER_STATE: GlobalSignal<PlayerState> = Signal::global(|| PlayerState::Stopped);

#[component]
pub fn Player() -> Element {
    rsx! {
        audio {
            autoplay: !PLAYER_SRC.read().0.is_empty(),
            src: PLAYER_SRC.read().0.clone(),
            onloadstart: |_| *PLAYER_STATE.write() = PlayerState::Loading(PLAYER_SRC.read().clone()),
            onload: |_| *PLAYER_STATE.write() = PlayerState::Loading(PLAYER_SRC.read().clone()),
            onplay: |_| *PLAYER_STATE.write() = PlayerState::Playing(PLAYER_SRC.read().clone()),
            onerror: |_| *PLAYER_STATE.write() = PlayerState::Error(PLAYER_SRC.read().clone()),
            onended: |_| *PLAYER_STATE.write() = PlayerState::Stopped,
            onpause: |_| *PLAYER_STATE.write() = PlayerState::Stopped,
        }
    }
}
