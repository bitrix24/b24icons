import { defineConfig, type DefaultTheme } from 'vitepress'
import pkg from "../../../package.json";

export const en = defineConfig({
	lang: 'en-US',
	description: 'Bitrix24 SVG icons for development web-applications',
	
	themeConfig: {
		nav: nav(),
		
		sidebar: {
			'/guide/': { base: '/guide/', items: sidebarGuide() }
		},
		
		editLink: {
			pattern: 'https://github.com/bitrix24/b24icons/edit/main/docs/:path',
			text: 'Edit this page on GitHub'
		},
		
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2024-present Bitrix24'
		},
	}
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{text: 'Quickstart', link: '/guide/getting-started'},
		{text: 'Icons', link: '/guide/icons'},
		{
			text: pkg.version,
			items: [
				{
					text: 'Changelog',
					link: 'https://github.com/bitrix24/b24icons/blob/main/CHANGELOG.md'
				},
				{
					text: '@bitrix24/b24style',
					link: 'https://bitrix24.github.io/b24style/reference/colors.html'
				},
			]
		}
	]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Guide',
			collapsed: false,
			items: [
				{ text: 'Getting Started', link: 'getting-started' }
			]
		},
		{ text: 'Icons', base: '/guide/', link: 'icons' }
	]
}