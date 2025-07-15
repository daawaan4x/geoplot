import type { Application } from "pixi.js";
import { BBox, LerpScalar, LerpVector, Vector } from "../primitives";
import { EventTick } from "./event-tick";
import type { PanzoomComputes, PanzoomProps } from "./types";
import { useEventDrag } from "./use-event-drag";
import { useEventResize } from "./use-event-resize";
import { useEventZoom } from "./use-event-zoom";

export type PanzoomView = PanzoomComputes &
	Readonly<{
		init(app: Application): void;
		panTo(x: number, y: number): void;
		setBBox({ min, max }: { min: { x: number; y: number }; max: { x: number; y: number } }): void;
		setMinEdge(magnitude: number, distance: number): void;
		reset(): void;
	}>;

export const usePanzoom = (target: HTMLElement) => {
	const props: PanzoomProps = {
		locked: false,
		minEdge: {
			magnitude: 0,
			distance: 0,
		},
		size: new Vector(),
		velocity: new Vector(),
		pan: new LerpVector(),
		shift: new LerpVector(),
		origin: new Vector(),
		zoom: new LerpScalar(1),
		bbox: new BBox(),
	};

	const computes = {
		translate: () => ({
			current: {
				x: props.origin.x + props.pan.current.x + props.shift.current.x,
				y: props.origin.y + props.pan.current.y + props.shift.current.y,
			},
			target: {
				x: props.origin.x + props.pan.target.x + props.shift.target.x,
				y: props.origin.y + props.pan.target.y + props.shift.target.y,
			},
		}),
		scale: () => ({
			current: props.zoom.current,
			target: props.zoom.target,
		}),
		unitPixelRatio: () => ({
			current: props.minEdge.distance / (props.minEdge.magnitude * computes.scale().current),
			target: props.minEdge.distance / (props.minEdge.magnitude * computes.scale().target),
		}),
	} as PanzoomComputes;

	useEventResize(target, props);
	useEventDrag(target, props);
	useEventZoom(target, props, computes);
	const ticker = EventTick(props, computes);

	return {
		...computes,
		init: (app) => {
			app.ticker.add((t) => ticker(t.deltaTime));
		},
		panTo: (x, y) => {
			const { origin, pan, shift, bbox } = props;

			const scale = computes.scale().target;

			pan.target.x = -(x - origin.x) * scale - shift.target.x;
			pan.target.y = -(y - origin.y) * scale - shift.target.y;

			const translate = { x: computes.translate().target.x, y: computes.translate().target.y };

			const max = { x: bbox.max.x * scale + translate.x, y: bbox.max.y * scale + translate.y };
			const min = { x: bbox.min.x * scale + translate.x, y: bbox.min.y * scale + translate.y };

			if (max.x < origin.x) pan.target.x -= max.x - origin.x;
			if (min.x > origin.x) pan.target.x -= min.x - origin.x;
			if (max.y < origin.y) pan.target.y -= max.y - origin.y;
			if (min.y > origin.y) pan.target.y -= min.y - origin.y;
		},
		setBBox: ({ min, max }) => {
			const bbox = props.bbox;

			bbox.min.x = min.x;
			bbox.min.y = min.y;

			bbox.max.x = max.x;
			bbox.max.y = max.y;
		},
		setMinEdge: (magnitude, distance) => {
			props.minEdge.magnitude = magnitude;
			props.minEdge.distance = distance;
		},
	} as PanzoomView;
};
