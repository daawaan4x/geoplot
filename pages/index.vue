<template>
	<div class="flex h-dvh min-h-dvh w-dvw min-w-dvw flex-col">
		<nav class="flex w-full flex-row items-center bg-[var(--ui-bg-inverted)]">
			<h1 class="flex flex-row px-4 py-3 text-3xl font-extrabold tracking-tight text-white">geoplot</h1>
			<blockquote class="flex flex-row items-center space-x-2 text-xs opacity-90">
				<p class="text-[var(--ui-text-inverted)]">by <i> Theone Genesis Eclarin </i></p>
				<div class="">
					<a href="https://github.com/daawaan4x">
						<img
							class="rounded border"
							src="https://img.shields.io/badge/@daawaan4x-white?logo=github&logoColor=121013"
							alt="Github" />
					</a>
				</div>
			</blockquote>
		</nav>
		<main class="relative grid w-full grow grid-cols-2 items-center justify-center gap-4 p-4">
			<LotVisualizer :boundary="boundary" :active-vector-range="activeLineRange" />
			<LotEditor
				:template="template"
				@boundary="(value) => (boundary = value)"
				@active-line-range="(value) => (activeLineRange = value)" />
		</main>
	</div>
</template>

<script setup lang="ts">
	import { LotVisualizer } from "#components";
	import type { Boundary } from "~/shared/lot-parser";
	import { ref } from "vue";

	const template = `
N 45d 12' E, 12.35 m
S 44d 50' E, 7.92 m
S 89d 15' E, 5.47 m
S 46d 5' E, 9.88 m
S 1d 35' W, 6.30 m
S 43d 45' W, 11.72 m
N 89d 50' W, 6.91 m
N 42d 55' W, 8.41 m
N 3d 15' E, 7.08 m
N 44d 10' W, 5.64 m
N 60d 0' W, 3 m
	`.trim();

	const boundary = ref<Boundary>([]);
	const activeLineRange = ref<{ start: number; end: number }>();
</script>
