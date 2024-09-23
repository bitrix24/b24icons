<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonMenu from '../ui/ButtonMenu.vue'
import type { InfoIconRow } from '../../types'
import getIcon from '../../utils/getIcon'
import makeDownload from '../../utils/makeDownload'

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

// region Action ////
function success(message: string)
{
	isActionComplete.value = true;
	messageText.value = message
	window.setTimeout(() => {
		isActionComplete.value = false;
		messageText.value = props.icon.name
	}, 1_000)
}

function copyComponentName()
{
	const code = componentName.value
	
	navigator.clipboard.writeText(code)
	
	success(copiedText)
}

function copyJSX()
{
	const attrs = ['']
	
	const code = `<${componentName.value}${attrs.join(' ')} />`
	
	navigator.clipboard.writeText(code)
	
	success(copiedText)
}

function copyVue()
{
	const attrs = ['']
	
	attrs.push('class="w-xl h-xl"')
	
	const code = `<${componentName.value}${attrs.join(' ')} />`
	
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

function downloadSVG()
{
	const svgString = getIcon(componentName.value)
	
	makeDownload(
		`${props.icon.icon}.svg`,
		`data:image/svg+xml;base64,${btoa(svgString)}`
	)
	success(downloadText)
}


function downloadPNG()
{
	const svgString = getIcon(componentName.value)
	
	const canvas = document.createElement('canvas');
	canvas.width = 48;
	canvas.height = 48;
	const ctx = canvas.getContext("2d");
	
	const image = new Image();
	image.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
	image.onload = function()
	{
		ctx.drawImage(image, 0, 0);
		makeDownload(
			`${props.icon.icon}.png`,
			canvas.toDataURL('image/png')
		)
		success(downloadText)
	}
}
// endregion ////

const options = ref([
	{ text: 'SVG' , onClick: copySVG },
	{ text: 'Data URL' , onClick: copyDataUrl },
	{ text: 'Component Name' , onClick: copyComponentName },
	
	//{ text: 'JSX' , onClick: copyJSX },
	
	{ text: 'Vue' , onClick: copyVue },
	/*/
	{ text: 'Download SVG' , onClick: downloadSVG },
	{ text: 'Download PNG' , onClick: downloadPNG },
	//*/
]);

</script>

<template>
	<ButtonMenu
		:class="[
			isActionComplete ? 'text-accent-green' : ''
		]"
		:text="messageText"
		id="action-button"
		callOptionOnClick
		:popoverPosition="popoverPosition"
		:options="options"
	/>
</template>