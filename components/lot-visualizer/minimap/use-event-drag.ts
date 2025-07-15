import { onBeforeUnmount } from "vue";
import type { PanzoomView } from "../panzoom";
import { toMinimapCoords } from "./helpers";
import type { MinimapProps } from "./types";

export function useEventDrag(target: HTMLElement, panzoomView: PanzoomView, props: MinimapProps) {
	const { viewbox, size } = props;

	function pointerDown(ev: PointerEvent) {
		props.locked = true;
		viewbox.target.x = ev.offsetX;
		viewbox.target.y = ev.offsetY;
	}

	target.addEventListener("pointerdown", pointerDown);
	onBeforeUnmount(() => target.removeEventListener("pointerdown", pointerDown));

	function pointerUp() {
		if (!props.locked) return;
		props.locked = false;
		panzoomView.panTo(viewbox.target.x * 4, viewbox.target.y * 4);
		const { x, y } = toMinimapCoords(size, panzoomView, "target");
		viewbox.target.x = x;
		viewbox.target.y = y;
	}

	window.addEventListener("pointerup", pointerUp);
	onBeforeUnmount(() => window.removeEventListener("pointerup", pointerUp));

	function pointerMove(ev: PointerEvent) {
		if (!props.locked) return;
		viewbox.target.x += ev.movementX;
		viewbox.target.y += ev.movementY;
		if (viewbox.target.x < 0) viewbox.target.x = 0;
		if (viewbox.target.x > size.x) viewbox.target.x = size.x;
		if (viewbox.target.y < 0) viewbox.target.y = 0;
		if (viewbox.target.y > size.y) viewbox.target.y = size.y;
	}

	window.addEventListener("pointermove", pointerMove);
	onBeforeUnmount(() => window.removeEventListener("pointermove", pointerMove));
}
