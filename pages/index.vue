<template>
	<div class="h-dvh min-h-dvh w-dvw min-w-dvw">
		<div class="relative grid h-full w-full grid-cols-2 items-center justify-center gap-4 p-4">
			<LotVisualizer :boundary="boundary" :active-vector-range="activeLineRange" />
			<LotEditor
				:template="template"
				@boundary="(value) => (boundary = value)"
				@active-line-range="(value) => (activeLineRange = value)" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { LotVisualizer } from "#components";
	import type { Boundary } from "~/shared/lot-parser";
	import { ref } from "vue";

	const template = `
N, 1 m
W, 1 m
S, 1 m
E, 1 m
	`.trim();

	const boundary = ref<Boundary>([]);
	const activeLineRange = ref<{ start: number; end: number }>();
</script>
