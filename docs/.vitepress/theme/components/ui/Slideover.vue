<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WritableComputedRef } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

defineOptions({
	inheritAttrs: false
})

interface Props {
	modelValue?: boolean,
	appear?: boolean,
	side?: 'left' | 'right' | 'top' | 'bottom',
	overlay?: boolean,
	transition?: boolean,
	preventClose?: boolean,
	class?: string
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
	appear: false,
	side: 'right',
	overlay: true,
	transition: true,
	preventClose: false,
	class: '',
})

const emit = defineEmits(['update:modelValue', 'close', 'close-prevented', 'after-leave'])

const ui = ref({
	wrapper: 'fixed inset-0 flex z-50',
	overlay: {
		base: 'fixed inset-0 transition-opacity',
		background: 'bg-gray-200/75 dark:bg-gray-800/75 backdrop-blur-sm',
		transition: {
			enter: 'ease-in-out duration-500',
			enterFrom: 'opacity-0',
			enterTo: 'opacity-100',
			leave: 'ease-in-out duration-500',
			leaveFrom: 'opacity-100',
			leaveTo: 'opacity-0'
		}
	},
	base: 'relative flex-1 flex flex-col w-full focus:outline-none',
	background: 'bg-white dark:bg-[#0f172a]',
	ring: '',
	rounded: '',
	padding: '',
	shadow: 'shadow-xl',
	width: 'w-screen max-w-[600px]',
	height: 'h-screen max-h-96',
	translate: {
		base: 'translate-x-0',
		left: '-translate-x-full rtl:translate-x-full',
		right: 'translate-x-full rtl:-translate-x-full',
		top: '-translate-y-full',
		bottom: 'translate-y-full'
	},
	// Syntax for `<TransitionRoot>` component https://headlessui.com/v1/vue/transition#basic-example
	transition: {
		enter: 'transform transition ease-in-out duration-300',
		leave: 'transform transition ease-in-out duration-200'
	}
})

const isOpen: WritableComputedRef<boolean> = computed({
	get ()
	{
		return props.modelValue
	},
	set (value)
	{
		emit('update:modelValue', value)
	}
})

const onAfterLeave = () => {
	emit('after-leave')
}

function close(value: boolean)
{
	if (props.preventClose)
	{
		emit('close-prevented')
		
		return
	}
	
	isOpen.value = value
	emit('close')
}

const transitionClass = computed(() => {
	if (!props.transition) {
		return {} as typeof ui.value.transition & {
			enterFrom: string
			enterTo: string
			leaveFrom: string
			leaveTo: string
		}
	}
	
	let enterFrom: string;
	let leaveTo: string;
	
	switch (props.side) {
		case 'left':
			enterFrom = ui.value.translate.left
			leaveTo = ui.value.translate.left
			break
		case 'right':
			enterFrom = ui.value.translate.right
			leaveTo = ui.value.translate.right
			break
		case 'top':
			enterFrom = ui.value.translate.top
			leaveTo = ui.value.translate.top
			break
		case 'bottom':
			enterFrom = ui.value.translate.bottom
			leaveTo = ui.value.translate.bottom
			break
		default:
			enterFrom = ui.value.translate.right
			leaveTo = ui.value.translate.right
	}
	
	return {
		...ui.value.transition,
		enterFrom,
		enterTo: ui.value.translate.base,
		leaveFrom: ui.value.translate.base,
		leaveTo
	}
})

const sideType = computed(() => {
	switch (props.side) {
		case 'left':
			return 'horizontal'
		case 'right':
			return 'horizontal'
		case 'top':
			return 'vertical'
		case 'bottom':
			return 'vertical'
		default:
			return 'right'
	}
})

</script>

<template>
	<TransitionRoot
		as="template"
		:appear="appear"
		:show="isOpen"
		@after-leave="onAfterLeave"
	>
		<HDialog
			:class="[
				ui.wrapper,
				{ 'justify-end': side === 'right' },
				{ 'items-end': side === 'bottom' }
			]"
			v-bind="$attrs"
			@close="close"
		>
			<TransitionChild
				v-if="overlay"
				as="template"
				:appear="appear"
				v-bind="ui.overlay.transition"
				:class="ui.overlay.transition.enterFrom"
			>
				<div :class="[ui.overlay.base, ui.overlay.background]"></div>
			</TransitionChild>
			
			<TransitionChild
				as="template"
				:appear="appear"
				v-bind="transitionClass"
				:class="transitionClass.enterFrom"
			>
				<HDialogPanel
					:class="[
						ui.base,
						sideType === 'horizontal'
							? [ui.width, 'h-full']
							: [ui.height, 'w-full'],
						ui.background,
						ui.ring,
						ui.rounded,
						ui.padding,
						ui.shadow
					]">
					<slot />
				</HDialogPanel>
			</TransitionChild>
		</HDialog>
	</TransitionRoot>
</template>