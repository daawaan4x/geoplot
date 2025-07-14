import type { PanzoomComputes, PanzoomProps } from "./types";

export const EventTick = (props: PanzoomProps, computes: PanzoomComputes) => {
	const { velocity, pan, origin, zoom, bbox, shift } = props;

	return (deltaTime: number) => {
		const k = Math.pow(0.3, 1 / deltaTime);

		if (!props.locked) {
			const k = Math.pow(0.05, 1 / deltaTime);
			if (Math.hypot(velocity.x + velocity.y) > 0.1) {
				velocity.x *= k;
				velocity.y *= k;
				pan.target.x += velocity.x;
				pan.target.y += velocity.y;
			}
		}

		pan.lerp(k);
		shift.lerp(k);
		zoom.lerp(k);

		const scale = computes.scale().current;
		const translate = { x: computes.translate().current.x, y: computes.translate().current.y };

		const max = { x: bbox.max.x * scale + translate.x, y: bbox.max.y * scale + translate.y };
		const min = { x: bbox.min.x * scale + translate.x, y: bbox.min.y * scale + translate.y };

		if (max.x < origin.x) pan.target.x = pan.current.x -= max.x - origin.x;
		if (min.x > origin.x) pan.target.x = pan.current.x -= min.x - origin.x;
		if (max.y < origin.y) pan.target.y = pan.current.y -= max.y - origin.y;
		if (min.y > origin.y) pan.target.y = pan.current.y -= min.y - origin.y;
	};
};
