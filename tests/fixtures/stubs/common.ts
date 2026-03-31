import { defineComponent, h } from "vue";

export const IconStub = defineComponent({
	name: "IconStub",
	setup() {
		return () => h("span", { "data-testid": "icon" });
	},
});

export const UButtonStub = defineComponent({
	name: "UButtonStub",
	props: {
		label: {
			type: String,
			default: "Load",
		},
		disabled: Boolean,
		tabindex: {
			type: [Number, String],
			default: 0,
		},
	},
	emits: ["click"],
	setup(props, { emit, slots }) {
		return () =>
			h(
				"button",
				{
					"type": "button",
					"data-testid": "prompt-load",
					"disabled": props.disabled,
					"tabindex": props.tabindex,
					"onClick": () => emit("click"),
				},
				slots.default?.() ?? props.label,
			);
	},
});
