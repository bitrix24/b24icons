<script setup lang="ts">
import type { GroupRow, InfoIconRow } from '#shared/types/base'
import { computed, watch } from 'vue'
import IconView from './IconView.vue'
import EmptyList from './EmptyList.vue'
import { useElementSize } from '@vueuse/core'
import useDynamicFilter from '../../composables/useDynamicFilter'
import useSearchInput from '../../composables/useSearchInput'

const props = defineProps<{
  groups: GroupRow[]
}>()

const iconList = computed(() => {
  let result: InfoIconRow[] = []
  for (const group of props.groups) {
    result = result.concat(
      group.list.map((item: InfoIconRow) => {
        return Object.assign(
          {},
          item,
          {
            subCategories: item.data.subCategories.join('; ')
          }
        )
      })
    )
  }

  return result
})

const { searchQuery, searchQueryDebounced } = useSearchInput()
watch(searchQueryDebounced, () => {
  scrollArea.value?.virtualizer?.scrollToIndex(0, { align: 'start', behavior: 'smooth' })
})

const filteredIcons = useDynamicFilter<InfoIconRow>(
  searchQuery,
  iconList,
  [
    { name: 'code' },
    { name: 'name' },
    { name: 'subCategories' }
  ]
)

const scrollArea = useTemplateRef('scrollArea')
const { width } = useElementSize(() => scrollArea.value?.$el)
const lanes = computed(() => Math.max(1, Math.min(5, Math.floor(width.value / 240))))
</script>

<template>
  <EmptyList
    v-if="iconList.length > 0 && filteredIcons.length === 0"
    :search-query="searchQuery"
    @clear="searchQuery = ''"
  />
  <B24ScrollArea
    v-else
    ref="scrollArea"
    v-slot="{ item }"
    :items="filteredIcons"
    :virtualize="{
      lanes,
      estimateSize: 148,
      gap: 16
    }"
    class="w-full h-[calc(100vh-var(--topbar-height)-40px)] dd-scrollbar-thin scrollbar-transparent"
  >
    <IconView :icon="item as InfoIconRow" />
  </B24ScrollArea>
</template>
