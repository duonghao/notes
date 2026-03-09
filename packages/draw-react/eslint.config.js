// @ts-check

import rootConfig from '../../eslint.config.js'
import pluginReact from '@eslint-react/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
  },
]
