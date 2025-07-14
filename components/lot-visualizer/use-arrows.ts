import { Polygon } from "~/shared/lot-parser";
import type { Boundary } from "~/shared/lot-parser";
import type { Arrow } from "./arrows";
import type { Vector } from "./primitives";

export function useArrows({
	size,
	boundary,
	activeVectorRange,
}: {
	size: number;
	boundary: Boundary;
	activeVectorRange: { start: number; end: number };
}) {
	if (!boundary || boundary.length <= 0) return undefined;

	const polygon = new Polygon(boundary).fit(size);
	const arrows = new Array<Arrow>(boundary.length);
	const points = polygon.points;
	for (let index = 0; index < arrows.length; index++) {
		const start = points[index] as Vector;
		const end = points[index + 1] as Vector;

		const midpoint = {
			x: (start.x + end.x) / 2,
			y: (start.y + end.y) / 2,
		} as Vector;

		const magnitude = Math.hypot(end.x - start.x, end.y - start.y);

		const boundaryVector = boundary[index]!;
		const angle = -boundaryVector.bearing.angle.radians;
		const perpAngle = boundaryVector.bearing.angle.perpRadians;
		const distance = boundaryVector.distance;

		const distanceLabel = `${distance} m`;

		const num = index + 1;
		const nextNum = num + 1 > arrows.length ? 1 : num + 1;
		const directionLabel = start.x < end.x ? `${num} → ${nextNum}` : `${nextNum} ← ${num}`;

		const label = `${distanceLabel}\n\n${directionLabel}`;

		const active = activeVectorRange.start <= index && index <= activeVectorRange.end;

		arrows[index] = {
			start,
			end,
			angle,
			perpAngle,
			midpoint,
			distance,
			magnitude,
			label,
			active,
		};
	}

	return arrows;
}
