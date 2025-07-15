<template>
	<div class="relative flex h-full w-full flex-col rounded-lg border-2 border-[#d3dae4]">
		<div class="h-auto w-full px-3 py-2">
			<span class="text-xs"> BOUNDARY EDITOR </span>
		</div>

		<!-- Editor -->
		<div ref="containerRef" class="text-md w-full grow border-t border-b border-[#ddd] text-base"></div>

		<div class="h-auto w-full p-4 text-sm">
			<!-- Area-->
			<span v-if="area">
				Area ≈
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
				Deviation of endpoints ≈
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
	import { onMounted, ref } from "vue";

	const props = withDefaults(
		defineProps<{
			template?: string;
		}>(),
		{
			template: "",
		},
	);

	const emits = defineEmits<{
		(event: "boundary", value: Boundary): void;
		(event: "active-line-range", value: { start: number; end: number }): void;
	}>();

	const containerRef = ref<HTMLTextAreaElement>();
	const content = ref<string>(props.template);
	const area = ref<number>();
	const deviation = ref<string>();
	const errorLineNumber = ref<number>(-1);
	const errorMessage = ref<string>();

	onMounted(() => {
		const container = containerRef.value!;

		const listener = EditorView.updateListener.of((update) => {
			if (update.docChanged) content.value = update.state.doc.toString();
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

		watchImmediate([content], ([content]) => {
			if (!content) {
				emits("boundary", []);
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
