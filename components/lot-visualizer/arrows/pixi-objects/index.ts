import type { Particle, Renderer, Text } from "pixi.js";
import type { Vector } from "../../primitives";
import type { Arrow } from "../arrow-data";
import { ParticleArrowBody } from "./particle-arrow-body";
import { ParticleArrowHead } from "./particle-arrow-head";
import { ParticleArrowTail } from "./particle-arrow-tail";
import { TextArrowLabel } from "./text-arrow-label";

export type ArrowBinding = Readonly<{
	body: Particle;
	tail: Particle;
	head: Particle;
	text: Text;
	tick(arrow: Arrow, scale: number, translate: Vector): void;
}>;

export const ArrowBinding = (renderer: Renderer) => {
	const body = ParticleArrowBody(renderer);
	const tail = ParticleArrowTail(renderer);
	const head = ParticleArrowHead(renderer);
	const text = TextArrowLabel();

	const tick = (arrow: Arrow, scale: number, translate: Vector) => {
		const color = arrow.active ? 0x0f1b2a : 0x8196b1;

		body.x = arrow.start.x * scale + translate.x;
		body.y = arrow.start.y * scale + translate.y;
		const bodyScale = arrow.magnitude * scale - 16;
		body.scaleX = Math.max(bodyScale, 0);
		body.rotation = arrow.angle;
		body.tint = color;

		tail.x = arrow.start.x * scale + translate.x;
		tail.y = arrow.start.y * scale + translate.y;
		tail.tint = color;

		head.x = arrow.end.x * scale + translate.x;
		head.y = arrow.end.y * scale + translate.y;
		head.rotation = arrow.angle;
		head.tint = color;

		text.text = arrow.label;
		text.rotation = arrow.perpAngle;
		text.position.x = arrow.midpoint.x * scale - 12 * Math.cos(arrow.angle) + translate.x;
		text.position.y = arrow.midpoint.y * scale - 12 * Math.sin(arrow.angle) + translate.y;
		text.tint = color;
	};

	return {
		body,
		tail,
		head,
		text,
		tick,
	} as ArrowBinding;
};
