import { BBox, LerpScalar, LerpVector, Vector } from "~/components/lot-visualizer/primitives";
import { floorDistance } from "~/components/lot-visualizer/scale-legend/helper";
import { describe, expect, it } from "vitest";

describe("lot visualizer primitives", () => {
	it("clones vectors without sharing references", () => {
		const vector = new Vector(2, 4);
		const clone = vector.clone();

		expect(clone).toEqual({ x: 2, y: 4 });
		expect(clone).not.toBe(vector);
	});

	it("lerps vectors and can reset to target", () => {
		const vector = new LerpVector(0, 0);
		vector.target.x = 10;
		vector.target.y = -4;

		vector.lerp(0.5);
		expect(vector.current.x).toBe(5);
		expect(vector.current.y).toBe(-2);

		vector.reset();
		expect(vector.current.x).toBe(10);
		expect(vector.current.y).toBe(-4);
	});

	it("lerps scalars and can reset to target", () => {
		const scalar = new LerpScalar(4);
		scalar.target = 10;

		scalar.lerp(0.25);
		expect(scalar.current).toBe(5.5);

		scalar.reset();
		expect(scalar.current).toBe(10);
	});

	it("computes bounding box width and height", () => {
		const bbox = new BBox();
		bbox.min.x = -2;
		bbox.min.y = 5;
		bbox.max.x = 7;
		bbox.max.y = 12;

		expect(bbox.width()).toBe(9);
		expect(bbox.height()).toBe(7);
	});

	it("floors distances across decimal and whole-number ranges", () => {
		expect(floorDistance(0)).toBe(0);
		expect(floorDistance(0.034)).toBe(0.02);
		expect(floorDistance(0.9)).toBe(0.5);
		expect(floorDistance(17)).toBe(10);
		expect(floorDistance(73)).toBe(50);
	});
});
