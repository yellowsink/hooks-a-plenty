import { useState } from "react";

export default () => {
	const [curr, set] = useState(0);
	return () => set(-curr);
};