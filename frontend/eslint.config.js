import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx', 'js', 'jsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'treadmilltracker',
    files: ['src/**/*.{ts,mts,tsx,vue,js,json,html,yaml}'],
    languageOptions: {parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: false,
      },
      project: './tsconfig.json',
    }},
  },

  globalIgnores(
    [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/volt/**',
      'node_modules/',
      '**/public/**'
    ]
  ),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,
  skipFormatting,

  {
    rules: {
      // Restrict all console methods
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
)
