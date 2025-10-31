<script setup lang="ts">
import infoMetaData from '@bitrix24/b24icons-vue/info-metadata.json'

/**
 * @todo move to types
 */
export type InfoIconData = {
  name?: null | string
  category: string
  subCategories: string[]
  dateFix?: null | string
}

export type InfoIconRow = {
  code: string
  name: string
  type: string
  icon: string
  specialized?: {
    animateSpin?: boolean
    animateSpinNormal?: boolean
    stroke?: 'stroke-bold' | 'stroke-normal' | 'stroke-thin'
    width?: 'auto' | 'w-lg' | 'w-[21px]'
    height?: 'auto' | 'h-lg' | 'h-[21px]'
  }
  data: InfoIconData
}

export type GroupRow = {
  code: string
  name: string
  list: InfoIconRow[]
}

const groups: Ref<GroupRow[]> = ref(infoMetaData.list as unknown as GroupRow[])

const title = ''
const prefix = ''
const suffix = ''
const description = ''

useSeoMeta({
  titleTemplate: `${prefix}%s ${suffix}- Bitrix24 Icons`,
  title,
  ogTitle: `${prefix}${title} ${suffix}- Bitrix24 Icons`,
  description,
  ogDescription: description
})
</script>

<template>
  <B24SidebarLayout
    :use-light-content="true"
  >
    <template #navbar>
      <Header show-logo-all-time />
    </template>

    <template #content-actions>
      @todo filter
    </template>

    <IconsList :groups="groups" />
  </B24SidebarLayout>
</template>
