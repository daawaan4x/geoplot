import type { BoundarySample } from "~/shared/boundary-samples";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";

export const HomePageLotVisualizerStub = defineComponent({
	name: "HomePageLotVisualizerStub",
	props: {
		boundary: {
			type: Array as PropType<unknown[]>,
			default: () => [],
		},
		activeVectorRange: {
			type: Object as PropType<{ start: number; end: number } | undefined>,
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
});

export const HomePageLotEditorStub = defineComponent({
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
});

export const HomePageBoundarySampleRailTileStub = defineComponent({
	name: "HomePageBoundarySampleRailTileStub",
	props: {
		sample: {
			type: Object as PropType<BoundarySample>,
			required: true,
		},
		load: {
			type: String as PropType<"immediate" | "prompt">,
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
					"data-sample-id": String(props.sample.id),
					"data-load": props.load,
					"onClick": () => emit("load", props.sample),
				},
				props.sample.title,
			);
	},
});
