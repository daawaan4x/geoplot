import { mockComponent, mountSuspended } from "@nuxt/test-utils/runtime";
import { boundarySamples } from "~/shared/boundary-samples";
import { fromBoundaryToDescription } from "~/shared/lot-parser";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { createHomePageDriver } from "../../support/page-objects/home-page";

mockComponent(
	"LotVisualizer",
	defineComponent({
		name: "HomePageLotVisualizerStub",
		props: {
			boundary: {
				type: Array,
				default: () => [],
			},
			activeVectorRange: {
				type: Object,
				default: undefined,
			},
		},
		setup(props) {
			return () =>
				h("div", {
					"data-testid": "visualizer",
					"data-boundary-length": String(props.boundary.length),
					"data-active-range": props.activeVectorRange
						? `${props.activeVectorRange.start}:${props.activeVectorRange.end}`
						: "none",
				});
		},
	}) as never,
);

mockComponent(
	"LotEditor",
	defineComponent({
		name: "HomePageLotEditorStub",
		props: {
			modelValue: {
				type: String,
				default: "",
			},
		},
		emits: ["update:modelValue", "boundary", "active-line-range"],
		setup(props, { emit }) {
			return () =>
				h("div", [
					h("output", { "data-testid": "editor-model" }, props.modelValue),
					h(
						"button",
						{
							"type": "button",
							"data-testid": "editor-update",
							"onClick": () => emit("update:modelValue", "MANUAL EDIT"),
						},
						"edit",
					),
					h(
						"button",
						{
							"type": "button",
							"data-testid": "editor-boundary",
							"onClick": () => emit("boundary", [{ id: 1 }, { id: 2 }]),
						},
						"boundary",
					),
					h(
						"button",
						{
							"type": "button",
							"data-testid": "editor-range",
							"onClick": () => emit("active-line-range", { start: 2, end: 3 }),
						},
						"range",
					),
				]);
		},
	}) as never,
);

mockComponent(
	"BoundarySampleRailTile",
	defineComponent({
		name: "HomePageBoundarySampleRailTileStub",
		props: {
			sample: {
				type: Object,
				required: true,
			},
			load: {
				type: String,
				required: true,
			},
		},
		emits: ["load"],
		setup(props, { emit }) {
			return () =>
				h(
					"button",
					{
						"type": "button",
						"data-testid": "sample-tile",
						"data-sample-id": String((props.sample as { id: number }).id),
						"data-load": props.load,
						"onClick": () => emit("load", props.sample),
					},
					(props.sample as { title: string }).title,
				);
		},
	}) as never,
);

const HomePage = (await import("~/pages/index.vue")).default;

describe("pages/index", () => {
	it("switches between sample-driven and editor-driven modes", async () => {
		const wrapper = await mountSuspended(HomePage);
		const page = createHomePageDriver(wrapper);

		expect(page.sampleLoadMode()).toBe("immediate");
		expect(page.editorModel()).toBe(fromBoundaryToDescription(boundarySamples[0]!.boundary));

		await page.clickEditorUpdate();
		expect(page.sampleLoadMode()).toBe("prompt");
		expect(page.editorModel()).toBe("MANUAL EDIT");

		await page.getSampleTiles()[1]!.trigger("click");
		expect(page.sampleLoadMode()).toBe("immediate");
		expect(page.editorModel()).toBe(fromBoundaryToDescription(boundarySamples[1]!.boundary));
	});

	it("forwards boundary and selection updates to the visualizer", async () => {
		const wrapper = await mountSuspended(HomePage);
		const page = createHomePageDriver(wrapper);

		await page.emitBoundary();
		await page.emitActiveRange();

		expect(page.visualizerBoundaryLength()).toBe("2");
		expect(page.visualizerActiveRange()).toBe("2:3");
	});
});
