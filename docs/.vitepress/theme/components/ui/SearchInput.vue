<script setup lang="ts">
import { computed, ref } from 'vue'
import { B24Icon } from "@bitrix24/b24icons-vue";

defineOptions({
	inheritAttrs: false
})

interface Props {
	modelValue: string
}

const props = defineProps<Props>()
const input = ref()
const emit = defineEmits(['update:modelValue'])

defineExpose({
	focus: () => {
		input.value.focus()
	}
})

const value = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

</script>

<template>
	<div
		v-bind="$attrs"
		class="
			relative w-full rounded
			bg-gray-30 dark:bg-[#0f172a]
			text-base-master dark:text-gray-200
		"
	>
		<B24Icon
			name="Main::Search2Icon"
			class="absolute size-8 z-10 top-3 left-3 pointer-events-none dark:text-gray-200"
		/>
		<input
			name="searchInput"
			ref="searchInput"
			type="search"
			v-model="value"
			placeholder="Search icons ..."
			class="
				relative rounded w-full h-14
				pl-12 py-2 pr-4
				justify-start
				text-lg
				placeholder:text-base-500
				border
				hover:border-info
				active:border-info-background-on
				focus-visible:border-info-background-on
			"
		/>
	</div>
</template>