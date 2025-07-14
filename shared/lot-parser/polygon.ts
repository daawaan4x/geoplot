import type { Boundary } from "./boundary";
import { Point } from "./point";

function getArea(points: Point[]) {
	let total = 0;

	for (let i = 0, l = points.length; i < l; i++) {
		const addX = points[i]!.x;
		const addY = points[i == points.length - 1 ? 0 : i + 1]!.y;
		const subX = points[i == points.length - 1 ? 0 : i + 1]!.x;
		const subY = points[i]!.y;

		total += addX * addY * 0.5;
		total -= subX * subY * 0.5;
	}

	return Math.abs(total);
}

export class Polygon {
	readonly points: Point[];
	readonly area: number = NaN;

	constructor(boundary: Boundary) {
		const point = new Point(0, 0);
		const points = new Array<Point>(boundary.length + 1);
		points[0] = point.clone();
		boundary.forEach((vector, index) => {
			point.x += vector.x;
			point.y += vector.y;
			points[index + 1] = point.clone();
		});

		this.points = points;
		this.area = getArea(points);
	}

	fit(size: number) {
		const points = this.points;

		// invert y-axis
		points.forEach((p) => (p.y *= -1));

		// center polygon to origin (0,0)
		const xs = () => points.map((p) => p.x);
		const ys = () => points.map((p) => p.y);
		const min = new Point(Math.min(...xs()), Math.min(...ys()));
		points.forEach((p) => ((p.x -= min.x), (p.y -= min.y)));
		const max = new Point(Math.max(...xs()) / 2, Math.max(...ys()) / 2);
		points.forEach((p) => ((p.x -= max.x), (p.y -= max.y)));

		// normalize points to -1...1
		const prevsize = Math.max(...xs(), ...ys());
		points.forEach((p) => ((p.x /= prevsize), (p.y /= prevsize)));

		// scale points back to -size...size
		points.forEach((p) => ((p.x *= size / 2), (p.y *= size / 2)));

		return this;
	}
}
