import { useRef, useState } from "react";

export default ((init?) => {
  const ref = useRef(init);

  return [ref.current, (newVal) => (ref.current = newVal)];
}) as typeof useState;
