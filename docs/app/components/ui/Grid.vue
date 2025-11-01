<script setup lang="ts">
import type { InfoIconRow } from '#shared/types/base'
import IconView from '../icons/IconView.vue'

defineProps<{
  icons: InfoIconRow[]
}>()
</script>

<template>
  <B24PageGrid
    class="grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6"
  >
    <template v-for="icon in icons" :key="icon.code">
      <IconView :icon="icon" />
    </template>
  </B24PageGrid>
</template>
