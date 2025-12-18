import fs from 'node:fs/promises'
import camelcase from 'camelcase'
import { rimraf } from 'rimraf'
import { transform as transformSvgr } from '@svgr/core'
import * as babel from '@babel/core'
import { compile as compileVue } from '@vue/compiler-dom'
import { dirname } from 'node:path'
import { deprecated } from './deprecated.js'
import { typeList } from './type-list.js'

let transform = {
  '@bitrix24-icons-react': async (svg, componentName, format, isDeprecated) => {
    const codeBlocks = []
    let blockIndex = 0

    let svgWithoutStyle = svg.replace(/<style>[\s\S]*<\/style>/g, (match) => {
      codeBlocks.push(match)
      return `<path data-info="__CODE_BLOCK_${blockIndex++}__"></path>`
    })

    svgWithoutStyle = svgWithoutStyle.replaceAll('xml:space', 'xmlSpace')

    let component = await transformSvgr(
      svgWithoutStyle,
      {
        ref: true,
        titleProp: true
      },
      { componentName }
    )

    let { code } = await babel.transformAsync(
      component,
      {
        plugins: [
          [
            (await import('@babel/plugin-transform-react-jsx')).default,
            {
              useBuiltIns: true,
              NumberIdentifier: false
            }
          ]
        ]
      }
    )

    // Add a deprecation warning to the component
    if (isDeprecated) {
      /** @type {string[]} */
      let lines = code.split('\n')
      lines.splice(1, 0, `/** @deprecated */`)
      code = lines.join('\n')
    }

    /**
     * @memo let's bring back the tag <style>
     */
    code = code.replaceAll('xmlSpace', 'xml:space')
    code.replace(/<path data-info="__CODE_BLOCK_(\d+)__"><\/path>/g, (_, index) => {
      return codeBlocks[Number.parseInt(index)] || ''
    })

    if (format === 'esm') {
      return code
    }

    return code
      .replace(
        'import * as React from "react"',
        'const React = require("react")'
      )
      .replace(
        'export default',
        'module.exports ='
      )
  },
  '@bitrix24-icons-vue': (svg, componentName, format, isDeprecated) => {
    let isHasTagStyle = false
    if (svg.search('<style>') !== -1) {
      /**
       * let's encode the tag <style>
       */
      isHasTagStyle = true
      console.warn(`ⓘ component [ ${componentName} ] svg has tag [style]`)
      svg = svg.replaceAll('<style>', '<main>').replaceAll('</style>', '</main>')
    }

    let { code } = compileVue(
      svg,
      {
        mode: 'module'
      }
    )

    /**
     * @memo Add a deprecation warning to the component
     */
    if (isDeprecated) {
      /** @type {string[]} */
      let lines = code.split('\n')
      lines.splice(2, 0, `/** @deprecated */`)
      code = lines.join('\n')
    }

    /**
     * @memo let's bring back the tag <style>
     */
    if (isHasTagStyle) {
      code = code.replace('main', 'style')
    }

    if (format === 'esm') {
      return code.replace(
        'export function',
        'export default function'
      )
    }

    return code
      .replace(
        /import\s+\{([^}]+)\}\s+from\s+(['"])(.*?)\2/,
        (_match, imports, _quote, mod) => {
          let newImports = imports
            .split(',')
            .map(i => i.trim().replace(/\s+as\s+/, ': '))
            .join(', ')

          return `const { ${newImports} } = require("${mod}")`
        }
      )
      .replace(
        'export function render',
        'module.exports = function render'
      )
  }
}

function toUpperFirstChar(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function prepareIconName(type, fileName) {
  let componentName = camelcase(
    fileName.replace(/\.svg$/, '')
      // .replaceAll('-', '')
      .replaceAll(' ', '')
      .replaceAll('(', '').replaceAll(')', '')
      .replaceAll('[', '').replaceAll(']', '')
      .replaceAll('{', '').replaceAll('}', ''),
    {
      pascalCase: true
    }
  )

  /**
   * @memo clear component name
   */
  componentName = componentName
    .replace('Ui', '')
    .replace('White', '').replace('Black', '')
    .replace('Light', '').replace('Dark', '')

  if (type === 'common-service') {
    componentName = componentName.replace('Service', '')
  }

  componentName = toUpperFirstChar(componentName)

  return `${componentName}Icon`
}

async function getIcons(type) {
  let files = await fs.readdir(`./optimized/${type}`)
  return Promise.all(
    files.map(async (file) => {
      return {
        svg: await fs.readFile(`./optimized/${type}/${file}`, 'utf8'),
        componentName: prepareIconName(type, file),
        isDeprecated: deprecated.includes(file)
      }
    })
  )
}

function exportAll(
  icons,
  format,
  includeExtension = true
) {
  return icons
    .map(({ componentName }) => {
      let extension = includeExtension ? '.js' : ''
      if (format === 'esm') {
        return `export { default as ${componentName} } from './${componentName}${extension}'`
      }
      return `module.exports.${componentName} = require("./${componentName}${extension}")`
    })
    .join('\n')
}

/**
 * @param {string} file
 * @param {string} text
 * @returns {Promise<void>}
 */
async function ensureWrite(
  file,
  text
) {
  await fs.mkdir(dirname(file), { recursive: true })
  await fs.writeFile(file, text, 'utf8')
}

/**
 * @param {string} file
 * @param {{}} json
 * @param {boolean} isMinify
 * @returns {Promise<void>}
 */
async function ensureWriteJson(
  file,
  json,
  isMinify = false
) {
  await ensureWrite(
    file,
    isMinify
      ? JSON.stringify(json)
      : (JSON.stringify(json, null, 2) + '\n')
  )
}

async function buildIcons(pack, type, format) {
  let outDir = `./packages/${pack}/dist/${type}`
  if (format === 'esm') {
    outDir += '/esm'
  }

  let icons = await getIcons(type)
  const metaDataPackageJson = {
    icons: {}
  }

  await Promise.all(
    icons.flatMap(async ({ componentName, svg, isDeprecated }) => {
      if (!['file-type'].includes(type)) {
        svg = svg
          // @memo skip for some icons
          .replaceAll(['TrashcanIcon'].includes(componentName) ? '?????' : '#fff', 'currentColor')
          .replaceAll('#FFF', 'currentColor')
          .replaceAll('#CCC', 'currentColor')
          .replaceAll('#ccc', 'currentColor')
          .replaceAll('#333', 'currentColor')
          .replaceAll('#C9CCD0', 'currentColor')
          .replaceAll('#c9ccd0', 'currentColor')
          .replaceAll('#BDC1C6', 'currentColor')
          .replaceAll('#bdc1c6', 'currentColor')
          .replaceAll('#959CA4', 'currentColor')
          .replaceAll('#959ca4', 'currentColor')
          .replaceAll('#828B95', 'currentColor')
          .replaceAll('#828b95', 'currentColor')
          .replaceAll('#525C69', 'currentColor')
          .replaceAll('#525c69', 'currentColor')
          .replaceAll('#535C69', 'currentColor')
          .replaceAll('#535c69', 'currentColor')
          .replaceAll('#000', 'currentColor')
          .replaceAll('#9DCF00', 'currentColor')
          .replaceAll('#9dcf00', 'currentColor')
          .replaceAll('#8DBB00', 'currentColor')
          .replaceAll('#8dbb00', 'currentColor')
          .replaceAll('#95C500', 'currentColor')
          .replaceAll('#95c500', 'currentColor')
          .replaceAll('#34A853', 'currentColor')
          .replaceAll('#34a853', 'currentColor')
          .replaceAll('#289D37', 'currentColor')
          .replaceAll('#289d37', 'currentColor')
          .replaceAll('#4690FB', 'currentColor')
          .replaceAll('#4690fb', 'currentColor')
          .replaceAll('#4690fb', 'currentColor')
          .replaceAll('#2a79a6', 'currentColor')
          .replaceAll('#4285F4', 'currentColor')
          .replaceAll('#4285f4', 'currentColor')
          .replaceAll('#0078D4', 'currentColor')
          .replaceAll('#0078d4', 'currentColor')
          .replaceAll('#A77BDE', 'currentColor')
          .replaceAll('#a77bde', 'currentColor')
          .replaceAll('#ff0400', 'currentColor')
          .replaceAll('#D61921', 'currentColor')
          .replaceAll('#d61921', 'currentColor')
          .replaceAll('#eb3c00', 'currentColor')
          .replaceAll('#EA4335', 'currentColor')
          .replaceAll('#ea4335', 'currentColor')
          .replaceAll('#FBBC05', 'currentColor')
          .replaceAll('#fbbc05', 'currentColor')
          .replaceAll('#FF9E00', 'currentColor')
          .replaceAll('#ff9e00', 'currentColor')
          .replaceAll('#FF6200', 'currentColor')
          .replaceAll('#ff6200', 'currentColor')
          .replaceAll('#FAA72C', 'currentColor')
          .replaceAll('#faa72c', 'currentColor')
          .replaceAll('#15C674', 'currentColor')
          .replaceAll('#15c674', 'currentColor')
          .replaceAll('#1BCE7B', 'currentColor')
          .replaceAll('#1bce7b', 'currentColor')
      }

      let content = await transform[pack](
        svg,
        componentName,
        format,
        isDeprecated
      )

      /** @type {string[]} */
      let types = []

      if (pack === '@bitrix24-icons-react') {
        types.push(`import * as React from 'react';`)
        if (isDeprecated) {
          types.push(`/** @deprecated */`)
        }

        types.push(`declare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;`)
        types.push(`export default ${componentName};`)
      } else {
        types.push(`import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';`)
        if (isDeprecated) {
          types.push(`/** @deprecated */`)
        }

        types.push(`declare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;`)
        types.push(`export default ${componentName};`)
      }

      let metaDataJson
      try {
        metaDataJson = JSON.parse(await fs.readFile(
          `./src/metadata/${type}/${componentName}.json`,
          'utf8'
        ))
      } catch (error) {
        metaDataJson = {
          specialized: true,
          category: null,
          subCategories: [],
          labels: []
        }

        console.error(
          error,
          `./src/metadata/${type}/${componentName}.json`
        )

        process.exit(1)
      }

      metaDataPackageJson.icons[componentName] = { ...metaDataJson }

      return [
        await ensureWrite(
          `${outDir}/${componentName}.js`,
          content
        ),
        ...(types
          ? [
              await ensureWrite(
                `${outDir}/${componentName}.d.ts`,
                types.join('\n') + '\n'
              )
            ]
          : []
        )
      ]
    })
  )

  await ensureWrite(
    `${outDir}/index.js`,
    exportAll(icons, format)
  )

  await ensureWrite(
    `${outDir}/index.d.ts`,
    exportAll(icons, 'esm', false)
  )

  await ensureWriteJson(
    `${outDir}/metadata.json`,
    metaDataPackageJson,
    true
  )
}

async function buildExports(styles) {
  let pkg = {}

  // To appease Vite's optimizeDeps feature which requires a root-level import
  pkg[`.`] = {
    types: `./dist/index.d.ts`,
    import: `./dist/bitrix24icons.esm.js`
  }

  // For those that want to read the version from package.json
  pkg[`./package.json`] = { default: './package.json' }

  pkg[`./metadata.json`] = { default: './dist/metadata.json' }
  pkg[`./info-metadata.json`] = { default: './dist/info-metadata.json' }

  // For components ////
  pkg[`./components/*`] = {
    types: `./dist/components/*.d.ts`,
    default: `./dist/components/*.js`
  }
  pkg[`./components/*.js`] = {
    types: `./components/*.d.ts`,
    default: `./components/*.js`
  }

  // Explicit exports for each style:
  for (let style of styles) {
    pkg[`./${style}`] = {
      types: `./dist/${style}/esm/index.d.ts`,
      import: `./dist/${style}/esm/index.js`
    }

    pkg[`./${style}/*`] = `./dist/${style}/esm/*.js`
  }

  return pkg
}

async function buildTypesVersions(styles) {
  let types = {}

  // Explicit exports for each style:
  for (let style of styles) {
    types[`${style}/*`] = [
      `./dist/${style}/esm/*.d.ts`
    ]
  }

  return {
    '*': types
  }
}

/**
 * @returns {Promise<void>}
 * @param {string} pack
 */
async function main(
  pack
) {
  console.log(`Building ${pack} package ...`)

  // region clear ////
  await Promise.all(
    typeList.map(type => rimraf(`./export/${pack}/${type}/*`, { glob: true }))
  )
  // endregion ////

  // region build icons ////
  // const cjsPackageJson = { module: './esm/index.js', sideEffects: false }
  const esmPackageJson = { type: 'module', sideEffects: false }

  await Promise.all([
    ...(typeList.map(async (type) => {
      return [
        // await buildIcons(
        //   pack,
        //   type,
        //   'cjs'
        // ),
        await buildIcons(
          pack,
          type,
          'esm'
        )
      ]
    })),
    ...(typeList.map((type) => {
      return [
        ensureWriteJson(`./packages/${pack}/dist/${type}/esm/package.json`, esmPackageJson)
        // ensureWriteJson(`./packages/${ pack }/dist/${ type }/package.json`, cjsPackageJson),
      ]
    }))
  ])
  // endregion ////

  // region { metadata, info-metadata }.json ////
  console.log(``)
  console.log(`Init metadata ...`)

  const metaDataJson = {
    list: []
  }

  const metaDataInfoJson = {
    list: []
  }

  for (const type of typeList) {
    const typeName = toUpperFirstChar(camelcase(type))

    const typeRow = {
      code: type,
      name: typeName,
      list: []
    }

    const iconMetaDataFileEsm = `./packages/${pack}/dist/${type}/esm/metadata.json`
    // const iconMetaDataFile = `./packages/${ pack }/dist/${ type }/metadata.json`;

    const metaDataPackageJson = JSON.parse(await fs.readFile(
      iconMetaDataFileEsm,
      'utf8'
    ))

    const iconsKey = Object.keys(metaDataPackageJson?.icons || {})

    for (const icon of iconsKey) {
      const iconCode = `${typeRow.code}::${icon}`

      const iconName = metaDataPackageJson?.icons[icon]?.name
        ? metaDataPackageJson.icons[icon].name
        : icon
            .replace(/Icon$/, '')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase()

      const iconRow = {
        code: iconCode,
        name: iconName,
        type: typeRow.code,
        icon: icon,
        specialized: metaDataPackageJson?.icons[icon]?.specialized || null,
        data: {
          name: metaDataPackageJson.icons[icon]?.name || null,
          category: metaDataPackageJson?.icons[icon]?.category || null,
          subCategories: metaDataPackageJson?.icons[icon]?.subCategories || [],
          dateFix: metaDataPackageJson?.icons[icon]?.dateFix || null
        }
      }

      metaDataJson.list.push(iconRow.code)
      typeRow.list.push(iconRow)
    }

    metaDataInfoJson.list.push(typeRow)

    // await rimraf(iconMetaDataFile, { glob: true })
    await rimraf(iconMetaDataFileEsm, { glob: true })
  }

  await ensureWriteJson(
    `./packages/${pack}/dist/metadata.json`,
    metaDataJson,
    true
  )

  await ensureWriteJson(
    `./packages/${pack}/dist/info-metadata.json`,
    metaDataInfoJson,
    true
  )

  await ensureWriteJson(
    `./packages/${pack}/src/metadata.json`,
    metaDataJson
  )

  await ensureWriteJson(
    `./packages/${pack}/src/info-metadata.json`,
    metaDataInfoJson
  )
  // endregion ////

  // region VUE.component ////
  if (pack === '@bitrix24-icons-vue') {
    console.log(``)
    console.log(`Init component ...`)

    const regex = /(\/\/ #CASE_RENDER_START# \/\/\/)([\s\S]*?)(\/\/ #CASE_RENDER_STOP# \/\/\/)/
    const componentPath = `./packages/${pack}/src/components/B24Icon.ts`

    let componentData = await fs.readFile(
      componentPath,
      'utf8'
    )

    const caseRender = metaDataJson.list.sort().map((code) => {
      const tmp = code.split('::')

      return `        case '${code}': return defineAsyncComponent(() => {
          return import('../../dist/${tmp[0]}/esm/${tmp[1]}.js')
        })`
    })

    componentData = componentData.replace(regex, `$1\n${caseRender.join('\n')}\n$3`)

    await ensureWrite(
      componentPath,
      componentData
    )
  }
  // endregion ////

  // region REACT.component ////
  if (pack === '@bitrix24-icons-react') {
    console.log(``)
    console.log(`Init component ...`)

    const regex = /(\/\/ #CASE_RENDER_START# \/\/\/)([\s\S]*?)(\/\/ #CASE_RENDER_STOP# \/\/\/)/
    const componentPath = `./packages/${pack}/src/components/B24Icon.tsx`

    let componentData = await fs.readFile(
      componentPath,
      'utf8'
    )

    const caseRender = metaDataJson.list.sort().map((code) => {
      const tmp = code.split('::')

      return `      case '${code}': return lazy(() => import('../../dist/${tmp[0]}/esm/${tmp[1]}.js'))`
    })

    componentData = componentData.replace(regex, `$1\n${caseRender.join('\n')}\n      $3`)

    await ensureWrite(
      componentPath,
      componentData
    )
  }
  // endregion ////

  // region package.json ////
  let packageJson = JSON.parse(await fs.readFile(
    `./packages/${pack}/package.json`,
    'utf8'
  ))

  packageJson.exports = await buildExports(typeList)
  packageJson.typesVersions = await buildTypesVersions(typeList)

  await ensureWriteJson(
    `./packages/${pack}/package.json`,
    packageJson
  )
  // endregion ////

  return console.log(`Finished building ${pack} package.`)
}

let [pack] = process.argv.slice(2)

if (!pack) {
  throw new Error('Please specify a package')
}

main(pack)
  .catch((error) => {
    console.error(error)
  })
