import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx', 'js', 'jsx'] })

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
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: true,
          arrowParameter: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: false,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
      '@typescript-eslint/no-explicit-any': ['error'],
    },
  },
)
