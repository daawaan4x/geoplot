import type { Renderer } from "pixi.js";
import { onBeforeUnmount } from "vue";

const maps = new WeakMap<Renderer, Record<string, unknown>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRenderCache<T extends (...args: any[]) => any>(
	options: {
		key: string;
		renderer: Renderer;
	},
	render: T,
): ReturnType<T> {
	let map = maps.get(options.renderer);
	if (!map) maps.set(options.renderer, (map = {}));

	let data = map[options.key];
	if (!data) map[options.key] = data = render();

	return data as ReturnType<T>;
}
