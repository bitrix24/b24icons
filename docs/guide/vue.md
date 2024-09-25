---
---
<script setup>
import { B24Icon } from '@bitrix24/b24icons-vue';
import Bitrix24Icon from '@bitrix24/b24icons-vue/common-service/Bitrix24Icon';
import Example from '~/.vitepress/theme/components/ui/Example.vue';

const configParams = __SH_BASE__;
</script>

# Vue

`@bitrix24/b24icons-vue` library for [Vue 3](https://vuejs.org/).

## Installation {#installation}
Install via `npm`.

::: code-group
```sh [npm]
$ npm i @bitrix24/b24icons-vue
```
:::

## Usage {#usage}

The package supports [ECMAScript](https://tc39.github.io/ecma262/#sec-modules) and `tree-shaking`.

Import icons as Vue-components. Only used icons are included in the build.

### Example {#example}

<Example>
	<div class="grid grid-cols-1 gap-x-10 gap-y-8 place-items-center">
		<div class="flex flex-col items-center gap-y-1">
			<p class="font-medium text-xs text-gray-800 font-b24-system-mono text-center dark:text-gray-400">Common-service::Bitrix24Icon</p>
			<div class="size-24 rounded-lg bg-white shadow-md dark:bg-gray-400 flex flex-row flex-nowrap items-center justify-center">
				<Bitrix24Icon class="size-15 text-blue-500 dark:text-blue-900" />
			</div>
		</div>
	</div>
</Example>


::: code-group
```vue{2,7} [SomeComponent.vue]
<script setup>
import Bitrix24Icon from '@bitrix24/b24icons-vue/common-service/Bitrix24Icon'
</script>

<template>
	<div class="rounded ...">
		<Bitrix24Icon class="size-15 text-blue-500 ..." />
	</div>
</template>
```
:::

## Generic Icon Component {#generic-icon-component}
Use the <a :href="`${configParams.github}/blob/main/packages/@bitrix24-icons-vue/src/components/B24Icon.ts`" target="_blank" rel="noreferrer">B24Icon</a> component for easy access to icons.

The component uses dynamic imports via `import()` to load icons as needed.

This does not break the `tree-shaking` principle because `tree-shaking` works with static imports, while dynamic imports are used for load optimization, loading only the necessary parts of the code when they are needed.

> Specify the full icon name with the `name` parameter, e.g., `Main::CopilotAiIcon`.

<Example>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-8 place-items-center">
		<div class="flex flex-col items-center gap-y-1">
			<p class="font-medium text-xs text-gray-800 font-b24-system-mono text-center dark:text-gray-400">Main::CopilotAiIcon</p>
			<div class="size-24 rounded-lg bg-white shadow-md dark:bg-gray-400 flex flex-row flex-nowrap items-center justify-center">
				<B24Icon name="Main::CopilotAiIcon" class="size-15 text-blue-500 dark:text-blue-900" />
			</div>
		</div>
		<div class="flex flex-col items-center gap-y-1">
			<p class="font-medium text-xs text-gray-800 font-b24-system-mono text-center dark:text-gray-400">Button::TariffIcon</p>
			<div class="size-24 rounded-lg bg-white shadow-md dark:bg-gray-400 flex flex-row flex-nowrap items-center justify-center">
				<B24Icon name="Button::TariffIcon" class="size-15 text-blue-500 dark:text-blue-900" />
			</div>
		</div>
		<div class="flex flex-col items-center gap-y-1">
			<p class="font-medium text-xs text-gray-800 font-b24-system-mono text-center dark:text-gray-400">Main::AiIcon</p>
			<div class="size-24 rounded-lg bg-white shadow-md dark:bg-gray-400 flex flex-row flex-nowrap items-center justify-center">
				<B24Icon name="Main::AiIcon" class="size-15 text-blue-500 dark:text-blue-900" />
			</div>
		</div>
	</div>
</Example>

::: code-group
```vue{2,7,10,13} [SomeComponent.vue]
<script setup>
import { B24Icon } from '@bitrix24/b24icons-vue'
</script>

<template>
	<div class="rounded ...">
		<B24Icon name="Button::TariffIcon" class="size-15 ..." />
	</div>
	<div class="rounded ...">
		<B24Icon name="Main::CopilotAiIcon" class="size-15 ..." />
	</div>
	<div class="rounded ...">
		<B24Icon name="Main::AiIcon" class="size-15 ..." />
	</div>
</template>
```
:::