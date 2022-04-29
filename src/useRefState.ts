import { useRef, Dispatch, SetStateAction } from 'react';
import useForceUpdate from './useForceUpdate';

export default <S>(initialState: S): [() => S, Dispatch<SetStateAction<S>>] => {
  const ref = useRef(initialState);
  const forceUpdate = useForceUpdate();

  return [() => ref.current, (v: S | ((prevState: S) => S)) => {
    ref.current = v instanceof Function ? v(ref.current) : v;
    forceUpdate();
  }];
};
