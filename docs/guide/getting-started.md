# Installation {#installation}

`@bitrix24/b24icons` ...


### Example

You can pass additional props to adjust the icon.

```vue
<script setup>
import ALetterIcon from '@bitrix24/b24icons-vue/main/ALetterIcon';
</script>

<template>
  <ALetterIcon class="size-10 text-gray-600"/>
</template>
```

## One generic icon component

It is possible to create one generic icon component to load icons, but it is not recommended.

::: danger
The example below imports all ES Modules, so exercise caution when using it. Importing all icons will significantly increase the build size of the application, negatively affecting its performance. This is especially important when using bundlers like `Webpack`, `Rollup`, or `Vite`.
:::

### Icon Component Example

::: code-group

```vue [components/B24Icon.vue]
<script setup>
import { computed } from 'vue';
import * as B24IconsMain from "@bitrix24/b24icons-vue/main";

const iconsGroups = {
	B24IconsMain
};

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const icon = computed(() => icons[props.name]);
</script>

<template>
  <component
    :is="icon"
  />
</template>
```

:::

### Using the Icon Component

All other props listed above also work on the `B24Icon` Component.

```vue
<template>
  <div id="app">
    <B24Icon name="B24IconsMain::ALetterIcon" />
  </div>
</template>
```