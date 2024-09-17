import { fileURLToPath, URL } from 'node:url';
import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "@bitrix24/icons",
	description: "Bitrix24 SVG icons for development web-applications",
	vite: {
		resolve: {
			/**
			 * @todo fix error
			 */
			alias: [
				{
					find: '@bitrix24/icons-vue/components',
					replacement: fileURLToPath(new URL('../../vue/components', import.meta.url)),
				},
				{
					find: '~/.vitepress',
					replacement: fileURLToPath(new URL('./', import.meta.url)),
				},
			],
		},
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{text: 'Home', link: '/'},
			{text: 'Examples', link: '/markdown-examples'}
		],
		
		sidebar: [
			{
				text: 'Examples',
				items: [
					{text: 'Markdown Examples', link: '/markdown-examples'},
					{text: 'Runtime API Examples', link: '/api-examples'}
				]
			}
		],
		
		socialLinks: [
			{icon: 'github', link: 'https://github.com/vuejs/vitepress'}
		],
	}
})
