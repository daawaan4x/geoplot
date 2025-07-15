import type { BBox, LerpScalar, LerpVector, Vector } from "../primitives";

export type PanzoomProps = {
	locked: boolean;
	minEdge: {
		magnitude: number;
		distance: number;
	};
	size: Vector;
	velocity: Vector;
	pan: LerpVector;
	shift: LerpVector;
	origin: Vector;
	zoom: LerpScalar;
	bbox: BBox;
};

export type PanzoomComputes = {
	translate(): Readonly<{
		current: Readonly<{ x: number; y: number }>;
		target: Readonly<{ x: number; y: number }>;
	}>;
	scale(): Readonly<{
		current: number;
		target: number;
	}>;
	unitPixelRatio(): Readonly<{
		current: number;
		target: number;
	}>;
};
