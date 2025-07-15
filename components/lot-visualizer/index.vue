<template>
	<div class="h-full w-full overflow-hidden">
		<div ref="containerRef" class="relative h-full w-full overflow-hidden rounded-lg border-2 border-[#d3dae4]">
			<canvas ref="canvasRef" class="cursor-grab! active:cursor-grabbing!"></canvas>
			<canvas
				ref="minimapRef"
				class="absolute right-4 bottom-4 h-[25%] w-[25%] touch-none rounded-md border-2 border-[#d3dae4]"></canvas>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useResizeObserver, watchImmediate } from "@vueuse/core";
	import type { Boundary } from "~/shared/lot-parser";
	import { computed, onMounted, onUnmounted, ref } from "vue";
	import { usePixiMainApp } from "./pixi-main-app";
	import { useArrows } from "./use-arrows";

	const props = withDefaults(
		defineProps<{
			boundary?: Boundary;
			activeVectorRange?: { start: number; end: number };
		}>(),
		{
			boundary: () => [],
			activeVectorRange: () => ({ start: -1, end: -1 }),
		},
	);

	const containerRef = ref<HTMLElement>();
	const canvasRef = ref<HTMLCanvasElement>();
	const minimapRef = ref<HTMLCanvasElement>();

	onMounted(async () => {
		const container = containerRef.value!;
		const canvas = canvasRef.value!;
		const minimap = minimapRef.value!;

		const size = ref(0);
		useResizeObserver(container, () => {
			const { offsetHeight, offsetWidth } = container;
			size.value = 0.8 * Math.min(offsetHeight, offsetWidth);
		});

		const arrows = computed(() => {
			return useArrows({
				size: size.value,
				boundary: props.boundary,
				activeVectorRange: props.activeVectorRange,
			});
		});

		const app = usePixiMainApp({ container, canvas, minimap });

		onUnmounted(() => {
			try {
				app.app.destroy(true);
			} catch (_) {
				// do nothing
			}
		});

		await app.init();
		watchImmediate([arrows], ([arrows]) => {
			if (arrows) app.arrows.data.set(arrows);
		});
	});
</script>
