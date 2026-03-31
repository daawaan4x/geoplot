import { createZoomController } from "~/components/lot-visualizer/panzoom/zoom-controller";
import { describe, expect, it } from "vitest";

function createFixture({ zoom = 1, longerSide = 800, minEdgeMagnitude = 100, minEdgeDistance = 100 } = {}) {
	const props = {
		minEdge: {
			magnitude: minEdgeMagnitude,
			distance: minEdgeDistance,
		},
		size: {
			x: longerSide,
			y: longerSide * 0.75,
		},
		shift: {
			target: {
				x: 0,
				y: 0,
			},
		},
		zoom: {
			target: zoom,
		},
	};

	const controller = createZoomController(props, {
		translate: () => ({
			target: {
				x: 0,
				y: 0,
			},
		}),
	});

	return {
		props,
		controller,
	};
}

describe("createZoomController", () => {
	it("zooms in by sqrt(2) for one step", () => {
		const { props, controller } = createFixture();

		controller.zoomByStep(1);

		expect(props.zoom.target).toBeCloseTo(Math.SQRT2);
	});

	it("reaches a 2x zoom after two positive steps", () => {
		const { props, controller } = createFixture();

		controller.zoomByStep(1);
		controller.zoomByStep(1);

		expect(props.zoom.target).toBeCloseTo(2);
	});

	it("zooms out by sqrt(2) for one negative step", () => {
		const { props, controller } = createFixture({ zoom: 2 });

		controller.zoomByStep(-1);

		expect(props.zoom.target).toBeCloseTo(Math.SQRT2);
	});

	it("clamps zoom to the minimum scale of 1", () => {
		const { props, controller } = createFixture({ zoom: 1 });

		controller.zoomByStep(-1);

		expect(props.zoom.target).toBe(1);
	});

	it("clamps zoom to the computed maximum scale", () => {
		const { props, controller } = createFixture({ zoom: 2, longerSide: 800, minEdgeMagnitude: 100 });

		controller.zoomByStep(1);

		expect(controller.getMaxZoom()).toBe(2);
		expect(props.zoom.target).toBe(2);
	});
});
