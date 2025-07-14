// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
	// Your custom configs here
	{
		rules: {
			"vue/html-self-closing": "off",
			// Allow unused arguments and variables when they begin with an underscore
			"@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
		},
	},
);
