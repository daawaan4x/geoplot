import { useResizeObserver } from "@vueuse/core";
import type { PanzoomProps } from "./types";

export const useEventResize = (target: HTMLElement, props: PanzoomProps) => {
	const { size, origin } = props;

	useResizeObserver(target, () => {
		size.x = target.offsetWidth;
		size.y = target.offsetHeight;
		origin.x = size.x / 2;
		origin.y = size.y / 2;
	});
};
