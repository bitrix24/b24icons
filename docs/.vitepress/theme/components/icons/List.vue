<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import CopyButton from './CopyButton.vue';
import { B24Icon } from '@bitrix24/b24icons-vue'
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
	for(const group of props.groups)
	{
		result = result.concat(
			group.list.map((item: InfoIconRow) => item)
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
					class="relative justify-start rounded w-full h-14 text-lg placeholder:text-base-500 pl-12 py-2 pr-4 border hover:border-info active:border-info-background-on focus-visible:border-info-background-on"
				/>
			</div>
		</div>
		<div
			class="flex flex-col items-center"
			v-if="iconList.length > 0 && filteredIcons.length === 0"
		>
			<div class="text-base-350">
				<B24Icon name="Main::AttentionIIcon" class="size-32" />
			</div>
			<h2 class="text-h1 my-6">
				No icons found for '{{ searchQuery }}'
			</h2>
			<VPButton
				text="Clear your search and try again"
				theme="alt"
				@click="searchQuery=''"
			/>
			<span class="my-2 font-md text-base-500">or</span>
			<VPButton
				text="Search on Github issues"
				theme="alt"
				:href="`https://github.com/bitrix24/b24icons/issues?q=is%3Aopen+${searchQuery}`"
				target="_blank"
			/>
		</div>
		<div v-bind="wrapperProps" class="aspect-square isolate">
			<template
				v-for="{ index, data: icons } in list"
				:key="index"
			>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6">
					<div
						v-for="icon in icons"
						:key="icon.code"
						class="group/block"
					>
						<div class="group/icon relative h-[100px] w-full">
							<div
								class="absolute
									z-20 inset-0
									h-full w-full
									items-end justify-center
									rounded
									hidden
									group-hover/block:flex
									bg-info-background-on/[0.70]
								"
							>
								<p class="
									text-center text-[0.8125rem] leading-1
									text-info-on
									line-clamp-2
									whitespace-normal
									pb-2
								">{{ icon.name }}</p>
							</div>
							<div class="absolute z-10 inset-0 flex h-full w-full items-center justify-center rounded text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-900/[0.08] dark:ring-gray-150/[0.28]">
								<div
									class="icon-wrapper group-hover/block:blur-[2px]"
									:id="icon.code.replace('::', '_')"
								>
									<B24Icon
										:name="icon.code"
										class="size-10"
										:class="[
											icon.specialized?.animateSpin ? 'animate-spin-slow' : '',
											
											icon.specialized?.width === 'w-lg' ? 'w-lg' : '',
											icon.specialized?.height === 'h-lg' ? 'h-lg' : '',
											
											icon.specialized?.width === 'w-[21px]' ? 'w-[21px]' : '',
											icon.specialized?.height === 'h-[21px]' ? 'h-[21px]' : '',
										]"
										
									/>
								</div>
							</div>
						</div>
						<div class="h-10 mt-0.5 mb-2">
							<CopyButton
								:icon="icon"
								popover-position="bottom"
							/>
						</div>
						
					</div>
				</div>
			</template>
			
		</div>
	</div>
</template>