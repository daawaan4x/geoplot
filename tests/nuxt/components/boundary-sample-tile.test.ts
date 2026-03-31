import { mockComponent, mountSuspended } from "@nuxt/test-utils/runtime";
import { boundarySamples } from "~/shared/boundary-samples";
import { beforeEach, describe, expect, it, vi } from "vitest";

const cleanupSpy = vi.fn();

vi.mock("~/components/lot-visualizer/minimap", () => ({
	renderStaticMinimap: vi.fn(() => vi.fn()),
}));

mockComponent(
	"UButton",
	{
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
		template:
			"<button type='button' data-testid='prompt-load' :disabled='disabled' :tabindex='tabindex' @click=\"$emit('click')\">{{ label }}</button>",
	} as never,
);

const BoundarySampleRailTile = (await import("~/components/boundary-sample-rail/tile.vue")).default;
const minimapModule = await import("~/components/lot-visualizer/minimap");
const renderStaticMinimap = vi.mocked(minimapModule.renderStaticMinimap);

function mountBoundarySampleTile(sample = boundarySamples[0]!, load: "immediate" | "prompt" = "immediate") {
	return mountSuspended(BoundarySampleRailTile, {
		props: {
			sample,
			load,
		},
	});
}

function getImmediateLoadButton(wrapper: Awaited<ReturnType<typeof mountBoundarySampleTile>>, title: string) {
	return wrapper.get(`button[aria-label="Load ${title}"]`);
}

function getPromptLoadButton(wrapper: Awaited<ReturnType<typeof mountBoundarySampleTile>>) {
	return wrapper.findAll("button")[1]!;
}

describe("BoundarySampleRailTile", () => {
	beforeEach(() => {
		cleanupSpy.mockReset();
		renderStaticMinimap.mockReset();
		renderStaticMinimap.mockImplementation(
			(_parent: HTMLElement, _canvas: HTMLCanvasElement, _description: string) => cleanupSpy,
		);
	});

	it("boots the static minimap and cleans it up on unmount", async () => {
		const wrapper = await mountBoundarySampleTile();

		expect(renderStaticMinimap).toHaveBeenCalledTimes(1);
		const firstCall = renderStaticMinimap.mock.calls[0];
		expect(firstCall).toBeDefined();
		expect(firstCall?.[2]).toBe(boundarySamples[0]?.description);

		wrapper.unmount();
		expect(cleanupSpy).toHaveBeenCalledTimes(1);
	});

	it("emits load from the immediate overlay button", async () => {
		const sample = boundarySamples[0]!;
		const wrapper = await mountBoundarySampleTile(sample);
		await getImmediateLoadButton(wrapper, sample.title).trigger("click");

		expect(wrapper.emitted("load")?.[0]?.[0]).toEqual(sample);
	});

	it("uses the prompt button when immediate loading is disabled", async () => {
		const sample = boundarySamples[1]!;
		const wrapper = await mountBoundarySampleTile(sample, "prompt");

		const [overlay, promptButton] = wrapper.findAll("button");
		expect(overlay).toBeDefined();
		expect(promptButton).toBeDefined();
		expect(overlay.attributes("disabled")).toBeDefined();
		expect(overlay.attributes("tabindex")).toBe("-1");
		expect(promptButton!.attributes("disabled")).toBeUndefined();
		expect(promptButton!.attributes("tabindex")).toBe("0");

		await getPromptLoadButton(wrapper).trigger("click");
		expect(wrapper.emitted("load")?.[0]?.[0]).toEqual(sample);
	});
});
