---
title: Icons
layout: page
outline: 2
outlineTitle: Categories
sidebar: true
---

<script setup lang="ts">
import { ref } from 'vue';
import infoMetaData from '@bitrix24/b24icons-vue/info-metadata.json';
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue';
import Slideovers from '~/.vitepress/theme/components/ui/Slideovers.vue';
import List from '~/.vitepress/theme/components/icons/List.vue';
import type { GroupRow } from '~/.vitepress/theme/types';

const groups: Ref<GroupRow[]> = ref(infoMetaData.list as unknown as GroupRow[])

</script>

<div class="VPDoc content">
	<PageContainer>
		<List :groups="groups" />
	</PageContainer>
	<Slideovers />
</div>