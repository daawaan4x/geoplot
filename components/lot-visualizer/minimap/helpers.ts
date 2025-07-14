import type { PanzoomView } from "../panzoom";
import type { Vector } from "../primitives";

export const toMinimapCoords = (size: Vector, view: PanzoomView, mode: "current" | "target") => {
	const scale = view.scale()[mode];
	const translate = {
		x: view.translate()[mode].x,
		y: view.translate()[mode].y,
	};
	const x = -translate.x / 4 / scale + size.x / 2 / scale + size.x / 2;
	const y = -translate.y / 4 / scale + size.y / 2 / scale + size.y / 2;
	return { x, y };
};
