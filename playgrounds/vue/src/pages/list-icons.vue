<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { B24Icon } from "@bitrix24/icons-vue/components/B24Icon"
import infoMetaData from '@bitrix24/icons-vue/info-metadata.json'

type IconDataLabel = {
	description: string,
	score: number
}

type IconData = {
	category: string,
	subCategories: string[],
	labels: IconDataLabel[]
}

type IconRow = {
	code: string,
	name: string,
	type: string,
	icon: string,
	data: IconData
}

type GroupRow = {
	code: string,
	name: string,
	list: IconRow[]
}

const list: Ref<GroupRow[]> = ref(infoMetaData?.list || []);
</script>

<template>
	<h1 class="text-h1 mb-sm flex whitespace-pre-wrap">List Icons</h1>
	
	<table class="w-full">
		<thead class="sticky top-0">
			<tr>
				<th class="p-2 align-top border-1 border-gray-100 bg-gray-350 text-base-master">Icon</th>
				<th class="p-2 align-top border-1 border-gray-100 bg-gray-350 text-base-master">Name</th>
				<th class="p-2 align-top border-1 border-gray-100 bg-gray-350 text-base-master">Sub Categories</th>
				<th class="p-2 align-top border-1 border-gray-100 bg-gray-350 text-base-master">Labels</th>
			</tr>
		</thead>
		<template
			v-for="(group, indexGroup) in list"
			:key="group.code"
		>
		<tbody>
			<tr>
				<td colspan="4" class="p-3 text-center"><h3 class="text-h3 font-semibold">{{ group.name }}</h3></td>
			</tr>
		</tbody>
		<tbody>
			<tr
				v-for="(icon, indexIcon) in group.list"
				:key="icon.code"
				class="hover:bg-gray-150"
			>
				<td class="p-2 align-top border border-1 border-gray-100">
					<div class="flex flex-row items-center justify-center size-20 border border-gray-50 shadow-2xl bg-white"><B24Icon
						:name="icon.name"
						class="size-16"
					/></div>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					{{ icon.name }}
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<template
						v-for="(subCategory, indexSubCategory) in icon.data.subCategories"
						:key="indexSubCategory"
					>
						<div>{{ subCategory }}</div>
					</template>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<template
						v-for="(label, indexLabel) in icon.data.labels"
						:key="indexLabel"
					>
						<div>{{ label.description }} <small>[ {{ label.score.toFixed(2) }} ]</small></div>
					</template>
				</td>
			</tr>
		</tbody>
		</template>
	</table>
</template>