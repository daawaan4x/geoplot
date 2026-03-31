import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pixiMocks = vi.hoisted(() => ({
	init: vi.fn(async () => undefined),
	destroy: vi.fn(),
	setArrows: vi.fn(),
	zoomByStep: vi.fn(),
}));

vi.mock("@vueuse/core", async () => {
	const actual = await vi.importActual<typeof import("@vueuse/core")>("@vueuse/core");
	return {
		...actual,
		useResizeObserver: vi.fn(),
	};
});

vi.mock("~/components/lot-visualizer/pixi-main-app", () => ({
	usePixiMainApp: vi.fn(() => ({
		app: {
			destroy: pixiMocks.destroy,
		},
		arrows: {
			data: {
				set: pixiMocks.setArrows,
			},
		},
		panzoom: {
			zoomByStep: pixiMocks.zoomByStep,
		},
		init: pixiMocks.init,
	})),
}));

const LotVisualizer = (await import("~/components/lot-visualizer/index.vue")).default;

function mountLotVisualizer() {
	return mountSuspended(LotVisualizer, {
		props: {
			boundary: [],
			activeVectorRange: { start: -1, end: -1 },
		},
	});
}

describe("LotVisualizer", () => {
	beforeEach(() => {
		sessionStorage.clear();
		pixiMocks.init.mockClear();
		pixiMocks.destroy.mockClear();
		pixiMocks.setArrows.mockClear();
		pixiMocks.zoomByStep.mockClear();
	});

	it("shows the help manual by default in a fresh browser session", async () => {
		vi.useFakeTimers();
		const wrapper = await mountLotVisualizer();

		expect(wrapper.find("[data-testid='lot-visualizer-help-panel']").exists()).toBe(true);
		expect(wrapper.find("[data-testid='lot-visualizer-help-trigger']").exists()).toBe(false);

		vi.useRealTimers();
	});

	it("collapses the help manual after five seconds", async () => {
		vi.useFakeTimers();
		const wrapper = await mountLotVisualizer();

		await vi.advanceTimersByTimeAsync(5000);

		expect(wrapper.find("[data-testid='lot-visualizer-help-panel']").exists()).toBe(false);
		expect(wrapper.get("[data-testid='lot-visualizer-help-trigger']").text()).toContain("User Manual");

		vi.useRealTimers();
	});

	it("keeps the manual collapsed on later mounts in the same session", async () => {
		vi.useFakeTimers();

		const firstWrapper = await mountLotVisualizer();
		firstWrapper.unmount();

		const secondWrapper = await mountLotVisualizer();

		expect(secondWrapper.find("[data-testid='lot-visualizer-help-panel']").exists()).toBe(false);
		expect(secondWrapper.find("[data-testid='lot-visualizer-help-trigger']").exists()).toBe(true);

		vi.useRealTimers();
	});

	it("reopens the manual when the help button is clicked", async () => {
		vi.useFakeTimers();
		const wrapper = await mountLotVisualizer();

		await vi.advanceTimersByTimeAsync(5000);
		await wrapper.get("[data-testid='lot-visualizer-help-trigger']").trigger("click");

		expect(wrapper.find("[data-testid='lot-visualizer-help-panel']").exists()).toBe(true);

		vi.useRealTimers();
	});

	it("wires the zoom buttons to the panzoom step API", async () => {
		vi.useFakeTimers();
		const wrapper = await mountLotVisualizer();

		await wrapper.get("[data-testid='lot-visualizer-zoom-out']").trigger("click");
		await wrapper.get("[data-testid='lot-visualizer-zoom-in']").trigger("click");

		expect(pixiMocks.zoomByStep).toHaveBeenNthCalledWith(1, -1);
		expect(pixiMocks.zoomByStep).toHaveBeenNthCalledWith(2, 1);

		vi.useRealTimers();
	});
});
