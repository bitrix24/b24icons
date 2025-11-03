import { defineNuxtModule } from '@nuxt/kit'
import pkg from '../package.json'

export type ModuleOptions = object

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@bitrix24/b24icons-nuxt',
    version: pkg.version,
    configKey: 'B24IconsNuxt',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  defaults: {},
  async setup(_options, _nuxt) {}
})
