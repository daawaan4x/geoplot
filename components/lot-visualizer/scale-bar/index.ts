import { useResizeObserver } from "@vueuse/core";
import type { Application } from "pixi.js";
import { Container } from "pixi.js";
import type { ScaleLegend } from "../scale-legend";
import { ScaleBarBinding } from "./pixi-objects";

export const useScaleBar = (canvas: HTMLCanvasElement, legend: ScaleLegend) => {
	const binding = ScaleBarBinding();

	const container = new Container();
	container.addChild(binding.graphicsBar, binding.textLabel);

	return {
		init(app: Application) {
			app.stage.addChild(container);
			app.ticker.add(() => binding.tick(legend.distance(), legend.length.current()));
			useResizeObserver(canvas, () => (container.position.y = canvas.clientHeight - 16));
		},
	};
};
