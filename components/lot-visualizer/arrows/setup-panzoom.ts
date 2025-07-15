import type { PanzoomView } from "../panzoom";
import type { Vector } from "../primitives";
import type { ArrowData } from "./arrow-data";

export const SetupPanzoom = (panzoomView: PanzoomView, arrowData: ArrowData) => {
	arrowData.onReset((arrows) => {
		const temp = arrows[0]!;
		const max = temp.start.clone();
		const min = temp.start.clone();

		const refreshBBox = (point: Vector) => {
			min.x = Math.min(min.x, point.x);
			min.y = Math.min(min.y, point.y);
			max.x = Math.max(max.x, point.x);
			max.y = Math.max(max.y, point.y);
		};

		const minEdge = {
			magnitude: Number.MAX_VALUE,
			distance: Number.MAX_VALUE,
		};

		const count = arrows.length;
		for (let index = 1; index < count; index++) {
			const arrow = arrows[index]!;
			refreshBBox(arrow.start);
			if (arrow.magnitude > 0) minEdge.magnitude = Math.min(minEdge.magnitude, arrow.magnitude);
			if (arrow.distance > 0) minEdge.distance = Math.min(minEdge.distance, arrow.distance);
		}
		refreshBBox(arrows[count - 1]!.end);

		panzoomView.setBBox({ min, max });
		panzoomView.setMinEdge(minEdge.magnitude, minEdge.distance);
	});
};
