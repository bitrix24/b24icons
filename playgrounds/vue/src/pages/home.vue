<script setup lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
//import { B24Icon } from "@bitrix24/icons-vue/components/B24Icon"
import QrIcon from "@bitrix24/icons-vue/button/QrIcon"

let Examples = defineComponent({
	props: ['routes'],
	setup: (props, { slots }) => () => slots.default({ routes: props.routes, slots }),
})

let router = useRouter()
let routes = router
	.getRoutes()
	.filter((example) => example.path !== '/')
	.filter((route) => route.meta.isRoot)
</script>

<template>
	<h1 class="text-h1 mb-xs flex whitespace-pre-wrap">Examples</h1>
	<div class="prose">
		<div tmp="B24Icon" name="Button::QrIcon" ></div>
		<QrIcon />
		<Examples :routes="routes" v-slot="{ routes, slots }">
			<ul>
				<li v-for="{ children, meta, path } in routes">
					<template v-if="children.length > 0">
						<h3 class="text-xl">{{ meta.name }}</h3>
						<component v-for="vnode in slots.default({ routes: children, slots })" :is="vnode" />
					</template>
					<template v-else>
						<router-link :key="path" :to="path" class="font-normal">
							{{ meta.name }}
						</router-link>
					</template>
				</li>
			</ul>
		</Examples>
	</div>
</template>