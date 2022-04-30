import { useState } from "react";

// yes, this is smaller than useReducer minified, i checked
export default () => {
	const [curr, set] = useState(0);
	return () => set(-curr);
};