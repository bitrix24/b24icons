<script setup lang="ts">
import type { InfoIconRow } from '#shared/types/base'
import { B24Icon } from '@bitrix24/b24icons-vue'
import IconSlideover from './IconSlideover.vue'

const props = defineProps<{
  icon: InfoIconRow
}>()

const overlay = useOverlay()
const slideOver = overlay.create(IconSlideover, {})

function openSlideOver() {
  slideOver.open({
    icon: props.icon
  })
}
</script>

<template>
  <B24PageCard
    class="group/block mb-[24px] min-w-[220px] cursor-pointer"
    :title="icon.name"
    reverse
    @click="openSlideOver"
  >
    <div class="h-[100px] flex items-center justify-center">
      <KeepAlive>
        <B24Icon
          :name="icon.code"
          class="size-[100px]"
          :class="[
            icon.specialized?.animateSpin ? 'animate-spin-slow' : '',
            icon.specialized?.animateSpinNormal ? 'animate-spin' : '',
            icon.specialized?.stroke === 'stroke-bold' ? 'stroke-[6px]' : '',
            icon.specialized?.stroke === 'stroke-normal' ? 'stroke-2' : '',
            icon.specialized?.stroke === 'stroke-thin' ? 'stroke-1' : '',

            icon.specialized?.width === 'w-lg' ? 'w-lg' : '',
            icon.specialized?.height === 'h-lg' ? 'h-lg' : '',

            icon.specialized?.width === 'w-[21px]' ? 'w-[21px]' : '',
            icon.specialized?.height === 'h-[21px]' ? 'h-[21px]' : ''
          ]"
        />
      </KeepAlive>
    </div>
  </B24PageCard>
</template>
