<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonMenu from '../ui/ButtonMenu.vue'
import type { InfoIconRow } from '../../types'
import getIcon from '../../utils/getIcon'

const props = defineProps<{
	icon: InfoIconRow,
	popoverPosition?: 'top'|'bottom'
}>()

const downloadText = 'Download!'
const copiedText = 'Copied!'

const messageText = ref(props.icon.name)
const isActionComplete = ref(false)

const componentName = computed(() =>
{
	return props.icon.code
})

function toUpperFirstChar(value)
{
	return value.charAt(0).toUpperCase() + value.slice(1)
}

// region Action ////
function success(message: string)
{
	isActionComplete.value = true;
	window.setTimeout(() => {
		isActionComplete.value = false;
	}, 1_000)
}

function copyComponentName()
{
	const code = [
		`#type#::#icon#`
	].join("\n")
		.replaceAll('#icon#', props.icon.icon)
		.replaceAll('#type#', toUpperFirstChar(props.icon.type))
	
	navigator.clipboard.writeText(code)
	
	success(copiedText)
}

function copyVue()
{
	const attrs = ['']
	
	attrs.push('class="w-xl h-xl"')
	
	const code = [
		//`import #icon# from '@bitrix24/b24icons-vue/#type#/#icon#'`,
		`<#icon#${attrs.join(' ')} />`
	].join("\n")
	.replaceAll('#icon#', props.icon.icon)
	.replaceAll('#type#', props.icon.type)
	
	navigator.clipboard.writeText(code)
	
	success(copiedText)
}

function copySVG()
{
	const svgString = getIcon(componentName.value)
	
	navigator.clipboard.writeText(svgString)
	
	success(copiedText)
}

function copyDataUrl()
{
	const svgString = getIcon(componentName.value)
	
	// Create SVG data url
	const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`
	navigator.clipboard.writeText(dataUrl)
	
	success(copiedText)
}

// endregion ////

const options = ref([
	{ text: 'Copy SVG' , onClick: copySVG },
	{ text: 'Copy Data URL' , onClick: copyDataUrl },
	{ text: 'Copy Component Name' , onClick: copyComponentName },
	{ text: 'Copy Vue' , onClick: copyVue },
]);

</script>

<template>
	<ButtonMenu
		:class="[
			isActionComplete ? 'text-accent-green' : ''
		]"
		id="action-button"
		callOptionOnClick
		:popoverPosition="popoverPosition"
		:options="options"
	/>
</template>