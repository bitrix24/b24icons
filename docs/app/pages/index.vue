<script setup lang="ts">
import { useColorMode } from '#imports'
import EncloseTextInCodeTagIcon from '@bitrix24/b24icons-vue/editor/EncloseTextInCodeTagIcon'
import InfoCircleIcon from '@bitrix24/b24icons-vue/outline/InfoCircleIcon'
import DemonstrationOnIcon from '@bitrix24/b24icons-vue/outline/DemonstrationOnIcon'
import PlayLIcon from '@bitrix24/b24icons-vue/outline/PlayLIcon'
import Bitrix24Icon from '@bitrix24/b24icons-vue/common-service/Bitrix24Icon'
import RocketIcon from '@bitrix24/b24icons-vue/outline/RocketIcon'
import DesignIcon from '@bitrix24/b24icons-vue/outline/DesignIcon'
import FavoriteIcon from '@bitrix24/b24icons-vue/outline/FavoriteIcon'
import PackageIcon from '@bitrix24/b24icons-vue/outline/PackageIcon'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '%s',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title}`,
  ogDescription: page.value.description
})

const iconFromIconName = (iconName?: string) => {
  if (!iconName) {
    return undefined
  }

  switch (iconName) {
    case 'EncloseTextInCodeTagIcon': return EncloseTextInCodeTagIcon
    case 'InfoCircleIcon': return InfoCircleIcon
    case 'DemonstrationOnIcon': return DemonstrationOnIcon
    case 'PlayLIcon': return PlayLIcon
  }

  return undefined
}

const features = [
  {
    icon: Bitrix24Icon,
    title: 'Full Bitrix24 icon set',
    description: 'The complete library of Bitrix24 SVG icons — one source for every product surface.'
  },
  {
    icon: RocketIcon,
    title: 'Tree-shakable by design',
    description: 'The B24Icon component loads icons via dynamic imports, so bundles only ship what you use.'
  },
  {
    icon: PackageIcon,
    title: 'Vue & Nuxt ready',
    description: 'First-class packages for Vue and Nuxt projects, with typed component imports.'
  },
  {
    icon: DesignIcon,
    title: 'Outline & solid styles',
    description: 'Multiple visual styles and categories to match any interface state and density.'
  },
  {
    icon: EncloseTextInCodeTagIcon,
    title: 'Fully typed',
    description: 'Every icon is a typed component — autocompletion and safety out of the box.'
  },
  {
    icon: FavoriteIcon,
    title: 'MIT licensed',
    description: 'Free and open source. Use the icons in personal and commercial projects.'
  }
]

const frameworks = [
  {
    title: 'Vue',
    description: 'Install @bitrix24/b24icons-vue and import icons as components.',
    to: '/docs/getting-started/installation/vue/'
  },
  {
    title: 'Nuxt',
    description: 'Add the @bitrix24/b24icons-nuxt module and use icons anywhere.',
    to: '/docs/getting-started/installation/nuxt/'
  }
]

const colorMode = useColorMode()
const isDark = computed(() => {
  return colorMode.value === 'dark'
})
const isMounted = ref(false)
const cardColorContext = computed(() => {
  if (import.meta.server || !isMounted.value) {
    return 'light'
  }
  return isDark.value ? 'dark' : 'light'
})

onMounted(() => {
  isMounted.value = true
})

const { mobileLinks } = useHeader()
</script>

<template>
  <B24SidebarLayout
    :use-light-content="false"
  >
    <template #sidebar>
      <B24SidebarHeader>
        <LogoWithVersion />
      </B24SidebarHeader>
      <B24SidebarBody>
        <B24NavigationMenu
          :items="mobileLinks"
          orientation="vertical"
        />
      </B24SidebarBody>
      <B24SidebarFooter>
        <B24SidebarSection>
          <ExtLinks />
        </B24SidebarSection>
      </B24SidebarFooter>
    </template>
    <template #navbar>
      <Header />
    </template>

    <B24Card
      v-if="page"
      class="mt-[22px]"
      :class="cardColorContext"
    >
      <div class="pt-[88px] h-auto lg:h-[calc(100vh-200px)] lg:pt-[12px] grid content-center lg:grid-cols-12 gap-y-[54px] lg:gap-[22px] items-center justify-between">
        <div class="col-span-12 lg:col-start-2 lg:col-span-4 flex flex-col gap-[12px] text-center lg:text-right">
          <ProseH1 class="mb-0 leading-(--ui-font-line-height-3xs)">
            <span class="text-(--ui-color-accent-main-primary)">@bitrix24/b24icons</span> <br>Bitrix24 UI-Kit
          </ProseH1>
          <ProseP>
            {{ page.hero.description }}
          </ProseP>
          <B24Separator class="my-4" type="dashed" />
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-[6px]">
            <B24Button
              v-for="link of page.hero.links"
              :key="link.label"
              v-bind="link"
              size="md"
              :icon="iconFromIconName(link?.iconName)"
            />
          </div>
        </div>
        <div class="relative col-span-12 lg:col-end-11 lg:col-span-5 mb-6 lg:mb-0">
          <HomeHeroIconsList />
        </div>
      </div>
    </B24Card>

    <B24PageSection
      v-if="page"
      title="Why b24icons"
      description="Everything you need to design applications in the Bitrix24 style."
      :b24ui="{ container: 'py-10 sm:py-14 lg:py-16 gap-0 sm:gap-0' }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <B24Card
          v-for="feature in features"
          :key="feature.title"
          :b24ui="{ root: 'h-full', body: 'p-5' }"
        >
          <component :is="feature.icon" class="size-7 text-(--ui-color-accent-main-primary) mb-3" />
          <p class="font-semibold text-label mb-1">
            {{ feature.title }}
          </p>
          <p class="text-sm text-muted">
            {{ feature.description }}
          </p>
        </B24Card>
      </div>
    </B24PageSection>

    <B24PageSection
      v-if="page"
      title="Start in your stack"
      description="Pick your framework and add Bitrix24 icons in a couple of steps."
      :b24ui="{ container: 'pt-0 pb-10 sm:pb-14 lg:pb-16 gap-0 sm:gap-0' }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="framework in frameworks"
          :key="framework.to"
          :to="framework.to"
          class="group block"
        >
          <B24Card
            :b24ui="{
              root: 'h-full transition-[transform,box-shadow] duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
              body: 'p-5'
            }"
          >
            <div class="flex items-center gap-2 mb-1">
              <component :is="PackageIcon" class="size-5 text-(--ui-color-accent-main-primary)" />
              <p class="font-semibold text-label">
                {{ framework.title }}
              </p>
            </div>
            <p class="text-sm text-muted">
              {{ framework.description }}
            </p>
          </B24Card>
        </NuxtLink>
      </div>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <B24Button
          label="Explore all icons"
          :icon="DemonstrationOnIcon"
          to="/icons/"
          color="air-primary"
          size="md"
        />
        <B24Button
          label="Get started"
          :icon="PlayLIcon"
          to="/docs/getting-started/"
          color="air-secondary-accent-2"
          size="md"
        />
      </div>
    </B24PageSection>

    <template #content-bottom>
      <Footer />
    </template>
  </B24SidebarLayout>
</template>
