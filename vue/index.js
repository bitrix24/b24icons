// The only reason this file exists is to appease Vite's optimizeDeps feature which requires a root-level import.

module.exports = new Proxy(
	{},
	{
		get: (_, property) => {
			if(property === '__esModule')
			{
				return {}
			}
			
			throw new Error(
				`Importing from \`@bitrix24icons/vue\` directly is not supported. Please import from either \`@bitrix24icons/vue/actions\`, \`@bitrix24icons/vue/contact-center\`, \`@bitrix24icons/vue/crm\`, \`@bitrix24icons/vue/editor\`, \`@bitrix24icons/vue/main\`, or \`@bitrix24icons/vue/social\` instead.`
			)
		},
	}
)