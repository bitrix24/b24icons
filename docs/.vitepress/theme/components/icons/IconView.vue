<script setup lang="ts">
import { B24Icon } from "@bitrix24/b24icons-vue";
import { useSlideover } from "../../composables/useSlideover";
import SlideoverIcon from "./SlideoverIcon.vue";
import type {InfoIconRow} from "../../types";

const props = defineProps<{
	icon: InfoIconRow
}>()

const slideover = useSlideover()

function openSlideover ()
{
	slideover.open(SlideoverIcon, {
		icon: props.icon,
		onClose: slideover.close
	})
}
</script>

<template>
	<button
		class="group/block outline-none"
		@click="openSlideover"
	>
		<div class="
			relative h-[115px] w-full rounded-lg
			border border-base-100
			ring-none ring-offset-2 ring-info-background-on ring-offset-white
			group-hover/block:border-info
			group-focus-within/block:ring
			dark:group-focus/block:ring-offset-[#0f172a]
			group-focus/block:border-0
		">
			<div class="
				absolute z-10 inset-0
				flex h-full w-full items-center justify-center
				icon-wrapper
				text-base-900
				dark:text-base-300
			">
				<KeepAlive>
					<B24Icon
						:name="icon.code"
						class="size-14"
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
				</KeepAlive>
			</div>
		</div>
		<p class="
			mt-1 h-10 truncate text-center text-[0.8125rem] leading-5
			text-base-500
			group-focus/block:line-clamp-2
			group-focus/block:whitespace-normal
			group-hover/block:line-clamp-2
			group-hover/block:whitespace-normal
		">{{ icon.name }}</p>
	</button>
</template>