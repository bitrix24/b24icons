<script setup lang="ts">
import NewMessageIcon from '@bitrix24/b24icons-vue/outline/NewMessageIcon'
</script>

<template>
  <B24Banner
    id="new-icons-banner"
    title="New solid icons!"
    to="/icons/?search=solid"
    :icon="NewMessageIcon"
    close
    color="air-primary-copilot"
    class="light"
  />
</template>
