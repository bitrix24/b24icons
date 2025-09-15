<script setup lang="ts">
import ComponentShowExample from '../ui/ComponentShowExample.vue'
import CopyButton from './CopyButton.vue'
import { B24Icon } from '@bitrix24/b24icons-vue'
import type { InfoIconRow } from '../../types'

defineProps<{
  icon: InfoIconRow
}>()

const emit = defineEmits<{ close: [boolean] }>()

function toUpperFirstChar(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>

<template>
  <B24Slideover
    :close="{ onClick: () => emit('close', false) }"
    :title="toUpperFirstChar(icon.code)"
    :description="[ icon.data.category, ...(icon.data?.subCategories || [  ])].join(' • ')"
    :b24ui="{ content: 'sm:max-w-3/4 lg:max-w-1/2' }"
  >
    <template #body>
      <div class="mt-2 mx-4 p-4 rounded bg-white dark:bg-base-900/20 gap-6 flex flex-col sm:flex-row items-start justify-start">
        <ComponentShowExample class="w-full sm:w-[200px] h-42">
          <div class="flex flex-col items-center gap-y-1">
            <div
              class="icon-wrapper"
              :id="icon.code.replace('::', '_')"
            >
              <B24Icon
                :name="icon.code"
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
        </ComponentShowExample>
        <div>
          <CopyButton :icon="icon" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <B24Button
          label="Close"
          color="air-tertiary"
          @click="emit('close', false)"
        />
      </div>
    </template>
  </B24Slideover>
</template>
