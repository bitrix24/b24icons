<script lang="ts">
export interface HeaderProps {
  showLogoAllTime?: boolean
}
</script>

<script setup lang="ts">
import useSearchInput from '../composables/useSearchInput'
import SearchInput from './ui/SearchInput.vue'
import GitHubIcon from '@bitrix24/b24icons-vue/social/GitHubIcon'
import Bitrix24Icon from '@bitrix24/b24icons-vue/common-service/Bitrix24Icon'
import TelegramIcon from '@bitrix24/b24icons-vue/outline/TelegramIcon'

const props = withDefaults(defineProps<HeaderProps>(), {
  showLogoAllTime: false
})

const config = useRuntimeConfig()

const { searchInput, searchQuery } = useSearchInput()

const isNeedChangeTarget = ref(false)
const tgLink = computed(() => {
  return (
    isNeedChangeTarget.value && (typeof window !== 'undefined' && window.navigator?.language.includes('ru'))
  )
    ? 'https://t.me/bitrix24apps'
    : 'https://t.me/b24_dev'
})

const b24DocsLink = computed(() => {
  return (
    isNeedChangeTarget.value && (typeof window !== 'undefined' && window.navigator?.language.includes('ru'))
  )
    ? 'https://apidocs.bitrix24.ru/'
    : 'https://apidocs.bitrix24.com/'
})

onMounted(() => {
  isNeedChangeTarget.value = true
})

const route = useRoute()
</script>

<template>
  <B24NavbarSection
    v-if="!route.path.startsWith('/icons')"
    class="inline-flex"
    :class="[
      props.showLogoAllTime ? '' : 'lg:hidden'
    ]"
  >
    <LogoWithVersion :no-padding="props.showLogoAllTime" />
  </B24NavbarSection>
  <B24NavbarSection
    v-if="route.path.startsWith('/icons')"
  >
    <SearchInput
      ref="searchInput"
      v-model="searchQuery"
      placeholder="Search icons ..."
      class="w-full"
    />
  </B24NavbarSection>

  <B24NavbarSpacer />

  <B24NavbarSection class="gap-1 sm:gap-3">
    <B24ColorModeButton :content="{ align: 'end', side: 'bottom' }" />
    <div class="hidden sm:flex flex-nowrap flex-row items-center justify-end gap-3">
      <B24Button
        aria-label="Bitrix24 REST API"
        :icon="Bitrix24Icon"
        :to="b24DocsLink"
        target="_blank"
        size="sm"
      />
      <B24Button
        aria-label="Bitrix24 Icons on Telegram"
        :icon="TelegramIcon"
        :to="tgLink"
        target="_blank"
        size="sm"
      />
      <B24Button
        aria-label="Bitrix24 Icons on GitHub"
        :icon="GitHubIcon"
        :to="config.public.gitUrl"
        target="_blank"
        size="sm"
      />
    </div>
  </B24NavbarSection>
</template>
