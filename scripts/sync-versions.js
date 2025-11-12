import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const rootPackage = JSON.parse(readFileSync('./package.json', 'utf8'))
const rootVersion = rootPackage.version

const packages = [
  'packages/@bitrix24-icons-vue/package.json',
  'packages/@bitrix24-icons-nuxt/package.json'
]

const isGitHub = process.env.GITHUB_ACTIONS === 'true'

packages.forEach((packagePath) => {
  const fullPath = join(process.cwd(), packagePath)
  const packageJson = JSON.parse(readFileSync(fullPath, 'utf8'))

  packageJson.version = rootVersion

  if (packagePath.includes('nuxt') && isGitHub) {
    packageJson.dependencies['@bitrix24/b24icons-vue'] = rootVersion
    console.log(`✓ Updated dependency in ${packagePath} to version ${rootVersion}`)
  }

  writeFileSync(fullPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`✓ Updated ${packagePath} to version ${rootVersion}`)
})

console.log(isGitHub ? '> GitHub Actions environment detected' : '> Local environment detected')
