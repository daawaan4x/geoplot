import { onBeforeUnmount } from "vue";
import type { PanzoomComputes, PanzoomProps } from "./types";

const zoomTick = 1 / 256;

export function useEventZoom(target: HTMLElement, props: PanzoomProps, computes: PanzoomComputes) {
	const { size, zoom, shift } = props;

	function wheel(ev: WheelEvent) {
		ev.preventDefault();

		const mouseDeltaY = -ev.deltaY;
		const amplifier = Number.isInteger(mouseDeltaY) ? 1 : 4;
		const deltaZoom = Math.round(amplifier * mouseDeltaY);

		const diffX = () => ev.offsetX - computes.translate().target.x;
		const diffY = () => ev.offsetY - computes.translate().target.y;

		const longerSide = Math.max(size.x, size.y);
		const maxZoom = (longerSide * 0.2) / props.minEdge.magnitude;

		if (deltaZoom > 0) {
			for (let i = 0; i < deltaZoom; i++) {
				if (zoom.target >= maxZoom) return;
				shift.target.x -= zoomTick * diffX();
				shift.target.y -= zoomTick * diffY();
				zoom.target *= zoomTick + 1;
			}
		} else if (deltaZoom < 0) {
			for (let i = 0; i < -deltaZoom; i++) {
				if (zoom.target <= 1) return;
				shift.target.x += (zoomTick / (zoomTick + 1)) * diffX();
				shift.target.y += (zoomTick / (zoomTick + 1)) * diffY();
				zoom.target /= zoomTick + 1;
			}
		}
	}

	target.addEventListener("wheel", wheel);
	onBeforeUnmount(() => target.removeEventListener("wheel", wheel));
}
