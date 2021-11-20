module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/base',
		'plugin:vue/vue3-essential',
		'@vue/typescript/recommended',
		// 'eslint:recommended',
		// '@vue/prettier',
		// '@vue/prettier/@typescript-eslint'
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': 'warn',
		'no-debugger': 'warn',
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		indent: ['error', 'tab'],
		'no-mixed-spaces-and-tabs': 'off',
		'vue/html-indent': 'off',
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: {
					max: 1,
					allowFirstLine: true
				},
				multiline: {
					max: 1,
					allowFirstLine: false
				}
			}
		]
	},
}
  