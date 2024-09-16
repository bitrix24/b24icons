<script setup lang="ts">
import { computed } from 'vue'
import * as B24IconsMain from "@bitrix24/icons-vue/main";
import      B24IconsMainMetaData from '@bitrix24/icons-vue/main/metadata.json';

import * as B24IconsSocial from "@bitrix24/icons-vue/social";
import      B24IconsSocialMetaData from '@bitrix24/icons-vue/social/metadata.json';

import * as B24IconsEditor from "@bitrix24/icons-vue/editor";
import      B24IconsEditorMetaData from '@bitrix24/icons-vue/editor/metadata.json';

import * as B24IconsCrm from "@bitrix24/icons-vue/crm";
import      B24IconsCrmMetaData from '@bitrix24/icons-vue/crm/metadata.json';

import * as B24IconsContactCenter from "@bitrix24/icons-vue/contact-center";
import      B24IconsContactCenterMetaData from '@bitrix24/icons-vue/contact-center/metadata.json';

import * as B24IconsActions from "@bitrix24/icons-vue/actions";
import      B24IconsActionsMetaData from '@bitrix24/icons-vue/actions/metadata.json';

import * as B24IconsButton from "@bitrix24/icons-vue/button";
import      B24IconsButtonMetaData from '@bitrix24/icons-vue/button/metadata.json';

import * as B24IconsButtonSpecialized from "@bitrix24/icons-vue/button-specialized";
import      B24IconsButtonSpecializedMetaData from '@bitrix24/icons-vue/button-specialized/metadata.json';

import * as B24IconsCommonB24 from "@bitrix24/icons-vue/common-b24";
import      B24IconsCommonB24MetaData from '@bitrix24/icons-vue/common-b24/metadata.json';

import * as B24IconsCommonService from "@bitrix24/icons-vue/common-service";
import      B24IconsCommonServiceMetaData from '@bitrix24/icons-vue/common-service/metadata.json';

const iconsGroups = {
	B24IconsMain,
	B24IconsSocial,
	B24IconsEditor,
	B24IconsCrm,
	B24IconsContactCenter,
	B24IconsActions,
	B24IconsButton,
	B24IconsButtonSpecialized,
	B24IconsCommonB24,
	B24IconsCommonService,
};

const iconsGroupsMeta = {
	B24IconsMain: B24IconsMainMetaData,
	B24IconsSocial: B24IconsSocialMetaData,
	B24IconsEditor: B24IconsEditorMetaData,
	B24IconsCrm: B24IconsCrmMetaData,
	B24IconsContactCenter: B24IconsContactCenterMetaData,
	B24IconsActions: B24IconsActionsMetaData,
	B24IconsButton: B24IconsButtonMetaData,
	B24IconsButtonSpecialized: B24IconsButtonSpecializedMetaData,
	B24IconsCommonB24: B24IconsCommonB24MetaData,
	B24IconsCommonService: B24IconsCommonServiceMetaData,
};

const getComponent = (name: string) => {
	const data = name.split('::');
	const group = (data[0] || '');
	const icon = (data[1] || '');
	
	if(
		!!iconsGroups[group]
		&& !!iconsGroups[group][icon]
	)
	{
		return iconsGroups[group][icon];
	}
	
	console.error(`Icon ${name} not exist`);
	return iconsGroups['B24IconsActions']['AgendaGapIcon'];
}

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
			v-for="(groupKey, indexGroup) in Object.keys(iconsGroups)"
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
					<div class="size-20 inline-block border border-gray-50"><component
						:is="getComponent(`${groupKey}::${index}`)"
						class="size-18"
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