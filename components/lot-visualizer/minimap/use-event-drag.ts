import { onBeforeUnmount } from "vue";
import type { PanzoomView } from "../panzoom";
import { toMinimapCoords } from "./helpers";
import type { MinimapProps } from "./types";

export function useEventDrag(target: HTMLElement, panzoomView: PanzoomView, props: MinimapProps) {
	const { viewbox, size } = props;
	let activePointerId: number | null = null;
	let lastPoint: { x: number; y: number } | null = null;

	// Convert browser coordinates into minimap-local coordinates for consistent dragging on touch devices.
	function getPoint(ev: PointerEvent) {
		const rect = target.getBoundingClientRect();

		return {
			x: ev.clientX - rect.left,
			y: ev.clientY - rect.top,
		};
	}

	function pointerDown(ev: PointerEvent) {
		const point = getPoint(ev);

		props.locked = true;
		activePointerId = ev.pointerId;
		lastPoint = point;
		viewbox.target.x = point.x;
		viewbox.target.y = point.y;
		target.setPointerCapture?.(ev.pointerId);
	}

	target.addEventListener("pointerdown", pointerDown);
	onBeforeUnmount(() => target.removeEventListener("pointerdown", pointerDown));

	function pointerUp(ev: PointerEvent) {
		if (activePointerId !== ev.pointerId) return;

		if (!props.locked) return;
		props.locked = false;
		activePointerId = null;
		lastPoint = null;
		target.releasePointerCapture?.(ev.pointerId);
		panzoomView.panTo(viewbox.target.x * 4, viewbox.target.y * 4);
		const { x, y } = toMinimapCoords(size, panzoomView, "target");
		viewbox.target.x = x;
		viewbox.target.y = y;
	}

	window.addEventListener("pointerup", pointerUp);
	window.addEventListener("pointercancel", pointerUp);
	onBeforeUnmount(() => {
		window.removeEventListener("pointerup", pointerUp);
		window.removeEventListener("pointercancel", pointerUp);
	});

	function pointerMove(ev: PointerEvent) {
		if (activePointerId !== ev.pointerId || !lastPoint) return;
		if (!props.locked) return;

		const point = getPoint(ev);
		viewbox.target.x += point.x - lastPoint.x;
		viewbox.target.y += point.y - lastPoint.y;

		// Clamp the viewbox so dragging never leaves the minimap bounds.
		if (viewbox.target.x < 0) viewbox.target.x = 0;
		if (viewbox.target.x > size.x) viewbox.target.x = size.x;
		if (viewbox.target.y < 0) viewbox.target.y = 0;
		if (viewbox.target.y > size.y) viewbox.target.y = size.y;
		lastPoint = point;
	}

	window.addEventListener("pointermove", pointerMove);
	onBeforeUnmount(() => window.removeEventListener("pointermove", pointerMove));
}
