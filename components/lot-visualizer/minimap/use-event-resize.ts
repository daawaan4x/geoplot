import type { MinimapProps } from "./types";

export function useEventResize(
	parent: HTMLElement,
	canvases: HTMLCanvasElement[],
	props: MinimapProps,
	callback: () => void,
	sizeScale = 0.25,
) {
	const { size, viewbox } = props;

	const redraw = () => {
		const width = parent.clientWidth * sizeScale;
		const height = parent.clientHeight * sizeScale;
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
	};

	const observer = new ResizeObserver(redraw);
	observer.observe(parent);
	redraw();

	return () => observer.disconnect();
}
