import type { Component } from 'vue'

export type InfoIconData = {
	name?: null|string,
	category: string,
	subCategories: string[],
	dateFix?: null|string,
}

export type InfoIconRow = {
	code: string,
	name: string,
	type: string,
	icon: string,
	specialized?: {
		animateSpin?: boolean,
		animateSpinNormal?: boolean,
		stroke?: 'stroke-bold'|'stroke-normal'|'stroke-thin',
		width?: 'auto'|'w-lg'|'w-[21px]',
		height?: 'auto'|'h-lg'|'h-[21px]',
	},
	data: InfoIconData
}

export type GroupRow = {
	code: string,
	name: string,
	list: InfoIconRow[]
}

export type ComponentProps<T> =
	T extends new () => { $props: infer P } ? NonNullable<P> :
		T extends (props: infer P, ...args: any) => any ? P :
			{}

export type ComponentSlots<T> =
	T extends new () => { $slots: infer S } ? NonNullable<S> :
		T extends (props: any, ctx: { slots: infer S; attrs: any; emit: any }, ...args: any) => any ? NonNullable<S> :
			{}

export type ComponentEmit<T> =
	T extends new () => { $emit: infer E } ? NonNullable<E> :
		T extends (props: any, ctx: { slots: any; attrs: any; emit: infer E }, ...args: any) => any ? NonNullable<E> :
			{}

export interface Slideover {
	ui?: any
	side?: 'right' | 'left'
	transition?: boolean
	appear?: boolean
	overlay?: boolean
	preventClose?: boolean
	modelValue?: boolean
}

export interface SlideoverState {
	component: Component | string
	props: Slideover
}