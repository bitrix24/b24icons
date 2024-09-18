import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";

/**
 * @memo Alias need insert at tsconfig.json
 */

console.log(fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/components', import.meta.url)));

export default defineConfig({
	server: {
		port: 3000
	},
	plugins: [
		vue()
	],
	resolve: {
		alias: {
			'@bitrix24/icons-vue': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist', import.meta.url)),
			'@bitrix24/icons-vue/components': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/components', import.meta.url)),
			'@bitrix24/icons-vue/main': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/main/esm', import.meta.url)),
			'@bitrix24/icons-vue/actions': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/actions/esm', import.meta.url)),
			'@bitrix24/icons-vue/crm': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/crm/esm', import.meta.url)),
			'@bitrix24/icons-vue/contact-center': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/contact-center/esm', import.meta.url)),
			'@bitrix24/icons-vue/social': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/social/esm', import.meta.url)),
			'@bitrix24/icons-vue/common-b24': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/common-b24/esm', import.meta.url)),
			'@bitrix24/icons-vue/common-service': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/common-service/esm', import.meta.url)),
			'@bitrix24/icons-vue/editor': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/editor/esm', import.meta.url)),
			//'@bitrix24/icons-vue/button': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/button/esm', import.meta.url)),
			'@bitrix24/icons-vue/button-specialized': fileURLToPath(new URL('../../packages/@bitrix24-icons-vue/dist/button-specialized/esm', import.meta.url)),
		}
	}
})