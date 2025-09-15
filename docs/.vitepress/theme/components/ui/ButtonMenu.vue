<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import ChevronDownIcon from '@bitrix24/b24icons-vue/actions/ChevronDownIcon'


interface Props {
  options: {
    label: string
    action?: () => void
  }[],
  callOptionOnClick?: boolean
  buttonColor?: string
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  callOptionOnClick: false,
  popoverPosition: 'bottom'
})

const emit = defineEmits(['click', 'optionClick'])

const selectedOption = useStorage(props.id, props.options[0].label)
const selectionOptionAction = computed(() => props.options.find(option => option.label === selectedOption.value).action)

const optionsAction = computed(() => props.options.map((option) => {
  return {
    label: option.label,
    onSelect: () => {
      selectedOption.value = option.label
      option.action()
    }
  }
}))

function onClick(event) {
  selectionOptionAction.value()
  emit('click', event)
}
</script>

<template>
  <B24ButtonGroup>
    <B24Button :color="buttonColor" :label="selectedOption" normal-case @click="onClick" />
    <B24DropdownMenu
      :items="optionsAction"
    >
      <B24Button color="air-secondary-accent-2" :icon="ChevronDownIcon" />
    </B24DropdownMenu>
  </B24ButtonGroup>
</template>
