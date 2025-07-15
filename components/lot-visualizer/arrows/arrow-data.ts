import type { Vector } from "../primitives";

export type Arrow = Readonly<{
	start: Readonly<Vector>;
	end: Readonly<Vector>;
	angle: number;
	perpAngle: number;
	magnitude: number;
	distance: number;
	midpoint: Readonly<Vector>;
	label: string;
	active: boolean;
}>;

export class ArrowData {
	private resetCallbacks: ((arrows: Arrow[]) => void)[] = [];

	set(arrows: Arrow[]) {
		this.resetCallbacks.forEach((callback) => callback(arrows));
	}

	onReset(callback: (arrows: Arrow[]) => void) {
		this.resetCallbacks.push(callback);
	}
}
