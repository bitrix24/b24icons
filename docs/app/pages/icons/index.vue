<script setup lang="ts">
import type { GroupRow } from '#shared/types/base'
import infoMetaData from '@bitrix24/b24icons-vue/info-metadata.json'

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
    :use-light-content="false"
  >
    <template #navbar>
      <Header show-logo-all-time />
    </template>

    <IconsList :groups="groups" />
  </B24SidebarLayout>
</template>
