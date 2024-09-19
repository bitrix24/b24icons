#!/usr/bin/env bash
set -e

SCRIPT_DIR=$(cd ${0%/*} && pwd -P)

# Known variables
SRC='./src'
DST='./dist'
name="bitrix24icons"
input="./${SRC}/index.ts"
components="${SRC}/components"

# Find executables
resolver="${SCRIPT_DIR}/resolve-files.js"
rewriteImports="${SCRIPT_DIR}/rewrite-imports.js"

# Setup shared options for esbuild
sharedOptions=()
sharedOptions+=("--platform=browser")
#sharedOptions+=("--target=es2019")
sharedOptions+=("--target=esnext")

# Generate actual builds
# ESM
resolverOptions=()
# shellcheck disable=SC2206
resolverOptions+=($components)
resolverOptions+=('/**/*.{ts,tsx}')
resolverOptions+=('--ignore=.test.,__mocks__')
# shellcheck disable=SC2068
INPUT_FILES=$($resolver ${resolverOptions[@]})

# shellcheck disable=SC2068
NODE_ENV=production  npx esbuild $INPUT_FILES --format=esm --outdir=$DST               --outbase=$SRC --minify --define:__DEV__="false" ${sharedOptions[@]} &
# shellcheck disable=SC2068
NODE_ENV=production  npx esbuild $input       --format=esm --outfile=$DST/$name.esm.js --outbase=$SRC --minify --define:__DEV__="false" ${sharedOptions[@]} &

# Common JS
# shellcheck disable=SC2068
NODE_ENV=development npx esbuild $input       --format=cjs --outfile=$DST/$name.js         --minify   --bundle --define:__DEV__="true" ${sharedOptions[@]} $@ &

# Generate ESM types
tsc --emitDeclarationOnly --outDir $DST &

wait

# Generate CJS types
# This is a bit of a hack, but it works because the same output works for both
cp $DST/index.d.ts $DST/index.d.cts

# Copy build files over
# skip
# cp -rf ./build/* $DST/

# Wait for all the scripts to finish
wait

# Rewrite ESM imports
# remember "../metadata.json" components/B24Icon.js
##$rewriteImports "$DST" '/**/*.js'
##$rewriteImports "$DST" '/**/*.d.ts'

# Remove test related files
# shellcheck disable=SC2046
# shellcheck disable=SC2006
rm -rf `$resolver "$DST" '/**/*.{test,__mocks__,}.*'`
# shellcheck disable=SC2046
# shellcheck disable=SC2006
rm -rf `$resolver "$DST" '/**/test-utils/*'`