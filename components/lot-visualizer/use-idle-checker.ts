import { debounce } from "lodash";
import { onBeforeUnmount } from "vue";

type IdleCheckerConfig<T> = {
	getter: () => T;
	isIdle: (oldValue: T, newValue: T) => boolean;
	onActive: () => void;
	onIdle: () => void;
};

export function useIdleChecker<T>(config: IdleCheckerConfig<T>) {
	let isIdle = false;
	let frameHandle: number | null = null;
	let oldValue: T | null = null;

	const onIdleCb = debounce(() => config.onIdle(), 1000);
	const onActiveCb = () => (onIdleCb.cancel(), config.onActive());

	function onIdle() {
		if (!isIdle) onIdleCb();
		isIdle = true;
	}

	function onActive() {
		if (isIdle) onActiveCb();
		isIdle = false;
	}

	function callback() {
		const newValue = config.getter();
		if (oldValue) {
			if (config.isIdle(oldValue, newValue)) onIdle();
			else onActive();
		}
		oldValue = newValue;
		frameHandle = window.requestAnimationFrame(callback);
	}

	frameHandle = window.requestAnimationFrame(callback);
	onBeforeUnmount(() => {
		onIdleCb.cancel();
		config.onIdle();
		if (frameHandle) window.cancelAnimationFrame(frameHandle);
	});
}
