<script setup lang="ts">
import Slideover from '../ui/Slideover.vue'
import { B24Icon } from "@bitrix24/b24icons-vue";
import type {InfoIconRow} from "../../types";
import CopyButton from './CopyButton.vue'

const props = defineProps<{
	icon: InfoIconRow
}>()

const emits = defineEmits<{
	close: [];
}>()

function toUpperFirstChar(value)
{
	return value.charAt(0).toUpperCase() + value.slice(1)
}

</script>
<template>
	<Slideover>
		<div class="pt-4 px-6 flex flex-col w-full gap-2 divide-y divide-gray-200">
			<div class="w-full flex flex-row items-center justify-between">
				<div class="text-h1 text-gray-900 dark:text-white">
					{{ props.icon.name }}
				</div>
				<button class="w-10 h-10" @click="emits('close')">
					<B24Icon
						name="Actions::Cross45Icon"
						class="pointer-events-none text-gray-800 dark:text-gray-200"
					/>
				</button>
			</div>
			<div class="pt-6 h-full">
				<div class="gap-6 flex flex-col sm:flex-row items-start justify-start">
					<div class="icon-wrapper w-full sm:w-[200px] h-32 flex justify-center items-center rounded border border-base-300" :id="icon.code.replace('::', '_')">
						<B24Icon
							:name="props.icon.code"
							class="size-14"
							:class="[
								icon.specialized?.animateSpin ? 'animate-spin-slow' : '',
								
								icon.specialized?.width === 'w-lg' ? 'w-lg' : '',
								icon.specialized?.height === 'h-lg' ? 'h-lg' : '',
								
								icon.specialized?.width === 'w-[21px]' ? 'w-[21px]' : '',
								icon.specialized?.height === 'h-[21px]' ? 'h-[21px]' : '',
							]"
						/>
					</div>
					<div>
						<div class="mb-4 text-h3 text-gray-900 dark:text-white">
							{{ toUpperFirstChar(props.icon.code) }}
						</div>
						<div class="mb-4 text-h6 text-gray-900 dark:text-white">
							{{ props.icon.data.subCategories.join(' • ') }}
						</div>
						<CopyButton :icon="props.icon" popover-position="bottom" />
					</div>
				</div>
			</div>
		</div>
	</Slideover>
</template>