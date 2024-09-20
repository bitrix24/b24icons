<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import { B24Icon } from '@bitrix24/icons-vue'
import type { IconRow } from '../../types'
import { useElementSize, useEventListener, useVirtualList } from '@vueuse/core'
import useDynamicFilter from '../../composables/useDynamicFilter'
import splitIntoChunks from "../../utils/splitIntoChunks"
import useSearchInput from "../../composables/useSearchInput";

const ICON_SIZE = 110;
const ICON_GRID_GAP = 24;

const props = defineProps<{
	icons: IconRow[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(containerRef)

const columnSize = computed(() => {
	return Math.floor(
		containerWidth.value / (ICON_SIZE + ICON_GRID_GAP)
	)
})

const iconList = computed(() => {
	return props.icons
})

const { searchInput, searchQuery, searchQueryDebounced } = useSearchInput();
watch(searchQueryDebounced, () => {
	scrollTo(0)
})

const filteredIcons = useDynamicFilter(
	searchQuery,
	iconList,
	[
		{ name: 'name' },
		{ name: 'type' }
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
		<div class="sticky z-10 top-12 pt-6 min-[960px]:pt-8 min-[960px]:top-16 -mt-8 mb-8 w-full flex bg-white shadow-[0_16px_24px_rgb(255,255,255)] dark:bg-[#0f172a] dark:shadow-[0_16px_24px_rgb(15,23,42)]">
			<div
				class="relative bg-gray-30 w-full rounded text-base-master dark:text-gray-200 dark:bg-[#0f172a]"
			>
				<B24Icon name="Main::Search2Icon" class="absolute size-8 z-10 top-3 left-3 pointer-events-none dark:text-gray-200" />
				<input
					name="searchInput"
					ref="searchInput"
					type="search"
					v-model="searchQuery"
					placeholder="Search icons ..."
					class="relative justify-start rounded w-full h-14 text-lg placeholder:text-base-500 pl-12 py-2 pr-2 border hover:border-info active:border-info-background-on focus-visible:border-info-background-on"
				/>
			</div>
		</div>
		<div
			class="flex flex-col items-center"
			v-if="list.length === 0"
		>
			<div class="text-base-350">
				<B24Icon name="Main::CloudEmptyIcon" class="size-32" />
			</div>
			<h2 class="text-h1 my-6">
				No icons found for '{{ searchQuery }}'
			</h2>
			<VPButton
				text="Clear your search and try again"
				theme="alt"
				@click="searchQuery=''"
			/>
			<span class="my-2 font-md text-base-350">or</span>
			<VPButton
				text="Search on Github issues"
				theme="alt"
				:href="`https://github.com/bitrix24/icons/issues?q=is%3Aopen+${searchQuery}`"
				target="_blank"
			/>
		</div>
		<div v-bind="wrapperProps" class="aspect-square">
			<template
				v-for="{ index, data: icons } in list"
				:key="index"
			>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6">
					<div
						v-for="icon in icons"
						:key="icon.code"
						class="group"
					>
						<div class="relative h-[100px] w-full">
							<button class="absolute inset-0 flex h-full w-full cursor-auto items-center justify-center rounded text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-900/[0.08] dark:ring-gray-150/[0.28]">
								<span :title="icon.name">
									<B24Icon
										:name="icon.name"
										class="size-10"
									/>
								</span>
							</button>
						</div>
						<p
							class="mt-3 h-10 truncate text-center text-[0.8125rem] leading-5 text-gray-500 group-focus-within:line-clamp-2 group-focus-within:whitespace-normal group-hover:line-clamp-2 group-hover:whitespace-normal"
						>{{ icon.icon }}</p>
					</div>
				</div>
			</template>
			
		</div>
	</div>
</template>