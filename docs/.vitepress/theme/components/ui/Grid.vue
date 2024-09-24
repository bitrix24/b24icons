<script setup lang="ts">
import IconView from "../icons/IconView.vue";
import type { InfoIconRow } from '../../types'

defineProps<{
	icons: InfoIconRow[]
}>()

</script>

<template>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6">
		<template
			v-for="icon in icons"
			:key="icon.code"
		>
			<IconView
				:icon="icon"
			/>
		</template>
	</div>
</template>