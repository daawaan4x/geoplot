import type { Arrow } from "../../arrows";
import { Vector } from "../../primitives";

export const MiniArrows = (ctx: CanvasRenderingContext2D, arrows: Arrow[]) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.fillStyle = "#48596E";
	ctx.strokeStyle = "#48596E";
	ctx.lineWidth = 1;

	const scale = 1 / 4;
	const translate = { x: 0, y: 0 };

	const transform = (vector: Vector) => new Vector(vector.x * scale + translate.x, vector.y * scale + translate.y);

	ctx.save();
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
	ctx.scale(2 * devicePixelRatio, 2 * devicePixelRatio);
	ctx.beginPath();
	for (let index = 0; index < arrows.length; index++) {
		const arrow = arrows[index]!;
		const start = arrow.start;
		const tstart = transform(start);
		const end = arrow.end;
		const tend = transform(end);

		ctx.moveTo(tstart.x, tstart.y);
		ctx.lineTo(tend.x, tend.y);

		ctx.moveTo(tend.x, tend.y);
		ctx.translate(tend.x, tend.y);
		ctx.rotate(arrow.angle);
		ctx.lineTo(-2, -2);
		ctx.lineTo(2, 0);
		ctx.lineTo(-2, 2);
		ctx.lineTo(-1, 0);
		ctx.lineTo(-2, -2);
		ctx.rotate(-arrow.angle);
		ctx.translate(-tend.x, -tend.y);
	}
	ctx.stroke();
	ctx.fill();
	ctx.restore();
};
