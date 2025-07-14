import { useResizeObserver } from "@vueuse/core";
import type { Application } from "pixi.js";
import type { PanzoomView } from "../panzoom";
import { LerpScalar } from "../primitives";
import { floorDistance } from "./helper";

export function useScaleLegend(target: HTMLCanvasElement, panzoom: PanzoomView) {
	let maxSize = 0;
	let distance = 0;
	const length = new LerpScalar();

	const ticker = (deltaTime: number) => {
		distance = floorDistance(panzoom.unitPixelRatio().target * maxSize);
		length.target = distance / panzoom.unitPixelRatio().target;
		length.lerp(Math.pow(0.2, 1 / deltaTime));
	};

	return {
		length: {
			current: () => length.current,
			target: () => length.target,
		},
		distance: () => distance,
		init(app) {
			app.ticker.add((t) => ticker(t.deltaTime));
			useResizeObserver(target, () => (maxSize = target.offsetWidth / 2));
		},
	} as ScaleLegend;
}

export type ScaleLegend = Readonly<{
	length: Readonly<{
		current(): number;
		target(): number;
	}>;
	distance(): number;
	init(app: Application): void;
}>;
