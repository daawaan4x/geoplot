export class Point {
	x = 0;
	y = 0;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

	clone() {
		return new Point(this.x, this.y);
	}
}
