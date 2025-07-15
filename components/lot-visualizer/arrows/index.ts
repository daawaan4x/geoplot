import type { Application } from "pixi.js";
import type { PanzoomView } from "../panzoom";
import type { Arrow } from "./arrow-data";
import { ArrowData } from "./arrow-data";
import { EventTick } from "./event-tick";
import { SetupPanzoom } from "./setup-panzoom";

export const Arrows = (panzoomView: PanzoomView) => {
	const data = new ArrowData();
	SetupPanzoom(panzoomView, data);
	const { init } = EventTick(panzoomView, data);
	return {
		data,
		init,
	};
};

export type { Arrow };
export { ArrowData };
