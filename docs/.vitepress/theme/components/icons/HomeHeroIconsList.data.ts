const getRandomItem = <Item>(items: Item[]): Item =>
  items[Math.floor(Math.random() * items.length)]

export default {
  async load() {
    const list = await import('@bitrix24/b24icons-vue/metadata.json', { with: { type: 'json' } })
    const icons = (list?.default?.list || [])
      .filter(item => item.includes("::"))
      /**
       * @memo exclude icon.specialized
       */
      .filter(item => !item.includes("specialized"))
      /**
       * @memo get new icons
       */
      .filter(item => item.includes("outline::"))
    const randomIcons = Array.from({ length: 100 }, () => getRandomItem(icons))

    return {
      icons: randomIcons
    }
  }
}
