use leptos::prelude::*;
use leptos_router::components::A;

use crate::{
    controls::Controls,
    player::{Player, PlayerState},
};

/// Renders the home page of your application.
#[component]
pub fn HomePage() -> impl IntoView {
    let src = RwSignal::new("".into());
    let player_state = RwSignal::new(PlayerState::Stopped);

    view! {
        <Player audio_src=src player_state=player_state />
        <div class="flex justify-evenly mt-10 mb-10">
            <div class="max-w-sm">
                // <Picture logo=logo alt="Dinxper FM - Het swingende geluid van Dinxperlo!" />
                <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
            </div>
        </div>
        <nav class="flex justify-evenly bg-gray-100">
            <ul class="flex flex-wrap my-1 list-none">
                <li>

                    <Controls
                        title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!".into()
                        label="Luister live!".into()
                        stream_src="https://stream.dinxperfm.nl/1".into()
                        audio_src=src
                        player_state=player_state
                    />
                </li>
                <li>
                    <A
                    href="/uzg"
                    {..}
                    class="inline-block py-3 px-4 text-blue-700 no-underline"
                    title="Uitzending gemist? Luister ze terug!"
                    >
                        "Uitzending gemist?"
                    </A>
                </li>
            </ul>
        </nav>
        // <Picture logo=programmering alt="Programmering van Dinxperlo FM" />
        <div class="flex justify-center mt-10"></div>
    }
}
