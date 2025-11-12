export default {
  plugins: [
    'preset-default',
    'removeDimensions',
    'sortAttrs',
    'cleanupListOfValues',
    {
      name: 'prefixIds',
      params: {
        prefix: (_svg, info) => {
          const normalizedPath = info.path.replace(/\\/g, '/')
          const pathParts = normalizedPath.split('/')
          const lastParts = pathParts.slice(-2)
          return lastParts
            .map(part => part.replace('.svg', ''))
            .join('_')
            .replace(/[^\w-]/g, '_')
        },
        prefixSeparator: '_'
      }
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            'fill': 'currentColor',
            'aria-hidden': 'true',
            'data-slot': 'icon'
          }
        ]
      }
    }
  ]
}
