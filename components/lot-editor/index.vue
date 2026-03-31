<template>
	<div class="relative flex h-full w-full flex-col rounded-none border-1 border-[#d3dae4] sm:rounded-lg sm:border-2">
		<div class="flex h-auto w-full flex-row items-center px-4 py-3">
			<span class="text-xs"> BOUNDARY EDITOR </span>
			<Icon name="lucide:info" class="text-muted mr-1 ml-3" />
			<span class="text-muted hidden text-xs sm:inline"> Visualize technical descriptions of lots/surveys. </span>
			<span class="text-muted inline text-xs sm:hidden"> Visualize technical lots/surveys. </span>
		</div>

		<!-- Editor -->
		<div ref="containerRef" class="text-md w-full grow border-t border-b border-[#ddd] text-base"></div>

		<div class="h-auto w-full p-4 text-xs sm:text-sm">
			<!-- Area-->
			<span v-if="area">
				<span class="hidden sm:inline">Area</span>
				<span class="inline sm:hidden">A</span>
				≈
				<span class="rounded border border-[#ccc] px-1 py-0.5 font-mono font-bold">
					{{ (area ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) }} m²</span
				>
			</span>

			<template v-if="area && deviation">
				&nbsp;
				<span class="mx-1 h-full border-r py-1 opacity-50"></span>
				&nbsp;
			</template>

			<!-- Deviation -->
			<span v-if="deviation" :class="{ 'text-error': errorMessage }">
				<span class="hidden sm:inline">Deviation of endpoints</span>
				<span class="inline sm:hidden">Deviation</span>
				≈
				<span class="rounded border border-[#ccc] px-1 py-0.5 font-mono font-bold">
					{{ deviation }}
				</span>
			</span>
			<br v-if="(area || deviation) && errorMessage" />

			<!-- Error Message -->
			<span v-if="errorMessage" class="text-error">
				<span v-if="errorLineNumber >= 0">
					<b> Line {{ errorLineNumber + 1 }} </b>
					<span style="font-weight: normal"> — </span>
				</span>
				{{ errorMessage }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { watchImmediate } from "#imports";
	import { parseDescription, ParserError, ValidationError } from "~/shared/lot-parser";
	import type { Boundary } from "~/shared/lot-parser";
	import { basicSetup, EditorView } from "codemirror";
	import { onMounted, onUnmounted, ref, watch } from "vue";

	const props = withDefaults(
		defineProps<{
			modelValue?: string;
		}>(),
		{
			modelValue: "",
		},
	);

	const emits = defineEmits<{
		(event: "update:modelValue", value: string): void;
		(event: "boundary", value: Boundary): void;
		(event: "active-line-range", value: { start: number; end: number }): void;
	}>();

	const containerRef = ref<HTMLDivElement>();
	const content = ref<string>(props.modelValue);
	const area = ref<number>();
	const deviation = ref<string>();
	const errorLineNumber = ref<number>(-1);
	const errorMessage = ref<string>();
	const viewRef = ref<EditorView>();

	let syncingFromParent = false;

	onMounted(() => {
		const container = containerRef.value!;

		const listener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				content.value = update.state.doc.toString();
				if (!syncingFromParent) emits("update:modelValue", content.value);
			}
			if (update.selectionSet) {
				const range = update.state.selection.ranges[0];
				emits("active-line-range", {
					start: update.state.doc.lineAt(range.from).number - 1,
					end: update.state.doc.lineAt(range.to).number - 1,
				});
			}
		});

		const view = new EditorView({
			doc: content.value,
			parent: container,
			extensions: [basicSetup, listener],
		});

		viewRef.value = view;

		watchImmediate([content], ([content]) => {
			if (!content) {
				emits("boundary", []);
				area.value = undefined;
				deviation.value = undefined;
				errorLineNumber.value = -1;
				errorMessage.value = undefined;
				return;
			}

			try {
				const results = parseDescription(content, { ref: [0, 0] });
				emits("boundary", results.boundary);
				area.value = results.area;
				deviation.value = results.deviation;
				errorLineNumber.value = -1;
				errorMessage.value = undefined;
			} catch (error) {
				errorLineNumber.value = -1;
				errorMessage.value = (error as Error).message;
				emits("boundary", []);

				if (error instanceof ParserError) {
					errorLineNumber.value = error.lineNumber - 1;
					area.value = undefined;
					deviation.value = undefined;
				}

				if (error instanceof ValidationError) {
					const results = error.results;
					emits("boundary", results.boundary);
					area.value = results.area;
					deviation.value = results.deviation;
				}
			}
		});
	});

	onUnmounted(() => viewRef.value?.destroy());

	watch(
		() => props.modelValue,
		(value) => {
			content.value = value;
			const view = viewRef.value;
			if (!view) return;

			const current = view.state.doc.toString();
			if (value === current) return;

			const { main } = view.state.selection;
			const nextAnchor = Math.min(main.anchor, value.length);
			const nextHead = Math.min(main.head, value.length);

			syncingFromParent = true;
			view.dispatch({
				changes: {
					from: 0,
					to: current.length,
					insert: value,
				},
				selection: {
					anchor: nextAnchor,
					head: nextHead,
				},
			});
			syncingFromParent = false;
		},
	);
</script>

<style scoped>
	:deep(.cm-editor) {
		height: 100%;
		width: 100%;
		outline: none;
	}

	:deep(.cm-lineNumbers) {
		width: 48px;
	}

	:deep(.cm-scroller) {
		width: 100%;
		position: absolute;
		overflow-y: auto;
	}
</style>
