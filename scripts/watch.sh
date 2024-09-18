#!/usr/bin/env bash
set -e

# Known variables
outdir="./dist"
name="bitrix24icons"
input="./src/index.ts"

# Setup shared options for esbuild
sharedOptions=()
sharedOptions+=("--bundle")
sharedOptions+=("--platform=browser")
sharedOptions+=("--target=es2020")

# Generate actual builds
# shellcheck disable=SC2068
npx esbuild $input --format=esm  --outfile=$outdir/$name.esm.js --sourcemap ${sharedOptions[@]} $@ --watch