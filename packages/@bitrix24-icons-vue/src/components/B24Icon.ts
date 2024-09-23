import { h, computed, defineAsyncComponent, defineComponent } from 'vue'
import type {PropType} from "vue"

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
			required: true
		}
	},
	setup(props) {
		const dynamicComponent = computed(() => {
			const tmp = props.name.split('::')
			try
			{
				return defineAsyncComponent(() => {
					return import(`../${tmp[0]?.toLowerCase()}/esm/${tmp[1]}.js`)
				})
			}
			catch(error)
			{
				console.error(`Icon [${props.name}] loading error:`, error)
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