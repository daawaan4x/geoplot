import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

// TODO: fix ESLint vscode extension not highlighting problems in svelte files

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommendedTypeChecked,
	...ts.configs.stylisticTypeChecked,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		languageOptions: {
			parserOptions: {
				project: true,
				programs: false,
				extraFileExtensions: [".svelte"],
			},
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		ignores: [
			"build", 
			".svelte-kit", 
			"dist", 
			"*.config.js", 
			"*.config.ts",
			"src/lib/shadcn"
		],
	},
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-console": "warn",
		},
	},
];
