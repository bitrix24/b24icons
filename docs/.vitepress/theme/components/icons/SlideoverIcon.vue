<script setup lang="ts">
import Example from '../ui/Example.vue'
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

function toUpperFirstChar(value: string): string
{
	return value.charAt(0).toUpperCase() + value.slice(1)
}

</script>
<template>
	<Slideover>
		<div class="text-base-900 dark:text-base-300 pt-4 px-6 flex flex-col w-full gap-2 divide-y divide-gray-200">
			<div class="w-full flex flex-row items-center justify-between">
				<div class="text-h1">
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
					<Example class="w-full sm:w-[200px] h-42">
						<div class="flex flex-col items-center gap-y-1">
							<div
								class="icon-wrapper"
								:id="icon.code.replace('::', '_')"
							>
								<B24Icon
									:name="props.icon.code"
									class="size-24 text-base-master dark:text-base-200"
									:class="[
										icon.specialized?.animateSpin ? 'animate-spin-slow' : '',
										icon.specialized?.animateSpinNormal ? 'animate-spin' : '',
										icon.specialized?.stroke === 'stroke-bold' ? 'stroke-[6px]' : '',
										icon.specialized?.stroke === 'stroke-normal' ? 'stroke-2' : '',
										icon.specialized?.stroke === 'stroke-thin' ? 'stroke-1' : '',
										
										icon.specialized?.width === 'w-lg' ? 'w-lg' : '',
										icon.specialized?.height === 'h-lg' ? 'h-lg' : '',
										
										icon.specialized?.width === 'w-[21px]' ? 'w-[21px]' : '',
										icon.specialized?.height === 'h-[21px]' ? 'h-[21px]' : '',
									]"
								/>
							</div>
						</div>
					</Example>
					<div>
						<div class="mb-4 text-h3">
							{{ toUpperFirstChar(props.icon.code) }}
						</div>
						<!--div class="mb-4 text-h6">
							{{ props.icon.data.subCategories.join(' • ') }}
						</div-->
						<CopyButton :icon="props.icon" popover-position="bottom" />
					</div>
				</div>
			</div>
		</div>
	</Slideover>
</template>