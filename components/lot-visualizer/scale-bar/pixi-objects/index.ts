import type { Graphics, Text } from "pixi.js";
import { GraphicsBar } from "./graphics-bar";
import { TextLabel } from "./text-label";

export type ScaleBarBinding = Readonly<{
	graphicsBar: Graphics;
	textLabel: Text;
	tick(distance: number, barLength: number): void;
}>;

export const ScaleBarBinding = () => {
	const graphicsBar = GraphicsBar();
	const textLabel = TextLabel();

	const tick = (distance: number, barLength: number) => {
		textLabel.text = `${distance} m`;
		textLabel.position.x = barLength + 8;

		graphicsBar.clear();
		graphicsBar.roundRect(0, -8, barLength, 8, 3).fill(0x0f1b2a);
	};

	return {
		graphicsBar,
		textLabel,
		tick,
	} as ScaleBarBinding;
};
