<script setup lang="ts">
import { computed, ref } from 'vue'
import { B24Icon } from '@bitrix24/icons-vue'
import type { IconRow } from '../../types'
import useDynamicFilter from '../../composables/useDynamicFilter'

const props = defineProps<{
	icons: IconRow[];
}>()

const searchQuery = ref('')

const iconList = computed(() => {
	return props.icons;
})

const filteredIcons = useDynamicFilter(searchQuery, iconList, [
	{ name: 'name' },
	{ name: 'type' },
])

</script>

<template>
	
	<div class="mb-3 border border-gray-500 p-2">
		<input
			type="search"
			v-model="searchQuery"
			placeholder="Search query..."
			class="flex w-full"
		/>
	</div>
	<div
		class="w-full grid gap-5 grid-cols-[repeat(auto-fill,_minmax(56px,_1fr))]"
	>
		<div
			v-for="(icon, indexRow) in filteredIcons"
			:key="icon.code"
			class="group/item aspect-square relative flex flex-col flex-nowrap justify-center items-center cursor-pointer rounded-2xs bg-gray-30 hover:bg-gray-200 dark:bg-base-master dark:text-gray-150"
		>
			<B24Icon
				:name="icon.name"
				class="size-10"
			/>
			<div class="hidden z-30 group-hover/item:absolute group-hover/item:block group-hover/item:-bottom-6 bg-info-background border border-info-background-on text-info-background-on text-xs p-1.5 rounded-2xs">{{ icon.name }}</div>
		</div>
	</div>
</template>