import { useRef, useState } from "react";

type Fetcher<T> = () => Promise<T>;

function useResource<T>(fetcher: Fetcher<T>): [undefined | T, () => void];
function useResource<T>(
  triggerState: unknown,
  fetcher: Fetcher<T>
): [undefined | T, () => void];

function useResource<T>(
  triggerStateOrFetcher: Fetcher<T> | any,
  fetcher?: Fetcher<T>
) {
  const [result, setResult] = useState<T>();

  const fetch = () => (fetcher ?? triggerStateOrFetcher)().then(setResult);

  // only needed in the if statement but at the top level because we are following the rules of hooks :)
  // initially prev = triggerState so we don't trigger instantly
  const prev = useRef(triggerStateOrFetcher);
  if (fetcher !== undefined) {
    if (prev.current !== triggerStateOrFetcher) {
      // fetcher has changed
      fetch();
      prev.current = triggerStateOrFetcher;
    }
  }
  // just run now lmao
  else fetch();

  return [result, fetch];
}

export default useResource;
