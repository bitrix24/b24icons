const fs = require('fs').promises;
const camelcase = require('camelcase');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const svgr = require('@svgr/core').default;
const babel = require('@babel/core');
const { compile: compileVue } = require('@vue/compiler-dom');
const { dirname } = require('path');
const { deprecated } = require('./deprecated');
const { typeList } = require('./type-list');

let transform = {
	'@bitrix24-icons-react': async (svg, componentName, format, isDeprecated) => {
		let component = await svgr(
			svg,
			{
				ref: true,
				titleProp: true
			},
			{ componentName }
		);
		
		let { code } = await babel.transformAsync(
			component,
			{
				plugins: [
					[
						require('@babel/plugin-transform-react-jsx'),
						{ useBuiltIns: true }
					]
				],
			}
		);

		// Add a deprecation warning to the component
		if(isDeprecated)
		{
			/** @type {string[]} */
			let lines = code.split('\n');
			lines.splice(1, 0, `/** @deprecated */`);
			code = lines.join('\n');
		}

		if(format === 'esm')
		{
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
			);
	},
	'@bitrix24-icons-vue': (svg, componentName, format, isDeprecated) => {
		
		let isHasTagStyle = false;
		if(svg.search('<style>') !== -1)
		{
			/**
			 * let's encode the tag <style>
			 */
			isHasTagStyle = true;
			console.warn('svg has tag [style] => convert him as tag [main]');
			svg = svg.replaceAll('<style>', '<main>');
			svg = svg.replaceAll('</style>', '</main>');
			// console.warn(`svg ${componentName}: `, svg); ////
		}
		
		let { code } = compileVue(
			svg,
			{
				mode: 'module',
			}
		);
		
		/**
		 * @memo Add a deprecation warning to the component
		 */
		if(isDeprecated)
		{
			/** @type {string[]} */
			let lines = code.split('\n');
			lines.splice(2, 0, `/** @deprecated */`);
			code = lines.join('\n');
		}
		
		/**
		 * @memo let's bring back the tag <style>
		 */
		if(isHasTagStyle)
		{
			code = code.replace('main', 'style');
		}

		if(format === 'esm')
		{
			return code.replace(
				'export function',
				'export default function'
			);
		}

		return code
			.replace(
				/import\s+\{\s*([^}]+)\s*\}\s+from\s+(['"])(.*?)\2/,
				(_match, imports, _quote, mod) => {
					let newImports = imports
						.split(',')
						.map((i) => i.trim().replace(/\s+as\s+/, ': '))
						.join(', ')

					return `const { ${newImports} } = require("${mod}")`
				}
			)
			.replace(
				'export function render',
				'module.exports = function render'
			);
	}
}

function toUpperFirstChar(value)
{
	return value.charAt(0).toUpperCase() + value.slice(1)
}

function prepareIconName(type, fileName)
{
	let componentName = camelcase(
		fileName.replace(/\.svg$/, '')
			//.replaceAll('-', '')
			.replaceAll(' ', '')
			.replaceAll('(', '').replaceAll(')', '')
			.replaceAll('[', '').replaceAll(']', '')
			.replaceAll('{', '').replaceAll('}', ''),
		{
			pascalCase: true,
		}
	);
	
	/**
	 * @memo clear component name
	 */
	componentName = componentName
		.replace('Ui', '')
		.replace('White', '').replace('Black', '')
		.replace('Light', '').replace('Dark', '');
	
	if(type === 'common-service')
	{
		componentName = componentName.replace('Service', '');
	}
	
	componentName = toUpperFirstChar(componentName);
	
	return `${componentName}Icon`;
}

async function getIcons(type)
{
	let files = await fs.readdir(`./optimized/${type}`);
	return Promise.all(
		files.map(async (file) => {
			return {
				svg: await fs.readFile(`./optimized/${type}/${file}`, 'utf8'),
				componentName: prepareIconName(type, file),
				isDeprecated: deprecated.includes(file),
			};
		})
	);
}

/**
 * @param {[]} icons
 * @param {string} format
 * @param {boolean} includeExtension
 * @returns {*}
 */
function exportAll(
	icons,
	format,
	includeExtension = true
)
{
	return icons
		.map(({ componentName }) => {
			let extension = includeExtension ? '.js' : '';
			if(format === 'esm')
			{
				return `export { default as ${componentName} } from './${componentName}${extension}'`;
			}
			return `module.exports.${componentName} = require("./${componentName}${extension}")`;
		})
		.join('\n');
}

/**
 * @param {string} file
 * @param {string} text
 * @returns {Promise<void>}
 */
async function ensureWrite(
	file,
	text
)
{
	await fs.mkdir(dirname(file), { recursive: true });
	await fs.writeFile(file, text, 'utf8')
}

/**
 * @param {string} file
 * @param {{}} json
 * @returns {Promise<void>}
 */
async function ensureWriteJson(
	file,
	json
)
{
	await ensureWrite(
		file,
		JSON.stringify(json, null, 2) + '\n'
	)
}

async function buildIcons(pack, type, format)
{
	let outDir = `./packages/${pack}/dist/${type}`;
	if(format === 'esm')
	{
		outDir += '/esm';
	}
	
	let icons = await getIcons(type);
	const metaDataPackageJson = {
		ttl: 0,
		icons: {}
	}
	
	await Promise.all(
		icons.flatMap(async ({ componentName, svg, isDeprecated }) => {
			
			let content = await transform[pack](
				svg,
				componentName,
				format,
				isDeprecated
			);

			/** @type {string[]} */
			let types = [];

			if(pack === '@bitrix24-icons-react')
			{
				types.push(`import * as React from 'react';`);
				if(isDeprecated)
				{
					types.push(`/** @deprecated */`);
				}
				
				types.push(`declare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;`);
				types.push(`export default ${componentName};`)
			}
			else
			{
				types.push(`import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';`);
				if(isDeprecated)
				{
					types.push(`/** @deprecated */`);
				}
				
				types.push(`declare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;`);
				types.push(`export default ${componentName};`);
			}
			
			let metaDataJson = {};
			try
			{
				metaDataJson = JSON.parse(await fs.readFile(
					`./src/metadata/${type}/${componentName}.json`,
					'utf8'
				));
			}
			catch(error)
			{
				metaDataJson = {
					specialized: true,
					category: null,
					subCategories: [],
					labels: [],
				};
				
				console.error(
					error,
					`./src/metadata/${type}/${componentName}.json`
				);
				
				process.exit(1)
				
			}
			
			metaDataPackageJson.ttl++;
			metaDataPackageJson.icons[componentName] = { ... metaDataJson };
			
			return [
				ensureWrite(
					`${outDir}/${componentName}.js`,
					content
				),
				...(types
					? [
						ensureWrite(
							`${outDir}/${componentName}.d.ts`,
							types.join('\n') + '\n'
						)
					]
					: []
				),
			]
		})
	)

	await ensureWrite(
		`${outDir}/index.js`,
		exportAll(icons, format)
	);

	await ensureWrite(
		`${outDir}/index.d.ts`,
		exportAll(icons, 'esm', false)
	);
	
	await ensureWriteJson(
		`${outDir}/metadata.json`,
		metaDataPackageJson
	);
}

/**
 * @param {string[]} styles
 */
async function buildExports(styles)
{
	let pkg = {}

	// To appease Vite's optimizeDeps feature which requires a root-level import
	pkg[`.`] = {
		import: `./dist/bitrix24icons.esm.js`,
		require: `./dist/index.js`,
	}

	// For those that want to read the version from package.json
	pkg[`./package.json`] = { default: './package.json' }
	
	// Explicit exports for each style:
	for(let style of styles)
	{
		pkg[`./${style}`] = {
			types: `./dist/${style}/index.d.ts`,
			import: `./dist/${style}/esm/index.js`,
			require: `./dist/${style}/index.js`,
		}
		
		pkg[`./${style}/metadata.json`] = { default: `./dist/${style}/esm/metadata.json` }
		
		pkg[`./${style}/*`] = {
			types: `./dist/${style}/*.d.ts`,
			import: `./dist/${style}/esm/*.js`,
			require: `./dist/${style}/*.js`,
		}
		
		pkg[`./${style}/*.js`] = {
			types: `./${style}/*.d.ts`,
			import: `./${style}/esm/*.js`,
			require: `./${style}/*.js`,
		}
	}
	
	// For components ////
	pkg[`./components/*`] = {
		types: `./dist/components/*.d.ts`,
		default: `./dist/components/*.js`,
	}
	pkg[`./components/*.js`] = {
		types: `./components/*.d.ts`,
		default: `./components/*.js`,
	}
	pkg[`./metadata.json`] = { default: './dist/metadata.json' }
	
	return pkg
}

/**
 * @returns {Promise<void>}
 * @param {string} pack
 */
async function main(
	pack
)
{
	console.log(`Building ${pack} package ...`);
	
	// region clear ////
	await Promise.all(
		typeList.map((type) => rimraf(`./export/${pack}/${type}/*`))
	);
	// endregion ////
	
	// region build icons ////
	const cjsPackageJson = { module: './esm/index.js', sideEffects: false }
	const esmPackageJson = { type: 'module', sideEffects: false }
	
	await Promise.all([
		...(typeList.map((type) => {
			return [
				buildIcons(
					pack,
					type,
					'cjs'
				),
				buildIcons(
					pack,
					type,
					'esm'
				),
			];
		})),
		...(typeList.map((type) => {
			return [
				ensureWriteJson(`./packages/${pack}/dist/${type}/esm/package.json`, esmPackageJson),
				ensureWriteJson(`./packages/${pack}/dist/${type}/package.json`, cjsPackageJson),
			];
		}))
	])
	// endregion ////
	
	// region metadata.json ////
	.then(() => {
		console.log(`Init metadata ...`)
		return new Promise(resolve => setTimeout(resolve, 2_600))
	})
	.then(async () => {
		const metaDataJson = {
			types: [],
			typesName: [],
			list: [],
		}
		
		for(const type of typeList)
		{
			metaDataJson.types.push(type)
			
			const typeKey = toUpperFirstChar(camelcase(type))
			metaDataJson.typesName.push(typeKey)
			
			const metaDataPackageJson = JSON.parse(await fs.readFile(
				`./packages/${pack}/dist/${type}/esm/metadata.json`,
				'utf8'
			))
			
			const iconsKey = Object.keys(metaDataPackageJson?.icons || {})
			
			for(const icon of iconsKey)
			{
				metaDataJson.list.push(`${typeKey}::${icon}`)
			}
		}
		
		await ensureWriteJson(
			`./packages/${pack}/dist/metadata.json`,
			metaDataJson
		)
		
		await ensureWriteJson(
			`./packages/${pack}/src/metadata.json`,
			metaDataJson
		)
	})
	// endregion ////
	
	// region package.json ////
	let packageJson = JSON.parse(await fs.readFile(
		`./packages/${pack}/package.json`,
		'utf8'
	))
	
	packageJson.exports = await buildExports(typeList)
	
	await ensureWriteJson(
		`./packages/${pack}/package.json`,
		packageJson
	)
	// endregion ////
	
	return console.log(`Finished building ${pack} package.`)
}

let [pack] = process.argv.slice(2);

if (!pack)
{
	throw new Error('Please specify a package')
}

main(pack)
.catch((error) => {
	console.error(error);
})