import { onBeforeUnmount } from "vue";
import type { PanzoomProps } from "./types";

export function useEventDrag(target: HTMLElement, props: PanzoomProps) {
	const { pan, velocity } = props;

	function pointerDown() {
		props.locked = true;
		velocity.x = 0;
		velocity.y = 0;
	}

	target.addEventListener("pointerdown", pointerDown);
	onBeforeUnmount(() => target.removeEventListener("pointerdown", pointerDown));

	function pointerUp() {
		if (!props.locked) return;
		props.locked = false;
		velocity.x /= 4;
		velocity.y /= 4;
	}

	window.addEventListener("pointerup", pointerUp);
	onBeforeUnmount(() => window.removeEventListener("pointerup", pointerUp));

	function pointerMove(ev: PointerEvent) {
		if (!props.locked) return;
		velocity.x = ev.movementX;
		velocity.y = ev.movementY;
		pan.target.x += velocity.x;
		pan.target.y += velocity.y;
	}

	window.addEventListener("pointermove", pointerMove);
	onBeforeUnmount(() => window.removeEventListener("pointermove", pointerMove));
}
