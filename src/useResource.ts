import { useRef, useState } from "react";
import useRefState from "./useRefState";

type Fetcher<T> = () => Promise<T>;
type Ret<T> = [undefined | T, any, () => void];

export default function <T>(fetcher: Fetcher<T>): Ret<T>;
export default function <T>(triggerState: unknown, fetcher: Fetcher<T>): Ret<T>;

export default function <T>(
  triggerStateOrFetcher: Fetcher<T> | any,
  fetcher?: Fetcher<T>
) {
  const [result, setResult] = useState<T>();
  // react <18 may not batch two states, so use a ref state
  const [rejection, setRejection] = useRefState<any>();

  const [isFirstCall, setIsFirstCall] = useRefState(true);

  const fetch = () =>
    (fetcher ?? triggerStateOrFetcher)().then(
      (res: T) => {
        setRejection(undefined);
        setResult(res);
      },
      (rej: any) => {
        setRejection(rej);
        setResult(undefined);
      }
    );

  // only needed in the if statement but at the top level because we are following the rules of hooks :)
  // initially prev = triggerState so we don't trigger instantly
  const prev = useRef(triggerStateOrFetcher);
  if (isFirstCall) {
    if (fetcher !== undefined) {
      if (prev.current !== triggerStateOrFetcher) {
        // fetcher has changed
        fetch();
        prev.current = triggerStateOrFetcher;
      }
    }
    // just run now lmao
    else fetch();

    setIsFirstCall(false);
  }

  return [result, rejection, fetch];
}
