import { useRenderCache } from "~/components/lot-visualizer/use-render-cache";
import { describe, expect, it, vi } from "vitest";

describe("useRenderCache", () => {
	it("reuses cached values for the same renderer and key", () => {
		const renderer = {} as never;
		const factory = vi.fn(() => ({ ready: true }));

		const first = useRenderCache({ key: "arrow-textures", renderer }, factory);
		const second = useRenderCache({ key: "arrow-textures", renderer }, factory);

		expect(factory).toHaveBeenCalledTimes(1);
		expect(second).toBe(first);
	});

	it("stores separate values for different renderers and keys", () => {
		const rendererA = {} as never;
		const rendererB = {} as never;

		const first = useRenderCache({ key: "arrow-textures", renderer: rendererA }, () => ({ id: "a" }));
		const second = useRenderCache({ key: "arrow-textures", renderer: rendererB }, () => ({ id: "b" }));
		const third = useRenderCache({ key: "different-key", renderer: rendererA }, () => ({ id: "c" }));

		expect(second).not.toBe(first);
		expect(third).not.toBe(first);
	});
});
