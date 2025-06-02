<script setup lang="ts">
import { B24Icon } from '@bitrix24/b24icons-vue'

defineProps<{
  searchQuery: string
}>()

defineEmits(['clear'])

const configParams = __SH_BASE__;
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="text-base-350">
      <B24Icon name="Main::AttentionIIcon" class="size-32"/>
    </div>
    <h2 class="text-h1 my-6">
      No icons found for '{{searchQuery}}'
    </h2>
    <B24Button
      normal-case
      rounded
      label="Clear your search and try again"
      theme="alt"
      @click="$emit('clear')"
    />
    <span class="my-2 font-md text-base-500">or</span>
    <B24Button
      normal-case
      rounded
      label="Search on Github issues"
      color="link"
      depth="dark"
      :href="`${configParams.github}/issues?q=is%3Aopen+${searchQuery}`"
      target="_blank"
    />
  </div>
</template>
