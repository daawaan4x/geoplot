import { useResizeObserver } from "@vueuse/core";
import { Application } from "pixi.js";
import { Arrows } from "./arrows";
import { useMinimap } from "./minimap";
import { usePanzoom } from "./panzoom";
import { useScaleBar } from "./scale-bar";
import { useScaleLegend } from "./scale-legend";
import { useIdleChecker } from "./use-idle-checker";

export function usePixiMainApp({
	container,
	canvas,
	minimap,
}: {
	container: HTMLElement;
	canvas: HTMLCanvasElement;
	minimap: HTMLCanvasElement;
}) {
	const app = new Application();

	const panzoom = usePanzoom(canvas);
	const scaleLegend = useScaleLegend(canvas, panzoom);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let currentArrowData: any[] | null = null;
	const arrows = Arrows(panzoom);
	arrows.data.onReset((current) => (currentArrowData = current));

	const minimapView = useMinimap(container, minimap, panzoom, arrows.data);
	const scaleBar = useScaleBar(canvas, scaleLegend);

	useIdleChecker({
		getter: () =>
			({
				strict: [
					currentArrowData?.length,
					currentArrowData,
					canvas.width,
					canvas.height,
					panzoom.translate().target.x,
					panzoom.translate().target.y,
					panzoom.scale().target,
					minimapView.locked(),
					minimapView.size.x(),
					minimapView.size.y(),
					minimapView.viewbox.target.x,
					minimapView.viewbox.target.y,
					scaleLegend.distance(),
					scaleLegend.length.target(),
				] as const,
				marginal: [
					panzoom.translate().current.x,
					panzoom.translate().current.y,
					Math.log2(panzoom.scale().current),
					minimapView.viewbox.current.x(),
					minimapView.viewbox.current.y(),
					scaleLegend.length.current(),
				] as const,
			}) as const,
		isIdle: (oldValue, newValue) => {
			{
				const oldValues = oldValue.strict;
				const newValues = newValue.strict;
				const count = oldValue.strict.length;
				for (let index = 0; index < count; index++) {
					if (oldValues[index] !== newValues[index]) return false;
				}
			}
			{
				const oldValues = oldValue.marginal;
				const newValues = newValue.marginal;
				const count = oldValue.marginal.length;
				for (let index = 0; index < count; index++) {
					if (Math.abs(oldValues[index]! - newValues[index]!) > 0.0000001) return false;
				}
			}
			return true;
		},
		onIdle: () => app.stop,
		onActive: () => app.start,
	});

	return {
		app,
		arrows,
		panzoom,
		init: async () => {
			await app.init({
				canvas,
				powerPreference: "high-performance",
				backgroundColor: 0xf7fafc,
				preserveDrawingBuffer: true,
				resolution: 2 * window.devicePixelRatio,
				autoDensity: true,
				resizeTo: container,
				autoStart: true,
				clearBeforeRender: true,
			});

			arrows.init(app);
			panzoom.init(app);
			scaleLegend.init(app);
			minimapView.init(app);
			scaleBar.init(app);
		},
	} as const;
}
