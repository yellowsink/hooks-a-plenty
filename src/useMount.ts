import { useEffect } from "react";

export default (callback: () => void) =>
  useEffect(() => {
    callback();
  }, []);
