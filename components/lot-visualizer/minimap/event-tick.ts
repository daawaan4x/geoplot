import type { PanzoomView } from "../panzoom";
import { toMinimapCoords } from "./helpers";
import type { MinimapProps } from "./types";

export const EventTick = (panzoomView: PanzoomView, props: MinimapProps, drawCallback: () => void) => {
	const { size, viewbox } = props;

	return (deltaTime: number) => {
		const k = Math.pow(0.3, 1 / deltaTime);

		if (props.locked) {
			viewbox.lerp(k);
		} else {
			const { x, y } = toMinimapCoords(size, panzoomView, "target");
			if (Math.hypot(viewbox.target.x - x, viewbox.target.y - y) < 0.0000001) {
				viewbox.lerp(k);
			} else {
				const { x, y } = toMinimapCoords(size, panzoomView, "current");
				viewbox.current.x = x;
				viewbox.current.y = y;
			}
		}

		drawCallback();
	};
};
