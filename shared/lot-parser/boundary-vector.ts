import type { Bearing } from "./bearing";

export class BoundaryVector {
	readonly x: number;
	readonly y: number;

	constructor(
		readonly bearing: Bearing,
		readonly distance: number,
	) {
		const radians = bearing.angle.radians;
		this.x = distance * Math.cos(radians);
		this.y = distance * Math.sin(radians);
	}
}
