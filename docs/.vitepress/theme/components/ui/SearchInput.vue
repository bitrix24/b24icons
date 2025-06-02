<script setup lang="ts">
import { computed } from 'vue'
import Search2Icon from '@bitrix24/b24icons-vue/main/Search2Icon'

defineOptions({
  inheritAttrs: false
})

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <B24Input
    v-bind="$attrs"
    :icon="Search2Icon"
    placeholder="Search icons ..."
    v-model="value"
    type="search"
    name="searchInput"
    size="lg"
  />
</template>
