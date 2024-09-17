<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type {PropType} from "vue";
import metaData from '../metadata.json'

/**
 * @todo Esm From Config
 */
let isEsm = true;

/**
 * Insert name like `Main::InsertHyperlinkIcon`
 */
const props = defineProps({
	class: {
		type: [String, Object, Array] as PropType<any>,
		default: () => ''
	},
	name: {
		type: String,
		required: true,
		validator(value: string)
		{
			return (metaData?.list || []).includes(value)
		}
	}
})

const loadComponent = computed(() => {
	const tmp = props.name.split('::');
	const iconGroup = (tmp[0] || '');
	const iconName = (tmp[1] || '');
	
	const mappingTypes = Object.fromEntries(
		(metaData?.typesName || []).map((key, index) => [key, (metaData?.types || [])[index]]),
	);
	
	try
	{
		return defineAsyncComponent(() => {
			if(isEsm)
			{
				return import(`../${mappingTypes[iconGroup]}/esm/${iconName}.js`)
			}
			
			return import(`../${mappingTypes[iconGroup]}/${iconName}.js`)
		})
	}
	catch(error)
	{
		console.error(`Error load icon ${props.name}`, error)
	}
})

</script>

<template>
	<component
		:is="loadComponent"
		:class="props.class"
	/>
</template>