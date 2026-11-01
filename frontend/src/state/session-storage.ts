import AtomicState from "@tolokoban/react-state";

/**
 * Keep the value of `state` in the session storage, under the key `id`,
 * and restore it immediately if a valid value is already stored there.
 */
export function persistInSessionStorage<T>(
  state: AtomicState<T>,
  id: string,
  guard: (data: unknown) => data is T,
) {
  const key = `AtomicState/session/${id}`;
  try {
    const text = window.sessionStorage.getItem(key);
    if (text) {
      const data: unknown = JSON.parse(text);
      if (guard(data)) state.value = data;
    }
  } catch (ex) {
    console.error(`Unable to retrieve session state "${id}":`, ex);
  }
  state.addListener((value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (ex) {
      console.error(`Unable to store session state "${id}":`, ex);
    }
  });
}
