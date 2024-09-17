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

<script setup>
import { computed, ref } from 'vue'
import metaData from '~/.vitepress/../../vue/metadata.json'
import B24Icon from '@bitrix24/icons-vue/components/B24Icon.vue'
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue'

const showIcons = 24;

// @todo remove this ////
const list = ref((metaData?.list || []).slice(0, showIcons));

const shuffleItems = () => {
	let data = metaData?.list || [];
	data = shuffle(data);
	list.value = data.slice(0, showIcons);
}

const shuffle = (array) => { 
	for (let i = array.length - 1; i > 0; i--) { 
		const j = Math.floor(Math.random() * (i + 1)); 
		[array[i], array[j]] = [array[j], array[i]]; 
	} 
	return array; 
}
</script>

<div class="VPDoc content">
	<PageContainer>
		<div class="mb-4"><a href="icon">Icon page</a></div>
		<button class="mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200" @click="shuffleItems">shuffleItems</button>
		<div
			class="grid grid-cols-6 gap-4"
		>
			<div
				v-for="(icon, index) in list"
				:key="icon"
				class="flex flex-row items-center justify-center size-20 inline-block border border-gray-50"
			>
				<B24Icon
					:name="icon"
					class="size-16"
				/>
			</div>
		</div>
	</PageContainer>
</div>