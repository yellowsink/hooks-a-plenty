import { useEffect } from "react";
import useFreeze from "./useFreeze";

export default (callback: () => void) => {
  const cb = useFreeze(callback);
  useEffect(() => {
    cb();
  }, []);
};
