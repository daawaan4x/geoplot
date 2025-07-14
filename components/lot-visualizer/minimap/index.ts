import type { Application } from "pixi.js";
import type { Arrow, ArrowData } from "../arrows";
import type { PanzoomView } from "../panzoom";
import { LerpVector, Vector } from "../primitives";
import { MiniArrows } from "./canvas-objects/mini-arrows";
import { Viewbox } from "./canvas-objects/viewbox";
import { EventTick } from "./event-tick";
import type { MinimapProps } from "./types";
import { useEventDrag } from "./use-event-drag";
import { useEventResize } from "./use-event-resize";

type MinimapView = Readonly<{
	locked(): boolean;
	size: Readonly<{
		x(): number;
		y(): number;
	}>;
	viewbox: Readonly<{
		current: Readonly<{
			x(): number;
			y(): number;
		}>;
		target: Readonly<{
			x(): number;
			y(): number;
		}>;
	}>;
	init(app: Application): void;
}>;

export function useMinimap(
	parent: HTMLElement,
	canvas: HTMLCanvasElement,
	panzoomView: PanzoomView,
	arrowData: ArrowData,
) {
	const buffer = document.createElement("canvas");
	const canvases = [canvas, buffer];

	const props = {
		locked: false,
		size: new Vector(),
		viewbox: new LerpVector(),
	} as MinimapProps;

	let cachedArrows: Arrow[] = [];
	const bufferContext = buffer.getContext("2d")!;
	const refreshBuffer = (arrows?: Arrow[]) => {
		if (arrows) cachedArrows = arrows;
		MiniArrows(bufferContext, cachedArrows);
	};
	arrowData.onReset((arrows) => refreshBuffer(arrows));

	const canvasContext = canvas.getContext("2d")!;
	const redraw = () => {
		if (!canvas.isConnected) return;
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		canvasContext.fillStyle = "rgba(255, 255, 255, 0.75)";
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		canvasContext.drawImage(buffer, 0, 0);
		Viewbox(canvasContext, panzoomView, props);
	};

	useEventResize(parent, canvases, props, () => {
		refreshBuffer();
		redraw();
	});

	useEventDrag(canvas, panzoomView, props);

	const ticker = EventTick(panzoomView, props, () => redraw());

	return {
		locked: () => props.locked,
		size: {
			x: () => props.size.x,
			y: () => props.size.y,
		},
		viewbox: {
			current: {
				x: () => props.viewbox.current.x,
				y: () => props.viewbox.current.y,
			},
			target: {
				x: () => props.viewbox.target.x,
				y: () => props.viewbox.target.y,
			},
		},
		init(app) {
			app.ticker.add((t) => ticker(t.deltaTime));
		},
	} as MinimapView;
}
