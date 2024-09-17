import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";

/**
 * @memo Alias need insert at tsconfig.json
 */
export default defineConfig({
	server: {
		port: 3000
	},
	plugins: [
		vue()
	],
	resolve: {
		alias: {
			'@bitrix24/icons-vue/components': fileURLToPath(new URL('../components', import.meta.url)),
			'@bitrix24/icons-vue/main': fileURLToPath(new URL('../main/esm', import.meta.url)),
			'@bitrix24/icons-vue/actions': fileURLToPath(new URL('../actions/esm', import.meta.url)),
			'@bitrix24/icons-vue/crm': fileURLToPath(new URL('../crm/esm', import.meta.url)),
			'@bitrix24/icons-vue/contact-center': fileURLToPath(new URL('../contact-center/esm', import.meta.url)),
			'@bitrix24/icons-vue/social': fileURLToPath(new URL('../social/esm', import.meta.url)),
			'@bitrix24/icons-vue/common-b24': fileURLToPath(new URL('../common-b24/esm', import.meta.url)),
			'@bitrix24/icons-vue/common-service': fileURLToPath(new URL('../common-service/esm', import.meta.url)),
			'@bitrix24/icons-vue/editor': fileURLToPath(new URL('../editor/esm', import.meta.url)),
			'@bitrix24/icons-vue/button': fileURLToPath(new URL('../button/esm', import.meta.url)),
			'@bitrix24/icons-vue/button-specialized': fileURLToPath(new URL('../button-specialized/esm', import.meta.url)),
		}
	}
})