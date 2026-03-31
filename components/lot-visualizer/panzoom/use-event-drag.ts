import { onBeforeUnmount } from "vue";
import type { PanzoomComputes, PanzoomProps } from "./types";

type PointerState = {
	clientX: number;
	clientY: number;
	localX: number;
	localY: number;
};

export function useEventDrag(target: HTMLElement, props: PanzoomProps, computes: PanzoomComputes) {
	const { pan, velocity, size, zoom, shift } = props;
	// Keep one source of truth for every active pointer so drag and pinch use the same coordinates.
	const pointers = new Map<number, PointerState>();

	let dragPointerId: number | null = null;
	let lastPinchDistance = 0;
	let lastPinchCenter: { x: number; y: number } | null = null;

	function readPointer(ev: PointerEvent): PointerState {
		const rect = target.getBoundingClientRect();

		return {
			clientX: ev.clientX,
			clientY: ev.clientY,
			localX: ev.clientX - rect.left,
			localY: ev.clientY - rect.top,
		};
	}

	function readPinch() {
		const [first, second] = Array.from(pointers.values());
		if (!first || !second) return null;

		return {
			center: {
				x: (first.localX + second.localX) / 2,
				y: (first.localY + second.localY) / 2,
			},
			distance: Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY),
		};
	}

	// Re-anchor zoom around the pinch center so the gesture feels attached to the fingers.
	function zoomAt(focusX: number, focusY: number, scaleFactor: number) {
		if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) return;

		const longerSide = Math.max(size.x, size.y);
		const maxZoom = (longerSide * 0.25) / props.minEdge.magnitude;
		const nextZoom = Math.min(maxZoom, Math.max(1, zoom.target * scaleFactor));

		if (nextZoom === zoom.target) return;

		const appliedScale = nextZoom / zoom.target;
		const translate = computes.translate().target;

		shift.target.x += (1 - appliedScale) * (focusX - translate.x);
		shift.target.y += (1 - appliedScale) * (focusY - translate.y);
		zoom.target = nextZoom;
	}

	function resetPinchState() {
		lastPinchCenter = null;
		lastPinchDistance = 0;
	}

	function pointerDown(ev: PointerEvent) {
		pointers.set(ev.pointerId, readPointer(ev));
		target.setPointerCapture?.(ev.pointerId);

		props.locked = true;
		velocity.x = 0;
		velocity.y = 0;

		if (pointers.size === 1) {
			dragPointerId = ev.pointerId;
			resetPinchState();
			return;
		}

		const pinch = readPinch();
		if (!pinch) return;

		dragPointerId = null;
		lastPinchCenter = pinch.center;
		lastPinchDistance = pinch.distance;
	}

	target.addEventListener("pointerdown", pointerDown);
	onBeforeUnmount(() => target.removeEventListener("pointerdown", pointerDown));

	function releasePointer(ev: PointerEvent) {
		const wasPinching = pointers.size > 1;
		if (!pointers.delete(ev.pointerId)) return;

		target.releasePointerCapture?.(ev.pointerId);

		if (pointers.size === 0) {
			props.locked = false;
			velocity.x = wasPinching ? 0 : velocity.x / 4;
			velocity.y = wasPinching ? 0 : velocity.y / 4;
			dragPointerId = null;
			resetPinchState();
			return;
		}

		if (pointers.size === 1) {
			const [pointerId] = pointers.keys();
			dragPointerId = pointerId ?? null;
			resetPinchState();
			velocity.x = 0;
			velocity.y = 0;
		}
	}

	window.addEventListener("pointerup", releasePointer);
	window.addEventListener("pointercancel", releasePointer);
	onBeforeUnmount(() => {
		window.removeEventListener("pointerup", releasePointer);
		window.removeEventListener("pointercancel", releasePointer);
	});

	function pointerMove(ev: PointerEvent) {
		const previous = pointers.get(ev.pointerId);
		if (!previous) return;

		pointers.set(ev.pointerId, readPointer(ev));

		// Two active pointers switch the gesture into pinch-to-zoom with center-based panning.
		const pinch = readPinch();
		if (pinch) {
			if (lastPinchCenter) {
				pan.target.x += pinch.center.x - lastPinchCenter.x;
				pan.target.y += pinch.center.y - lastPinchCenter.y;
			}

			if (lastPinchDistance > 0 && pinch.distance > 0) {
				zoomAt(pinch.center.x, pinch.center.y, pinch.distance / lastPinchDistance);
			}

			lastPinchCenter = pinch.center;
			lastPinchDistance = pinch.distance;
			velocity.x = 0;
			velocity.y = 0;
			return;
		}

		if (dragPointerId !== ev.pointerId) return;

		const next = pointers.get(ev.pointerId)!;
		velocity.x = next.clientX - previous.clientX;
		velocity.y = next.clientY - previous.clientY;
		pan.target.x += velocity.x;
		pan.target.y += velocity.y;
	}

	window.addEventListener("pointermove", pointerMove);
	onBeforeUnmount(() => window.removeEventListener("pointermove", pointerMove));
}
