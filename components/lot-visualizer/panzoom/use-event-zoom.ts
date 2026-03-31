import { onBeforeUnmount } from "vue";
import type { createZoomController } from "./zoom-controller";

const zoomTick = 1 / 256;

export function useEventZoom(
	target: HTMLElement,
	zoomController: Pick<ReturnType<typeof createZoomController>, "zoomByFactor">,
) {
	function wheel(ev: WheelEvent) {
		ev.preventDefault();

		const mouseDeltaY = -ev.deltaY;
		const amplifier = Number.isInteger(mouseDeltaY) ? 1 : 4;
		const deltaZoom = Math.round(amplifier * mouseDeltaY);
		if (deltaZoom === 0) return;

		zoomController.zoomByFactor(ev.offsetX, ev.offsetY, Math.pow(zoomTick + 1, deltaZoom));
	}

	target.addEventListener("wheel", wheel);
	onBeforeUnmount(() => target.removeEventListener("wheel", wheel));
}
