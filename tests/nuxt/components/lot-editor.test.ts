import { mockComponent, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	malformedLotDescription,
	openLotDescription,
	shortSquareLotDescription,
	squareLotDescription,
} from "../../fixtures/lot-descriptions";
import { IconStub } from "../../fixtures/stubs/common";

vi.mock("codemirror", () => import("../../support/codemirror"));

type CodeMirrorMockModule = typeof import("../../support/codemirror");
const { EditorView, resetCodeMirrorMock } = (await import("codemirror")) as unknown as CodeMirrorMockModule;
const LotEditor = (await import("~/components/lot-editor/index.vue")).default;

async function mountLotEditor(modelValue: string) {
	const wrapper = await mountSuspended(LotEditor, {
		props: {
			modelValue,
		},
		global: {
			stubs: {
				Icon: IconStub,
			},
		},
	});
	await flushPromises();
	return wrapper;
}

function latestPayload<T>(wrapper: Awaited<ReturnType<typeof mountLotEditor>>, eventName: string) {
	return (wrapper.emitted(eventName)?.at(-1) ?? [])[0] as T;
}

describe("LotEditor", () => {
	beforeEach(() => {
		resetCodeMirrorMock();
	});

	it("parses valid descriptions and emits boundary results", async () => {
		const wrapper = await mountLotEditor(squareLotDescription);

		expect(wrapper.text()).toContain("Area ≈");
		expect(wrapper.text()).toContain("100");
		expect(wrapper.text()).toContain("Deviation of endpoints ≈");
		expect(wrapper.text()).not.toContain("Cannot recognize input");
		expect(latestPayload<unknown[]>(wrapper, "boundary")).toHaveLength(4);
	});

	it("shows parser errors with the failing line number", async () => {
		const wrapper = await mountLotEditor(malformedLotDescription);

		expect(wrapper.text()).toContain("Line 2");
		expect(wrapper.text()).toContain("Cannot recognize input as a technical description of lots/surveys");
		expect(latestPayload<unknown[]>(wrapper, "boundary")).toEqual([]);
	});

	it("preserves deviation feedback for validation errors", async () => {
		const wrapper = await mountLotEditor(openLotDescription);

		expect(wrapper.text()).toContain("The boundary must form an approximately enclosed shape");
		expect(wrapper.text()).toContain("Deviation of endpoints ≈");
		expect(wrapper.text()).not.toContain("Area ≈");
		expect(latestPayload<unknown[]>(wrapper, "boundary")).toHaveLength(2);
	});

	it("emits the active line range from editor selections", async () => {
		const wrapper = await mountLotEditor(shortSquareLotDescription);

		const view = EditorView.instances[0]!;
		view.dispatch({
			selection: {
				anchor: 0,
				head: shortSquareLotDescription.length - 1,
			},
		});

		expect(latestPayload<{ start: number; end: number }>(wrapper, "active-line-range")).toEqual({
			start: 0,
			end: 2,
		});
	});
});
