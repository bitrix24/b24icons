<script setup lang="ts">
import type { InfoIconRow } from '#shared/types/base'
import IconView from '../icons/IconView.vue'

defineProps<{
  icons: InfoIconRow[]
}>()
</script>

<template>
  <div
    class="flex flex-row flex-wrap items-start justify-center gap-6 mb-6"
  >
    <template v-for="icon in icons" :key="icon.code">
      <IconView :icon="icon" />
    </template>
  </div>
</template>
