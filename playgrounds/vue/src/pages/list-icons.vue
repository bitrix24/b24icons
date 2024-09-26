<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { B24Icon } from "@bitrix24/b24icons-vue"
import infoMetaData from '@bitrix24/b24icons-vue/info-metadata.json'
import type { GroupRow } from '../types'

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
			</tr>
		</thead>
		<template
			v-for="(group, indexGroup) in list"
			:key="group.code"
		>
		<tbody class="sticky top-10">
			<tr>
				<td colspan="3" class="p-3 text-center bg-gray-100"><h3 class="text-h3 font-semibold">{{ group.name }}</h3></td>
			</tr>
		</tbody>
		<tbody>
			<tr
				v-for="(icon, indexIcon) in group.list"
				:key="icon.code"
				class="hover:bg-gray-20"
			>
				<td class="p-2 align-top border border-1 border-gray-100">
					<div class="flex flex-row items-center justify-center size-20 border border-gray-50 bg-white"><B24Icon
						:name="icon.code"
						class="size-16"
					/></div>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<dl class="divide-y divide-gray-100">
						<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">name</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ icon.name }}</dd>
						</div>
						<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">code</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ icon.code }}</dd>
						</div>
						<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">type</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ icon.type }}</dd>
						</div>
						<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">icon</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ icon.icon }}</dd>
						</div>
						<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">specialized</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><pre>{{ icon.specialized }}</pre></dd>
						</div>
					</dl>
				</td>
				<td class="p-2 align-top border border-1 border-gray-100">
					<ul class="list-disc list-inside">
					<template
						v-for="(subCategory, indexSubCategory) in icon.data.subCategories"
						:key="indexSubCategory"
					>
						<li>{{ subCategory }}</li>
					</template>
					</ul>
				</td>
			</tr>
		</tbody>
		</template>
	</table>
</template>