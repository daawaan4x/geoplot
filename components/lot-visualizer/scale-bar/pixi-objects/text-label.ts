import { Text } from "pixi.js";

export const TextLabel = () => {
	const text = new Text({
		text: "1000 m",
		style: {
			fontSize: 24,
			fontFamily: "Garamond",
			fill: 0x0f1b2a,
			stroke: {
				color: 0xf7fafc,
				width: 6,
			},
			fontWeight: "600",
		},
	});

	text.anchor.set(1, 0.5);
	text.position.y = -26;
	return text;
};
