<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import StickyContainer from '../ui/StickyContainer.vue';
import SearchInput from '../ui/SearchInput.vue';
import Grid from '../ui/Grid.vue';
import EmptyList from './EmptyList.vue';
import type { GroupRow, InfoIconRow } from '../../types'
import { useElementSize, useEventListener, useVirtualList } from '@vueuse/core'
import useDynamicFilter from '../../composables/useDynamicFilter'
import splitIntoChunks from "../../utils/splitIntoChunks"
import useSearchInput from "../../composables/useSearchInput";

const ICON_SIZE = 110;
const ICON_GRID_GAP = 24;

const props = defineProps<{
  groups: GroupRow[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(containerRef)

const columnSize = computed(() => {
  return Math.floor(
    containerWidth.value / (ICON_SIZE + ICON_GRID_GAP)
  )
})

const iconList = computed(() => {
  let result: InfoIconRow[] = [];
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

const { searchInput, searchQuery, searchQueryDebounced } = useSearchInput();
watch(searchQueryDebounced, () => {
  scrollTo(0)
})

const filteredIcons = useDynamicFilter(
  searchQuery,
  iconList,
  [
    { name: 'code' },
    { name: 'name' },
    { name: 'subCategories' }
  ]
)

const chunkedItems = computed(() => {
  return splitIntoChunks(
    filteredIcons.value, columnSize.value
  )
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  chunkedItems,
  {
    itemHeight: ICON_SIZE + ICON_GRID_GAP,
    overscan: 10
  }
)

onMounted(() => {
  containerProps.ref.value = document.documentElement;
  useEventListener(window, 'scroll', containerProps.onScroll)
})
</script>

<template>
  <div ref="containerRef" class="pb-[400px]">
    <StickyContainer>
      <SearchInput
        placeholder="Search icons ..."
        v-model="searchQuery"
        ref="searchInput"
      />
    </StickyContainer>
    <EmptyList
      v-if="iconList.length > 0 && filteredIcons.length === 0"
      :searchQuery="searchQuery"
      @clear="searchQuery = ''"
    />
    <div v-bind="wrapperProps" class="aspect-square isolate">
      <Grid
        v-for="{ index, data: icons } in list"
        :key="index"
        :icons="icons"
      />
    </div>
  </div>
</template>
