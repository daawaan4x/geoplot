import type { LerpVector, Vector } from "../primitives";

export type MinimapProps = {
	locked: boolean;
	size: Vector;
	viewbox: LerpVector;
};
