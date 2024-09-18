<script setup lang="ts">
import { ref } from 'vue'
import { B24Icon } from "@bitrix24/icons-vue/components/B24Icon"
import QrIcon from "@bitrix24/icons-vue/button/QrIcon"
import metaData from '@bitrix24/icons-vue/metadata.json'
import B24IconsMainMetaData from '@bitrix24/icons-vue/main/metadata.json'
import B24IconsSocialMetaData from '@bitrix24/icons-vue/social/metadata.json'
import B24IconsEditorMetaData from '@bitrix24/icons-vue/editor/metadata.json'
import B24IconsCrmMetaData from '@bitrix24/icons-vue/crm/metadata.json'
import B24IconsContactCenterMetaData from '@bitrix24/icons-vue/contact-center/metadata.json'
import B24IconsActionsMetaData from '@bitrix24/icons-vue/actions/metadata.json'
import B24IconsButtonMetaData from '@bitrix24/icons-vue/button/metadata.json'
import B24IconsButtonSpecializedMetaData from '@bitrix24/icons-vue/button-specialized/metadata.json'
import B24IconsCommonB24MetaData from '@bitrix24/icons-vue/common-b24/metadata.json'
import B24IconsCommonServiceMetaData from '@bitrix24/icons-vue/common-service/metadata.json'

const iconsGroupsMeta = {
	Main: B24IconsMainMetaData,
	Social: B24IconsSocialMetaData,
	Editor: B24IconsEditorMetaData,
	Crm: B24IconsCrmMetaData,
	ContactCenter: B24IconsContactCenterMetaData,
	Actions: B24IconsActionsMetaData,
	Button: B24IconsButtonMetaData,
	ButtonSpecialized: B24IconsButtonSpecializedMetaData,
	CommonB24: B24IconsCommonB24MetaData,
	CommonService: B24IconsCommonServiceMetaData,
};

const list = ref(metaData?.typesName || []);

console.log(import.meta);
</script>

<template>
	<h1 class="text-h1 mb-sm flex whitespace-pre-wrap">List Icons</h1>
	
	<table class="w-full">
		<thead>
			<tr>
				<th class="p-2 align-top border border-2 border-gray-300">Icon</th>
				<th class="p-2 align-top border border-2 border-gray-300">Name</th>
				<th class="p-2 align-top border border-2 border-gray-300">Sub Categories</th>
				<th class="p-2 align-top border border-2 border-gray-300">Labels</th>
			</tr>
		</thead>
		<template
			v-for="(groupKey, indexGroup) in list"
			:key="indexGroup"
		>
		<tbody>
			<tr>
				<td colspan="4"><h3 class="text-h3">{{ groupKey }}</h3></td>
			</tr>
		</tbody>
		<tbody>
			<tr
				v-for="(row, index) in iconsGroupsMeta[groupKey].icons"
				:key="index"
			>
				<td class="p-2 align-top border border-1 border-gray-100">
					<div class="flex flex-row items-center justify-center size-20 border border-gray-50"><B24Icon
						:name="`${groupKey}::${index}`"
						class="size-16"
					/></div>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					{{ index }} <br>
					{{ row.category }}
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<template
						v-for="(subCategory, indexSubCategory) in row.subCategories"
						:key="indexSubCategory"
					>
						<div>{{ subCategory }}</div>
					</template>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<template
						v-for="(label, indexLabel) in row.labels"
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