// https://vitepress.dev/guide/custom-theme
import {h, shallowRef} from 'vue'
import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './tailwind.postcss'
import {slidOverInjectionKey} from './composables/useSlideover'
import type {SlideoverState} from './types'

export default {
	extends: DefaultTheme,
	Layout: () =>
	{
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		})
	},
	enhanceApp({app, router, siteData})
	{
		const slideoverState = shallowRef<SlideoverState>({
			component: 'div',
			props: {}
		})
		
		app.provide(slidOverInjectionKey, slideoverState)
	}
} satisfies Theme
