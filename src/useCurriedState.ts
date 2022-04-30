import { useState, Dispatch, SetStateAction } from "react";

export default <S>(initialState: S | (() => S)): [S, (v: S) => Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(initialState);

  return [state, (v) => () => setState(v)];
};
