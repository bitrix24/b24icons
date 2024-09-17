/** @type {import('tailwindcss').Config} */

export default {
	important: true,
	darkMode: 'class',
	content: [
		'./docs/.vitepress/**/*.{js,ts,vue}',
		'./docs/**/*.md',
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('@bitrix24/b24style')({
			logs: false,
			useLocalFonts: false
		}),
	]
}