import { vi } from "vitest";

export function installAnimationFrameMock() {
	let handle = 0;
	const callbacks = new Map<number, FrameRequestCallback>();

	vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
		const id = ++handle;
		callbacks.set(id, callback);
		return id;
	});

	vi.stubGlobal("cancelAnimationFrame", (id: number) => {
		callbacks.delete(id);
	});

	return {
		flush(time = 0) {
			const pending = [...callbacks.values()];
			callbacks.clear();
			pending.forEach((callback) => callback(time));
			return pending.length;
		},
		pending() {
			return callbacks.size;
		},
	};
}
