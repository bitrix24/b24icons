import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitepress'
import { configParams } from './params'

/**
 * @memo fix
 */
const customAlias: any = [
	{
		find: '~/.vitepress',
		replacement: fileURLToPath(new URL('./../', import.meta.url)),
	}
];

export const shared = defineConfig({
	title: '@bitrix24/b24icons',
	
	lastUpdated: true,
	cleanUrls: false,
	metaChunk: true,
	
	base: configParams.baseFolder,
	/* prettier-ignore */
	head: [
		['link', { rel: 'icon', href: `${configParams.baseFolder}favicon.ico` }],
		['meta', { name: 'theme-color', content: '#5f67ee' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:locale', content: 'en' }],
		['meta', { property: 'og:title', content: '@bitrix24/b24icons | Bitrix24 SVG icons for development web-applications' }],
		['meta', { property: 'og:site_name', content: '@bitrix24/b24icons' }],
		['meta', { property: 'og:image', content: `${configParams.domain}${configParams.baseFolder}bitrix24_b24icons.jpg` }],
		['meta', { property: 'og:url', content: `${configParams.domain}${configParams.baseFolder}` }],
	],
	
	themeConfig: {
		siteTitle: false,
		logo: { src: '/b24-logo.svg'},
		
		socialLinks: [
			{
				icon: {
					svg: '<svg style="width: 30px; height: 30px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon"><path fill-rule="evenodd" d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0m-12.624.354 1.988.643a.2.2 0 0 0 .1-.006l.001-.001c.46-.287 4.548-2.848 4.784-2.934.037-.012.064.001.057.027-.095.329-3.652 3.465-3.652 3.465s-.035.04-.028.071a.09.09 0 0 0 .037.06c.451.3 2.494 1.662 3.085 2.166a.55.55 0 0 0 .402.155c.302-.011.386-.34.386-.34s1.405-5.608 1.452-6.36l.006-.075q.005-.051.005-.096a.6.6 0 0 0-.017-.174.19.19 0 0 0-.128-.138c-.128-.049-.346.024-.346.024s-7.71 2.749-8.15 3.053c-.095.066-.127.104-.143.148-.076.217.161.313.161.313" clip-rule="evenodd"/></svg>'
				},
				link: 'https://t.me/b24_dev'
			},
			{icon: 'github', link: configParams.github}
		],
	},
	vite: {
		define: {
			__SH_BASE__: configParams
		},
		resolve: {
			alias: customAlias
		},
	}
})