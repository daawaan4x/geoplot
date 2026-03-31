<template>
	<div
		class="pointer-events-auto absolute bottom-4 left-4 flex flex-col overflow-hidden rounded-lg border border-slate-300 bg-white/92 shadow-sm backdrop-blur"
		role="group"
		aria-label="Zoom controls">
		<button
			type="button"
			data-testid="lot-visualizer-zoom-in"
			class="flex size-9 items-center justify-center border-b border-slate-300 text-slate-700 transition hover:bg-white"
			aria-label="Zoom in"
			@click="$emit('zoom-in')">
			<Icon name="lucide:plus" class="size-4" />
		</button>
		<button
			type="button"
			data-testid="lot-visualizer-zoom-out"
			class="flex size-9 items-center justify-center text-slate-700 transition hover:bg-white"
			aria-label="Zoom out"
			@click="$emit('zoom-out')">
			<Icon name="lucide:minus" class="size-4" />
		</button>
	</div>
</template>

<script setup lang="ts">
	defineEmits<{
		(event: "zoom-in" | "zoom-out"): void;
	}>();
</script>
