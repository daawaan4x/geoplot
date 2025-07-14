export class Vector {
	x = 0;
	y = 0;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

	clone() {
		return new Vector(this.x, this.y);
	}
}

export class LerpVector {
	readonly current: Vector = new Vector();
	readonly target: Vector = new Vector();

	constructor(x?: number, y?: number) {
		this.current.x = this.target.x = x ?? 0;
		this.current.y = this.target.y = y ?? 0;
	}

	lerp(k: number) {
		const { current, target } = this;
		current.x += (target.x - current.x) * k;
		current.y += (target.y - current.y) * k;
	}

	reset() {
		const { current, target } = this;
		current.x = target.x;
		current.y = target.y;
	}
}

export class LerpScalar {
	current = 0;
	target = 0;

	constructor(value?: number) {
		this.current = this.target = value ?? 0;
	}

	lerp(k: number) {
		this.current += (this.target - this.current) * k;
	}

	reset() {
		this.current = this.target;
	}
}

export class BBox {
	readonly min = new Vector();
	readonly max = new Vector();

	width() {
		return this.max.x - this.min.x;
	}

	height() {
		return this.max.y - this.min.y;
	}
}
