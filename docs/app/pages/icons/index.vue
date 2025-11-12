<script setup lang="ts">
import type { GroupRow } from '#shared/types/base'
import infoMetaData from '@bitrix24/b24icons-vue/info-metadata.json'

const groups: Ref<GroupRow[]> = ref(infoMetaData.list as unknown as GroupRow[])

const title = 'Collection'
const prefix = ''
const description = 'Icons for creating Bitrix24-style applications'

useSeoMeta({
  titleTemplate: `${prefix}%s Bitrix24 Icons`,
  title,
  ogTitle: `${prefix}${title} Bitrix24 Icons`,
  description,
  ogDescription: description
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

    <IconsList :groups="groups" />
  </B24SidebarLayout>
</template>
