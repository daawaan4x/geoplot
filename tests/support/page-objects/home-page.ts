import type { VueWrapper } from "@vue/test-utils";

type Wrapper = Pick<VueWrapper, "get" | "findAll">;

export function createHomePageDriver(wrapper: Wrapper) {
	const getVisualizer = () => wrapper.get("[data-testid='visualizer']");
	const getEditorModel = () => wrapper.get("[data-testid='editor-model']");
	const getSampleTiles = () => wrapper.findAll("[data-testid='sample-tile']");

	return {
		getSampleTiles,
		sampleLoadMode(index = 0) {
			return getSampleTiles()[index]?.attributes("data-load");
		},
		editorModel() {
			return getEditorModel().text();
		},
		clickEditorUpdate() {
			return wrapper.get("[data-testid='editor-update']").trigger("click");
		},
		emitBoundary() {
			return wrapper.get("[data-testid='editor-boundary']").trigger("click");
		},
		emitActiveRange() {
			return wrapper.get("[data-testid='editor-range']").trigger("click");
		},
		visualizerBoundaryLength() {
			return getVisualizer().attributes("data-boundary-length");
		},
		visualizerActiveRange() {
			return getVisualizer().attributes("data-active-range");
		},
	};
}
