import { Text } from "pixi.js";

export const TextArrowLabel = () => {
	const text = new Text({
		text: "",
		style: {
			fontSize: 18,
			lineHeight: 15,
			fontFamily: "Garamond",
			fill: 0xffffff,
			fontWeight: "600",
			align: "center",
		},
	});

	text.anchor.set(0.5, 0.5);
	return text;
};
