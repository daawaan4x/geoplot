<template>
	<div class="flex h-dvh min-h-dvh w-dvw min-w-dvw flex-col bg-white">
		<nav class="flex w-full flex-row items-center bg-[var(--ui-bg-inverted)]">
			<h1 class="flex flex-row px-4 py-3 text-3xl font-extrabold tracking-tight text-white">geoplot</h1>
			<blockquote class="flex flex-row items-center gap-2 text-xs opacity-90">
				<p class="hidden text-[var(--ui-text-inverted)] sm:block">by <i> Theone Genesis Eclarin </i></p>
				<div>
					<a href="https://github.com/daawaan4x">
						<img
							class="rounded border"
							src="https://img.shields.io/badge/@daawaan4x-white?logo=github&logoColor=121013"
							alt="Github" />
					</a>
				</div>
			</blockquote>
		</nav>
		<main
			class="grid w-full grow grid-cols-1 grid-rows-[minmax(0,1fr)_8.75rem] gap-0 overflow-hidden p-0 sm:gap-2 sm:p-4 lg:grid-cols-[minmax(0,1fr)_10.75rem] lg:grid-rows-1 lg:gap-4 lg:p-8">
			<section class="grid min-h-0 grid-cols-1 grid-rows-2 gap-0 sm:gap-2 lg:grid-cols-2 lg:grid-rows-1 lg:gap-4">
				<LotVisualizer :boundary="boundary" :active-vector-range="activeLineRange" />
				<LotEditor
					:model-value="editorText"
					@update:model-value="handleEditorUpdate"
					@boundary="(value) => (boundary = value)"
					@active-line-range="(value) => (activeLineRange = value)" />
			</section>

			<aside class="flex min-h-0 flex-col bg-white lg:overflow-hidden">
				<div
					class="flex min-h-0 gap-0 overflow-x-auto sm:gap-2 lg:flex-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
					<BoundarySampleRailTile
						v-for="sample in boundarySamples"
						:key="sample.id"
						:sample="sample"
						:load="loadMode"
						class="h-[8.75rem] min-w-[8.75rem] shrink-0 lg:h-auto lg:min-w-0"
						@load="loadSample" />
				</div>
			</aside>
		</main>
	</div>
</template>

<script setup lang="ts">
	import { LotVisualizer } from "#components";
	import { boundarySamples } from "~/shared/boundary-samples";
	import { fromBoundaryToDescription } from "~/shared/lot-parser";
	import type { Boundary } from "~/shared/lot-parser";
	import { computed, ref } from "vue";

	const initialSample = boundarySamples[0]!;
	const editorText = ref(fromBoundaryToDescription(initialSample.boundary));
	const boundary = ref<Boundary>(initialSample.boundary);
	const activeLineRange = ref<{ start: number; end: number }>();
	const source = ref<"sample" | "editor">("sample");

	const loadMode = computed(() => (source.value === "sample" ? "immediate" : "prompt"));

	function loadSample(sample: (typeof boundarySamples)[number]) {
		editorText.value = fromBoundaryToDescription(sample.boundary);
		boundary.value = sample.boundary;
		source.value = "sample";
	}

	function handleEditorUpdate(value: string) {
		editorText.value = value;
		source.value = "editor";
	}
</script>
