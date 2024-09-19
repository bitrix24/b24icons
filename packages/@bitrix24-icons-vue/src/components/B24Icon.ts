import { h, computed, defineAsyncComponent, defineComponent } from 'vue'
import type {PropType} from "vue"
import metaData from '../metadata.json'

type IconRow = {
	code: string,
	name: string,
	type: string,
	icon: string,
}

const iconsList = metaData.list as unknown as IconRow[];
const supportIcons = iconsList.map((iconRow) => iconRow?.code || '');

/**
 * Insert name like `Main::InsertHyperlinkIcon`
 */
export let B24Icon = defineComponent({
	name: 'B24Icon',
	props: {
		class: {
			type: [String, Object, Array] as PropType<any>,
			default: () => ''
		},
		name: {
			type: String,
			required: true,
			validator: (value: string): boolean => {
				return supportIcons.includes(value.toLowerCase())
			}
		}
	},
	setup(props) {
		const dynamicComponent = computed(() => {
			let iconRow = iconsList.find((item) => item.code === props.name.toLowerCase())
			
			if(!iconRow)
			{
				console.error(`Icon [${props.name}] not supported`)
				return
			}
			
			try
			{
				return defineAsyncComponent(() => {
					return import(`../${iconRow.type}/esm/${iconRow.icon}.js`)
				})
			}
			catch(error)
			{
				console.error(`Icon [${iconRow.name}] loading error:`, error)
			}
		})
		
		return {
			dynamicComponent
		}
	},
	render() {
		return h(this.dynamicComponent, { class: this.$props.class})
	}
})