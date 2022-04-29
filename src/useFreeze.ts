import { useRef } from "react";

export default <T>(val: T) => useRef(val).current;