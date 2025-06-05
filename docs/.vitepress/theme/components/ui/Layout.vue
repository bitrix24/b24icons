<script setup lang="ts">
import VPLayout from 'vitepress/dist/client/theme-default/Layout.vue'
import HomeHeroIconsCard from './../icons/HomeHeroIconsList.vue'
</script>

<template>
  <B24App>
    <VPLayout>
      <template #home-hero-image>
        <HomeHeroIconsCard />
      </template>
    </VPLayout>
  </B24App>
</template>
