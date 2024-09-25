<script setup lang="ts">
</script>

<template>
	<div class="
		relative rounded-lg overflow-hidden
		bg-gray-20 dark:bg-gray-800/25
	">
		<div
			style="background-position:10px 10px"
			class="
				absolute inset-0
				bg-grid-gray-50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]
				dark:bg-grid-gray-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]
			"
			></div>
		<div class="
			relative rounded-lg overflow-hidden
			p-8 min-h-40
			flex flex-col flex-nowrap
			justify-center items-center
		">
			<div class="flex flex-row flex-nowrap items-center justify-center">
				<slot />
			</div>
		</div>
		<div class="
			pointer-events-none
			absolute rounded-lg inset-0
			border
			border-black/5 dark:border-white/5
		"></div>
	</div>
</template>