import { h, computed, defineAsyncComponent, defineComponent } from 'vue'
import type {PropType} from "vue"
import metaData from '../metadata.json'

//import AnotherComponent from './AnotherComponent.js';

/**
 * Insert name like `Main::InsertHyperlinkIcon`
 */
export const B24Icon = defineComponent({
	name: 'B24Icon',
	props: {
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
	},
	setup(props) {
		const dynamicComponent = computed(() => {
			const tmp = props.name.split('::');
			const iconGroup = (tmp[0] || '');
			const iconName = (tmp[1] || '');
			
			const mappingTypes = Object.fromEntries(
				(metaData?.typesName || []).map((key, index) => [key, (metaData?.types || [])[index]]),
			);
			
			try
			{
				return defineAsyncComponent(() => {
					return import(`../${mappingTypes[iconGroup]}/esm/${iconName}.js`)
				})
			}
			catch(error)
			{
				console.error(`Error load icon ${props.name}`, error)
			}
		})
		
		return {
			dynamicComponent
		};
	},
	render() {
		return h(this.dynamicComponent, { class: this.$props.class});
	}
})