import { useResizeObserver } from "@vueuse/core";
import type { MinimapProps } from "./types";

export function useEventResize(
	parent: HTMLElement,
	canvases: HTMLCanvasElement[],
	props: MinimapProps,
	callback: () => void,
) {
	const { size, viewbox } = props;

	useResizeObserver(parent, () => {
		const width = parent.clientWidth / 4;
		const height = parent.clientHeight / 4;
		viewbox.target.x += width / 2 - viewbox.target.x;
		viewbox.target.y += height / 2 - viewbox.target.y;

		for (let index = 0; index < canvases.length; index++) {
			const canvas = canvases[index]!;
			canvas.width = width;
			canvas.height = height;
		}

		size.x = width;
		size.y = height;

		callback();
	});
}
