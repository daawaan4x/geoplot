import { enableAutoUnmount } from "@vue/test-utils";
import { afterEach, vi } from "vitest";

enableAutoUnmount(afterEach);

afterEach(() => {
	document.body.innerHTML = "";
	vi.clearAllMocks();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
