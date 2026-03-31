<template>
	<div
		v-if="active"
		class="absolute top-0 right-0 left-0 h-1 overflow-hidden bg-slate-400"
		data-testid="lot-visualizer-help-progress">
		<div class="h-full bg-slate-700" :style="{ width: `${progressPercent}%` }"></div>
	</div>
</template>

<script setup lang="ts">
	import { onBeforeUnmount, ref, watch } from "vue";

	const props = defineProps<{
		active: boolean;
		durationMs: number;
		startedAtMs: number;
	}>();

	const progressPercent = ref(100);

	let animationFrameId: number | undefined;

	function clearAnimationFrame() {
		if (animationFrameId === undefined) return;
		window.cancelAnimationFrame(animationFrameId);
		animationFrameId = undefined;
	}

	function tick(now: number) {
		const elapsed = Math.max(0, now - props.startedAtMs);
		const remaining = Math.max(0, props.durationMs - elapsed);
		progressPercent.value = props.durationMs <= 0 ? 0 : (remaining / props.durationMs) * 100;

		if (!props.active || remaining <= 0) {
			clearAnimationFrame();
			return;
		}

		animationFrameId = window.requestAnimationFrame(tick);
	}

	function startAnimation() {
		clearAnimationFrame();
		progressPercent.value = 100;

		if (!props.active) return;
		animationFrameId = window.requestAnimationFrame(tick);
	}

	watch(
		() => [props.active, props.durationMs, props.startedAtMs] as const,
		() => startAnimation(),
		{ immediate: true },
	);

	onBeforeUnmount(() => {
		clearAnimationFrame();
	});
</script>
