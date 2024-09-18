// The only reason this file exists is to appease Vite's optimizeDeps feature which requires a root-level import.

export default new Proxy(
	{},
	{
		get: (_, property) => {
			if (property === '__esModule') {
				return {}
			}
			
			throw new Error(
				`Importing from \`@bitrix24/icons-vue\` directly is not supported. Please import from either \`@bitrix24/icons-vue/actions\`, \`@bitrix24/icons-vue/contact-center\`, \`@bitrix24/icons-vue/crm\`, \`@bitrix24/icons-vue/editor\`, \`@bitrix24/icons-vue/main\`, or \`@bitrix24/icons-vue/social\` instead.`
			)
		},
	}
)