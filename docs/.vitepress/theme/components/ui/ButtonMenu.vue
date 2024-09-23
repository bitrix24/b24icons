<script setup lang="ts">
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import { ref } from 'vue'
import type { InfoIconRow } from '../../types'
import ChevronToTheRightIcon from '@bitrix24/b24icons-vue/actions/ChevronDownIcon'

import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from '@headlessui/vue'

interface Props {
	text: string,
	options: {
		text: string
		onClick?: () => void
	}[],
	callOptionOnClick?: boolean
	buttonClass?: string
	id: string
	popoverPosition?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
	callOptionOnClick: false,
	popoverPosition: 'bottom'
})

const emit = defineEmits(['click', 'optionClick'])

function onOptionClick(event, option) {
	if(!props.callOptionOnClick) {
		return
	}

	option.onClick()

	emit('optionClick', event)
}

</script>

<template>
	<Listbox>
		<div class="relative flex flex-col flex-nowrap">
			<ListboxButton
				class="
					relative
					flex flex-row flex-nowrap
					items-center justify-between
					
					min-w-full
					px-2 py-2
					
					font-normal text-md leading-5
					rounded
					bg-white dark:bg-gray-900
					dark:text-info-on
					ring-0 ring-inset ring-info-background-on
					group-hover/block:ring-1
					group-hover/block:bg-info-background-on
					group-hover/block:text-info-on
					group-hover/block:text-left
				"
			>
				<div class="truncate flex-auto group-hover/block:hidden">{{ props.text }}</div>
				<div class="hidden group-hover/block:block">Copy</div>
				<ChevronToTheRightIcon class="size-5 flex-none hidden group-hover/block:block" />
			</ListboxButton>
			<ListboxOptions
				class="
					shadow-xl shadow-info-background-on/[0.20]
					absolute top-0 -left-4 -right-4 z-50
					flex flex-col flex-nowrap
					rounded
					p-0.5 min-w-full
					border border-gray-200
					bg-white dark:bg-[#0f172a] dark:border-gray-900/[0.40]
					transition
					overflow-auto
				"
			>
				<ListboxOption
					as="button"
					class="
						text-left
						block rounded
						px-3 py-2 leading-tight
						text-xs text-normal
						line-clamp-2
						list-none
						transition
						text-base
						border-none
						hover:bg-info-background-on
						hover:text-info-on
					"
					v-for="option in options"
					:value="option.text"
					@click="onOptionClick($event, option)"
				>
					{{ option.text }}
				</ListboxOption>
			</ListboxOptions>
		</div>
	</Listbox>
</template>