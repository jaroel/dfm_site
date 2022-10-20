import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";

export function createLocalStore<T extends object>(
  initState: T
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  createEffect(() => (localStorage.todos = JSON.stringify(state)));
  return [state, setState];
}

export const [appState, setAppState] = createLocalStore({ video: false });
