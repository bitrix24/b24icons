---
layout: page
outline: 2
outlineTitle: Categories
sidebar: true
head:
  - - link
    - rel: canonical
      content: https://bitrix24.github.io/b24icons/icons/
---

<script setup lang="ts">
import { ref } from 'vue';
import metaData from '@bitrix24/icons-vue/metadata.json';
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue';
import List from '~/.vitepress/theme/components/icons/List.vue';
import type { IconRow } from '~/.vitepress/theme/types';

const list: Ref<IconRow[]> = ref(metaData.list as unknown as IconRow[]);

</script>

<div class="VPDoc content">
	<PageContainer>
		<List :icons="list" />
	</PageContainer>
</div>