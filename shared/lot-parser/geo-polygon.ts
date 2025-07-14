import bearing from "@turf/bearing";
import destination from "@turf/destination";
import distance from "@turf/distance";
import type { Boundary } from "./boundary";

export class GeoPolygon {
	readonly points: [number, number][];
	readonly deviation: {
		magnitude: number;
		degrees: number;
	};

	constructor(ref: [number, number], boundary: Boundary) {
		const count = boundary.length;
		const points = (this.points = new Array<[number, number]>(count));
		let runningSum = ref;
		for (let index = 0; index < count; index++) {
			const vector = boundary[index]!;
			const distance = vector.distance;
			const bearing = vector.bearing.angle.degrees;
			const transformedBearing = ((-bearing - 90 + 720) % 360) - 180;
			const point = destination(runningSum, distance, transformedBearing, {
				units: "meters",
			});
			runningSum = point.geometry.coordinates as [number, number];
			points[index] = [...runningSum];
		}

		const startpoint = points[0]!;
		const endpoint = points[count - 1]!;

		this.deviation = {
			magnitude: distance(startpoint, endpoint, { units: "meters" }),
			degrees: ((-bearing(startpoint, endpoint) + 90 + 720) % 360) - 180,
		};

		points[count - 1] = points[0]!;
	}
}
