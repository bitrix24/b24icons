<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { createRoot, type Root } from 'react-dom/client'
import React from 'react'

interface Props {
  component: React.ComponentType<any> | React.LazyExoticComponent<any>
  props?: Record<string, any>
}

const props = defineProps<Props>()

const containerRef = ref<HTMLDivElement | null>(null)
let root: Root | null = null

const renderReactComponent = () => {
  if (!containerRef.value || import.meta.server) return

  if (root) {
    root.unmount()
  }

  root = createRoot(containerRef.value)
  const Component = props.component

  root.render(React.createElement(Component, props.props || {}))
}

onMounted(() => {
  renderReactComponent()
})

onBeforeUnmount(() => {
  if (root) {
    root.unmount()
    root = null
  }
})

watch(() => props.props, () => {
  renderReactComponent()
}, { deep: true })

watch(() => props.component, () => {
  renderReactComponent()
})
</script>

<template>
  <div ref="containerRef" />
</template>
