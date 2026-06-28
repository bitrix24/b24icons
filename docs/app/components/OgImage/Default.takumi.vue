<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  headline?: string
}>(), {
  title: 'Bitrix24 Icons',
  description: 'Bitrix24 SVG icons for web applications',
  headline: 'Bitrix24 Icons'
})
</script>

<template>
  <div class="bg-white size-full flex flex-col">
    <!-- frame -->
    <div class="absolute inset-y-0 left-26 w-[2px] bg-slate-200" />
    <div class="absolute inset-y-0 right-26 w-[2px] bg-slate-200" />
    <div class="absolute top-12 inset-x-0 h-[2px] bg-slate-200" />
    <div class="absolute bottom-26 inset-x-26 h-[2px] bg-slate-200" />
    <div class="absolute bottom-12 inset-x-0 h-[2px] bg-slate-200" />

    <!-- brand wordmark (bottom-left) -->
    <div class="absolute bottom-15 left-34 flex flex-row items-center gap-3">
      <div class="flex items-center justify-center w-[44px] h-[44px] rounded-[10px] bg-[#0d2b3e] text-white text-2xl font-bold">
        24
      </div>
      <span class="text-2xl font-semibold text-[#0d2b3e]">Bitrix24 Icons</span>
    </div>

    <!-- headline -->
    <div class="mx-26 mt-24 border-y-2 border-slate-200 h-14 flex flex-row items-center">
      <div class="h-full uppercase flex items-center text-[#2066b0] text-[20px] font-semibold px-6 pt-1">
        {{ headline }}
      </div>
    </div>

    <!-- title + description -->
    <div class="mx-34 mt-12 h-[240px] flex flex-col justify-center">
      <h1 class="text-5xl font-semibold mb-0 flex gap-1">
        <span>{{ title }}</span>
      </h1>
      <p class="text-3xl text-slate-500 overflow-hidden" style="max-height: 5.2em;">
        {{ description }}
      </p>
    </div>
  </div>
</template>
