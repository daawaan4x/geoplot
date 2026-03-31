import { fileURLToPath } from "node:url";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const nuxtProject = await defineVitestProject({
	resolve: {
		alias: {
			"~": rootDir,
			"@": rootDir,
		},
	},
	test: {
		name: "nuxt",
		include: ["tests/nuxt/**/*.test.ts"],
		setupFiles: ["./tests/setup/nuxt.ts"],
		environmentOptions: {
			nuxt: {
				domEnvironment: "jsdom",
			},
		},
	},
});

const coverageInclude = [
	"shared/lot-parser/**",
	"shared/boundary-samples.ts",
	"components/lot-visualizer/primitives.ts",
	"components/lot-visualizer/use-arrows.ts",
	"components/lot-visualizer/use-render-cache.ts",
	"components/lot-visualizer/use-idle-checker.ts",
	"components/lot-visualizer/scale-legend/helper.ts",
	"components/lot-editor/index.vue",
	"components/boundary-sample-rail/tile.vue",
	"pages/index.vue",
];

const coverageExclude = [
	"components/lot-visualizer/pixi-main-app.ts",
	"components/lot-visualizer/minimap/**",
	"components/lot-visualizer/panzoom/**",
	"components/lot-visualizer/arrows/event-tick.ts",
	"components/lot-visualizer/arrows/setup-panzoom.ts",
	"components/lot-visualizer/arrows/pixi-objects/**",
	"components/lot-visualizer/scale-bar/**",
];

export default defineConfig({
	resolve: {
		alias: {
			"~": rootDir,
			"@": rootDir,
		},
	},
	test: {
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json-summary"],
			include: coverageInclude,
			exclude: coverageExclude,
		},
		projects: [
			{
				resolve: {
					alias: {
						"~": rootDir,
						"@": rootDir,
					},
				},
				test: {
					name: "unit",
					environment: "node",
					include: ["tests/unit/**/*.test.ts"],
				},
			},
			nuxtProject,
		],
	},
});
