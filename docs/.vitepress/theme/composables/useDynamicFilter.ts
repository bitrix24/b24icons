import Fuse from 'fuse.js';
import { shallowRef, computed, Ref, watch } from 'vue';

function useDynamicFilter<T>(
	filterText: Ref<string>,
	items: Ref<T[]>,
	attributes: Fuse.FuseOptionKeyObject<T>[] = [],
	config: Fuse.IFuseOptions<T> = {}
) {
	const searchEngine = shallowRef(
		new Fuse(items.value, {
			threshold: 0.2,
			keys: attributes,
			...config,
		})
	);
	
	const filteredItems = computed(() => {
		if (filterText.value) {
			return searchEngine.value.search(filterText.value).map((res) => res.item);
		}
		
		if (attributes.length > 0) {
			const primaryAttribute = attributes[0].name;
			
			return items.value.slice().sort((first, second) => {
				const firstStr = first[primaryAttribute as keyof T] as string;
				const secondStr = second[primaryAttribute as keyof T] as string;
				return firstStr.localeCompare(secondStr);
			});
		}
		
		return items.value;
	});
	
	return filteredItems;
}

export default useDynamicFilter;