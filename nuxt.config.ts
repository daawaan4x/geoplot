import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt"],
	compatibilityDate: "2025-07-13",
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	ui: {
		colorMode: false,
	},
	typescript: {
		typeCheck: true,
	},
	imports: {
		autoImport: false,
	},
});
