import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";


export function createSessionStore<T extends object>(
  initState: T
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (sessionStorage.appstate) setState(JSON.parse(sessionStorage.appstate));
  createEffect(() => (sessionStorage.appstate = JSON.stringify(state)));
  return [state, setState];
}

export const [appState, setAppState] = createSessionStore({ video: false });
