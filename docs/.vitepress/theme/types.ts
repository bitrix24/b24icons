export type IconRow = {
	code: string,
	fullCode: string,
	name: string,
	type: string,
	icon: string,
	specialized?: {
		animateSpin?: boolean,
		width?: 'auto'|'w-lg'|'w-[21px]',
		height?: 'auto'|'h-lg'|'h-[21px]',
	}
};