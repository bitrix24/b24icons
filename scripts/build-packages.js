#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';

const SRC = './src';
const DST = './dist';
const name = 'bitrix24icons';
const input = `${SRC}/index.ts`;
const components = `${SRC}/components`;

const sharedOptions = [
	'--platform=browser',
	'--target=esnext'
];

const additionalArgs = process.argv.slice(2).join(' ');

function resolveFiles(components) {
	const resolverOptions = [
		components,
		'/**/*.{ts,tsx}',
		'--ignore=.test.,__mocks__'
	];
	
	let [args, flags] = resolverOptions.reduce(
		([args, flags], part) => {
			if (part.startsWith('--')) {
				flags[part.slice(2, part.indexOf('='))] = part.slice(part.indexOf('=') + 1)
			} else {
				args.push(part)
			}
			return [args, flags]
		},
		[[], {}]
	)
	
	flags.ignore = flags.ignore ?? ''
	flags.ignore = flags.ignore.split(',').filter(Boolean)
	
	return fastGlob
		.sync(args.join(''))
		.filter((file) => {
			for (let ignore of flags.ignore) {
				if (file.includes(ignore)) {
					return false
				}
			}
			return true
		});
}

function rewriteImports(directory, pattern) {
	const files = fastGlob.sync([path.join(directory, pattern)]);
	files.forEach(file => {
		const resolvedFile = path.resolve(process.cwd(), file);
		const content = fs.readFileSync(resolvedFile, 'utf8');
		const result = content.replace(/(import|export)([^"']*?)(["'])\.(.*?)\3/g, (full, a, b, _, d) => {
			if (d.endsWith('.js')) {
				return full;
			}
			return `${a}${b}'.${d}.js'`;
		});
		if (result !== content) {
			fs.writeFileSync(resolvedFile, result, 'utf8');
		}
	});
}

function build() {
	const inputFiles = resolveFiles(components).join('\n');

// ESM Build
	execSync(`npx cross-env NODE_ENV=production npx esbuild ${inputFiles} --format=esm --outdir=${DST} --outbase=${SRC} --minify --define:__DEV__="false" ${sharedOptions.join(' ')}`);
	execSync(`npx cross-env NODE_ENV=production npx esbuild ${input} --format=esm --outfile=${DST}/${name}.esm.js --outbase=${SRC} --minify --define:__DEV__="false" ${sharedOptions.join(' ')}`);
// CommonJS Build
	execSync(`npx cross-env NODE_ENV=development npx esbuild ${input} --format=cjs --outfile=${DST}/${name}.js --minify --bundle --define:__DEV__="true" ${sharedOptions.join(' ')}  ${additionalArgs}`);
	
// Generate ESM types
	execSync(`tsc --emitDeclarationOnly --outDir ${DST}`);

// Generate CJS types
	fs.copyFileSync(`${DST}/index.d.ts`, `${DST}/index.d.cts`);

// Rewrite ESM imports
	rewriteImports(DST, '/**/*.js');
	rewriteImports(DST, '/**/*.d.ts');

// Remove test related files
	const testFiles = fastGlob.sync([`${DST}/**/*.{test,__mocks__,}.*`, `${DST}/**/test-utils/*`]);
	testFiles.forEach(file => fs.rmSync(file, { recursive: true, force: true }));
}

build();