<template>
	<article
		class="group/sample relative aspect-square h-full w-full overflow-hidden rounded-lg border-2 border-[#d3dae4] bg-white transition-colors focus-within:border-[#b8c4d4] hover:border-[#b8c4d4]">
		<button
			type="button"
			class="absolute inset-0 z-20 outline-none focus-visible:ring-2 focus-visible:ring-[#9fb3cf]"
			:class="isImmediate ? 'cursor-pointer' : 'pointer-events-none'"
			:aria-label="isImmediate ? `Load ${sample.title}` : undefined"
			:disabled="!isImmediate"
			:tabindex="isImmediate ? 0 : -1"
			@click="$emit('load', sample)" />

		<div class="relative h-full w-full">
			<div ref="thumbnailRef" class="absolute inset-0">
				<canvas ref="canvasRef" class="h-full w-full"></canvas>
			</div>
			<div class="pointer-events-none absolute inset-0 bg-linear-to-t from-white/82 via-white/12 to-transparent"></div>
			<div
				class="absolute top-2 left-2 rounded border border-[#d3dae4] bg-white/92 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-[#48596e] uppercase">
				{{ sample.id }}
			</div>
			<div
				class="absolute right-3 bottom-3 z-30 transition-opacity"
				:aria-hidden="!isPrompt"
				:class="isPrompt ? 'opacity-100' : 'pointer-events-none opacity-0'">
				<UButton
					color="neutral"
					size="xs"
					variant="outline"
					label="Load"
					class="px-2.5 py-1.5 opacity-0 transition-opacity group-focus-within/sample:opacity-100 group-hover/sample:opacity-100"
					:disabled="!isPrompt"
					:tabindex="isPrompt ? 0 : -1"
					@click="$emit('load', sample)" />
			</div>
			<div class="pointer-events-none absolute inset-x-0 bottom-0 px-2 py-2">
				<h3
					class="line-clamp-2 text-[11px] leading-3.5 font-semibold text-[#2d3a4b] [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_0_12px_rgba(255,255,255,0.95)]">
					{{ sample.title }}
				</h3>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
	import { renderStaticMinimap } from "~/components/lot-visualizer/minimap";
	import type { BoundarySample } from "~/shared/boundary-samples";
	import { computed, onMounted, onUnmounted, ref } from "vue";

	const props = defineProps<{
		sample: BoundarySample;
		load: "immediate" | "prompt";
	}>();

	defineEmits<{
		(event: "load", value: BoundarySample): void;
	}>();

	const isImmediate = computed(() => props.load === "immediate");
	const isPrompt = computed(() => props.load === "prompt");

	const canvasRef = ref<HTMLCanvasElement>();
	const thumbnailRef = ref<HTMLDivElement>();

	let cleanup: (() => void) | undefined;

	onMounted(() => {
		if (!canvasRef.value || !thumbnailRef.value) return;
		cleanup = renderStaticMinimap(thumbnailRef.value.parentElement!, canvasRef.value, props.sample.description);
	});

	onUnmounted(() => cleanup?.());
</script>
