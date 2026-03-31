import { useArrows } from "~/components/lot-visualizer/use-arrows";
import { Bearing, BoundaryVector } from "~/shared/lot-parser";
import { describe, expect, it } from "vitest";

const squareBoundary = [
	new BoundaryVector(new Bearing("E"), 10),
	new BoundaryVector(new Bearing("N"), 10),
	new BoundaryVector(new Bearing("W"), 10),
	new BoundaryVector(new Bearing("S"), 10),
];

describe("useArrows", () => {
	it("returns undefined for empty boundaries", () => {
		expect(
			useArrows({
				size: 100,
				boundary: [],
				activeVectorRange: { start: 0, end: 0 },
			}),
		).toBeUndefined();
	});

	it("derives labels, geometry, and active states from the boundary", () => {
		const arrows = useArrows({
			size: 100,
			boundary: squareBoundary,
			activeVectorRange: { start: 1, end: 2 },
		});

		expect(arrows).toHaveLength(4);
		expect(arrows?.[0]).toMatchObject({
			distance: 10,
			active: false,
			label: "10 m\n\n1 → 2",
		});
		expect(arrows?.[0]?.magnitude).toBeCloseTo(100);
		expect(arrows?.[1]).toMatchObject({
			active: true,
			label: "10 m\n\n3 ← 2",
		});
		expect(arrows?.[2]?.active).toBe(true);
		expect(arrows?.[3]?.active).toBe(false);
	});
});
