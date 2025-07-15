import type { PanzoomView } from "../../panzoom";
import type { MinimapProps } from "../types";

export const Viewbox = (ctx: CanvasRenderingContext2D, panzoomView: PanzoomView, props: MinimapProps) => {
	const { size, viewbox } = props;

	const scale = panzoomView.scale().current;

	ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
	ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
	const width = size.x / scale;
	const height = size.y / scale;
	const x = viewbox.current.x - width / 2;
	const y = viewbox.current.y - height / 2;
	ctx.fillRect(x, y, width, height);
	ctx.strokeRect(x, y, width - 1, height - 1);
};
