import { mount } from "@vue/test-utils";
import { useIdleChecker } from "~/components/lot-visualizer/use-idle-checker";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { installAnimationFrameMock } from "../../support/animation-frame";

describe("useIdleChecker", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("switches between idle and active states and runs cleanup", async () => {
		const onActive = vi.fn();
		const onIdle = vi.fn();
		const source = ref(1);
		const animationFrame = installAnimationFrameMock();

		const wrapper = mount(
			defineComponent({
				setup() {
					useIdleChecker({
						getter: () => source.value,
						isIdle: (oldValue, newValue) => oldValue === newValue,
						onActive,
						onIdle,
					});

					return () => h("div");
				},
			}),
		);

		expect(animationFrame.pending()).toBe(1);

		animationFrame.flush();
		expect(onIdle).not.toHaveBeenCalled();

		animationFrame.flush();
		await vi.advanceTimersByTimeAsync(1000);
		expect(onIdle).toHaveBeenCalledTimes(1);

		source.value = 2;
		animationFrame.flush();
		expect(onActive).toHaveBeenCalledTimes(1);

		wrapper.unmount();
		expect(animationFrame.pending()).toBe(0);
		expect(onIdle).toHaveBeenCalledTimes(2);
	});
});
