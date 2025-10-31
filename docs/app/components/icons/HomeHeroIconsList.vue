<script setup lang="ts">
import { ref, onMounted, shallowRef, onBeforeUnmount} from 'vue';
import { data } from './HomeHeroIconsList.data'
import { random } from 'lodash-es'
import { B24Icon } from '@bitrix24/b24icons-vue'

const time = 1000
const maxItems = data.icons.length
const maxItemsToShow = 40
const intervalTime = shallowRef()

const getInitialItems = () => data.icons.slice(0, maxItemsToShow)
const items = ref(getInitialItems())

function getRandomNewIcon() {
  const randomIndex = random(0, maxItems - 1)
  const newRandomIcon = data.icons[randomIndex]

  if (items.value.some((item) => item === newRandomIcon)) {
    return getRandomNewIcon()
  }

  return newRandomIcon
}

function isMark() {
  return random(0, 100) > 90
}

function insert() {
  const replaceIndex = random(0, maxItemsToShow - 1)
  items.value[replaceIndex] = getRandomNewIcon()
}

function startInterval() {
  if (Number.parseInt(intervalTime.value) > 0) {
    return
  }
  console.log('>> start randomize icons')
  intervalTime.value = setInterval(() => {
    insert()
    insert()
    insert()
  }, time)
}

function stopInterval() {
  clearInterval(intervalTime.value)
  intervalTime.value = 0
}

onMounted(() => {
  window.addEventListener('mousemove', startInterval, { once: true })
  if( document.visibilityState !== "hidden" ) {
    startInterval()
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopInterval()
      console.log('>> stop randomize icons: visibilitychange')
    } else {
      startInterval()
    }
  })
})

onBeforeUnmount(() => {
  stopInterval()
  console.log('>> stop randomize icons: onBeforeUnmount')
})
</script>

<template>
  <div class="mx-auto mt-4 md:mt-12 lg:mt-24">
    <div class="mx-auto relative w-full h-full max-w-[560px] max-h-[220px]">
      <div class=" grid gap-4 grid-cols-[repeat(auto-fill,minmax(38px,1fr))] grid-rows-[repeat(auto-fill,minmax(38px,1fr))] w-full h-full max-h-[196px] relative overflow-hidden">
        <div
          v-for="(icon, iconIndex) in items"
          :key="iconIndex"
          class="inline-flex justify-center items-center"
        >
          <B24Icon
            :name="icon"
            class="size-8 "
            :class="[
              isMark() ? 'text-ai-700 dark:text-blue-450' : 'text-base-master dark:text-base-200'
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
