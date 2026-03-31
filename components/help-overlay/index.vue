<template>
	<div class="pointer-events-auto absolute top-3 left-3 max-w-[calc(100%-1.5rem)] sm:top-4 sm:left-4">
		<button
			v-if="!isOpen"
			type="button"
			data-testid="lot-visualizer-help-trigger"
			class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/92 px-3 py-2 text-left text-xs font-semibold tracking-tight text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
			aria-expanded="false"
			aria-controls="lot-visualizer-help-panel"
			@click="openHelp">
			<Icon name="lucide:circle-help" class="size-4 shrink-0" />
			<span>User Manual</span>
		</button>

		<section
			v-else
			id="lot-visualizer-help-panel"
			data-testid="lot-visualizer-help-panel"
			class="relative w-[min(19rem,calc(100vw-2.5rem))] overflow-hidden rounded-[calc(0.5rem+0.75rem)] border border-slate-300 bg-white/95 p-3 pt-4 text-slate-700 shadow-lg backdrop-blur sm:w-[18.5rem]"
			aria-labelledby="lot-visualizer-help-title">
			<HelpOverlayAutoHideProgress
				:active="showAutoHideProgress"
				:duration-ms="HELP_AUTO_HIDE_MS"
				:started-at-ms="autoHideStartedAtMs" />

			<div class="flex items-center justify-between gap-2">
				<div>
					<h2 id="lot-visualizer-help-title" class="text-sm font-semibold text-slate-900 uppercase">User Manual</h2>
				</div>

				<button
					type="button"
					class="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100"
					aria-label="Close help overlay"
					@click="closeHelp">
					Close
				</button>
			</div>

			<div class="mt-2 grid gap-2 text-xs leading-3.5 text-slate-600">
				<div class="rounded-lg border border-slate-200 bg-slate-50/80 p-2">
					<div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
						<p class="font-semibold text-slate-800">Wheel / pinch</p>
						<p>Zoom + resize minimap box</p>
						<p class="font-semibold text-slate-800">Panning</p>
						<p>Pan across the boundary lot</p>
						<p class="font-semibold text-slate-800">Minimap</p>
						<p>Drag the main view</p>
						<p class="font-semibold text-slate-800">Zoom Buttons</p>
						<p>1-step = 2x zoom</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import HelpOverlayAutoHideProgress from "./auto-hide-progress.vue";

	const HELP_OVERLAY_SESSION_KEY = "geoplot:lot-visualizer-help-overlay-seen";
	const HELP_AUTO_HIDE_MS = 5000;

	const isOpen = ref(false);
	const showAutoHideProgress = ref(false);
	const autoHideStartedAtMs = ref(0);

	let autoHideTimer: number | undefined;

	function clearAutoHideTimer() {
		if (autoHideTimer === undefined) return;
		window.clearTimeout(autoHideTimer);
		autoHideTimer = undefined;
	}

	function closeHelp() {
		clearAutoHideTimer();
		showAutoHideProgress.value = false;
		autoHideStartedAtMs.value = 0;
		isOpen.value = false;
	}

	function openHelp() {
		clearAutoHideTimer();
		showAutoHideProgress.value = false;
		autoHideStartedAtMs.value = 0;
		isOpen.value = true;
	}

	function bootHelpOverlay() {
		try {
			if (window.sessionStorage.getItem(HELP_OVERLAY_SESSION_KEY) === "1") return;
			window.sessionStorage.setItem(HELP_OVERLAY_SESSION_KEY, "1");
		} catch (_) {
			// Fall back to the default open state if session storage is unavailable.
		}

		isOpen.value = true;
		showAutoHideProgress.value = true;
		autoHideStartedAtMs.value = performance.now();
		autoHideTimer = window.setTimeout(() => {
			isOpen.value = false;
			showAutoHideProgress.value = false;
			autoHideStartedAtMs.value = 0;
			autoHideTimer = undefined;
		}, HELP_AUTO_HIDE_MS);
	}

	onMounted(() => {
		bootHelpOverlay();
	});

	onUnmounted(() => {
		clearAutoHideTimer();
	});
</script>
